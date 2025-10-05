import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import { CustomizationProvider } from '@/contexts/CustomizationProvider'
import CookieConsent from '@/components/shared/CookieConsent'
import ChatWidget from '@/components/shared/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Viva o Sim - CRM Completo para Eventos',
  description: 'Plataforma completa de CRM e gestão para profissionais de eventos. Automatize vendas, organize clientes e multiplique seus resultados.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <CustomizationProvider>
            <AuthProvider>
              {children}
              <CookieConsent />
              <ChatWidget />
            </AuthProvider>
          </CustomizationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
