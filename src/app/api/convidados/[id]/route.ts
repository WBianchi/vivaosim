import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// PUT - Atualizar convidado
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, email, telefone, numeroConvites, status, observacoes, presenteEvento } = body

    // Verificar se convidado existe
    const convidado = await prisma.convidadoCliente.findUnique({
      where: { id: params.id }
    })

    if (!convidado) {
      return NextResponse.json(
        { error: 'Convidado não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar
    const updatedConvidado = await prisma.convidadoCliente.update({
      where: { id: params.id },
      data: {
        ...(nome && { nome }),
        ...(email !== undefined && { email: email || null }),
        ...(telefone !== undefined && { telefone: telefone || null }),
        ...(numeroConvites && { numeroConvites }),
        ...(status && { 
          status,
          ...(status === 'CONFIRMADO' && !convidado.confirmedAt && { confirmedAt: new Date() })
        }),
        ...(observacoes !== undefined && { observacoes: observacoes || null }),
        ...(presenteEvento !== undefined && { 
          presenteEvento,
          ...(presenteEvento && !convidado.checkinAt && { checkinAt: new Date() })
        })
      }
    })

    return NextResponse.json({
      success: true,
      convidado: updatedConvidado
    })
  } catch (error) {
    console.error('Erro ao atualizar convidado:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar convidado' },
      { status: 500 }
    )
  }
}

// DELETE - Remover convidado
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se convidado existe
    const convidado = await prisma.convidadoCliente.findUnique({
      where: { id: params.id }
    })

    if (!convidado) {
      return NextResponse.json(
        { error: 'Convidado não encontrado' },
        { status: 404 }
      )
    }

    // Deletar
    await prisma.convidadoCliente.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Convidado removido com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar convidado:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar convidado' },
      { status: 500 }
    )
  }
}
