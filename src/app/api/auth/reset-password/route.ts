import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    await AuthService.resetPassword(token, password)

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso. Faça login com sua nova senha.'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 400 })
  }
}
