'use client'

import { usePathname } from 'next/navigation'
import ChatWidget from './ChatWidget'

export default function ConditionalChatWidget() {
  const pathname = usePathname()

  // Páginas onde o ChatWidget NÃO deve aparecer
  const excludedPages = [
    '/admin',
    '/dashboard', 
    '/chat',
    '/profile',
    '/settings',
    '/crm',
    '/events',
    '/leads'
  ]

  // Verificar se a página atual deve mostrar o ChatWidget
  const shouldShowWidget = !excludedPages.some(page => 
    pathname.startsWith(page)
  )

  // Só renderizar o ChatWidget em páginas públicas/marketing
  return shouldShowWidget ? <ChatWidget /> : null
}
