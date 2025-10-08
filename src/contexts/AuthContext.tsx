'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decodeToken } from '@/lib/jwt'

// Definir os enums localmente enquanto não temos os tipos do Prisma
enum UserRole {
  ADMINISTRADOR = 'ADMINISTRADOR',
  ATENDENTE = 'ATENDENTE', 
  ASSINANTE = 'ASSINANTE',
  CLIENTE = 'CLIENTE'
}

enum UserStatus {
  PENDENTE = 'PENDENTE',
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO'
}

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatar?: string | null
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<boolean>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

interface RegisterData {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Função para redirecionar baseado no role
function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'ADMINISTRADOR':
    case 'ATENDENTE':
    case 'ASSINANTE':
      return '/dashboard'
    case 'CLIENTE':
      return '/cliente'
    default:
      return '/'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Auto-refresh do token a cada 6 dias
  useEffect(() => {
    if (!accessToken) return

    const refreshInterval = setInterval(async () => {
      console.log('🔄 Auto-refresh do token...')
      const success = await refreshToken()
      if (!success) {
        console.log('❌ Falha no auto-refresh, deslogando...')
        await logout()
      }
    }, 6 * 24 * 60 * 60 * 1000) // 6 dias

    return () => clearInterval(refreshInterval)
  }, [accessToken])

  useEffect(() => {
    // Função para ler token do cookie
    const getTokenFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'accessToken') {
          return value
        }
      }
      return null
    }

    const initAuth = async () => {
      console.log('🔐 AuthContext: Inicializando autenticação...')
      
      // Verificar token no localStorage primeiro, depois no cookie
      let token = localStorage.getItem('accessToken')
      if (!token) {
        token = getTokenFromCookie()
        console.log('🍪 Token do cookie:', token ? 'encontrado' : 'não encontrado')
      } else {
        console.log('💾 Token do localStorage:', token ? 'encontrado' : 'não encontrado')
      }

      if (token) {
        try {
          const payload = decodeToken(token)
          console.log('🔓 Token decodificado:', payload)
          
          if (payload && payload.exp > Date.now() / 1000) {
            setAccessToken(token)
            setUser({
              id: payload.userId,
              name: payload.name,
              email: payload.email,
              role: payload.role as any,
              status: payload.status as any,
              avatar: null
            })
            
            console.log('✅ Usuário autenticado:', payload.name, payload.role)
            
            // Sincronizar localStorage com cookie
            if (!localStorage.getItem('accessToken')) {
              localStorage.setItem('accessToken', token)
            }
          } else {
            console.log('⏰ Token expirado')
            localStorage.removeItem('accessToken')
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
            await refreshToken()
          }
        } catch (error) {
          console.error('❌ Erro ao decodificar token:', error)
          localStorage.removeItem('accessToken')
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        }
      } else {
        console.log('🚫 Nenhum token encontrado')
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string, rememberMe = false) => {
    console.log('🔐 AuthContext: Fazendo login...', { email })
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      const data = await response.json()
      console.log('📦 Response data:', data)
      console.log('📦 Data keys:', Object.keys(data))

      if (!data.success) {
        console.log('❌ Login falhou:', data.error)
        throw new Error(data.error)
      }

      console.log('🔍 Verificando data.data:', data.data)
      console.log('🔍 Data.data keys:', data.data ? Object.keys(data.data) : 'undefined')
      
      const { user: userData, accessToken: token } = data.data
      console.log('👤 UserData:', userData)
      console.log('🔑 Token:', token ? 'exists' : 'missing')
      
      // Atualizar estado
      setUser(userData)
      setAccessToken(token)
      localStorage.setItem('accessToken', token)
      
      // Setar cookie com 7 dias (sem secure para localhost, samesite=lax para compatibilidade)
      const maxAge = 7 * 24 * 60 * 60 // 7 dias em segundos
      document.cookie = `accessToken=${token}; path=/; max-age=${maxAge}; samesite=lax`
      
      console.log('✅ Estado atualizado:', { user: userData.name, role: userData.role })
      console.log('🍪 Cookie setado com max-age:', maxAge, 'segundos (7 dias)')
      
      // NÃO redirecionar aqui - deixar a página de login fazer isso
      // Isso evita conflito de redirecionamento duplo

    } catch (error: any) {
      console.error('❌ Erro no AuthContext:', error)
      throw new Error(error.message || 'Erro ao fazer login')
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      // Registro bem-sucedido - redirecionar para verificação de email
      router.push('/verify-email')

    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta')
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setUser(null)
      setAccessToken(null)
      localStorage.removeItem('accessToken')
      // Limpar cookie
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      router.push('/login')
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      const { accessToken: newToken } = data.data
      const payload = decodeToken(newToken)
      
      setAccessToken(newToken)
      setUser({
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: payload.status,
        avatar: payload.avatar
      })
      localStorage.setItem('accessToken', newToken)

      return true

    } catch (error) {
      setUser(null)
      setAccessToken(null)
      localStorage.removeItem('accessToken')
      return false
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

    } catch (error: any) {
      throw new Error(error.message || 'Erro ao solicitar reset de senha')
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

    } catch (error: any) {
      throw new Error(error.message || 'Erro ao redefinir senha')
    }
  }

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
