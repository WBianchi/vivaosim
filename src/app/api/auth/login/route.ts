import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 API Login: Recebendo requisição...')
    const body = await request.json()
    console.log('📋 Login payload:', { email: body.email, rememberMe: body.rememberMe })
    
    const { email, password, rememberMe } = loginSchema.parse(body)

    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    console.log('🔍 Chamando AuthService.login...')
    const result = await AuthService.login(
      { email, password, rememberMe },
      ipAddress,
      userAgent
    )
    
    console.log('✅ AuthService retornou sucesso para:', email)

    const response = NextResponse.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    })

    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days or 7 days
      path: '/'
    })

    return response

  } catch (error: any) {
    console.error('❌ Erro na API de login:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 400 })
  }
}
