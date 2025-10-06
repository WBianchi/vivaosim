import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { verifyAccessToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const folder: string = (data.get('folder') as string) || 'uploads' // 'avatars', 'logos', 'blog', etc

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `${folder}/${timestamp}.${extension}`

    console.log('📤 Fazendo upload para Vercel Blob:', fileName)

    // Upload para Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false
    })

    console.log('✅ Upload concluído! URL:', blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: blob.pathname,
      size: file.size
    })

  } catch (error: any) {
    console.error('❌ Erro no upload:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
