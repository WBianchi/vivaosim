'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  MessageCircle, 
  Kanban, 
  TrendingUp, 
  DollarSign, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Settings,
  ChevronRight,
  Home,
  HeadphonesIcon,
  UserPlus,
  BarChart3,
  CreditCard,
  MapPin,
  ClipboardList,
  Receipt,
  FileText as FileContract,
  Globe,
  Megaphone,
  Target,
  ShoppingCart,
  User,
  Send,
  Zap,
  Link2,
  GitBranch,
  Bot,
  Ticket,
  Hash,
  MessageSquare,
  Send as SendIcon,
  BookOpen,
  MessageCircleMore,
  Users2,
  Package
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeProvider'
import { cn } from '@/lib/utils'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  isActive?: boolean
  badge?: number
  isNew?: boolean
  onExpandChange?: (expanded: boolean) => void
  hasSubmenu?: boolean
  submenuItems?: SubMenuItemProps[]
  isExpanded?: boolean
  onToggleSubmenu?: () => void
}

interface SubMenuItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isNew?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  label, 
  href, 
  isActive, 
  isExpanded, 
  badge,
  isNew,
  hasSubmenu,
  onToggleSubmenu 
}) => {
  const { isDarkMode } = useTheme()
  
  const content = (
      <motion.div
        className={cn(
          'group relative flex items-center rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden',
          'hover:scale-[1.02] active:scale-[0.98]',
          isExpanded ? 'px-4 py-3 mx-3' : 'p-3 mx-2 justify-center',
          isActive
            ? isDarkMode
              ? 'bg-gradient-to-r from-orange-500/20 to-orange-400/10 text-orange-300 shadow-lg shadow-orange-500/10'
              : 'bg-gradient-to-r from-orange-500/10 to-orange-400/5 text-orange-600 shadow-lg shadow-orange-500/20'
            : isDarkMode
              ? 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
              : 'hover:bg-gray-100/80 text-gray-600 hover:text-gray-900'
        )}
        whileHover={{ 
          backgroundColor: isActive ? undefined : (isDarkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(249, 250, 251, 0.8)'),
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon container */}
        <motion.div 
          className="relative flex items-center justify-center"
          animate={{ 
            rotate: isActive ? [0, -5, 5, 0] : 0 
          }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: cn(
              'w-5 h-5 transition-all duration-300',
              isActive && 'drop-shadow-sm'
            )
          })}
          
          {/* Badge */}
          {badge && badge > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 min-w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
            >
              {badge > 99 ? '99+' : badge}
            </motion.div>
          )}
          
          {/* New indicator */}
          {isNew && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Label with smooth expand animation */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="whitespace-nowrap overflow-hidden"
            >
              <span className="font-medium text-sm">
                {label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className={cn(
              'absolute left-0 top-1/2 w-1 rounded-r-full',
              isExpanded ? 'h-8' : 'h-6',
              isDarkMode 
                ? 'bg-gradient-to-b from-orange-400 to-orange-500' 
                : 'bg-gradient-to-b from-orange-500 to-orange-600'
            )}
            layoutId="activeIndicator"
            initial={{ x: -4, y: '-50%' }}
            animate={{ x: 0, y: '-50%' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {/* Hover glow effect */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
            isDarkMode
              ? 'bg-gradient-to-r from-orange-400/5 to-transparent'
              : 'bg-gradient-to-r from-orange-500/5 to-transparent'
          )}
          whileHover={{ opacity: isActive ? 0 : 1 }}
        />
      </motion.div>
  )

  // Se tem submenu, não usa Link, apenas retorna o conteúdo clicável
  if (hasSubmenu) {
    return (
      <div onClick={onToggleSubmenu} className="cursor-pointer">
        {content}
      </div>
    )
  }

  // Se tem href, usa Link
  if (href) {
    return <Link href={href}>{content}</Link>
  }

  // Caso contrário, apenas retorna o conteúdo
  return content
}

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void
  isMobile?: boolean
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ onExpandChange, isMobile = false, className }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const pathname = usePathname()

  // Menu items baseado no role do usuário
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: <LayoutDashboard />,
        label: 'Visão Geral',
        href: '/dashboard',
        badge: 0,
        isNew: false
      }
    ]

    if (user?.role === 'ADMINISTRADOR' || user?.role === 'ASSINANTE') {
      return [
        ...baseItems,
        {
          icon: <MessageCircle />,
          label: 'Chat ao Vivo',
          href: '/chat',
          badge: 3,
          isNew: true
        },
        {
          icon: <Kanban />,
          label: 'Kanban',
          href: '/dashboard/kanban',
          badge: 7,
          isNew: false
        },
        {
          icon: <TrendingUp />,
          label: 'Vendas',
          href: '/dashboard/vendas',
          badge: 5,
          isNew: false
        },
        {
          icon: <DollarSign />,
          label: 'Financeiro',
          href: '/dashboard/financeiro',
          badge: 12,
          isNew: false
        },
        {
          icon: <HeadphonesIcon />,
          label: 'Atendentes',
          href: '/dashboard/atendentes',
          badge: 1,
          isNew: false
        },
        {
          icon: <Package />,
          label: 'Planos',
          href: '/dashboard/planos',
          badge: 3,
          isNew: true
        },
        {
          icon: <UserPlus />,
          label: 'Assinantes',
          href: '/dashboard/assinantes',
          badge: 8,
          isNew: false
        },
        {
          icon: <Users />,
          label: 'Clientes',
          href: '/dashboard/clientes',
          badge: 24,
          isNew: false
        },
        {
          icon: <UserCheck />,
          label: 'Afiliados',
          href: '/dashboard/afiliados',
          badge: 3,
          isNew: false
        },
        {
          icon: <Calendar />,
          label: 'Agendamentos',
          href: '/dashboard/agendamentos',
          badge: 2,
          isNew: false
        },
        {
          icon: <Receipt />,
          label: 'Orçamentos',
          href: '/dashboard/orcamentos',
          badge: 4,
          isNew: false
        },
        {
          icon: <FileContract />,
          label: 'Contratos',
          href: '/dashboard/contratos',
          badge: 1,
          isNew: false
        },
        {
          icon: <Globe />,
          label: 'Sites',
          href: '/dashboard/sites',
          badge: 4,
          isNew: true
        },
        {
          icon: <Megaphone />,
          label: 'Marketing',
          hasSubmenu: true,
          badge: 22,
          isNew: false,
          submenuItems: [
            {
              icon: <Target />,
              label: 'Funil de Vendas',
              href: '/dashboard/marketing/funil',
              isNew: false
            },
            {
              icon: <Send />,
              label: 'Campanhas',
              href: '/dashboard/marketing/campanhas',
              isNew: false
            },
            {
              icon: <Zap />,
              label: 'Automações',
              href: '/dashboard/marketing/automacoes',
              isNew: true
            },
            {
              icon: <SendIcon />,
              label: 'Disparos',
              href: '/dashboard/marketing/disparos',
              isNew: true
            },
            {
              icon: <Link2 />,
              label: 'Integrações',
              href: '/dashboard/marketing/integracoes',
              isNew: false
            }
          ]
        },
        {
          icon: <GitBranch />,
          label: 'Fluxograma',
          href: '/dashboard/fluxograma',
          badge: 1,
          isNew: true
        },
        {
          icon: <Users2 />,
          label: 'Agentes',
          href: '/dashboard/agentes',
          badge: 3,
          isNew: true
        },
        {
          icon: <MessageCircleMore />,
          label: 'Chat Interno',
          href: '/dashboard/chat-interno',
          badge: 5,
          isNew: true
        },
        {
          icon: <Hash />,
          label: 'Tags',
          href: '/dashboard/tags',
          badge: 12,
          isNew: false
        },
        {
          icon: <Ticket />,
          label: 'Tickets',
          href: '/dashboard/tickets',
          badge: 8,
          isNew: false
        },
        {
          icon: <BookOpen />,
          label: 'Blog',
          href: '/dashboard/blog',
          badge: 2,
          isNew: true
        },
        {
          icon: <BarChart3 />,
          label: 'Relatórios',
          href: '/dashboard/relatorios',
          badge: 5,
          isNew: true
        },
        {
          icon: <Settings />,
          label: 'Configurações',
          href: '/dashboard/configuracoes',
          badge: 2,
          isNew: false
        }
      ]
    }

    if (user?.role === 'ATENDENTE') {
      return [
        ...baseItems,
        {
          icon: <MessageCircle />,
          label: 'Chat ao Vivo',
          href: '/chat',
          badge: 2,
          isNew: false
        },
        {
          icon: <Kanban />,
          label: 'Kanban',
          href: '/dashboard/kanban',
          badge: 0,
          isNew: false
        },
        {
          icon: <FileText />,
          label: 'Contratos',
          href: '/dashboard/contratos',
          badge: 0,
          isNew: false
        },
        {
          icon: <CreditCard />,
          label: 'Orçamentos',
          href: '/dashboard/orcamentos',
          badge: 1,
          isNew: false
        },
        {
          icon: <Calendar />,
          label: 'Agendamentos',
          href: '/dashboard/agendamentos',
          badge: 0,
          isNew: false
        },
        {
          icon: <Users />,
          label: 'Clientes',
          href: '/dashboard/clientes',
          badge: 0,
          isNew: false
        },
        {
          icon: <BarChart3 />,
          label: 'Relatórios',
          href: '/dashboard/relatorios',
          badge: 0,
          isNew: false
        },
        {
          icon: <Settings />,
          label: 'Configurações',
          href: '/dashboard/configuracoes',
          badge: 0,
          isNew: false
        }
      ]
    }

    // Cliente
    return [
      {
        icon: <FileText />,
        label: 'Meu Contrato',
        href: '/dashboard/contrato',
        badge: null,
        isNew: false
      },
      {
        icon: <DollarSign />,
        label: 'Custos',
        href: '/dashboard/custos',
        badge: null,
        isNew: false
      },
      {
        icon: <Globe />,
        label: 'Meu Site',
        href: '/dashboard/site',
        badge: null,
        isNew: true
      },
      {
        icon: <ShoppingCart />,
        label: 'Lista de Presentes',
        href: '/dashboard/compras',
        badge: 12,
        isNew: false
      },
      {
        icon: <TrendingUp />,
        label: 'Recebimentos',
        href: '/dashboard/recebimentos',
        badge: 8,
        isNew: true
      },
      {
        icon: <Users />,
        label: 'Convidados',
        href: '/dashboard/convidados',
        badge: 150,
        isNew: false
      },
      {
        icon: <User />,
        label: 'Meu Perfil',
        href: '/dashboard/meu-perfil',
        badge: null,
        isNew: false
      }
    ]
  }

  const menuItems = getMenuItems()

  return (
    <motion.div
      className={cn(
        'relative h-screen flex flex-col transition-all duration-500 ease-in-out',
        'border-r border-gray-200/50 dark:border-slate-700/50',
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95' 
          : 'bg-gradient-to-b from-white/95 via-gray-50/95 to-white/95',
        'backdrop-blur-xl',
        isExpanded ? 'w-64' : 'w-20',
        className
      )}
      onMouseEnter={() => {
        if (!isMobile) {
          setIsExpanded(true)
          onExpandChange?.(true)
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsExpanded(false)
          onExpandChange?.(false)
        }
      }}
      animate={{ 
        width: isExpanded ? 256 : 80,
        boxShadow: isExpanded 
          ? isDarkMode 
            ? '20px 0 60px rgba(0, 0, 0, 0.3)'
            : '20px 0 60px rgba(0, 0, 0, 0.1)'
          : '5px 0 20px rgba(0, 0, 0, 0.05)'
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* Logo Area */}
      <div className="p-6">
        <Link href="/dashboard">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/30"
              whileHover={{ 
                rotate: [0, -5, 5, 0],
                scale: 1.05
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white font-bold text-lg">V</span>
            </motion.div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h1 className={cn(
                    'font-bold text-lg',
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    Viva o Sim
                  </h1>
                  <p className={cn(
                    'text-xs opacity-60',
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    CRM Eventos
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3
              }}
            >
              <MenuItem
                icon={item.icon}
                label={item.label}
                href={'href' in item ? item.href : undefined}
                hasSubmenu={'hasSubmenu' in item ? item.hasSubmenu : false}
                submenuItems={'submenuItems' in item ? item.submenuItems : undefined}
                onToggleSubmenu={() => {
                  if ('hasSubmenu' in item && item.hasSubmenu) {
                    // Toggle submenu logic here
                  }
                }}
                isActive={'href' in item && pathname === item.href}
                isExpanded={isExpanded}
                badge={item.badge}
                isNew={item.isNew}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>

      {/* User Info at Bottom */}
      <div className="p-4 border-t border-gray-200/50 dark:border-slate-700/50">
        <motion.div
          className={cn(
            'flex items-center gap-3 rounded-2xl p-3 cursor-pointer transition-all duration-300',
            isDarkMode 
              ? 'hover:bg-slate-700/30' 
              : 'hover:bg-gray-100/50'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-800"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          <AnimatePresence>
            {isExpanded && user && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 min-w-0"
              >
                <p className={cn(
                  'font-medium text-sm truncate',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {user.name}
                </p>
                <p className={cn(
                  'text-xs truncate opacity-60',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {user.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expand/Collapse indicator */}
      <motion.div
        className={cn(
          'absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer',
          'border shadow-lg transition-all duration-300',
          isDarkMode
            ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        )}
        animate={{ 
          rotate: isExpanded ? 180 : 0,
          scale: isExpanded ? 1.1 : 1
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-3 h-3" />
      </motion.div>
    </motion.div>
  )
}
