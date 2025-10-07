'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Activity, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChangeStatusSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
  clientData?: any
}

const statusOptions = [
  { value: 'active', label: 'Ativo', color: 'green', icon: '✅' },
  { value: 'pending', label: 'Pendente', color: 'yellow', icon: '⏳' },
  { value: 'inactive', label: 'Inativo', color: 'gray', icon: '⭕' },
  { value: 'blocked', label: 'Bloqueado', color: 'red', icon: '🚫' },
  { value: 'lead', label: 'Lead', color: 'blue', icon: '🎯' },
  { value: 'client', label: 'Cliente', color: 'purple', icon: '👤' },
  { value: 'vip', label: 'VIP', color: 'orange', icon: '⭐' },
]

export function ChangeStatusSidebar({ isOpen, onClose, chatId, clientData }: ChangeStatusSidebarProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(clientData?.status || 'active')
  const [loading, setLoading] = useState(false)

  const handleChangeStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/contacts/${clientData?.id || chatId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus })
      })

      if (response.ok) {
        alert('✅ Status atualizado com sucesso!')
        onClose()
      } else {
        alert('❌ Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('❌ Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
      yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      gray: 'border-gray-500 bg-gray-50 dark:bg-gray-900/20',
      red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
      blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    }
    return colors[color] || colors.gray
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Alterar Status
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecione o novo status do cliente
                  </p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {/* Cliente Info */}
              {clientData && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-300 mb-2">
                    👤 Cliente
                  </h4>
                  <p className="text-sm font-medium">{clientData.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status atual: <span className="font-medium">{clientData.status}</span>
                  </p>
                </div>
              )}

              {/* Status Options */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Selecione o Status
                </h4>
                {statusOptions.map((status) => (
                  <motion.button
                    key={status.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedStatus === status.value
                        ? `${getStatusColor(status.color)} border-${status.color}-500`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{status.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {status.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Status: {status.value}
                          </p>
                        </div>
                      </div>
                      {selectedStatus === status.value && (
                        <Check className="w-5 h-5 text-indigo-500" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangeStatus}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Alterar Status'}
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
