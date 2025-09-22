'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Headphones, Save, User, Mail, Phone, Clock, Settings } from 'lucide-react'

interface CreateAttendantModalProps {
  onClose: () => void
  onSave: (attendantData: any) => void
  attendant?: any
}

export const CreateAttendantModal: React.FC<CreateAttendantModalProps> = ({
  onClose,
  onSave,
  attendant
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Atendente',
    department: 'support',
    status: 'active',
    maxChats: 8,
    workingHours: '08:00 - 18:00',
    avatar: ''
  })

  useEffect(() => {
    setIsVisible(true)
    if (attendant) {
      setFormData({
        name: attendant.name || '',
        email: attendant.email || '',
        phone: attendant.phone || '',
        role: attendant.role || 'Atendente',
        department: attendant.department || 'support',
        status: attendant.status || 'active',
        maxChats: attendant.maxChats || 8,
        workingHours: attendant.workingHours || '08:00 - 18:00',
        avatar: attendant.avatar || ''
      })
    }
  }, [attendant])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const attendantData = {
      id: attendant?.id || `att-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: formData.avatar || null,
      status: formData.status,
      onlineStatus: 'offline',
      department: formData.department,
      role: formData.role,
      rating: attendant?.rating || 4.0,
      totalRatings: attendant?.totalRatings || 0,
      activeChats: attendant?.activeChats || 0,
      maxChats: formData.maxChats,
      responseTime: attendant?.responseTime || 2.0,
      resolutionTime: attendant?.resolutionTime || 20.0,
      ticketsResolved: attendant?.ticketsResolved || 0,
      ticketsTotal: attendant?.ticketsTotal || 0,
      workingHours: formData.workingHours,
      lastActivity: new Date().toISOString(),
      joinedAt: attendant?.joinedAt || new Date().toISOString(),
      currentClients: attendant?.currentClients || [],
      performance: attendant?.performance || {
        satisfaction: 4.0,
        firstResponseTime: 60,
        resolutionRate: 85,
        escalationRate: 15
      }
    }

    onSave(attendantData)
    handleClose()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {attendant ? 'Editar Atendente' : 'Novo Atendente'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {attendant ? 'Atualize as informações' : 'Adicione um novo membro à equipe'}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome do atendente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Atendente Senior"
                    />
                  </div>
                </div>
              </div>

              {/* Configurações de Trabalho */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações de Trabalho
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Departamento *
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="support">Suporte Técnico</option>
                      <option value="sales">Vendas</option>
                      <option value="billing">Financeiro</option>
                      <option value="general">Atendimento Geral</option>
                      <option value="vip">Atendimento VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="training">Em Treinamento</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Máximo de Chats Simultâneos
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxChats}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxChats: parseInt(e.target.value) || 8 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horário de Trabalho
                    </label>
                    <input
                      type="text"
                      value={formData.workingHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="08:00 - 18:00"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Foto de Perfil (Opcional)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Deixe em branco para usar o avatar padrão
                  </p>
                </div>
              </div>

              {/* Informações sobre Departamentos */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  ℹ️ Informações sobre Departamentos:
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li><strong>Suporte Técnico:</strong> Resolução de problemas técnicos e bugs</li>
                  <li><strong>Vendas:</strong> Consultoria comercial e fechamento de negócios</li>
                  <li><strong>Financeiro:</strong> Questões de cobrança, pagamento e faturamento</li>
                  <li><strong>Atendimento Geral:</strong> Dúvidas gerais e informações básicas</li>
                  <li><strong>Atendimento VIP:</strong> Clientes premium com prioridade especial</li>
                </ul>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {attendant ? 'Atualizar' : 'Criar'} Atendente
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
