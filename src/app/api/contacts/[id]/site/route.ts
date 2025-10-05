import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar site do cliente
    const site = await prisma.clientSite.findUnique({
      where: { contactId: params.id },
      include: {
        produtos: true,
        convidados: true
      }
    })

    return NextResponse.json({
      success: true,
      site
    })
  } catch (error) {
    console.error('Erro ao buscar site:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar site' },
      { status: 500 }
    )
  }
}
