import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verificar autenticação
async function verifyAuth(request: NextRequest) {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authorization.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    return null
  }
}

// Função para gerar slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const createPlanSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL', 'LIFETIME']).default('MONTHLY'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  maxUsers: z.number().optional(),
  maxProjects: z.number().optional(),
  maxStorage: z.number().optional(),
  maxApiCalls: z.number().optional(),
  features: z.array(z.string()),
  displayOrder: z.number().default(0)
})

const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL', 'LIFETIME']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  maxUsers: z.number().optional(),
  maxProjects: z.number().optional(),
  maxStorage: z.number().optional(),
  maxApiCalls: z.number().optional(),
  features: z.array(z.string()).optional(),
  displayOrder: z.number().optional()
})

// GET - Listar planos
export async function GET(request: NextRequest) {
  try {
    // Remover autenticação para permitir buscar planos no modal
    // const user = await verifyAuth(request)
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const period = searchParams.get('period')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (period && period !== 'all') {
      where.period = period.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const plans = await prisma.plan.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    })

    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      price: Number(plan.price),
      period: plan.period,
      status: plan.status,
      isFeatured: plan.isFeatured,
      isPopular: plan.isPopular,
      maxUsers: plan.maxUsers,
      maxProjects: plan.maxProjects,
      maxStorage: plan.maxStorage,
      maxApiCalls: plan.maxApiCalls,
      features: plan.features,
      displayOrder: plan.displayOrder,
      subscribersCount: plan._count.subscriptions,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString()
    }))

    return NextResponse.json({ plans: formattedPlans })
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar plano
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPlanSchema.parse(body)
    
    // Gerar slug único
    let slug = generateSlug(validatedData.name)
    let slugExists = await prisma.plan.findUnique({ where: { slug } })
    let counter = 1
    
    while (slugExists) {
      slug = `${generateSlug(validatedData.name)}-${counter}`
      slugExists = await prisma.plan.findUnique({ where: { slug } })
      counter++
    }
    
    const plan = await prisma.plan.create({
      data: {
        ...validatedData,
        slug,
        createdById: user.userId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      price: Number(plan.price),
      period: plan.period,
      status: plan.status,
      isFeatured: plan.isFeatured,
      isPopular: plan.isPopular,
      maxUsers: plan.maxUsers,
      maxProjects: plan.maxProjects,
      maxStorage: plan.maxStorage,
      maxApiCalls: plan.maxApiCalls,
      features: plan.features,
      displayOrder: plan.displayOrder,
      subscribersCount: 0,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
      createdBy: plan.createdBy
    }

    return NextResponse.json({ plan: formattedPlan }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar plano:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar plano
export async function PATCH(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do plano é obrigatório' },
        { status: 400 }
      )
    }

    const validatedData = updatePlanSchema.parse(updateData)
    
    const existingPlan = await prisma.plan.findUnique({
      where: { id }
    })

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      )
    }
    
    // Se mudou o nome, atualizar o slug
    let updatePayload: any = { ...validatedData }
    if (validatedData.name) {
      updatePayload.slug = generateSlug(validatedData.name)
    }
    
    const plan = await prisma.plan.update({
      where: { id },
      data: updatePayload,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    })

    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      price: Number(plan.price),
      period: plan.period,
      status: plan.status,
      isFeatured: plan.isFeatured,
      isPopular: plan.isPopular,
      maxUsers: plan.maxUsers,
      maxProjects: plan.maxProjects,
      maxStorage: plan.maxStorage,
      maxApiCalls: plan.maxApiCalls,
      features: plan.features,
      displayOrder: plan.displayOrder,
      subscribersCount: plan._count.subscriptions,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
      createdBy: plan.createdBy
    }

    return NextResponse.json({ plan: formattedPlan })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao atualizar plano:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar plano
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do plano é obrigatório' },
        { status: 400 }
      )
    }

    const existingPlan = await prisma.plan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    })

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      )
    }

    // Não permite deletar plano com assinantes ativos
    if (existingPlan._count.subscriptions > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar plano com assinantes ativos. Inative o plano primeiro.' },
        { status: 400 }
      )
    }

    await prisma.plan.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Plano deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar plano:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
