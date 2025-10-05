import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Arquivo deve ser uma imagem' },
        { status: 400 }
      )
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Imagem deve ter no máximo 5MB' },
        { status: 400 }
      )
    }

    // Upload para Vercel Blob
    const blob = await put(`attendants/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    return NextResponse.json({
      success: true,
      url: blob.url
    })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    )
  }
}
