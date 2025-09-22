import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { z } from 'zod'

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = verifyEmailSchema.parse(body)

    await AuthService.verifyEmail(token)

    return NextResponse.json({
      success: true,
      message: 'Email verificado com sucesso!'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 400 })
  }
}
