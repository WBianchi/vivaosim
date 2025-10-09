import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
const JWT_ISSUER = 'vivaosim'
const JWT_AUDIENCE = 'vivaosim-app'

export interface JWTPayload extends jwt.JwtPayload {
  userId: string
  email: string
  name: string
  role: string
  status: string
  sessionId: string
  exp: number
  iat: number
}

export interface RefreshTokenPayload {
  userId: string
  sessionId: string
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h', // Access token expires in 24 hours
    issuer: 'vivaosim',
    audience: 'vivaosim-app'
  })
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d', // Refresh token expires in 7 days
    issuer: 'vivaosim',
  })
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }) as JWTPayload

    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expirado')
    }

    return payload
  } catch (error) {
    throw new Error('Token inválido ou expirado')
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'vivaosim',
      audience: 'vivaosim-app'
    }) as RefreshTokenPayload
  } catch (error) {
    throw new Error('Refresh token inválido ou expirado')
  }
}

export function decodeToken(token: string): any {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}
