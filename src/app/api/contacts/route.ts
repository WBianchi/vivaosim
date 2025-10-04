import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para criação de contato
const createContactSchema = z.object({
  // Dados básicos
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  additionalPhone: z.string().optional(),
  document: z.string().optional(),
  company: z.string().optional().nullable(),
  address: z.union([
    z.string(),
    z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional()
    })
  ]).optional().nullable(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional().nullable(),
  
  // Dados WhatsApp
  whatsappChatId: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappName: z.string().optional(),
  whatsappIsGroup: z.boolean().default(false),
  whatsappProfilePic: z.string().optional(),
  
  // Classificação
  source: z.string().transform(val => {
    const upper = val.toUpperCase()
    const validSources = ['WHATSAPP', 'WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'PHONE_CALL', 'EMAIL', 'OTHER']
    
    // Mapear valores comuns
    const mapping: Record<string, string> = {
      'FACEBOOK': 'SOCIAL_MEDIA',
      'INSTAGRAM': 'SOCIAL_MEDIA',
      'TWITTER': 'SOCIAL_MEDIA',
      'LINKEDIN': 'SOCIAL_MEDIA',
      'TIKTOK': 'SOCIAL_MEDIA'
    }
    
    if (validSources.includes(upper)) return upper
    if (mapping[upper]) return mapping[upper]
    return 'OTHER'
  }).default('WHATSAPP'),
  createdFrom: z.string().optional(),
  priority: z.union([z.number(), z.string()]).transform(val => {
    if (typeof val === 'string') {
      const map: any = { low: 1, medium: 3, high: 5 }
      return map[val] || 1
    }
    return val
  }).default(1),
  
  // Relacionamentos Kanban
  kanbanBoardId: z.string().optional(),
  kanbanColumnId: z.string().optional(),
  
  // Relacionamentos
  queueId: z.string().optional(),
  assignedToId: z.string().optional(),
  
  // Tags iniciais
  tags: z.array(z.string()).optional(),
  
  // Campos extras que vem do modal mas não vamos usar
  id: z.string().optional(),
  avatar: z.any().optional().nullable(),
  status: z.string().optional(),
  type: z.string().optional(),
  attendant: z.string().optional(),
  attendantName: z.string().optional().nullable(),
  subscription: z.any().optional().nullable(),
  totalValue: z.number().optional(),
  lastContact: z.string().optional(),
  createdAt: z.string().optional(),
  contracts: z.array(z.any()).optional(),
  tickets: z.array(z.any()).optional(),
  quotes: z.array(z.any()).optional(),
  meetings: z.array(z.any()).optional(),
  documents: z.any().optional()
})

// GET - Listar contatos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const queueId = searchParams.get('queueId')
    const status = searchParams.get('status')
    const assignedToId = searchParams.get('assignedToId')

    const skip = (page - 1) * limit

    // Filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { whatsappNumber: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (queueId) where.queueId = queueId
    if (status) where.status = status
    if (assignedToId) where.assignedToId = assignedToId

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          queue: true,
          assignedTo: { select: { id: true, name: true, email: true } },
          tags: true,
          schedules: { take: 3, orderBy: { datetime: 'desc' } },
          tickets: { take: 3, orderBy: { createdAt: 'desc' } },
          _count: {
            select: {
              schedules: true,
              quotes: true,
              contracts: true,
              tickets: true
            }
          }
        }
      }),
      prisma.contact.count({ where })
    ])

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar contatos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar contato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createContactSchema.parse(body)
    
    // Verificar se já existe contato com este whatsappChatId
    if (validatedData.whatsappChatId) {
      const existingContact = await prisma.contact.findUnique({
        where: { whatsappChatId: validatedData.whatsappChatId }
      })
      
      if (existingContact) {
        return NextResponse.json(
          { error: 'Já existe um contato vinculado a este chat do WhatsApp' },
          { status: 409 }
        )
      }
    }

    const { 
      tags, 
      address, 
      documents, 
      kanbanBoardId, 
      kanbanColumnId,
      // Remover campos que não existem no Prisma
      id,
      avatar,
      status,
      type,
      attendant,
      attendantName,
      subscription,
      totalValue,
      lastContact,
      createdAt,
      contracts,
      tickets,
      quotes,
      meetings,
      ...contactData 
    } = validatedData

    // Processar address se for objeto
    let addressString = ''
    let cityValue = contactData.city
    let stateValue = contactData.state
    let zipCodeValue = contactData.zipCode

    if (address && typeof address === 'object') {
      addressString = address.street || ''
      cityValue = address.city || cityValue
      stateValue = address.state || stateValue
      zipCodeValue = address.zipCode || zipCodeValue
    } else if (typeof address === 'string') {
      addressString = address
    }

    // Processar document se vier em documents.cpf
    let documentValue = contactData.document
    if (documents && typeof documents === 'object') {
      documentValue = documents.cpf || documents.cnpj || documentValue
    }

    // Criar contato - APENAS com campos válidos do Prisma
    const contact = await prisma.contact.create({
      data: {
        name: contactData.name,
        email: contactData.email || undefined,
        phone: contactData.phone || undefined,
        additionalPhone: contactData.additionalPhone || undefined,
        document: documentValue || undefined,
        company: contactData.company || undefined,
        address: addressString || undefined,
        city: cityValue || undefined,
        state: stateValue || undefined,
        zipCode: zipCodeValue || undefined,
        notes: contactData.notes || undefined,
        whatsappChatId: contactData.whatsappChatId || undefined,
        whatsappNumber: contactData.whatsappNumber || undefined,
        whatsappName: contactData.whatsappName || undefined,
        whatsappIsGroup: contactData.whatsappIsGroup || false,
        whatsappProfilePic: contactData.whatsappProfilePic || undefined,
        source: contactData.source as any,
        createdFrom: contactData.createdFrom || undefined,
        priority: contactData.priority || 1,
        // Relacionamentos com connect
        ...(contactData.queueId && {
          queue: { connect: { id: contactData.queueId } }
        }),
        ...(contactData.assignedToId && {
          assignedTo: { connect: { id: contactData.assignedToId } }
        }),
        // Relacionamentos Kanban
        ...(kanbanBoardId && {
          kanbanBoard: { connect: { id: kanbanBoardId } }
        }),
        ...(kanbanColumnId && {
          kanbanColumn: { connect: { id: kanbanColumnId } }
        })
      },
      include: {
        queue: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        tags: true,
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    // Log de atividade
    if ((contactData as any).createdById) {
      await prisma.contactActivity.create({
        data: {
          type: 'conversion',
          title: 'Contato criado a partir do WhatsApp',
          description: `Lead convertido do chat ${validatedData.whatsappChatId || 'desconhecido'}`,
          contactId: contact.id,
          userId: (contactData as any).createdById,
          metadata: {
            source: validatedData.source,
            createdFrom: validatedData.createdFrom,
            whatsappData: {
              chatId: validatedData.whatsappChatId,
              number: validatedData.whatsappNumber,
              name: validatedData.whatsappName
            }
          }
        }
      })
    }

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar contato:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// DELETE - Excluir contato
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do contato é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o contato existe
    const contact = await prisma.contact.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contato não encontrado' },
        { status: 404 }
      )
    }

    // Excluir o contato
    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Contato excluído com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao excluir contato:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
