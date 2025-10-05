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

// GET - Listar despesas
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const contractId = searchParams.get('contractId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (siteId) where.siteId = siteId
    if (contractId) where.contractId = contractId
    if (category && category !== 'all') where.category = category
    if (status && status !== 'all') where.status = status

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        contract: {
          select: {
            id: true,
            numero: true,
            title: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Erro ao buscar despesas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar despesa
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      status,
      amount,
      paidAmount,
      dueDate,
      paidDate,
      paymentMethod,
      attachments,
      notes,
      siteId,
      contractId,
      supplierId,
      installments
    } = body

    // Se tiver parcelamento, criar múltiplas despesas
    if (installments && installments > 1) {
      const installmentAmount = amount / installments
      const expenses = []

      for (let i = 1; i <= installments; i++) {
        const installmentDueDate = dueDate ? new Date(dueDate) : new Date()
        installmentDueDate.setMonth(installmentDueDate.getMonth() + (i - 1))

        const expense = await prisma.expense.create({
          data: {
            title: `${title} (${i}/${installments})`,
            description,
            category,
            status: status || 'PENDENTE',
            amount: installmentAmount,
            paidAmount: 0,
            dueDate: installmentDueDate,
            paidDate: paidDate ? new Date(paidDate) : null,
            paymentMethod,
            attachments: attachments || [],
            notes,
            siteId,
            contractId,
            supplierId,
            createdById: user.userId,
            installments,
            installmentNumber: i
          },
          include: {
            supplier: true,
            contract: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })

        expenses.push(expense)
      }

      return NextResponse.json({
        success: true,
        expenses
      })
    }

    // Criar despesa única
    const expense = await prisma.expense.create({
      data: {
        title,
        description,
        category,
        status: status || 'PENDENTE',
        amount,
        paidAmount: paidAmount || 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        paidDate: paidDate ? new Date(paidDate) : null,
        paymentMethod,
        attachments: attachments || [],
        notes,
        siteId,
        contractId,
        supplierId,
        createdById: user.userId,
        installments: 1,
        installmentNumber: 1
      },
      include: {
        supplier: true,
        contract: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      expense
    })

  } catch (error: any) {
    console.error('Erro ao criar despesa:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
