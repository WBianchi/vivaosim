import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Atualizar status da assinatura
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    console.log('📝 Atualizando assinatura:', params.id, 'Status:', status)

    const subscription = await prisma.planSubscription.update({
      where: { id: params.id },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

    console.log('✅ Assinatura atualizada:', subscription.id)

    return NextResponse.json({
      success: true,
      data: subscription
    })
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar assinatura' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar assinatura
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.planSubscription.delete({
      where: { id: params.id }
    })

    console.log('✅ Assinatura excluída:', params.id)

    return NextResponse.json({
      success: true,
      message: 'Assinatura deletada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar assinatura' },
      { status: 500 }
    )
  }
}
