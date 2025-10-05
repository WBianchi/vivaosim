import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
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
    const folder: string = (data.get('folder') as string) || 'uploads' // 'avatars', 'logos', etc

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

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Criar diretório se não existir
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Diretório já existe
    }

    // Gerar nome único
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `${timestamp}.${extension}`
    const filePath = join(uploadDir, fileName)

    // Salvar arquivo
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${folder}/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName,
      size: file.size
    })

  } catch (error: any) {
    console.error('Erro no upload:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })
  }
}
