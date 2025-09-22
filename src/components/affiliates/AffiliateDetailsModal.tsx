'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Edit3, Mail, Phone, DollarSign, TrendingUp, Calendar, Copy, Award, Link, Percent, Clock, CreditCard, Building } from 'lucide-react'

interface AffiliateDetailsModalProps {
  affiliate: any
  onClose: () => void
  onEdit?: () => void
}

export const AffiliateDetailsModal: React.FC<AffiliateDetailsModalProps> = ({ affiliate, onClose, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'payments'>('overview')

  useEffect(() => { setIsVisible(true) }, [])
  const handleClose = () => { setIsVisible(false); setTimeout(onClose, 300) }
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
  const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{affiliate.name}</h2>
                  <span className="text-sm text-gray-600">{affiliate.email}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {onEdit && <motion.button whileHover={{ scale: 1.05 }} onClick={() => { onEdit(); handleClose() }} className="p-2 hover:bg-gray-100 rounded-xl"><Edit3 className="w-5 h-5" /></motion.button>}
                <motion.button whileHover={{ scale: 1.05 }} onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></motion.button>
              </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {['overview', 'performance', 'payments'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-3 ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}>
                  {tab === 'overview' ? 'Visão Geral' : tab === 'performance' ? 'Performance' : 'Pagamentos'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <DollarSign className="w-5 h-5 text-purple-600 mb-2" />
                      <p className="text-2xl font-bold">{formatCurrency(affiliate.totalCommissions)}</p>
                      <p className="text-sm text-gray-600">Comissões Totais</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
                      <p className="text-2xl font-bold">{affiliate.salesCount}</p>
                      <p className="text-sm text-gray-600">Vendas</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <Percent className="w-5 h-5 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold">{affiliate.conversionRate}%</p>
                      <p className="text-sm text-gray-600">Conversão</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <Award className="w-5 h-5 text-orange-600 mb-2" />
                      <p className="text-2xl font-bold">{affiliate.commissionRate}%</p>
                      <p className="text-sm text-gray-600">Taxa Comissão</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Informações de Contato</h3>
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <span>{affiliate.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span>{affiliate.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span>Desde {formatDate(affiliate.joinedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Link de Afiliado</h3>
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-blue-600" />
                            <span className="text-sm truncate">{affiliate.shareableLink}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigator.clipboard.writeText(affiliate.shareableLink)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Métricas de Performance</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total de Vendas</p>
                        <p className="text-2xl font-bold">{affiliate.salesCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Taxa de Conversão</p>
                        <p className="text-2xl font-bold">{affiliate.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Última Venda</p>
                        <p className="text-lg font-semibold">{formatDate(affiliate.lastSale)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Planos Comissionados</h3>
                    <div className="flex flex-wrap gap-2">
                      {affiliate.plans.map((plan: string) => (
                        <span key={plan} className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-sm capitalize">
                          {plan}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Resumo de Pagamentos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Pago</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(affiliate.totalCommissions)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Este Mês</p>
                        <p className="text-2xl font-bold">{formatCurrency(affiliate.monthlyCommissions)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">Dados Bancários</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-600" />
                        <span>Banco: {affiliate.bankInfo.bank}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span>Agência: {affiliate.bankInfo.agency} | Conta: {affiliate.bankInfo.account}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span>Método: {affiliate.paymentMethod === 'pix' ? 'PIX' : 'Transferência'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigator.clipboard.writeText(affiliate.id)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { if (onEdit) { onEdit(); handleClose() } }}
                  className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Afiliado
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
