import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// GET - Buscar informações da empresa
export async function GET(request: NextRequest) {
  try {
    // Buscar a primeira configuração (ou criar se não existir)
    let company = await prisma.infosEmpresa.findFirst()

    if (!company) {
      // Criar configuração padrão se não existir
      company = await prisma.infosEmpresa.create({
        data: {
          nomeEmpresa: 'VivaOSim Solutions',
          email: 'contato@vivaosim.com',
          pais: 'Brasil'
        }
      })
    }

    return NextResponse.json({
      success: true,
      company
    })
  } catch (error) {
    console.error('❌ Erro ao buscar informações da empresa:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar informações da empresa'
    }, { status: 500 })
  }
}

// POST - Atualizar informações da empresa
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

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({
        success: false,
        error: 'Apenas administradores podem alterar as informações da empresa'
      }, { status: 403 })
    }

    const body = await request.json()
    const { nomeEmpresa, cnpj, email, telefone, endereco, cidade, estado, pais, horarioAbertura, horarioFechamento, diasAtendimento } = body

    // Buscar configuração existente
    let company = await prisma.infosEmpresa.findFirst()

    if (company) {
      // Atualizar configuração existente
      company = await prisma.infosEmpresa.update({
        where: { id: company.id },
        data: {
          nomeEmpresa,
          cnpj,
          email,
          telefone,
          endereco,
          cidade,
          estado,
          pais,
          horarioAbertura,
          horarioFechamento,
          diasAtendimento
        }
      })
    } else {
      // Criar nova configuração
      company = await prisma.infosEmpresa.create({
        data: {
          nomeEmpresa,
          cnpj,
          email,
          telefone,
          endereco,
          cidade,
          estado,
          pais,
          horarioAbertura,
          horarioFechamento,
          diasAtendimento
        }
      })
    }

    return NextResponse.json({
      success: true,
      company,
      message: 'Informações da empresa salvas com sucesso!'
    })
  } catch (error) {
    console.error('❌ Erro ao salvar informações da empresa:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao salvar informações da empresa'
    }, { status: 500 })
  }
}
