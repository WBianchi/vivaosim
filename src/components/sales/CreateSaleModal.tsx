'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Save, User, Package, CreditCard } from 'lucide-react'

interface CreateSaleModalProps {
  onClose: () => void
  onSave: (saleData: any) => void
  sale?: any
}

export const CreateSaleModal: React.FC<CreateSaleModalProps> = ({
  onClose,
  onSave,
  sale
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  
  const [formData, setFormData] = useState({
    subscriberId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerDocument: '',
    customerCompany: '',
    planId: '',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    status: 'active',
    discount: 0,
    notes: ''
  })

  useEffect(() => {
    setIsVisible(true)
    fetchData()
    
    if (sale) {
      setFormData({
        subscriberId: sale.customer?.id || '',
        customerName: sale.customer?.name || '',
        customerEmail: sale.customer?.email || '',
        customerPhone: '',
        customerDocument: '',
        customerCompany: sale.customer?.company || '',
        planId: sale.plan?.id || '',
        paymentMethod: sale.paymentMethod || 'credit_card',
        paymentStatus: sale.paymentStatus || 'paid',
        status: sale.status || 'active',
        discount: sale.discount || 0,
        notes: sale.notes || ''
      })
    }
  }, [sale])

  const fetchData = async () => {
    try {
      // Buscar assinantes
      const subsResponse = await fetch('/api/subscribers')
      const subsData = await subsResponse.json()
      
      if (subsData.success) {
        setSubscribers(subsData.data)
      }

      // Buscar planos
      const plansResponse = await fetch('/api/plans')
      const plansData = await plansResponse.json()
      
      if (plansData.plans) {
        setPlans(plansData.plans.filter((p: any) => p.status === 'ACTIVE'))
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscriberChange = (subscriberId: string) => {
    const subscriber = subscribers.find(s => s.id === subscriberId)
    
    if (subscriberId === 'new') {
      setIsNewCustomer(true)
      setSelectedSubscriber(null)
      setFormData(prev => ({
        ...prev,
        subscriberId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerDocument: '',
        customerCompany: ''
      }))
    } else if (subscriber) {
      setIsNewCustomer(false)
      setSelectedSubscriber(subscriber)
      setFormData(prev => ({
        ...prev,
        subscriberId: subscriber.id,
        customerName: subscriber.name,
        customerEmail: subscriber.email,
        customerPhone: subscriber.phone || '',
        customerDocument: subscriber.cpf || subscriber.cnpj || '',
        customerCompany: subscriber.company || ''
      }))
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isNewCustomer) {
        // Criar novo assinante com assinatura
        const response = await fetch('/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            password: 'Temp123!@#', // Senha temporária
            subdomain: formData.customerName.toLowerCase().replace(/\s+/g, ''),
            document: formData.customerDocument,
            company: formData.customerCompany,
            planId: formData.planId,
            avatar: null
          })
        })

        const data = await response.json()

        if (data.success) {
          console.log('✅ Novo assinante criado com assinatura!')
          setTimeout(() => window.location.reload(), 1000)
        } else {
          alert('❌ Erro: ' + data.error)
        }
      } else {
        // Criar assinatura para assinante existente
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: formData.subscriberId,
            planId: formData.planId,
            paymentMethod: formData.paymentMethod,
            discount: formData.discount,
            notes: formData.notes
          })
        })

        const data = await response.json()

        if (data.success) {
          console.log('✅ Assinatura criada!')
          setTimeout(() => window.location.reload(), 1000)
        } else {
          alert('❌ Erro: ' + data.error)
        }
      }
      
      handleClose()
    } catch (error) {
      console.error('❌ Erro ao criar venda:', error)
      alert('❌ Erro ao criar venda')
    }
  }

  const oldHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const plans = {
      'plan-001': { id: 'plan-001', name: 'Plano Básico', price: 49.90, period: 'monthly' },
      'plan-002': { id: 'plan-002', name: 'Plano Profissional', price: 99.90, period: 'monthly' },
      'plan-003': { id: 'plan-003', name: 'Plano Premium', price: 199.90, period: 'monthly' }
    }

    const selectedPlan = plans[formData.planId as keyof typeof plans]
    const originalAmount = selectedPlan.price
    const discountAmount = (originalAmount * formData.discount) / 100
    const finalAmount = originalAmount - discountAmount
    
    const saleData = {
      id: sale?.id || `sale-${Date.now()}`,
      saleNumber: sale?.saleNumber || `VND-2024-${String(Date.now()).slice(-3)}`,
      customer: {
        id: `sub-${Date.now()}`,
        name: formData.customerName,
        email: formData.customerEmail,
        company: formData.customerCompany || null
      },
      plan: selectedPlan,
      amount: originalAmount,
      discount: formData.discount,
      finalAmount: finalAmount,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      createdAt: sale?.createdAt || new Date().toISOString(),
      paidAt: formData.paymentStatus === 'paid' ? new Date().toISOString() : null,
      activationDate: formData.status === 'completed' ? new Date().toISOString() : null,
      expirationDate: formData.status === 'completed' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      notes: formData.notes,
      commission: formData.status === 'completed' ? finalAmount * 0.1 : 0,
      seller: formData.seller
    }

    onSave(saleData)
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {sale ? 'Editar Venda' : 'Nova Venda'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sale ? 'Atualize as informações' : 'Registre uma nova venda'}
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
              {/* Cliente */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Cliente
                </h3>
                
                {/* Select de Assinante */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecionar Cliente *
                  </label>
                  <select
                    required
                    value={formData.subscriberId || 'new'}
                    onChange={(e) => handleSubscriberChange(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">
                      {loading ? 'Carregando...' : 'Selecione um cliente'}
                    </option>
                    <option value="new" className="font-bold">
                      ➕ Criar Novo Cliente
                    </option>
                    <optgroup label="Clientes Existentes">
                      {subscribers.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} - {sub.email}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Campos do Cliente */}
                {isNewCustomer && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF/CNPJ *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerDocument}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerDocument: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Empresa (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.customerCompany}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerCompany: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                )}

                {/* Mostrar dados do cliente selecionado */}
                {selectedSubscriber && !isNewCustomer && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedSubscriber.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedSubscriber.email}</span>
                      </div>
                      {selectedSubscriber.phone && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedSubscriber.phone}</span>
                        </div>
                      )}
                      {selectedSubscriber.company && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Empresa:</span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedSubscriber.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Plano */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Plano e Preço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plano *
                    </label>
                    <select
                      required
                      value={formData.planId}
                      onChange={(e) => setFormData(prev => ({ ...prev, planId: e.target.value }))}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                    >
                      <option value="">
                        {loading ? 'Carregando planos...' : 'Selecione um plano'}
                      </option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / {
                            plan.period === 'MONTHLY' ? 'mês' :
                            plan.period === 'QUARTERLY' ? 'trimestre' :
                            plan.period === 'SEMIANNUAL' ? 'semestre' :
                            plan.period === 'ANNUAL' ? 'ano' : 'vitalício'
                          }
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Desconto (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pagamento e Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Método de Pagamento
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="credit_card">Cartão de Crédito</option>
                      <option value="pix">PIX</option>
                      <option value="bank_transfer">Transferência</option>
                      <option value="boleto">Boleto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status do Pagamento
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="paid">Pago</option>
                      <option value="pending">Pendente</option>
                      <option value="failed">Falhou</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status da Venda
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="completed">Concluída</option>
                      <option value="pending">Pendente</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Observações sobre a venda..."
                />
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
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {sale ? 'Atualizar' : 'Criar'} Venda
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
