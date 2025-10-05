import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// PUT - Atualizar produto
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
    const { nome, descricao, imagem, preco, quantidade, categoria, ativo, destaque } = body

    // Verificar se produto existe
    const produto = await prisma.produtoCliente.findUnique({
      where: { id: params.id }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar
    const updatedProduto = await prisma.produtoCliente.update({
      where: { id: params.id },
      data: {
        ...(nome && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(imagem !== undefined && { imagem }),
        ...(preco && { preco: Number(preco) }),
        ...(quantidade !== undefined && { quantidade }),
        ...(categoria !== undefined && { categoria }),
        ...(ativo !== undefined && { ativo }),
        ...(destaque !== undefined && { destaque })
      }
    })

    return NextResponse.json({
      success: true,
      produto: updatedProduto
    })
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

// DELETE - Remover produto
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

    // Verificar se produto existe
    const produto = await prisma.produtoCliente.findUnique({
      where: { id: params.id }
    })

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Deletar
    await prisma.produtoCliente.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Produto removido com sucesso'
    })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    )
  }
}
