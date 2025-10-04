/**
 * Função helper para buscar o token de autenticação
 * Tenta buscar do localStorage primeiro, depois dos cookies
 */
export function getAuthToken(): string | null {
  // Tentar localStorage primeiro (compatibilidade com código antigo)
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token')
    if (localToken) {
      return localToken
    }

    // Se não encontrou no localStorage, buscar dos cookies
    const cookies = document.cookie.split(';')
    
    // Buscar accessToken
    const accessTokenCookie = cookies.find(c => c.trim().startsWith('accessToken='))
    if (accessTokenCookie) {
      const token = accessTokenCookie.split('=')[1]
      return token
    }

    // Fallback: buscar token genérico
    const tokenCookie = cookies.find(c => c.trim().startsWith('token='))
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1]
      return token
    }
  }

  return null
}

/**
 * Função para obter headers de autenticação
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  
  if (!token) {
    return {}
  }

  return {
    'Authorization': `Bearer ${token}`
  }
}
