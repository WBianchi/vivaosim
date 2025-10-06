import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface DecodedToken {
  userId: string
  [key: string]: unknown
}

const attendanceStatusLabels: Record<string, string> = {
  AGUARDANDO: 'Aguardando atendimento',
  EM_ANDAMENTO: 'Em atendimento',
  PAUSADO: 'Atendimento pausado',
  FINALIZADO: 'Atendimento finalizado'
}

const contactStatusLabels: Record<string, string> = {
  LEAD_FRESCO: 'Lead fresco',
  LEAD_QUALIFICADO: 'Lead qualificado',
  PROSPECT: 'Prospect',
  CLIENTE: 'Cliente',
  INATIVO: 'Inativo'
}

async function verifyAuth(): Promise<DecodedToken | null> {
  const headersList = headers()
  const authorization = headersList.get('authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }

  const token = authorization.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error)
    return null
  }
}

function formatStatusLabel(code?: string | null, fallback?: string | null): string | undefined {
  if (!code && !fallback) return undefined

  if (code && attendanceStatusLabels[code]) {
    return attendanceStatusLabels[code]
  }

  if (code && contactStatusLabels[code]) {
    return contactStatusLabels[code]
  }

  if (fallback) return fallback

  if (!code) return undefined

  return code
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

async function getChatMeta(chatId: string) {
  const [contact, attendance] = await Promise.all([
    prisma.contact.findUnique({
      where: { whatsappChatId: chatId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        queue: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        statusConfig: true
      }
    }),
    prisma.attendance.findFirst({
      where: { whatsappChatId: chatId },
      include: {
        attendant: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })
  ])

  if (!contact && !attendance) {
    return null
  }

  return {
    contactId: contact?.id,
    assignedTo: attendance?.attendant
      ? {
          id: attendance.attendant.id,
          name: attendance.attendant.name,
          email: attendance.attendant.email,
          avatar: attendance.attendant.avatar || null
        }
      : contact?.assignedTo
        ? {
            id: contact.assignedTo.id,
            name: contact.assignedTo.name,
            email: contact.assignedTo.email,
            avatar: contact.assignedTo.avatar || null
          }
        : null,
    status: attendance
      ? {
          code: attendance.status,
          label: formatStatusLabel(attendance.status)
        }
      : contact
        ? {
            code: contact.statusConfig?.name || contact.status,
            label: formatStatusLabel(contact.statusConfig?.name, contact.statusConfig?.description) || formatStatusLabel(contact.status)
          }
        : null,
    queue: contact?.queue
      ? {
          id: contact.queue.id,
          name: contact.queue.name,
          color: contact.queue.color
        }
      : null,
    updatedAt: attendance?.updatedAt ?? contact?.updatedAt ?? new Date()
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = await params
    const decodedChatId = decodeURIComponent(chatId)

    const meta = await getChatMeta(decodedChatId)

    return NextResponse.json({
      success: true,
      meta
    })
  } catch (error) {
    console.error('❌ Erro ao buscar metadados do chat:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId } = await params
    const decodedChatId = decodeURIComponent(chatId)

    const body = await request.json()
    const { assignedToId, status, chatName, chatNumber } = body as {
      assignedToId?: string | null
      status?: string | null
      chatName?: string | null
      chatNumber?: string | null
    }

    if (!assignedToId && !status) {
      return NextResponse.json({
        error: 'Nenhuma mudança informada'
      }, { status: 400 })
    }

    let contact = await prisma.contact.findUnique({
      where: { whatsappChatId: decodedChatId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    if (!contact) {
      if (!chatName) {
        return NextResponse.json({
          error: 'Contato não encontrado. Forneça chatName para criar automaticamente.'
        }, { status: 400 })
      }

      contact = await prisma.contact.create({
        data: {
          name: chatName,
          phone: chatNumber || undefined,
          whatsappNumber: chatNumber || undefined,
          whatsappName: chatName,
          whatsappChatId: decodedChatId,
          whatsappIsGroup: false,
          source: 'WHATSAPP',
          status: 'LEAD_FRESCO',
          assignedToId: assignedToId || undefined
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      })
    } else if (assignedToId !== undefined) {
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: {
          assignedToId: assignedToId || null
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      })
    }

    let attendance = await prisma.attendance.findFirst({
      where: { whatsappChatId: decodedChatId }
    })

    const shouldUpdateStatus = typeof status === 'string' && status.length > 0
    const shouldUpdateAssigned = typeof assignedToId !== 'undefined'

    if (attendance) {
      const updateData: Record<string, unknown> = {}

      if (shouldUpdateStatus) {
        updateData.status = status
      }

      if (shouldUpdateAssigned && assignedToId) {
        updateData.attendantId = assignedToId
      }

      if (Object.keys(updateData).length > 0) {
        attendance = await prisma.attendance.update({
          where: { id: attendance.id },
          data: updateData
        })
      }
    } else if (shouldUpdateStatus || (shouldUpdateAssigned && assignedToId)) {
      const attendantId = assignedToId || contact?.assignedToId || user.userId

      attendance = await prisma.attendance.create({
        data: {
          status: (status as string) || 'AGUARDANDO',
          contactId: contact!.id,
          attendantId,
          whatsappChatId: decodedChatId,
          notes: null,
          tags: []
        }
      })
    }

    const meta = await getChatMeta(decodedChatId)

    return NextResponse.json({
      success: true,
      meta
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar metadados do chat:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
