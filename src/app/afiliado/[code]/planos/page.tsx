'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Zap, Package, ArrowRight, Star } from 'lucide-react'

export default function AffiliatePlansPage() {
  const params = useParams()
  const affiliateCode = params.code as string
  
  const [plans, setPlans] = useState<any[]>([])
  const [affiliate, setAffiliate] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (affiliateCode) {
      trackVisit()
      fetchPlans()
    }
  }, [affiliateCode])

  const trackVisit = async () => {
    try {
      await fetch('/api/affiliates/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: affiliateCode,
          page: '/planos',
          action: 'view'
        })
      })
    } catch (error) {
      console.error('Erro ao rastrear visita:', error)
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await fetch(`/api/affiliates/code/${affiliateCode}`)
      const data = await response.json()

      if (data.success) {
        setPlans(data.plans)
        setAffiliate(data.affiliate)
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    try {
      // Rastrear clique
      await fetch('/api/affiliates/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: affiliateCode,
          page: '/planos',
          action: 'click',
          planId
        })
      })

      // Redirecionar para checkout com código do afiliado
      window.location.href = `/cadastro?plan=${planId}&ref=${affiliateCode}`
    } catch (error) {
      console.error('Erro ao rastrear clique:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando planos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">VivaOSim</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {affiliate ? `Indicado por ${affiliate.name}` : 'Escolha seu plano'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
          >
            Escolha o Plano Perfeito
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">
              Para Seu Negócio
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Gerencie eventos, vendas e atendimento em uma única plataforma
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 overflow-hidden ${
                plan.isPopular 
                  ? 'border-purple-500 ring-4 ring-purple-100 dark:ring-purple-900/30' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.period === 'MONTHLY' ? 'mês' : 
                        plan.period === 'QUARTERLY' ? 'trimestre' :
                        plan.period === 'SEMIANNUAL' ? 'semestre' :
                        plan.period === 'ANNUAL' ? 'ano' : 'vitalício'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features?.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  
                  {/* Default features se não tiver */}
                  {(!plan.features || plan.features.length === 0) && (
                    <>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Até {plan.maxUsers} usuários</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Suporte prioritário</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Todas as funcionalidades</span>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'
                  }`}
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        {affiliate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Você foi indicado por <strong>{affiliate.name}</strong>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
