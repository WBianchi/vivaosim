'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AffiliateCard } from './AffiliateCard'
import { AffiliatesTable } from './AffiliatesTable'
import { EmptyState } from './EmptyState'

interface AffiliatesListProps {
  filters: any
  searchTerm: string
  viewMode: 'grid' | 'table'
  onAffiliateSelect: (affiliate: any) => void
  onEdit: (affiliate: any) => void
  onDelete: (affiliateId: string) => void
}

const mockAffiliates = [
  {
    id: 'aff-001',
    name: 'Carlos Eduardo Silva',
    email: 'carlos@afiliado.com',
    phone: '(11) 99999-1111',
    avatar: null,
    status: 'active',
    paymentStatus: 'paid',
    performance: 'excellent',
    joinedAt: '2023-03-15T10:00:00Z',
    lastSale: '2024-01-24T16:30:00Z',
    totalCommissions: 12450.80,
    monthlyCommissions: 3250.50,
    salesCount: 89,
    conversionRate: 28.5,
    commissionRate: 15,
    shareableLink: 'https://app.com/ref/carlos-silva',
    plans: ['basic', 'professional', 'premium'],
    paymentMethod: 'pix',
    bankInfo: {
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: '67890-1'
    }
  },
  {
    id: 'aff-002',
    name: 'Marina Santos Costa',
    email: 'marina@vendas.com',
    phone: '(21) 88888-2222',
    avatar: null,
    status: 'active',
    paymentStatus: 'pending',
    performance: 'good',
    joinedAt: '2023-06-20T14:00:00Z',
    lastSale: '2024-01-25T11:15:00Z',
    totalCommissions: 8750.30,
    monthlyCommissions: 1890.75,
    salesCount: 56,
    conversionRate: 22.1,
    commissionRate: 12,
    shareableLink: 'https://app.com/ref/marina-santos',
    plans: ['basic', 'professional'],
    paymentMethod: 'bank_transfer',
    bankInfo: {
      bank: 'Itaú',
      agency: '5678-9',
      account: '12345-6'
    }
  },
  {
    id: 'aff-003',
    name: 'Roberto Lima Ferreira',
    email: 'roberto@marketing.io',
    phone: '(31) 77777-3333',
    avatar: null,
    status: 'inactive',
    paymentStatus: 'overdue',
    performance: 'poor',
    joinedAt: '2023-01-10T09:00:00Z',
    lastSale: '2023-12-15T18:45:00Z',
    totalCommissions: 2340.50,
    monthlyCommissions: 0,
    salesCount: 23,
    conversionRate: 8.3,
    commissionRate: 10,
    shareableLink: 'https://app.com/ref/roberto-lima',
    plans: ['basic'],
    paymentMethod: 'pix',
    bankInfo: {
      bank: 'Caixa Econômica',
      agency: '9876-5',
      account: '54321-0'
    }
  },
  {
    id: 'aff-004',
    name: 'Ana Paula Rocha',
    email: 'ana@topvendas.com',
    phone: '(85) 66666-4444',
    avatar: null,
    status: 'active',
    paymentStatus: 'paid',
    performance: 'excellent',
    joinedAt: '2022-11-05T16:30:00Z',
    lastSale: '2024-01-25T20:10:00Z',
    totalCommissions: 18950.90,
    monthlyCommissions: 4580.20,
    salesCount: 134,
    conversionRate: 35.7,
    commissionRate: 18,
    shareableLink: 'https://app.com/ref/ana-rocha',
    plans: ['basic', 'professional', 'premium', 'enterprise'],
    paymentMethod: 'pix',
    bankInfo: {
      bank: 'Bradesco',
      agency: '2468-1',
      account: '13579-2'
    }
  },
  {
    id: 'aff-005',
    name: 'Pedro Henrique Santos',
    email: 'pedro@newbie.com',
    phone: '(47) 55555-5555',
    avatar: null,
    status: 'pending',
    paymentStatus: 'processing',
    performance: 'average',
    joinedAt: '2024-01-20T12:00:00Z',
    lastSale: '2024-01-23T14:20:00Z',
    totalCommissions: 450.75,
    monthlyCommissions: 450.75,
    salesCount: 3,
    conversionRate: 15.0,
    commissionRate: 10,
    shareableLink: 'https://app.com/ref/pedro-santos',
    plans: ['basic'],
    paymentMethod: 'bank_transfer',
    bankInfo: {
      bank: 'Santander',
      agency: '1357-9',
      account: '24680-3'
    }
  }
]

export const AffiliatesList: React.FC<AffiliatesListProps> = ({
  filters, searchTerm, viewMode, onAffiliateSelect, onEdit, onDelete
}) => {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAffiliates()
  }, [])

  const fetchAffiliates = async () => {
    try {
      const response = await fetch('/api/affiliates')
      const data = await response.json()
      
      if (data.success) {
        setAffiliates(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar afiliados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (affiliateId: string) => {
    try {
      const response = await fetch(`/api/affiliates/${affiliateId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Afiliado excluído!')
        fetchAffiliates()
      } else {
        alert('❌ Erro: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('❌ Erro ao excluir afiliado')
    }
  }

  const filteredAffiliates = affiliates.filter((affiliate) => {
    if (filters.status !== 'all' && affiliate.status !== filters.status) return false
    if (filters.paymentStatus !== 'all' && affiliate.paymentStatus !== filters.paymentStatus) return false
    if (filters.performance !== 'all' && affiliate.performance !== filters.performance) return false
    if (filters.plan !== 'all' && !affiliate.plans.includes(filters.plan)) return false

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = affiliate.name.toLowerCase().includes(searchLower)
      const matchesEmail = affiliate.email.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesEmail) return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (filteredAffiliates.length === 0) {
    return <EmptyState filters={filters} searchTerm={searchTerm} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAffiliates.length} afiliado{filteredAffiliates.length !== 1 ? 's' : ''} encontrado{filteredAffiliates.length !== 1 ? 's' : ''}
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAffiliates.map((affiliate, index) => (
              <AffiliateCard
                key={affiliate.id}
                affiliate={affiliate}
                index={index}
                onClick={() => onAffiliateSelect(affiliate)}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <AffiliatesTable
          affiliates={filteredAffiliates}
          onAffiliateSelect={onAffiliateSelect}
        />
      )}
    </div>
  )
}
