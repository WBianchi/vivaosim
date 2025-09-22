import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: 'Token de atualização não encontrado'
      }, { status: 401 })
    }

    const result = await AuthService.refreshToken(refreshToken)

    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: result.accessToken
      }
    })

    // Update refresh token cookie
    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error: any) {
    const response = NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 401 })

    // Clear refresh token cookie on error
    response.cookies.delete('refreshToken')

    return response
  }
}
