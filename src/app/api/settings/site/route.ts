import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// GET - Buscar configurações do site (pública - não requer autenticação)
export async function GET(request: NextRequest) {
  try {
    // Buscar a primeira configuração (ou criar se não existir)
    let config = await prisma.configuracaoSite.findFirst()

    if (!config) {
      // Criar configuração padrão se não existir
      config = await prisma.configuracaoSite.create({
        data: {
          titulo: 'Viva o Sim - Sistema de Gestão',
          descricao: 'Plataforma completa para gestão de negócios e atendimento ao cliente',
          palavrasChave: 'gestão, CRM, atendimento, vendas'
        }
      })
    }

    return NextResponse.json({
      success: true,
      config
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar configurações:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// POST - Salvar configurações do site
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

    // Verificar se o usuário é ADMINISTRADOR
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({
        success: false,
        error: 'Apenas administradores podem alterar as configurações'
      }, { status: 403 })
    }

    const body = await request.json()
    const { titulo, descricao, palavrasChave, logo, logoSize, logoWidth, logoHeight, favicon } = body

    // Buscar configuração existente
    let config = await prisma.configuracaoSite.findFirst()

    if (config) {
      // Atualizar configuração existente
      config = await prisma.configuracaoSite.update({
        where: { id: config.id },
        data: {
          titulo,
          descricao,
          palavrasChave,
          logo,
          logoSize,
          logoWidth,
          logoHeight,
          favicon
        }
      })
    } else {
      // Criar nova configuração
      config = await prisma.configuracaoSite.create({
        data: {
          titulo,
          descricao,
          palavrasChave,
          logo,
          logoSize,
          logoWidth,
          logoHeight,
          favicon
        }
      })
    }

    return NextResponse.json({
      success: true,
      config,
      message: 'Configurações salvas com sucesso!'
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar configurações:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
