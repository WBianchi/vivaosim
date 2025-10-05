'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, FileSignature, Plus, Search, Filter } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllContractsSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllContractsSidebar({ isOpen, onClose, chatId }: AllContractsSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [contracts, setContracts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchContracts()
    }
  }, [isOpen, chatId])

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        console.log('⚠️ AllContractsSidebar: Token não encontrado')
        setLoading(false)
        return
      }

      const url = chatId 
        ? `/api/contracts?chatId=${chatId}`
        : '/api/contracts'

      console.log(`🔍 AllContractsSidebar: Buscando contratos... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      console.log('📋 AllContractsSidebar: Resposta da API:', data)
      
      if (data.contracts) {
        setContracts(data.contracts)
        console.log(`✅ AllContractsSidebar: ${data.contracts.length} contratos carregados`)
      }
    } catch (error) {
      console.error('❌ AllContractsSidebar: Erro ao buscar contratos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter(contract => 
    contract.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'draft': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'completed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    return colors[status] || colors.draft
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'draft': 'Rascunho',
      'pending': 'Pendente',
      'active': 'Ativo',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    }
    return labels[status] || status
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="contracts-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Contratos deste Chat' : 'Todos os Contratos'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="contracts-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {chatId ? 'Contratos desta conversa' : `${contracts.length} contratos encontrados`}
                  </p>
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Busca */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar contratos..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Lista de Contratos */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileSignature className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? 'Nenhum contrato encontrado' : 'Nenhum contrato ainda'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContracts.map((contract) => (
                  <motion.div
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {contract.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {getStatusLabel(contract.status)}
                      </span>
                    </div>
                    
                    {contract.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                        {contract.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        R$ {parseFloat(contract.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
