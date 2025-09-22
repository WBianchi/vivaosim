import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const resendVerificationSchema = z.object({
  email: z.string().email('Email inválido')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resendVerificationSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá as instruções de verificação.'
      })
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: false,
        error: 'Este email já foi verificado.'
      }, { status: 400 })
    }

    // Generate new verification token
    const verificationToken = uuidv4()

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerification: verificationToken
      }
    })

    // TODO: Send verification email
    console.log(`Verification token for ${email}: ${verificationToken}`)
    console.log(`Verification link: ${process.env.APP_URL}/verify-email?token=${verificationToken}`)

    return NextResponse.json({
      success: true,
      message: 'Email de verificação reenviado com sucesso!'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    }, { status: 400 })
  }
}
