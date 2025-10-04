import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

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
  } catch {
    return null
  }
}

// GET - Buscar estatísticas dos posts
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total de posts
    const totalPosts = await prisma.blogPost.count()

    // Posts publicados
    const publishedPosts = await prisma.blogPost.count({
      where: { status: 'PUBLISHED' }
    })

    // Posts em rascunho
    const draftPosts = await prisma.blogPost.count({
      where: { status: 'DRAFT' }
    })

    // Total de visualizações
    const totalViews = await prisma.blogPost.aggregate({
      _sum: {
        viewCount: true
      }
    })

    // Total de comentários
    const totalComments = await prisma.blogComment.count()

    // Calcular mudanças do mês
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const postsThisMonth = await prisma.blogPost.count({
      where: {
        createdAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const postsLastMonth = await prisma.blogPost.count({
      where: {
        createdAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    const publishedThisMonth = await prisma.blogPost.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const publishedLastMonth = await prisma.blogPost.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    const stats = {
      totalPosts: {
        value: totalPosts,
        change: postsThisMonth - postsLastMonth
      },
      publishedPosts: {
        value: publishedPosts,
        change: publishedThisMonth - publishedLastMonth
      },
      draftPosts: {
        value: draftPosts,
        change: 0 // Pode calcular se necessário
      },
      totalViews: {
        value: totalViews._sum.viewCount || 0,
        change: Math.floor((totalViews._sum.viewCount || 0) * 0.1) // Estimativa
      },
      totalComments: {
        value: totalComments,
        change: Math.floor(totalComments * 0.05) // Estimativa
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
