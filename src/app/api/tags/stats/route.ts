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

// GET - Buscar estatísticas das tags
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total de tags do usuário
    const totalTags = await prisma.whatsAppTag.count({
      where: {
        userId: user.userId
      }
    })

    // Tags com uso (que têm chatTags associadas)
    const tagsWithUsage = await prisma.whatsAppTag.findMany({
      where: {
        userId: user.userId
      },
      include: {
        chatTags: true
      }
    })

    // Tags mais usadas (com mais de 10 usos)
    const mostUsedTags = tagsWithUsage.filter(tag => tag.chatTags.length >= 10).length

    // Cores únicas ativas
    const uniqueColors = new Set(tagsWithUsage.map(tag => tag.color))
    const activeColors = uniqueColors.size

    // Calcular mudanças do mês (comparar com mês anterior)
    const now = new Date()
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const tagsThisMonth = await prisma.whatsAppTag.count({
      where: {
        userId: user.userId,
        createdAt: {
          gte: firstDayThisMonth
        }
      }
    })

    const tagsLastMonth = await prisma.whatsAppTag.count({
      where: {
        userId: user.userId,
        createdAt: {
          gte: firstDayLastMonth,
          lt: firstDayThisMonth
        }
      }
    })

    // Contar tags mais usadas criadas este mês
    const mostUsedThisMonth = tagsWithUsage.filter(tag => 
      tag.chatTags.length >= 10 && 
      new Date(tag.createdAt) >= firstDayThisMonth
    ).length

    const mostUsedLastMonth = tagsWithUsage.filter(tag => 
      tag.chatTags.length >= 10 && 
      new Date(tag.createdAt) >= firstDayLastMonth &&
      new Date(tag.createdAt) < firstDayThisMonth
    ).length

    const stats = {
      totalTags: {
        value: totalTags,
        change: tagsThisMonth - tagsLastMonth
      },
      mostUsedTags: {
        value: mostUsedTags,
        change: mostUsedThisMonth - mostUsedLastMonth
      },
      activeColors: {
        value: activeColors,
        change: Math.floor(activeColors * 0.1) // Estimativa
      },
      totalUsage: {
        value: tagsWithUsage.reduce((sum, tag) => sum + tag.chatTags.length, 0),
        change: tagsThisMonth * 5 // Estimativa
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
