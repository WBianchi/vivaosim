'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, DollarSign, Calendar, Package, Users, FileText } from 'lucide-react'

interface CreateExpenseModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CreateExpenseModal({ onClose, onSuccess }: CreateExpenseModalProps) {
  const [loading, setLoading] = useState(false)
  const [contracts, setContracts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OUTROS',
    status: 'PENDENTE',
    amount: '',
    dueDate: '',
    paymentMethod: '',
    supplierId: '',
    contractId: '',
    siteId: '',
    installments: 1,
    notes: ''
  })

  // Buscar contratos e fornecedores ao abrir
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Buscar contratos
      const contractsRes = await fetch('/api/contracts')
      const contractsData = await contractsRes.json()
      setContracts(contractsData.contracts || [])

      // Buscar fornecedores
      const suppliersRes = await fetch('/api/suppliers')
      const suppliersData = await suppliersRes.json()
      setSuppliers(suppliersData.suppliers || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    }
  }

  const categories = [
    { value: 'SOM', label: 'Som e DJ' },
    { value: 'ILUMINACAO', label: 'Iluminação' },
    { value: 'FOTOGRAFIA', label: 'Fotografia' },
    { value: 'FILMAGEM', label: 'Filmagem' },
    { value: 'DECORACAO', label: 'Decoração' },
    { value: 'BUFFET', label: 'Buffet' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'TRANSPORTE', label: 'Transporte' },
    { value: 'SEGURANCA', label: 'Segurança' },
    { value: 'LIMPEZA', label: 'Limpeza' },
    { value: 'EQUIPAMENTOS', label: 'Equipamentos' },
    { value: 'PESSOAL', label: 'Pessoal' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'ADMINISTRATIVO', label: 'Administrativo' },
    { value: 'OUTROS', label: 'Outros' }
  ]

  const paymentMethods = [
    { value: 'DINHEIRO', label: 'Dinheiro' },
    { value: 'PIX', label: 'PIX' },
    { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { value: 'TRANSFERENCIA', label: 'Transferência' },
    { value: 'BOLETO', label: 'Boleto' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'OUTROS', label: 'Outros' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar siteId
    if (!formData.siteId && !formData.contractId) {
      alert('❌ Selecione um contrato ou informe o Site ID')
      return
    }

    setLoading(true)

    try {
      // Preparar dados
      const dataToSend: any = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        status: formData.status,
        amount: parseFloat(formData.amount),
        paidAmount: 0,
        dueDate: formData.dueDate || null,
        paidDate: null,
        paymentMethod: formData.paymentMethod || null,
        attachments: [],
        notes: formData.notes || null,
        siteId: formData.siteId,
        contractId: formData.contractId || null,
        supplierId: formData.supplierId || null,
        installments: parseInt(formData.installments.toString())
      }

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Despesa criada com sucesso!')
        onSuccess()
        onClose()
      } else {
        alert('❌ ' + (data.error || 'Erro ao criar despesa'))
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao criar despesa')
    } finally {
      setLoading(false)
    }
  }

  // Quando selecionar um contrato, pegar o siteId dele
  const handleContractChange = (contractId: string) => {
    setFormData({ ...formData, contractId })
    
    if (contractId) {
      const contract = contracts.find(c => c.id === contractId)
      if (contract && contract.contact?.clientSite) {
        setFormData(prev => ({ ...prev, contractId, siteId: contract.contact.clientSite.id }))
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Nova Despesa
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cadastre uma nova despesa no sistema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título da Despesa *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Pagamento DJ"
              required
            />
          </div>

          {/* Contrato e Fornecedor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contrato (Opcional)
              </label>
              <select
                value={formData.contractId}
                onChange={(e) => handleContractChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione um contrato...</option>
                {contracts.map(contract => (
                  <option key={contract.id} value={contract.id}>
                    {contract.numero} - {contract.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fornecedor (Opcional)
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione um fornecedor...</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoria e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Site ID Manual (caso não tenha contrato) */}
          {!formData.contractId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site ID * (obrigatório se não selecionar contrato)
              </label>
              <input
                type="text"
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="ID do site/evento"
                required={!formData.contractId}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ou selecione um contrato acima para preencher automaticamente
              </p>
            </div>
          )}

          {/* Data de Vencimento e Parcelamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parcelamento
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.installments}
                onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.installments > 1 && formData.amount && 
                  `${formData.installments}x de R$ ${(parseFloat(formData.amount) / formData.installments).toFixed(2)}`
                }
              </p>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Método de Pagamento
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione...</option>
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Detalhes adicionais sobre a despesa..."
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações Internas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Notas internas (não visível para o cliente)..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Criar Despesa
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
