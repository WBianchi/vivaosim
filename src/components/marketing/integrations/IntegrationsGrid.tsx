'use client'

import { motion } from 'framer-motion'
import { 
  Check, Settings, ExternalLink, Star, Zap, Shield,
  CreditCard, DollarSign, BarChart3, Target, Hash,
  MessageCircle, Users, Mail, Flame, Brain, Globe,
  ShoppingCart, TrendingUp, Database, Megaphone,
  Instagram, Facebook, Youtube, Twitter, Linkedin,
  Building2, Package, Wallet, PieChart, FileText
} from 'lucide-react'
import Image from 'next/image'

interface IntegrationsGridProps {
  searchTerm: string
  selectedCategory: string
  activeIntegrations: string[]
  onToggleIntegration: (id: string) => void
}

export const IntegrationsGrid: React.FC<IntegrationsGridProps> = ({
  searchTerm, selectedCategory, activeIntegrations, onToggleIntegration
}) => {
  const integrations = [
    {
      id: 'asaas',
      name: 'Asaas',
      description: 'Gateway de pagamento completo com boleto, PIX e cartão',
      category: 'payment',
      icon: CreditCard,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Boleto', 'PIX', 'Cartão', 'Split de pagamento'],
      popular: true,
      hasAI: false
    },
    {
      id: 'pagarme',
      name: 'Pagar.me',
      description: 'Processamento de pagamentos com anti-fraude',
      category: 'payment',
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      features: ['Checkout transparente', 'Anti-fraude', 'Recorrência'],
      popular: true,
      hasAI: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Pagamentos internacionais e assinaturas',
      category: 'payment',
      icon: Wallet,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      features: ['Multi-moeda', 'Assinaturas', 'Marketplace'],
      popular: false,
      hasAI: true
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Solução de pagamento do Mercado Livre',
      category: 'payment',
      icon: ShoppingCart,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      features: ['PIX', 'QR Code', 'Parcelamento'],
      popular: true,
      hasAI: false
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Análise completa de tráfego e comportamento',
      category: 'analytics',
      icon: BarChart3,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      features: ['Real-time', 'Funis', 'Conversões', 'Audiências'],
      popular: true,
      hasAI: true
    },
    {
      id: 'google-ads',
      name: 'Google Ads',
      description: 'Campanhas de anúncios no Google',
      category: 'marketing',
      icon: Target,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Search', 'Display', 'YouTube', 'Shopping'],
      popular: true,
      hasAI: true
    },
    {
      id: 'meta-pixel',
      name: 'Meta Pixel',
      description: 'Rastreamento de conversões do Facebook',
      category: 'marketing',
      icon: Facebook,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Eventos', 'Conversões', 'Remarketing'],
      popular: true,
      hasAI: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Integração com Instagram Business',
      category: 'social',
      icon: Instagram,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      features: ['Posts', 'Stories', 'DM', 'Shopping'],
      popular: true,
      hasAI: true
    },
    {
      id: 'whatsapp-business',
      name: 'WhatsApp Business',
      description: 'API oficial do WhatsApp Business',
      category: 'social',
      icon: MessageCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      features: ['Mensagens', 'Catálogo', 'Automação'],
      popular: true,
      hasAI: true
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM completo com automação de marketing',
      category: 'crm',
      icon: Database,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      features: ['Contatos', 'Deals', 'Automação', 'Email'],
      popular: false,
      hasAI: true
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      description: 'CRM focado em vendas',
      category: 'crm',
      icon: TrendingUp,
      iconColor: 'text-gray-700',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      features: ['Pipeline', 'Atividades', 'Relatórios'],
      popular: false,
      hasAI: false
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing e automação',
      category: 'marketing',
      icon: Mail,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      features: ['Templates', 'Automação', 'Segmentação'],
      popular: true,
      hasAI: true
    },
    {
      id: 'hotmart',
      name: 'Hotmart',
      description: 'Plataforma de produtos digitais',
      category: 'payment',
      icon: Flame,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      features: ['Afiliados', 'Área de membros', 'Checkout'],
      popular: true,
      hasAI: false
    },
    {
      id: 'rd-station',
      name: 'RD Station',
      description: 'Automação de marketing e vendas',
      category: 'marketing',
      icon: Megaphone,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      features: ['Lead scoring', 'Nutrição', 'CRM'],
      popular: false,
      hasAI: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Integração com YouTube Analytics',
      category: 'social',
      icon: Youtube,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      features: ['Analytics', 'Monetização', 'Live'],
      popular: true,
      hasAI: false
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'TikTok for Business',
      category: 'social',
      icon: Hash,
      iconColor: 'text-gray-900 dark:text-white',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      features: ['Ads', 'Analytics', 'Shopping'],
      popular: true,
      hasAI: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'LinkedIn para empresas',
      category: 'social',
      icon: Linkedin,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Posts', 'Ads', 'Recruiter'],
      popular: false,
      hasAI: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automação entre aplicativos',
      category: 'marketing',
      icon: Zap,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      features: ['5000+ apps', 'Workflows', 'Triggers'],
      popular: true,
      hasAI: true
    },
    {
      id: 'google-tag-manager',
      name: 'Google Tag Manager',
      description: 'Gerenciamento de tags e pixels',
      category: 'analytics',
      icon: Package,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Tags', 'Triggers', 'Variables'],
      popular: true,
      hasAI: false
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      description: 'Analytics de produto',
      category: 'analytics',
      icon: PieChart,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      features: ['Eventos', 'Funnels', 'Retention'],
      popular: false,
      hasAI: true
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM enterprise completo',
      category: 'crm',
      icon: Building2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud'],
      popular: false,
      hasAI: true
    },
    {
      id: 'monday',
      name: 'Monday.com',
      description: 'Gestão de projetos e CRM',
      category: 'crm',
      icon: FileText,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      features: ['Boards', 'Automação', 'Forms'],
      popular: false,
      hasAI: false
    },
    {
      id: 'segment',
      name: 'Segment',
      description: 'CDP - Customer Data Platform',
      category: 'analytics',
      icon: Globe,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      features: ['Unificação', 'Destinations', 'Sources'],
      popular: false,
      hasAI: true
    },
    {
      id: 'activecampaign',
      name: 'ActiveCampaign',
      description: 'Email marketing e CRM',
      category: 'marketing',
      icon: Mail,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      features: ['Automação', 'CRM', 'Segmentação'],
      popular: false,
      hasAI: true
    }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    if (selectedCategory !== 'all' && integration.category !== selectedCategory) return false
    if (searchTerm && !integration.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredIntegrations.map((integration, index) => {
        const isActive = activeIntegrations.includes(integration.id)
        
        return (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 transition-all ${
              isActive 
                ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              {integration.popular && (
                <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg" title="Popular">
                  <Star className="w-3 h-3 text-orange-500" />
                </div>
              )}
              {integration.hasAI && (
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg" title="Com IA">
                  <Zap className="w-3 h-3 text-blue-500" />
                </div>
              )}
            </div>

            {/* Logo e Nome */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 ${integration.bgColor} rounded-xl flex items-center justify-center`}>
                {integration.icon && <integration.icon className={`w-6 h-6 ${integration.iconColor}`} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {integration.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-4">
              {integration.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-lg"
                >
                  {feature}
                </span>
              ))}
              {integration.features.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{integration.features.length - 3}
                </span>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleIntegration(integration.id)}
                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isActive ? (
                  <>
                    <Check className="w-4 h-4" />
                    Ativo
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Ativar
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Configurações"
              >
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Documentação"
              >
                <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
