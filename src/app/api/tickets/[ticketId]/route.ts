import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

// DELETE - Excluir ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = params

    await prisma.ticket.delete({
      where: { id: ticketId }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Ticket excluído com sucesso' 
    })

  } catch (error) {
    console.error('Erro ao excluir ticket:', error)
    return NextResponse.json({ 
      error: 'Erro ao excluir ticket',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Atualizar ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = params
    const body = await request.json()

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        assignedToId: body.assignedToId
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      ticket 
    })

  } catch (error) {
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json({ 
      error: 'Erro ao atualizar ticket',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
