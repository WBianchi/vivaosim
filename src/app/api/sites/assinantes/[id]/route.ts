import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Atualizar site
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      customDomain,
      status,
      configType,
      primaryColor,
      secondaryColor,
      segment,
      serverType,
      serverUrl,
      suspendedReason
    } = body

    // Verificar domínio personalizado se alterado
    if (customDomain) {
      const existing = await prisma.subscriberSite.findFirst({
        where: {
          customDomain,
          NOT: { id }
        }
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Domínio personalizado já está em uso' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      customDomain,
      configType,
      primaryColor,
      secondaryColor,
      segment,
      serverType,
      serverUrl
    }

    // Atualizar status e datas relacionadas
    if (status) {
      updateData.status = status
      
      if (status === 'ACTIVE' && !updateData.activatedAt) {
        updateData.activatedAt = new Date()
      }
      
      if (status === 'SUSPENDED') {
        updateData.suspendedAt = new Date()
        updateData.suspendedReason = suspendedReason
      }
    }

    const site = await prisma.subscriberSite.update({
      where: { id },
      data: updateData,
      include: {
        subscriber: true,
        plan: true,
        subscription: true
      }
    })

    return NextResponse.json({
      success: true,
      data: site,
      message: 'Site atualizado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar site:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar site' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir site
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.subscriberSite.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Site excluído com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao excluir site:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao excluir site' },
      { status: 500 }
    )
  }
}

// PATCH - Ativar/Desativar site
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { action } = await request.json()

    const site = await prisma.subscriberSite.findUnique({
      where: { id }
    })

    if (!site) {
      return NextResponse.json(
        { success: false, error: 'Site não encontrado' },
        { status: 404 }
      )
    }

    let newStatus = site.status
    let updateData: any = {}

    if (action === 'activate') {
      newStatus = 'ACTIVE'
      updateData.activatedAt = new Date()
    } else if (action === 'deactivate') {
      newStatus = 'INACTIVE'
    } else if (action === 'suspend') {
      newStatus = 'SUSPENDED'
      updateData.suspendedAt = new Date()
    }

    const updatedSite = await prisma.subscriberSite.update({
      where: { id },
      data: {
        status: newStatus,
        ...updateData
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedSite,
      message: `Site ${action === 'activate' ? 'ativado' : action === 'suspend' ? 'suspenso' : 'desativado'} com sucesso`
    })
  } catch (error: any) {
    console.error('Erro ao alterar status do site:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao alterar status' },
      { status: 500 }
    )
  }
}
