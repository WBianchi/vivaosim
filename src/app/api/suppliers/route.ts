import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) return null

    const payload = verifyAccessToken(token)
    return payload
  } catch (error) {
    return null
  }
}

// GET - Listar fornecedores
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const category = searchParams.get('category')

    const where: any = {}
    
    if (siteId) where.siteId = siteId
    if (category && category !== 'all') where.category = category

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { expenses: true }
        }
      }
    })

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar fornecedor
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      category,
      email,
      phone,
      whatsapp,
      cnpj,
      cpf,
      address,
      city,
      state,
      zipCode,
      bankName,
      bankAgency,
      bankAccount,
      pixKey,
      notes,
      rating,
      siteId
    } = body

    const supplier = await prisma.supplier.create({
      data: {
        name,
        category,
        email,
        phone,
        whatsapp,
        cnpj,
        cpf,
        address,
        city,
        state,
        zipCode,
        bankName,
        bankAgency,
        bankAccount,
        pixKey,
        notes,
        rating: rating || 0,
        siteId
      }
    })

    return NextResponse.json({
      success: true,
      supplier
    })

  } catch (error: any) {
    console.error('Erro ao criar fornecedor:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
