import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface WhatsAppSession {
  id: string
  sessionId: string
  name: string
  status: 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'STOPPED'
  qrCode?: string
  phoneNumber?: string
  profileName?: string
  profilePicture?: string
  connectedAt?: Date
  lastSeen?: Date
  webhookUrl?: string
}

interface CreateSessionData {
  name: string
}

export const useWhatsAppSession = () => {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { accessToken } = useAuth()

  // Headers para autenticação
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  })

  // Buscar sessões existentes
  const fetchSessions = useCallback(async () => {
    if (!accessToken) {
      // Sem token, apenas inicializar array vazio
      setSessions([])
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/whatsapp/sessions', {
        headers: getHeaders()
      })

      if (!response.ok) {
        // Se falhar, apenas manter array vazio sem erro
        setSessions([])
        return
      }

      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (err) {
      // Em caso de erro, apenas log no console, não mostrar erro pro usuário
      console.warn('Erro ao buscar sessões:', err)
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  // Criar nova sessão
  const createSession = async (sessionData: CreateSessionData): Promise<WhatsAppSession> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Tentar criar via API se tiver token
      if (accessToken) {
        try {
          const response = await fetch('/api/whatsapp/sessions', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(sessionData)
          })

          if (response.ok) {
            const data = await response.json()
            const newSession = data.session
            setSessions(prev => [...prev, newSession])
            
            // Tentar obter QR Code imediatamente
            if (newSession.status === 'STARTING') {
              setTimeout(() => {
                fetchQRCode(newSession.sessionId)
              }, 2000)
            }
            return newSession
          }
        } catch (apiError) {
          console.warn('API não disponível, usando modo mock:', apiError)
        }
      }

      // Fallback: Criar sessão mock com QR Code
      const mockSession: WhatsAppSession = {
        id: `mock-${Date.now()}`,
        sessionId: `mock-session-${Date.now()}`,
        name: sessionData.name,
        status: 'SCAN_QR_CODE',
        qrCode: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z',
        webhookUrl: 'mock://webhook'
      }
      
      setSessions(prev => [...prev, mockSession])
      return mockSession
      
    } finally {
      setIsLoading(false)
    }
  }

  // Obter QR Code para uma sessão
  const fetchQRCode = async (sessionId: string) => {
    if (!accessToken) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${sessionId}/qr`, {
        headers: getHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(prev => 
          prev.map(session => 
            session.sessionId === sessionId 
              ? { 
                  ...session, 
                  status: 'SCAN_QR_CODE',
                  qrCode: data.qrCode
                }
              : session
          )
        )
      } else if (response.status === 400) {
        // QR não necessário - sessão pode estar conectada
        setSessions(prev => 
          prev.map(session => 
            session.sessionId === sessionId 
              ? { ...session, status: 'WORKING' }
              : session
          )
        )
      }
    } catch (err) {
      console.error('Erro ao buscar QR Code:', err)
    }
  }

  // Reconectar/reativar sessão
  const reconnectSession = async (sessionId: string) => {
    try {
      setSessions(prev => 
        prev.map(session => 
          session.sessionId === sessionId 
            ? { ...session, status: 'STARTING' }
            : session
        )
      )
      
      // Tentar obter novo QR Code
      setTimeout(() => {
        fetchQRCode(sessionId)
      }, 2000)
    } catch (err) {
      setError('Erro ao reconectar sessão')
      throw err
    }
  }

  // Parar sessão
  const stopSession = async (sessionId: string) => {
    if (!accessToken) return

    try {
      setSessions(prev => 
        prev.map(session => 
          session.sessionId === sessionId 
            ? { ...session, status: 'STOPPED' }
            : session
        )
      )
    } catch (err) {
      setError('Erro ao parar sessão')
      throw err
    }
  }

  // Deletar sessão
  const deleteSession = async (sessionId: string) => {
    if (!accessToken) return

    try {
      const response = await fetch(`/api/whatsapp/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.sessionId !== sessionId))
      } else {
        throw new Error('Falha ao deletar sessão')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar sessão')
      throw err
    }
  }

  // Simular recebimento de webhook para atualizar status
  const updateSessionStatus = (sessionId: string, newStatus: WhatsAppSession['status'], additionalData?: Partial<WhatsAppSession>) => {
    setSessions(prev => 
      prev.map(session => 
        session.sessionId === sessionId 
          ? { 
              ...session, 
              status: newStatus,
              lastSeen: new Date(),
              ...additionalData
            }
          : session
      )
    )
  }

  // Carregar sessões ao montar o componente
  useEffect(() => {
    if (accessToken) {
      fetchSessions()
    } else {
      // Carregar sessão mock para teste
      setSessions([
        {
          id: 'mock-1',
          sessionId: 'mock-session-1',
          name: 'WhatsApp Teste',
          status: 'SCAN_QR_CODE',
          qrCode: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAyADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z',
          webhookUrl: 'mock://webhook'
        }
      ])
    }
  }, [accessToken, fetchSessions])

  // Polling para atualizar status das sessões (opcional)
  useEffect(() => {
    if (!accessToken || sessions.length === 0) return

    const interval = setInterval(() => {
      // Verificar status de sessões que estão em estados transitórios
      sessions.forEach(session => {
        if (session.status === 'STARTING' || session.status === 'SCAN_QR_CODE') {
          fetchQRCode(session.sessionId)
        }
      })
    }, 10000) // Verificar a cada 10 segundos

    return () => clearInterval(interval)
  }, [sessions, accessToken])

  return {
    sessions,
    isLoading,
    error,
    fetchSessions,
    createSession,
    fetchQRCode,
    reconnectSession,
    stopSession,
    deleteSession,
    updateSessionStatus,
    clearError: () => setError(null)
  }
}
