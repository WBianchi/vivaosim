import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// GET - Buscar tema visual
export async function GET(request: NextRequest) {
  try {
    let theme = await prisma.temaVisual.findFirst()

    if (!theme) {
      // Criar tema padrão se não existir
      theme = await prisma.temaVisual.create({
        data: {}
      })
    }

    return NextResponse.json({
      success: true,
      theme
    })
  } catch (error) {
    console.error('❌ Erro ao buscar tema:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar tema visual'
    }, { status: 500 })
  }
}

// POST - Atualizar tema visual
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token não fornecido' 
      }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)
    
    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token inválido' 
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({
        success: false,
        error: 'Apenas administradores podem alterar o tema'
      }, { status: 403 })
    }

    const body = await request.json()

    // Buscar tema existente
    let theme = await prisma.temaVisual.findFirst()

    if (theme) {
      // Atualizar tema existente
      theme = await prisma.temaVisual.update({
        where: { id: theme.id },
        data: body
      })
    } else {
      // Criar novo tema
      theme = await prisma.temaVisual.create({
        data: body
      })
    }

    return NextResponse.json({
      success: true,
      theme,
      message: 'Tema visual salvo com sucesso!'
    })
  } catch (error) {
    console.error('❌ Erro ao salvar tema:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao salvar tema visual'
    }, { status: 500 })
  }
}
