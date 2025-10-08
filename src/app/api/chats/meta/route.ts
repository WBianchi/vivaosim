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
  if (!code && !fallback) {
    return undefined
  }

  if (code && attendanceStatusLabels[code]) {
    return attendanceStatusLabels[code]
  }

  if (code && contactStatusLabels[code]) {
    return contactStatusLabels[code]
  }

  if (fallback) {
    return fallback
  }

  if (!code) {
    return undefined
  }

  return code
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatIdsParam = searchParams.get('chatIds')

    if (!chatIdsParam) {
      return NextResponse.json({
        error: 'chatIds é obrigatório'
      }, { status: 400 })
    }

    const chatIds = Array.from(new Set(chatIdsParam.split(',').map(id => decodeURIComponent(id.trim())).filter(Boolean)))

    if (chatIds.length === 0) {
      return NextResponse.json({
        success: true,
        metaByChat: {}
      })
    }

    const [contacts, attendances] = await Promise.all([
      prisma.contact.findMany({
        where: {
          whatsappChatId: { in: chatIds }
        },
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
      prisma.attendance.findMany({
        where: {
          whatsappChatId: { in: chatIds }
        },
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

    const metaByChat: Record<string, any> = {}

    // Inicializar todos os chats com status padrão AGUARDANDO
    chatIds.forEach(chatId => {
      metaByChat[chatId] = {
        status: {
          code: 'AGUARDANDO',
          label: 'Aguardando atendimento'
        }
      }
    })

    contacts.forEach(contact => {
      if (!contact.whatsappChatId) return

      metaByChat[contact.whatsappChatId] = {
        ...(metaByChat[contact.whatsappChatId] || {}),
        contactId: contact.id,
        assignedTo: contact.assignedTo ? {
          id: contact.assignedTo.id,
          name: contact.assignedTo.name,
          email: contact.assignedTo.email,
          avatar: contact.assignedTo.avatar || null
        } : null,
        status: {
          code: contact.statusConfig?.name || contact.status,
          label: formatStatusLabel(contact.statusConfig?.name, contact.statusConfig?.description) || formatStatusLabel(contact.status)
        },
        queue: contact.queue ? {
          id: contact.queue.id,
          name: contact.queue.name,
          color: contact.queue.color
        } : null,
        updatedAt: contact.updatedAt
      }
    })

    attendances.forEach(attendance => {
      if (!attendance.whatsappChatId) return

      const current = metaByChat[attendance.whatsappChatId] || {}

      metaByChat[attendance.whatsappChatId] = {
        ...current,
        contactId: current.contactId,
        assignedTo: attendance.attendant ? {
          id: attendance.attendant.id,
          name: attendance.attendant.name,
          email: attendance.attendant.email,
          avatar: attendance.attendant.avatar || null
        } : current.assignedTo || null,
        status: {
          code: attendance.status,
          label: formatStatusLabel(attendance.status)
        },
        updatedAt: attendance.updatedAt
      }
    })

    return NextResponse.json({
      success: true,
      metaByChat
    })
  } catch (error) {
    console.error('❌ Erro ao buscar metadados dos chats:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
