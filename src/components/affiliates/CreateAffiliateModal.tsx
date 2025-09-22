'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Save, User, Mail, Phone, DollarSign, Percent, Link, CreditCard, Building, Settings } from 'lucide-react'

interface CreateAffiliateModalProps {
  onClose: () => void
  onSave: (affiliateData: any) => void
  affiliate?: any
}

export const CreateAffiliateModal: React.FC<CreateAffiliateModalProps> = ({ onClose, onSave, affiliate }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commissionRate: 10,
    paymentMethod: 'pix',
    bankInfo: {
      bank: '',
      agency: '',
      account: ''
    },
    plans: [] as string[],
    status: 'pending'
  })

  useEffect(() => {
    setIsVisible(true)
    if (affiliate) {
      setFormData({
        name: affiliate.name || '',
        email: affiliate.email || '',
        phone: affiliate.phone || '',
        commissionRate: affiliate.commissionRate || 10,
        paymentMethod: affiliate.paymentMethod || 'pix',
        bankInfo: affiliate.bankInfo || { bank: '', agency: '', account: '' },
        plans: affiliate.plans || [],
        status: affiliate.status || 'pending'
      })
    }
  }, [affiliate])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const affiliateData = {
      id: affiliate?.id || `aff-${Date.now()}`,
      ...formData,
      performance: affiliate?.performance || 'average',
      joinedAt: affiliate?.joinedAt || new Date().toISOString(),
      lastSale: affiliate?.lastSale || new Date().toISOString(),
      totalCommissions: affiliate?.totalCommissions || 0,
      monthlyCommissions: affiliate?.monthlyCommissions || 0,
      salesCount: affiliate?.salesCount || 0,
      conversionRate: affiliate?.conversionRate || 0,
      shareableLink: `https://app.com/ref/${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
      paymentStatus: 'pending'
    }

    onSave(affiliateData)
    handleClose()
  }

  const togglePlan = (plan: string) => {
    setFormData(prev => ({
      ...prev,
      plans: prev.plans.includes(plan) 
        ? prev.plans.filter(p => p !== plan)
        : [...prev.plans, plan]
    }))
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {affiliate ? 'Editar Afiliado' : 'Novo Afiliado'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {affiliate ? 'Atualize as informações' : 'Adicione um novo parceiro'}
                  </p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">Pendente</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações de Comissão
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Taxa de Comissão (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, commissionRate: parseInt(e.target.value) || 10 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pagamento</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pix">PIX</option>
                      <option value="bank_transfer">Transferência Bancária</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Planos Comissionados</label>
                  <div className="flex flex-wrap gap-2">
                    {['basic', 'professional', 'premium', 'enterprise'].map(plan => (
                      <motion.button
                        key={plan}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => togglePlan(plan)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          formData.plans.includes(plan)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {plan === 'basic' ? 'Básico' : plan === 'professional' ? 'Profissional' : plan === 'premium' ? 'Premium' : 'Enterprise'}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Dados Bancários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banco</label>
                    <input
                      type="text"
                      value={formData.bankInfo.bank}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankInfo: { ...prev.bankInfo, bank: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="Banco do Brasil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agência</label>
                    <input
                      type="text"
                      value={formData.bankInfo.agency}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankInfo: { ...prev.bankInfo, agency: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="1234-5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conta</label>
                    <input
                      type="text"
                      value={formData.bankInfo.account}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankInfo: { ...prev.bankInfo, account: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="67890-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">ℹ️ Informações Importantes:</h4>
                <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                  <li>• O link de afiliado será gerado automaticamente</li>
                  <li>• Comissões são calculadas sobre vendas aprovadas</li>
                  <li>• Pagamentos são processados mensalmente</li>
                  <li>• O afiliado receberá acesso ao dashboard exclusivo</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {affiliate ? 'Atualizar' : 'Criar'} Afiliado
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
