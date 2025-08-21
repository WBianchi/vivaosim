import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Megaphone, 
  Target, 
  Mail, 
  Share2, 
  BarChart3, 
  Users,
  Smartphone,
  Calendar,
  Heart,
  Zap,
  TrendingUp,
  Star,
  MessageSquare,
  Eye,
  MousePointer,
  Award,
  Rocket,
  Globe,
  Camera,
  Send
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketing Digital | Viva o Sim - Automatize e Potencialize suas Campanhas',
  description: 'Crie campanhas impactantes, automatize comunicações, segmente audiências e monitore resultados com ferramentas de marketing integradas.',
  keywords: 'marketing digital eventos, email marketing, automação, campanhas, segmentação audiência, analytics marketing',
  openGraph: {
    title: 'Marketing Digital - Eventos que Geram Buzz',
    description: 'Ferramentas completas para marketing que converte e fideliza.',
    images: ['/og-marketing.jpg'],
  }
}

const MarketingPage = () => {
  const recursosMarketing = [
    {
      title: 'Email Marketing Avançado',
      description: 'Crie campanhas de email personalizadas com automação inteligente. Templates profissionais, segmentação avançada e métricas detalhadas.',
      icon: Mail,
      benefits: [
        'Templates responsivos',
        'Automação por triggers',
        'Segmentação avançada',
        'A/B Testing integrado'
      ],
      link: {
        text: 'Criar campanha',
        href: '/email-marketing'
      }
    },
    {
      title: 'Gestão de Redes Sociais',
      description: 'Planeje, agende e monitore posts em todas as redes sociais. Calendário editorial, banco de imagens e análise de engajamento.',
      icon: Share2,
      benefits: [
        'Agendamento múltiplo',
        'Calendário editorial',
        'Banco de mídia',
        'Analytics social'
      ],
      link: {
        text: 'Gerenciar redes',
        href: '/redes-sociais'
      }
    },
    {
      title: 'Landing Pages Otimizadas',
      description: 'Construa landing pages de alta conversão com editor drag-and-drop. Otimização automática e testes A/B integrados.',
      icon: MousePointer,
      benefits: [
        'Editor visual',
        'Otimização automática',
        'Formulários inteligentes',
        'Integração CRM'
      ],
      link: {
        text: 'Criar landing page',
        href: '/landing-pages'
      }
    },
    {
      title: 'Automação de Marketing',
      description: 'Jornadas automatizadas baseadas no comportamento do cliente. Nurturing inteligente que converte prospects em clientes.',
      icon: Zap,
      benefits: [
        'Fluxos automatizados',
        'Triggers comportamentais',
        'Lead scoring',
        'Nurturing inteligente'
      ],
      link: {
        text: 'Automatizar fluxos',
        href: '/automacao-marketing'
      }
    },
    {
      title: 'Analytics e Métricas',
      description: 'Dashboard completo com métricas de marketing. ROI, conversões, funil de vendas e insights acionáveis em tempo real.',
      icon: BarChart3,
      benefits: [
        'ROI em tempo real',
        'Funil de conversão',
        'Insights automáticos',
        'Relatórios customizados'
      ],
      link: {
        text: 'Ver métricas',
        href: '/analytics-marketing'
      }
    },
    {
      title: 'Segmentação Inteligente',
      description: 'Segmente sua audiência com precisão cirúrgica. IA que identifica padrões e cria segmentos automaticamente para máxima relevância.',
      icon: Target,
      benefits: [
        'Segmentação automática',
        'Perfis comportamentais',
        'Audiências lookalike',
        'Personalização 1:1'
      ],
      link: {
        text: 'Segmentar audiência',
        href: '/segmentacao'
      }
    }
  ]

  const beneficiosMarketing = [
    {
      title: 'ROI 400% Maior',
      description: 'Campanhas segmentadas e automação inteligente multiplicam o retorno sobre investimento em marketing.',
      icon: TrendingUp
    },
    {
      title: '85% Taxa de Abertura',
      description: 'Emails personalizados e segmentação precisa resultam em taxas de abertura muito acima da média.',
      icon: Eye
    },
    {
      title: '300% Mais Engajamento',
      description: 'Conteúdo relevante e timing perfeito triplicam o engajamento nas redes sociais.',
      icon: Heart
    },
    {
      title: '50% Redução em Custos',
      description: 'Automação elimina trabalho manual e otimiza gastos com publicidade paga.',
      icon: Award
    }
  ]

  const jornadas = [
    {
      etapa: 'Atração',
      descricao: 'Capture leads qualificados com conteúdo relevante e ofertas irresistíveis.',
      icone: Megaphone,
      canais: [
        'SEO e Blog',
        'Redes Sociais',
        'Google Ads',
        'Landing Pages'
      ]
    },
    {
      etapa: 'Engajamento',
      descricao: 'Nutra relacionamentos com automação personalizada e conteúdo de valor.',
      icone: MessageSquare,
      canais: [
        'Email Sequences',
        'Retargeting',
        'Conteúdo Premium',
        'Webinars'
      ]
    },
    {
      etapa: 'Conversão',
      descricao: 'Converta prospects em clientes com ofertas personalizadas no momento certo.',
      icone: Target,
      canais: [
        'Ofertas Personalizadas',
        'Chat Automático',
        'Demos Agendadas',
        'Propostas Dinâmicas'
      ]
    },
    {
      etapa: 'Fidelização',
      descricao: 'Mantenha clientes engajados e transforme em promotores da sua marca.',
      icone: Star,
      canais: [
        'Onboarding',
        'Newsletter VIP',
        'Programa Fidelidade',
        'Referral Program'
      ]
    }
  ]

  const depoimentosMarketing = [
    {
      id: '1',
      name: 'Marina Silva',
      role: 'Diretora de Marketing',
      company: 'EventMax',
      content: 'Nossas campanhas nunca foram tão eficazes. O ROI aumentou 350% e conseguimos automatizar 80% do nosso marketing. A segmentação é impressionante.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Ricardo Santos',
      role: 'CMO',
      company: 'Mega Produções',
      content: 'A automação de email marketing transformou nosso negócio. Clientes recebem o conteúdo certo na hora certa.',
      rating: 5
    },
    {
      id: '3',
      name: 'Camila Rocha',
      role: 'Coordenadora Digital',
      company: 'Prime Events',
      content: 'O dashboard de analytics nos dá insights que nunca tivemos. Sabemos exatamente onde investir nosso orçamento.',
      rating: 5
    },
    {
      id: '4',
      name: 'Lucas Fernandes',
      role: 'Social Media Manager',
      company: 'Eventos Premium',
      content: 'O agendamento de posts e o calendário editorial organizaram completamente nossa presença digital.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Marketing Digital Inteligente"
        description="Automatize campanhas, segmente audiências e multiplique resultados. Ferramentas completas de marketing digital para eventos que convertem e fidelizam."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Marketing' }
        ]}
        badge={{
          text: 'ROI 400%+',
          variant: 'success'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Ferramentas que Maximizam Conversões"
        subtitle="Marketing automation que funciona 24/7"
        features={recursosMarketing}
        variant="cards"
        columns={3}
      />

      {/* Jornada do Cliente */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-lg text-orange-500 font-medium mb-4">Marketing 360°</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Jornada Completa do <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Cliente</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Da atração à fidelização, acompanhe e otimize cada etapa da jornada
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {jornadas.map((jornada, index) => {
                const IconeComponent = jornada.icone
                return (
                  <div key={index} className="relative">
                    {/* Connection arrows */}
                    {index === 0 && (
                      <div className="hidden lg:block absolute top-1/2 left-full w-12 h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 transform -translate-y-1/2">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-orange-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    )}
                    {index === 2 && (
                      <div className="hidden lg:block absolute top-1/2 left-full w-12 h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 transform -translate-y-1/2">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-orange-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    )}
                    
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <IconeComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {jornada.etapa}
                          </h3>
                          <div className="text-sm text-orange-500 font-medium">
                            Etapa {index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {jornada.descricao}
                      </p>

                      <div className="space-y-3">
                        {jornada.canais.map((canal, canalIndex) => (
                          <div key={canalIndex} className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{canal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard de Marketing */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Analytics que <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Impulsionam Decisões</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Métricas em tempo real para otimizar cada campanha
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { metric: 'Taxa Conversão', value: '12.8%', trend: '+2.3%', icon: Target, color: 'green' },
                  { metric: 'ROI Campanhas', value: '420%', trend: '+45%', icon: TrendingUp, color: 'blue' },
                  { metric: 'Email Open Rate', value: '89.2%', trend: '+12%', icon: Mail, color: 'purple' },
                  { metric: 'Social Engagement', value: '24.5K', trend: '+180%', icon: Heart, color: 'pink' }
                ].map((item, index) => {
                  const IconComponent = item.icon
                  const colorClasses = {
                    green: 'bg-green-100 dark:bg-green-500/20 text-green-500',
                    blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500',
                    purple: 'bg-purple-100 dark:bg-purple-500/20 text-purple-500',
                    pink: 'bg-pink-100 dark:bg-pink-500/20 text-pink-500'
                  }
                  
                  return (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm">
                      <div className={`w-12 h-12 rounded-lg ${colorClasses[item.color as keyof typeof colorClasses]} flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {item.metric}
                      </div>
                      <div className="text-xs text-green-500 font-medium">
                        {item.trend}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Gráfico simulado */}
              <div className="bg-white/20 dark:bg-slate-700/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance das Campanhas - Últimos 30 dias
                </h3>
                <div className="h-32 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 dark:from-orange-800 dark:via-orange-700 dark:to-orange-600 rounded-lg flex items-end justify-between p-4">
                  {[65, 78, 85, 92, 88, 95, 100].map((height, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-sm shadow-sm"
                      style={{
                        height: `${height}%`,
                        width: '12%'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Resultados que <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Falam por Si</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transforme sua estratégia de marketing com resultados mensuráveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosMarketing.map((beneficio, index) => {
              const IconComponent = beneficio.icon
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {beneficio.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {beneficio.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <TestimonialSection
        title="Marketing que Realmente Converte"
        subtitle="Veja como empresas multiplicaram seus resultados"
        testimonials={depoimentosMarketing}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Marketing que Converte?"
        description="Automatize campanhas, segmente com precisão e multiplique seu ROI. Suas campanhas merecem tecnologia de ponta para resultados extraordinários."
        variant="gradient"
        buttons={[
          {
            text: 'Automatizar Marketing',
            href: '/cadastro?produto=marketing',
            variant: 'primary',
            icon: 'rocket'
          },
          {
            text: 'Ver Campanhas',
            href: '/demo?solucao=marketing',
            variant: 'outline',
            icon: 'external'
          }
        ]}
        stats={[
          { value: '400%', label: 'ROI Médio' },
          { value: '85%', label: 'Taxa de Abertura' },
          { value: '300%', label: 'Mais Engajamento' },
          { value: '50%', label: 'Redução Custos' }
        ]}
        badge="Marketing Intelligence"
      />

      <Footer />
    </div>
  )
}

export default MarketingPage
