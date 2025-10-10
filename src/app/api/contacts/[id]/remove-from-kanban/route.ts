import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    const { id } = params

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

    // Apenas remove do Kanban (seta kanbanColumnId como null)
    await prisma.contact.update({
      where: { id },
      data: {
        kanbanColumnId: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente removido do Kanban com sucesso'
    })
  } catch (error) {
    console.error('Erro ao remover cliente do Kanban:', error)
    return NextResponse.json(
      { error: 'Erro ao remover cliente do Kanban' },
      { status: 500 }
    )
  }
}
