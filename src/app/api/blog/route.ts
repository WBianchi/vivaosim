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
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).default('PUBLIC'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

// GET - Listar posts
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const visibility = searchParams.get('visibility')
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (visibility && visibility !== 'all') {
      where.visibility = visibility.toUpperCase()
    }
    
    if (author && author !== 'all') {
      where.authorId = author
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.publishedAt?.toISOString(),
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post._count.comments,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author,
      categories: post.categories.map(c => c.category),
      tags: post.tags.map(t => t.tag)
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar post
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)
    
    // Gerar slug único
    let slug = generateSlug(validatedData.title)
    let slugExists = await prisma.blogPost.findUnique({ where: { slug } })
    let counter = 1
    
    while (slugExists) {
      slug = `${generateSlug(validatedData.title)}-${counter}`
      slugExists = await prisma.blogPost.findUnique({ where: { slug } })
      counter++
    }
    
    const { categories, tags, ...postData } = validatedData
    
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        slug,
        authorId: user.userId,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        }
      }
    })

    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.publishedAt?.toISOString(),
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: 0,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author,
      categories: [],
      tags: []
    }

    return NextResponse.json({ post: formattedPost }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar post
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
        { error: 'ID do post é obrigatório' },
        { status: 400 }
      )
    }

    const validatedData = updatePostSchema.parse(updateData)
    
    // Verificar se o post pertence ao usuário
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este post' },
        { status: 403 }
      )
    }
    
    const { categories, tags, ...postData } = validatedData
    
    // Se mudou o título, atualizar o slug
    let updatePayload: any = { ...postData }
    if (validatedData.title) {
      updatePayload.slug = generateSlug(validatedData.title)
    }
    
    // Se mudou para PUBLISHED e não tinha publishedAt, definir agora
    if (validatedData.status === 'PUBLISHED' && !existingPost.publishedAt) {
      updatePayload.publishedAt = new Date()
    }
    
    const post = await prisma.blogPost.update({
      where: { id },
      data: updatePayload,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.publishedAt?.toISOString(),
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post._count.comments,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author,
      categories: post.categories.map(c => c.category),
      tags: post.tags.map(t => t.tag)
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar post
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
        { error: 'ID do post é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o post pertence ao usuário
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== user.userId) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este post' },
        { status: 403 }
      )
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Post deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
