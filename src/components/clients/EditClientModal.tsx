'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Lock, Eye, EyeOff, Upload, Trash2 } from 'lucide-react'
import { useMask } from '@/hooks/useMask'

interface EditClientModalProps {
  client: any
  onClose: () => void
  onSuccess: () => void
}

export function EditClientModal({ client, onClose, onSuccess }: EditClientModalProps) {
  const [loading, setLoading] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { phoneMask, documentMask, cepMask, removeMask } = useMask()
  
  const [form, setForm] = useState({
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    document: client.document || '',
    city: client.city || '',
    state: client.state || '',
    address: client.address || '',
    zipCode: client.zipCode || '',
    neighborhood: client.neighborhood || '',
    number: client.number || '',
    complement: client.complement || '',
    status: client.status || 'LEAD',
    notes: client.notes || '',
    avatar: client.avatar || '',
    password: '',
    confirmPassword: ''
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Imagem muito grande! Máximo 5MB')
      return
    }

    // Criar FormData para upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'avatars')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setForm({ ...form, avatar: data.url }) // Salva apenas a URL
      } else {
        alert('❌ Erro ao fazer upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('❌ Erro ao fazer upload')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (showPasswordChange) {
      if (form.password !== form.confirmPassword) {
        alert('❌ As senhas não coincidem')
        return
      }
      if (form.password.length < 6) {
        alert('❌ A senha deve ter no mínimo 6 caracteres')
        return
      }
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/contacts/${client.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          password: showPasswordChange ? form.password : undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Cliente atualizado com sucesso!')
        onSuccess()
      } else {
        alert('❌ ' + (data.error || 'Erro ao atualizar'))
      }
    } catch (error) {
      alert('❌ Erro ao atualizar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Cliente</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Foto de Perfil */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Foto de Perfil</h3>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                    {client.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg inline-flex items-center gap-2 transition">
                    <Upload className="w-4 h-4" />
                    Alterar Foto
                  </div>
                </label>
                {form.avatar && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatar: '' })}
                    className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg inline-flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG. Max: 2MB</p>
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">E-mail *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: phoneMask(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CPF/CNPJ</label>
                <input
                  value={form.document}
                  onChange={(e) => setForm({ ...form, document: documentMask(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                />
              </div>
            </div>
          </div>

          {/* Endereço Completo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Endereço</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CEP</label>
                <input
                  value={form.zipCode}
                  onChange={(e) => setForm({ ...form, zipCode: cepMask(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Cidade</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="São Paulo"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Rua/Avenida</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Rua exemplo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Número</label>
                <input
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bairro</label>
                <input
                  value={form.neighborhood}
                  onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Centro"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Complemento</label>
                <input
                  value={form.complement}
                  onChange={(e) => setForm({ ...form, complement: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Apto 101"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="LEAD">Lead</option>
                  <option value="CLIENTE">Cliente</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Observações sobre o cliente..."
                />
              </div>
            </div>
          </div>

          {/* Alterar Senha */}
          <div className="border-t pt-6">
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
            >
              <Lock className="w-4 h-4" />
              {showPasswordChange ? 'Cancelar alteração de senha' : 'Alterar senha'}
            </button>

            {showPasswordChange && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 pr-10"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Digite novamente"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
