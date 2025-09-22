import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

// GET - Buscar configurações
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Buscar configurações (pode ser da base de dados ou arquivo)
    // Por enquanto, vou retornar valores padrão
    const settings = {
      // SEO
      siteTitle: 'VivaOSim - Sistema de Gestão',
      siteDescription: 'Plataforma completa para gestão de negócios e atendimento ao cliente',
      keywords: 'gestão, CRM, atendimento, vendas',
      favicon: '/favicon.ico',
      
      // Branding
      logo: '/logo.png',
      primaryColor: '#f97316',
      secondaryColor: '#ea580c',
      fontFamily: 'Inter',
      
      // Company
      companyName: 'VivaOSim Solutions',
      cnpj: '00.000.000/0001-00',
      email: 'contato@vivaosim.com',
      phone: '(11) 99999-9999',
      address: 'Rua Example, 123',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      
      // System
      notifications: true,
      darkMode: false,
      language: 'pt-BR'
    }

    return NextResponse.json({ success: true, data: settings })

  } catch (error: any) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// POST/PUT - Salvar configurações
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload || payload.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'Sem permissão para modificar configurações' }, { status: 403 })
    }

    const settings = await request.json()
    
    console.log('Salvando configurações:', settings)
    
    // Aqui você salvaria no banco de dados
    // await prisma.settings.upsert({
    //   where: { id: 1 },
    //   update: settings,
    //   create: { id: 1, ...settings }
    // })

    return NextResponse.json({ 
      success: true, 
      message: 'Configurações salvas com sucesso',
      data: settings 
    })

  } catch (error: any) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  return POST(request)
}

export async function PATCH(request: NextRequest) {
  return POST(request)
}
