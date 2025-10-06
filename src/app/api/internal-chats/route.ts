import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET - Listar chats disponíveis e usuários para conversar
export async function GET(request: NextRequest) {
  try {
    // TODO: Usar next-auth ou JWT para pegar userId
    // Por enquanto, vou usar um header temporário
    const userId = request.headers.get('x-user-id')
    
    console.log('📥 API Internal Chats - userId recebido:', userId)
    
    if (!userId) {
      console.log('❌ userId não encontrado no header')
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    // Buscar usuário logado
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, name: true, email: true, avatar: true, status: true }
    })

    console.log('👤 Usuário encontrado:', currentUser)

    if (!currentUser) {
      console.log('❌ Usuário não existe no banco')
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Definir roles que o usuário pode ver
    let targetRoles: UserRole[] = []
    
    if (currentUser.role === UserRole.ADMINISTRADOR) {
      // Admin vê atendentes
      targetRoles = [UserRole.ATENDENTE]
      console.log('🔍 Admin buscando ATENDENTEs')
    } else if (currentUser.role === UserRole.ATENDENTE) {
      // Atendente vê admins
      targetRoles = [UserRole.ADMINISTRADOR]
      console.log('🔍 Atendente buscando ADMINISTRADOREs')
    } else {
      console.log('⛔ Role não permitido:', currentUser.role)
      return NextResponse.json(
        { error: 'Sem permissão para acessar chat interno' },
        { status: 403 }
      )
    }

    // Buscar usuários disponíveis para conversar
    const availableUsers = await prisma.user.findMany({
      where: {
        role: { in: targetRoles },
        status: 'ATIVO',
        id: { not: userId }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        lastLoginAt: true
      },
      orderBy: { name: 'asc' }
    })

    console.log(`✅ ${availableUsers.length} usuários disponíveis encontrados:`, availableUsers.map(u => ({ name: u.name, role: u.role })))

    // Buscar chats existentes onde o usuário participa
    const chats = await prisma.internalChat.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    })

    // Mapear chats para incluir informações do outro usuário
    const chatsWithUserInfo = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.user1Id === userId ? chat.user2Id : chat.user1Id
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            status: true,
            lastLoginAt: true
          }
        })

        const isUser1 = chat.user1Id === userId
        const unreadCount = isUser1 ? chat.user1UnreadCount : chat.user2UnreadCount
        const pinned = isUser1 ? chat.user1Pinned : chat.user2Pinned
        const muted = isUser1 ? chat.user1Muted : chat.user2Muted
        const archived = isUser1 ? chat.user1Archived : chat.user2Archived

        return {
          id: chat.id,
          otherUser,
          lastMessage: chat.lastMessage,
          lastMessageAt: chat.lastMessageAt,
          unreadCount,
          pinned,
          muted,
          archived,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }
      })
    )

    return NextResponse.json({
      currentUser: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        email: currentUser.email,
        avatar: currentUser.avatar
      },
      chats: chatsWithUserInfo,
      availableUsers
    })
  } catch (error) {
    console.error('❌ Erro ao listar chats:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar ou obter chat com usuário
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { otherUserId } = body

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'ID do outro usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existe um chat entre os dois usuários
    const existingChat = await prisma.internalChat.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: userId }
        ]
      }
    })

    if (existingChat) {
      return NextResponse.json({ chat: existingChat })
    }

    // Criar novo chat (user1Id sempre o menor ID para manter consistência)
    const [user1, user2] = [userId, otherUserId].sort()
    
    const newChat = await prisma.internalChat.create({
      data: {
        user1Id: user1,
        user2Id: user2
      }
    })

    console.log('✅ Chat interno criado:', newChat.id)
    return NextResponse.json({ chat: newChat }, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao criar chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
