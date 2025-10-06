import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const chatId: string = data.get('chatId') as string

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    if (!chatId) {
      return NextResponse.json({ error: 'chatId não fornecido' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      // Imagens
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Vídeos
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm',
      // Áudios
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm',
      // Documentos
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de arquivo não permitido',
        allowedTypes 
      }, { status: 400 })
    }

    // Validar tamanho (máx 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Arquivo muito grande (máx 50MB)',
        size: file.size,
        maxSize 
      }, { status: 400 })
    }

    // Gerar nome único
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const fileName = `chat-media/${timestamp}_${randomId}.${extension}`

    console.log('📤 Fazendo upload para Vercel Blob:', fileName)

    // Upload para Vercel Blob Storage (URL pública e acessível globalmente)
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false
    })

    console.log('✅ Upload concluído! URL pública:', blob.url)

    // Determinar tipo de mídia
    let mediaType: 'image' | 'video' | 'audio' | 'document' = 'document'
    if (file.type.startsWith('image/')) mediaType = 'image'
    else if (file.type.startsWith('video/')) mediaType = 'video'
    else if (file.type.startsWith('audio/')) mediaType = 'audio'

    return NextResponse.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: {
        fileName: blob.pathname,
        fileUrl: blob.url, // URL pública do Vercel Blob - acessível globalmente!
        mediaType,
        mimeType: file.type,
        size: file.size,
        chatId
      }
    })

  } catch (error: any) {
    console.error('❌ Erro no upload:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
