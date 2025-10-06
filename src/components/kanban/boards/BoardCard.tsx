'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarClock,
  FileSignature,
  Ticket,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Board {
  id: string
  name: string
  description: string
  color: string
  clientCount: number
  lastUpdated: string
  createdBy?: {
    name: string
    email: string
  } | string
  columnsCount?: number
  quotesCount?: number
  appointmentsCount?: number
  ticketsCount?: number
  contractsCount?: number
}

interface BoardCardProps {
  board: Board
  index: number
  onClick: () => void
  onDelete?: (boardId: string) => void
  onUpdateName?: (boardId: string, newName: string) => void
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, index, onClick, onDelete, onUpdateName }) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(board.name)

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingName(true)
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (editedName.trim() && editedName !== board.name) {
      onUpdateName?.(board.id, editedName.trim())
    } else {
      setEditedName(board.name)
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur()
    } else if (e.key === 'Escape') {
      setEditedName(board.name)
      setIsEditingName(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('pt-BR')
  } catch {
    return ''
  }
}

  const stats = [
    {
      id: 'columns',
      label: 'Colunas',
      value: board.columnsCount || 0,
      icon: LayoutDashboard,
      tone: 'text-sky-600',
      chip: 'bg-sky-500/10',
      badgeBg: 'bg-sky-500/15',
      badgeText: 'text-sky-600'
    },
    {
      id: 'clients',
      label: 'Clientes',
      value: board.clientCount || 0,
      icon: Users,
      tone: 'text-emerald-600',
      chip: 'bg-emerald-500/10',
      badgeBg: 'bg-emerald-500/15',
      badgeText: 'text-emerald-600'
    },
    {
      id: 'quotes',
      label: 'Orçamentos',
      value: board.quotesCount || 0,
      icon: FileText,
      tone: 'text-purple-600',
      chip: 'bg-purple-500/10',
      badgeBg: 'bg-purple-500/15',
      badgeText: 'text-purple-600'
    },
    {
      id: 'appointments',
      label: 'Agendamentos',
      value: board.appointmentsCount || 0,
      icon: CalendarClock,
      tone: 'text-blue-600',
      chip: 'bg-blue-500/10',
      badgeBg: 'bg-blue-500/15',
      badgeText: 'text-blue-600'
    },
    {
      id: 'contracts',
      label: 'Contratos',
      value: board.contractsCount || 0,
      icon: FileSignature,
      tone: 'text-amber-600',
      chip: 'bg-amber-500/10',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-600'
    },
    {
      id: 'tickets',
      label: 'Tickets',
      value: board.ticketsCount || 0,
      icon: Ticket,
      tone: 'text-rose-600',
      chip: 'bg-rose-500/10',
      badgeBg: 'bg-rose-500/15',
      badgeText: 'text-rose-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group relative h-full cursor-pointer overflow-hidden rounded-3xl border border-transparent bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-900"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/10 via-transparent to-amber-400/10 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />
      
      <div className="relative flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                autoFocus
                className="w-full border-b-2 border-orange-500 bg-transparent pb-1 text-lg font-semibold text-gray-900 outline-none transition dark:text-white"
              />
            ) : (
              <h3 
                onDoubleClick={handleDoubleClick}
                onClick={(e) => e.stopPropagation()}
                className="mb-2 line-clamp-2 cursor-text text-xl font-semibold text-gray-900 transition-colors hover:text-orange-600 dark:text-white"
                title="Duplo clique para editar"
              >
                {board.name}
              </h3>
            )}
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {board.description || 'Organize seus processos do primeiro contato ao fechamento.'}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              if (confirm(`Deseja excluir o quadro "${board.name}"?`)) {
                onDelete?.(board.id)
              }
            }}
            className="rounded-xl p-2 text-red-400 transition-all hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/20"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-inner dark:border-gray-800 dark:bg-gray-900/80">
          <div className="grid gap-3 md:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.id}
                  className="flex items-center justify-between rounded-2xl bg-white/90 px-3 py-2 shadow-sm transition-colors dark:bg-gray-900/90"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl',
                        stat.chip
                      )}
                    >
                      <Icon className={cn('h-4.5 w-4.5', stat.tone)} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
                      stat.badgeBg,
                      stat.badgeText
                    )}
                  >
                    {stat.value}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{formatDate(board.lastUpdated) ? `Atualizado ${formatDate(board.lastUpdated)}` : 'Novo quadro'}</span>
          </div>

          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600 transition-colors group-hover:bg-orange-500/20 group-hover:text-orange-700"
          >
            Abrir
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
