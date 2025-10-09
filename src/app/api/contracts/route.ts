import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

const createContractSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().nullish(),
  amount: z.number().positive('Valor deve ser positivo'),
  startDate: z.string().datetime().nullish(),
  endDate: z.string().datetime().nullish(),
  eventDate: z.string().datetime().nullish(),
  contactId: z.string(),
  chatId: z.string().nullish(),
  assignedToId: z.string().nullish()
})

// GET - Listar contratos
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')
    const chatId = searchParams.get('chatId')
    const status = searchParams.get('status')

    console.log(`📋 GET /api/contracts - Params:`, { contactId, chatId, status })

    const where: any = {}
    
    if (contactId) where.contactId = contactId
    if (chatId) where.chatId = chatId
    if (status && status !== 'all') where.status = status

    console.log(`🔍 Buscando contratos com where:`, where)

    const contracts = await prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            whatsappNumber: true,
            email: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        }
      }
    })

    console.log(`✅ Contratos encontrados: ${contracts.length}`)
    if (contracts.length > 0) {
      console.log(`📋 Primeiro contrato:`, contracts[0])
    }

    return NextResponse.json({ contracts })
  } catch (error) {
    console.error('Erro ao buscar contratos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar contrato
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar se é FormData (com arquivo) ou JSON
    const contentType = request.headers.get('content-type')
    let validatedData: any

    if (contentType?.includes('multipart/form-data')) {
      // Processar FormData
      const formData = await request.formData()
      const body = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || null,
        amount: parseFloat(formData.get('amount') as string),
        startDate: formData.get('startDate') as string || null,
        endDate: formData.get('endDate') as string || null,
        contactId: formData.get('contactId') as string,
        chatId: formData.get('chatId') as string || null,
        assignedToId: formData.get('assignedToId') as string || null,
        paymentTerms: formData.get('paymentTerms') as string || null,
        adminSignature: formData.get('adminSignature') as string || null,
        clientSignature: formData.get('clientSignature') as string || null,
        status: formData.get('status') as string || 'draft'
      }
      
      // TODO: Processar arquivo contractFile se necessário
      const contractFile = formData.get('contractFile') as File | null
      
      validatedData = body
    } else {
      // Processar JSON normal
      const body = await request.json()
      validatedData = createContractSchema.parse(body)
    }
    
    // Gerar número único do contrato (formato: CTR-YYYY-NNNN)
    const year = new Date().getFullYear()
    const lastContract = await prisma.contract.findFirst({
      where: {
        numero: {
          startsWith: `CTR-${year}-`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    let nextNumber = 1
    if (lastContract) {
      const lastNumber = parseInt(lastContract.numero.split('-')[2])
      nextNumber = lastNumber + 1
    }
    
    const numero = `CTR-${year}-${String(nextNumber).padStart(4, '0')}`
    
    const contract = await prisma.contract.create({
      data: {
        numero,
        title: validatedData.title,
        description: validatedData.description,
        amount: validatedData.amount,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        eventDate: validatedData.eventDate ? new Date(validatedData.eventDate) : null,
        chatId: validatedData.chatId,
        contactId: validatedData.contactId,
        createdById: user.userId,
        assignedToId: validatedData.assignedToId || null,
        status: validatedData.status || 'draft',
        providerSignature: validatedData.adminSignature || null,
        clientSignature: validatedData.clientSignature || null
      },
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            whatsappNumber: true,
            email: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        }
      }
    })

    // Log de atividade
    await prisma.contactActivity.create({
      data: {
        type: 'contract',
        title: `Contrato criado: ${contract.title}`,
        description: `Contrato de R$ ${contract.amount.toFixed(2)} criado`,
        contactId: contract.contactId,
        userId: user.userId,
        metadata: {
          contractId: contract.id,
          amount: contract.amount,
          startDate: contract.startDate,
          endDate: contract.endDate
        }
      }
    })

    return NextResponse.json({ contract }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar contrato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar contrato
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        contact: { 
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            whatsappNumber: true,
            email: true 
          } 
        },
        createdBy: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        }
      }
    })

    return NextResponse.json({ contract })
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar contrato
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.contract.delete({ where: { id } })

    return NextResponse.json({ message: 'Contrato deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar contrato:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
