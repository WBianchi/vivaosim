import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/lib/jwt'
import { UserRole, UserStatus } from '@prisma/client'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  city?: string
  state?: string
  country?: string
  cpf?: string
  cnpj?: string
}

export interface AuthResult {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    status: UserStatus
    avatar?: string | null
  }
  accessToken: string
  refreshToken: string
}

export class AuthService {
  static async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    const { email, password, rememberMe = false } = credentials

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      throw new Error('Credenciais inválidas')
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('Conta temporariamente bloqueada. Tente novamente mais tarde.')
    }

    // Check if account is active
    if (user.status !== 'ATIVO') {
      throw new Error('Conta inativa. Entre em contato com o suporte.')
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      // Increment login attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: user.loginAttempts + 1,
          lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes after 5 attempts
        }
      })
      throw new Error('Credenciais inválidas')
    }

    // Create session
    const sessionId = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7)) // 30 days if remember me, 7 days otherwise

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      sessionId
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId
    })

    // Save session to database
    await prisma.userSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt,
        ipAddress,
        userAgent
      }
    })

    // Reset login attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        rememberMe
      }
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar
      },
      accessToken,
      refreshToken
    }
  }

  static async register(data: RegisterData): Promise<AuthResult> {
    const { email, password, ...userData } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('Usuário já cadastrado com este email')
    }

    // Check CPF/CNPJ uniqueness
    if (userData.cpf) {
      const cpfExists = await prisma.user.findUnique({
        where: { cpf: userData.cpf }
      })
      if (cpfExists) {
        throw new Error('CPF já cadastrado')
      }
    }

    if (userData.cnpj) {
      const cnpjExists = await prisma.user.findUnique({
        where: { cnpj: userData.cnpj }
      })
      if (cnpjExists) {
        throw new Error('CNPJ já cadastrado')
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        email,
        password: hashedPassword,
        role: UserRole.CLIENTE,
        status: UserStatus.PENDENTE, // Requires email verification
        emailVerification: uuidv4()
      }
    })

    // Create session
    const sessionId = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      sessionId
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId
    })

    // Save session
    await prisma.userSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt
      }
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar
      },
      accessToken,
      refreshToken
    }
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken)

      // Find session
      const session = await prisma.userSession.findUnique({
        where: { refreshToken },
        include: { user: true }
      })

      if (!session || !session.isActive || session.expiresAt < new Date()) {
        throw new Error('Sessão inválida ou expirada')
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status,
        sessionId: session.id
      })

      const newRefreshToken = generateRefreshToken({
        userId: session.user.id,
        sessionId: session.id
      })

      // Update session
      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken,
          updatedAt: new Date()
        }
      })

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      throw new Error('Token de atualização inválido')
    }
  }

  static async logout(refreshToken: string): Promise<void> {
    await prisma.userSession.updateMany({
      where: { refreshToken },
      data: { isActive: false }
    })
  }

  static async logoutAll(userId: string): Promise<void> {
    await prisma.userSession.updateMany({
      where: { userId },
      data: { isActive: false }
    })
  }

  static async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not
      return
    }

    const resetToken = uuidv4()
    const resetExpires = new Date()
    resetExpires.setHours(resetExpires.getHours() + 1) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordReset: resetToken,
        passwordResetExpires: resetExpires
      }
    })

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`)
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        passwordReset: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw new Error('Token de reset inválido ou expirado')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordReset: null,
        passwordResetExpires: null,
        loginAttempts: 0,
        lockedUntil: null
      }
    })

    // Logout all sessions
    await this.logoutAll(user.id)
  }

  static async verifyEmail(token: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { emailVerification: token }
    })

    if (!user) {
      throw new Error('Token de verificação inválido')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerification: null,
        status: UserStatus.ATIVO
      }
    })
  }
}
