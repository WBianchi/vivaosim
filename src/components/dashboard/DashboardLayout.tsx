'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isDarkMode } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Se estiver na página do fluxograma, renderiza apenas o children sem o layout
  if (pathname === '/dashboard/fluxograma') {
    return <>{children}</>
  }

  // Verificar se é página de chat interno
  const isChatInterno = pathname === '/dashboard/chat-interno'

  return (
    <div className={cn(
      'min-h-screen flex transition-colors duration-300',
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    )}>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className={cn(
          'absolute inset-0',
          isDarkMode
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.05),transparent_50%)]'
        )} />
        <motion.div
          className={cn(
            'absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl',
            isDarkMode
              ? 'bg-orange-500/10'
              : 'bg-orange-300/20'
          )}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className={cn(
            'absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl',
            isDarkMode
              ? 'bg-blue-500/10'
              : 'bg-blue-300/20'
          )}
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && sidebarExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarExpanded(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={cn(
          'relative z-50',
          isMobile ? 'fixed left-0 top-0 h-full' : 'sticky top-0 self-start h-screen overflow-y-auto'
        )}
        animate={{
          x: isMobile ? (sidebarExpanded ? 0 : -320) : 0
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] 
        }}
      >
        <Sidebar 
          onExpandChange={setSidebarExpanded}
          isMobile={isMobile}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar */}
        <TopBar 
          onMenuClick={() => setSidebarExpanded(!sidebarExpanded)}
          showMenuButton={isMobile}
          disableWhatsApp={isChatInterno}
        />
        
        {/* Page Content */}
        <main className="flex-1 relative">
          {/* Page Transition Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="h-full"
            >
              {/* Content Wrapper */}
              <div className={cn(
                'h-full w-full',
                'relative z-10'
              )}>
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Floating Action Button - Para mobile */}
          {isMobile && (
            <motion.button
              className={cn(
                'fixed bottom-6 right-6 w-14 h-14 rounded-2xl shadow-2xl z-40',
                'flex items-center justify-center',
                'bg-gradient-to-r from-orange-500 to-orange-600',
                'text-white border-4 border-white/20',
                'backdrop-blur-xl'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 10px 40px rgba(249, 115, 22, 0.3)',
                  '0 20px 60px rgba(249, 115, 22, 0.4)',
                  '0 10px 40px rgba(249, 115, 22, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onClick={() => setSidebarExpanded(true)}
            >
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <path d="M3 12h18m-9-9l9 9-9 9" />
              </motion.svg>
            </motion.button>
          )}
        </main>
      </div>

    </div>
  )
}
