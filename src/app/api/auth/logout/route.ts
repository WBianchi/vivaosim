import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (refreshToken) {
      await AuthService.logout(refreshToken)
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })

    // Clear refresh token cookie
    response.cookies.delete('refreshToken')

    return response

  } catch (error: any) {
    const response = NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 500 })

    // Clear refresh token cookie even on error
    response.cookies.delete('refreshToken')

    return response
  }
}
