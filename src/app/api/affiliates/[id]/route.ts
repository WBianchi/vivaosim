import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Atualizar afiliado
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, email, phone, commissionRate, pixKey } = body

    console.log('✏️ Atualizando afiliado:', id)

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone
      }
    })

    // Atualizar perfil de afiliado
    await prisma.affiliate.updateMany({
      where: { userId: id },
      data: {
        commissionRate: commissionRate / 100
      }
    })

    console.log('✅ Afiliado atualizado!')

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error: any) {
    console.error('Erro ao atualizar afiliado:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar afiliado' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir afiliado
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('🗑️ Excluindo afiliado:', id)

    // Buscar afiliado
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        affiliateProfile: true
      }
    })

    if (!user || !user.affiliateProfile) {
      return NextResponse.json(
        { success: false, error: 'Afiliado não encontrado' },
        { status: 404 }
      )
    }

    // Excluir perfil de afiliado primeiro (por causa da FK)
    await prisma.affiliate.delete({
      where: { id: user.affiliateProfile.id }
    })

    // Excluir usuário
    await prisma.user.delete({
      where: { id }
    })

    console.log('✅ Afiliado excluído!')

    return NextResponse.json({
      success: true,
      message: 'Afiliado excluído com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao excluir afiliado:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao excluir afiliado' },
      { status: 500 }
    )
  }
}
