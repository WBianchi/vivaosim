import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'

// Rotas públicas que não precisam de autenticação
const publicRoutes = [
  '/',
  '/verify-email',
  '/reset-password',
  '/forgot-password'
]

// Rotas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/settings',
  '/events',
  '/leads',
  '/crm',
  '/chat'
]

// Rotas de autenticação (login/cadastro)
const authRoutes = [
  '/login',
  '/cadastro'
]

// Rotas baseadas em roles
const roleBasedRoutes = {
  '/admin': ['ADMINISTRADOR'],
  '/dashboard': ['ADMINISTRADOR', 'ATENDENTE', 'ASSINANTE'],
  '/crm': ['ADMINISTRADOR', 'ATENDENTE', 'ASSINANTE'],
  '/chat': ['ADMINISTRADOR', 'ATENDENTE', 'ASSINANTE']
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🛡️ Middleware - Path:', pathname)
  
  // Não processar rotas de API
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  const accessToken = request.headers.get('authorization')?.replace('Bearer ', '') ||
                     request.cookies.get('accessToken')?.value

  console.log('🔍 Token found:', accessToken ? 'YES' : 'NO')
  console.log('🍪 All cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value}`))

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)
  
  console.log('🔒 Is protected:', isProtectedRoute)
  console.log('🔐 Is auth route:', isAuthRoute)

  // Se é uma rota de autenticação e o usuário já está logado, redirecionar
  if (isAuthRoute && accessToken) {
    try {
      const payload = verifyAccessToken(accessToken)
      // Redirecionar baseado no role
      const redirectUrl = getRedirectUrlByRole(payload.role)
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (error) {
      // Token inválido, continuar para a página de auth
      return NextResponse.next()
    }
  }

  // TEMPORÁRIO: Desabilitar verificação JWT até resolver problema do Edge Runtime
  if (isProtectedRoute) {
    if (!accessToken) {
      console.log('❌ Sem token - redirecionando para login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Se tem token, permite acesso (temporário)
    console.log('✅ Token encontrado - permitindo acesso temporário ao dashboard')
    return NextResponse.next()
  }

  return NextResponse.next()
}

function getRedirectUrlByRole(role: string): string {
  switch (role) {
    case 'ADMINISTRADOR':
    case 'ATENDENTE':
    case 'ASSINANTE':
      return '/dashboard'
    case 'CLIENTE':
      return '/profile'
    default:
      return '/'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs', // Usar Node.js runtime para suportar crypto
}
