import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// GET - Buscar configurações do sistema
export async function GET(request: NextRequest) {
  try {
    let config = await prisma.configuracoesSistema.findFirst()

    if (!config) {
      // Criar configuração padrão se não existir
      config = await prisma.configuracoesSistema.create({
        data: {}
      })
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error) {
    console.error('❌ Erro ao buscar configurações do sistema:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar configurações do sistema'
    }, { status: 500 })
  }
}

// POST - Atualizar configurações do sistema
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
        error: 'Apenas administradores podem alterar as configurações do sistema'
      }, { status: 403 })
    }

    const body = await request.json()

    // Buscar configuração existente
    let config = await prisma.configuracoesSistema.findFirst()

    if (config) {
      // Atualizar configuração existente
      config = await prisma.configuracoesSistema.update({
        where: { id: config.id },
        data: body
      })
    } else {
      // Criar nova configuração
      config = await prisma.configuracoesSistema.create({
        data: body
      })
    }

    return NextResponse.json({
      success: true,
      config,
      message: 'Configurações do sistema salvas com sucesso!'
    })
  } catch (error) {
    console.error('❌ Erro ao salvar configurações do sistema:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao salvar configurações do sistema'
    }, { status: 500 })
  }
}
