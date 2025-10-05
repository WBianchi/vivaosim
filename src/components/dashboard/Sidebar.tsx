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
  newColor?: string
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
  color?: string
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  label, 
  href, 
  isActive, 
  isExpanded, 
  badge,
  isNew,
  newColor,
  hasSubmenu,
  onToggleSubmenu,
  submenuItems 
}) => {
  const { isDarkMode } = useTheme()
  const pathname = usePathname()
  
  // Verifica se algum submenu está ativo
  const hasActiveSubmenu = submenuItems?.some(sub => pathname === sub.href)
  
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
              className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                newColor ? `bg-gradient-to-r ${newColor}` : 'bg-gradient-to-r from-green-400 to-emerald-500'
              )}
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
              className="flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden"
            >
              <span className="font-medium text-sm">
                {label}
              </span>
              {hasSubmenu && (
                <ChevronRight className="w-4 h-4 transition-transform duration-200" />
              )}
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
          hasSubmenu: true,
          submenuItems: [
            {
              icon: <MessageCircle />,
              label: 'Conversas',
              href: '/chat',
              isNew: false,
              color: 'text-blue-500'
            },
            {
              icon: <Hash />,
              label: 'Tags',
              href: '/dashboard/tags',
              isNew: false,
              color: 'text-purple-500'
            },
            {
              icon: <Ticket />,
              label: 'Tickets',
              href: '/dashboard/tickets',
              isNew: false,
              color: 'text-yellow-500'
            },
            {
              icon: <Calendar />,
              label: 'Agendamentos',
              href: '/dashboard/agendamentos',
              isNew: false,
              color: 'text-green-500'
            },
            {
              icon: <Receipt />,
              label: 'Orçamentos',
              href: '/dashboard/orcamentos',
              isNew: false,
              color: 'text-orange-500'
            },
            {
              icon: <FileContract />,
              label: 'Contratos',
              href: '/dashboard/contratos',
              isNew: false,
              color: 'text-red-500'
            }
          ]
        },
        {
          icon: <Kanban />,
          label: 'Kanban',
          href: '/dashboard/kanban',
          hasSubmenu: true,
          submenuItems: [
            {
              icon: <Kanban />,
              label: 'Quadro',
              href: '/dashboard/kanban',
              isNew: false,
              color: 'text-indigo-500'
            },
            {
              icon: <Hash />,
              label: 'Tags',
              href: '/dashboard/tags',
              isNew: false,
              color: 'text-purple-500'
            },
            {
              icon: <Ticket />,
              label: 'Tickets',
              href: '/dashboard/tickets',
              isNew: false,
              color: 'text-yellow-500'
            },
            {
              icon: <Calendar />,
              label: 'Agendamentos',
              href: '/dashboard/agendamentos',
              isNew: false,
              color: 'text-green-500'
            },
            {
              icon: <Receipt />,
              label: 'Orçamentos',
              href: '/dashboard/orcamentos',
              isNew: false,
              color: 'text-orange-500'
            },
            {
              icon: <FileContract />,
              label: 'Contratos',
              href: '/dashboard/contratos',
              isNew: false,
              color: 'text-red-500'
            }
          ]
        },
        {
          icon: <DollarSign />,
          label: 'Financeiro',
          href: '/dashboard/financeiro',
          hasSubmenu: true,
          submenuItems: [
            {
              icon: <DollarSign />,
              label: 'Visão Geral',
              href: '/dashboard/financeiro',
              isNew: false,
              color: 'text-green-500'
            },
            {
              icon: <TrendingUp />,
              label: 'Vendas',
              href: '/dashboard/vendas',
              isNew: false,
              color: 'text-blue-500'
            },
            {
              icon: <Package />,
              label: 'Planos',
              href: '/dashboard/planos',
              isNew: true,
              color: 'text-purple-500'
            }
          ]
        },
        {
          icon: <Users2 />,
          label: 'Usuários',
          hasSubmenu: true,
          submenuItems: [
            {
              icon: <UserPlus />,
              label: 'Assinantes',
              href: '/dashboard/assinantes',
              isNew: false,
              color: 'text-blue-500'
            },
            {
              icon: <UserCheck />,
              label: 'Afiliados',
              href: '/dashboard/afiliados',
              isNew: false,
              color: 'text-green-500'
            },
            {
              icon: <HeadphonesIcon />,
              label: 'Atendentes',
              href: '/dashboard/atendentes',
              isNew: false,
              color: 'text-purple-500'
            },
            {
              icon: <Users />,
              label: 'Clientes',
              href: '/dashboard/clientes',
              isNew: false,
              color: 'text-orange-500'
            }
          ]
        },
        {
          icon: <Globe />,
          label: 'Sites',
          hasSubmenu: true,
          isNew: true,
          newColor: 'from-blue-400 to-blue-500',
          submenuItems: [
            {
              icon: <UserCheck />,
              label: 'Sites Assinantes',
              href: '/dashboard/sites/assinantes',
              isNew: false,
              color: 'text-blue-500'
            },
            {
              icon: <Users />,
              label: 'Sites Clientes',
              href: '/dashboard/sites/clientes',
              isNew: false,
              color: 'text-purple-500'
            }
          ]
        },
        {
          icon: <Megaphone />,
          label: 'Marketing',
          hasSubmenu: true,
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
          isNew: true,
          newColor: 'from-purple-400 to-purple-500'
        },
        {
          icon: <Users2 />,
          label: 'Agentes',
          href: '/dashboard/agentes',
          isNew: true,
          newColor: 'from-pink-400 to-pink-500'
        },
        {
          icon: <MessageCircleMore />,
          label: 'Chat Interno',
          href: '/dashboard/chat-interno',
          isNew: true,
          newColor: 'from-cyan-400 to-cyan-500'
        },
        {
          icon: <BookOpen />,
          label: 'Blog',
          href: '/dashboard/blog',
          isNew: true,
          newColor: 'from-yellow-400 to-yellow-500'
        },
        {
          icon: <BarChart3 />,
          label: 'Relatórios',
          href: '/dashboard/relatorios',
          isNew: true,
          newColor: 'from-red-400 to-red-500'
        },
        {
          icon: <Settings />,
          label: 'Configurações',
          href: '/dashboard/configuracoes',
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
          isNew: false
        },
        {
          icon: <Kanban />,
          label: 'Kanban',
          href: '/dashboard/kanban',
          isNew: false
        },
        {
          icon: <FileText />,
          label: 'Contratos',
          href: '/dashboard/contratos',
          isNew: false
        },
        {
          icon: <CreditCard />,
          label: 'Orçamentos',
          href: '/dashboard/orcamentos',
          isNew: false
        },
        {
          icon: <Calendar />,
          label: 'Agendamentos',
          href: '/dashboard/agendamentos',
          isNew: false
        },
        {
          icon: <BarChart3 />,
          label: 'Relatórios',
          href: '/dashboard/relatorios',
          isNew: false
        },
        {
          icon: <Settings />,
          label: 'Configurações',
          href: '/dashboard/configuracoes',
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
        isNew: false
      },
      {
        icon: <DollarSign />,
        label: 'Custos e Despesas',
        href: '/dashboard/custos',
        isNew: false
      },
      {
        icon: <Globe />,
        label: 'Meu Site',
        href: '/dashboard/site',
        isNew: true,
        newColor: 'from-blue-400 to-blue-500'
      },
      {
        icon: <ShoppingCart />,
        label: 'Lista de Presentes',
        href: '/dashboard/compras',
        isNew: false
      },
      {
        icon: <TrendingUp />,
        label: 'Recebimentos',
        href: '/dashboard/recebimentos',
        isNew: true,
        newColor: 'from-green-400 to-green-500'
      },
      {
        icon: <Users />,
        label: 'Convidados',
        href: '/dashboard/convidados',
        isNew: false
      },
      {
        icon: <User />,
        label: 'Meu Perfil',
        href: '/dashboard/meu-perfil',
        isNew: false
      }
    ]
  }

  const menuItems = getMenuItems()

  return (
    <motion.div
      className={cn(
        'relative h-screen flex flex-col overflow-hidden',
        'border-r border-gray-200/50 dark:border-slate-700/50',
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95' 
          : 'bg-gradient-to-b from-white/95 via-gray-50/95 to-white/95',
        'backdrop-blur-xl',
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
          setExpandedMenus([]) // Fecha submenus ao colapsar
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
        duration: 0.3, 
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
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
              <>
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  href={'href' in item ? item.href : undefined}
                  hasSubmenu={'hasSubmenu' in item ? item.hasSubmenu : false}
                  submenuItems={'submenuItems' in item && Array.isArray(item.submenuItems) ? item.submenuItems : undefined}
                  onToggleSubmenu={() => {
                    if ('hasSubmenu' in item && item.hasSubmenu) {
                      setExpandedMenus(prev => 
                        prev.includes(item.label)
                          ? prev.filter(label => label !== item.label)
                          : [...prev, item.label]
                      )
                    }
                  }}
                  isActive={'href' in item && pathname === item.href}
                  isExpanded={isExpanded}
                  badge={'badge' in item ? item.badge as number : undefined}
                  isNew={item.isNew}
                />
                
                {/* Submenu Items */}
                {'hasSubmenu' in item && item.hasSubmenu && expandedMenus.includes(item.label) && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {item.submenuItems?.map((subItem: SubMenuItemProps) => (
                      <Link key={subItem.href} href={subItem.href}>
                        <motion.div
                          className={cn(
                            'flex items-center gap-3 px-4 py-2 mx-2 rounded-xl transition-all duration-200',
                            pathname === subItem.href
                              ? isDarkMode
                                ? 'bg-orange-500/10 text-orange-400'
                                : 'bg-orange-50 text-orange-600'
                              : isDarkMode
                                ? 'hover:bg-slate-700/30 text-slate-400 hover:text-slate-200'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          )}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {React.cloneElement(subItem.icon as React.ReactElement, {
                            className: cn('w-4 h-4', subItem.color || '')
                          })}
                          <span className="text-sm font-medium">{subItem.label}</span>
                          {subItem.isNew && (
                            <span className={cn(
                              "ml-auto px-2 py-0.5 text-xs text-white rounded-full",
                              subItem.color?.replace('text-', 'bg-') || 'bg-green-500'
                            )}>
                              Novo
                            </span>
                          )}
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </>
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
