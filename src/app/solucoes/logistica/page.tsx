import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Users, 
  Clipboard,
  Route,
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Boxes,
  Navigation,
  Timer,
  Target,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestão Logística | Viva o Sim - Controle Total de Equipamentos e Entregas',
  description: 'Gerencie toda logística dos seus eventos com controle de estoque, rastreamento de entregas, coordenação de equipes e cronogramas de montagem.',
  keywords: 'gestão logística eventos, controle estoque, rastreamento entregas, coordenação equipes, montagem eventos',
  openGraph: {
    title: 'Gestão Logística - Eventos sem Falhas Operacionais',
    description: 'Sistema completo para gerenciar equipamentos, entregas e equipes com precisão militar.',
    images: ['/og-logistica.jpg'],
  }
}

const LogisticaPage = () => {
  const recursosLogistica = [
    {
      title: 'Controle de Estoque Inteligente',
      description: 'Gerencie todos os equipamentos e materiais com controle automático de entrada, saída e disponibilidade em tempo real.',
      icon: Package,
      benefits: [
        'Controle automático de estoque',
        'Rastreabilidade completa',
        'Alertas de baixo estoque',
        'Previsão de demanda'
      ],
      link: {
        text: 'Gerenciar estoque',
        href: '/controle-estoque'
      }
    },
    {
      title: 'Rastreamento de Entregas',
      description: 'Acompanhe todas as entregas em tempo real. GPS integrado, notificações automáticas e confirmação de recebimento.',
      icon: Truck,
      benefits: [
        'GPS em tempo real',
        'Notificações automáticas',
        'Confirmação digital',
        'Histórico completo'
      ],
      link: {
        text: 'Rastrear entregas',
        href: '/rastreamento-entregas'
      }
    },
    {
      title: 'Coordenação de Equipes',
      description: 'Organize e coordene todas as equipes de montagem, desmontagem e operação com cronogramas sincronizados.',
      icon: Users,
      benefits: [
        'Cronogramas de equipe',
        'Comunicação instantânea',
        'Delegação de tarefas',
        'Controle de presença'
      ],
      link: {
        text: 'Coordenar equipes',
        href: '/coordenacao-equipes'
      }
    },
    {
      title: 'Planejamento de Rotas',
      description: 'Otimize rotas de entrega e coleta automaticamente. Economize tempo, combustível e reduza custos operacionais.',
      icon: Route,
      benefits: [
        'Otimização automática',
        'Economia de combustível',
        'Múltiplas paradas',
        'Tempo real de trânsito'
      ],
      link: {
        text: 'Otimizar rotas',
        href: '/planejamento-rotas'
      }
    },
    {
      title: 'Checklist de Montagem',
      description: 'Checklists digitais para montagem e desmontagem. Garanta que nada seja esquecido e tudo seja feito na ordem correta.',
      icon: Clipboard,
      benefits: [
        'Checklists personalizáveis',
        'Ordem de execução',
        'Fotos de comprovação',
        'Assinatura digital'
      ],
      link: {
        text: 'Criar checklists',
        href: '/checklist-montagem'
      }
    },
    {
      title: 'Centro de Comando',
      description: 'Dashboard central com visão completa de toda operação. Monitore tudo em tempo real e tome decisões rápidas.',
      icon: BarChart3,
      benefits: [
        'Dashboard em tempo real',
        'Alertas inteligentes',
        'Métricas de performance',
        'Controle centralizado'
      ],
      link: {
        text: 'Acessar centro',
        href: '/centro-comando'
      }
    }
  ]

  const beneficiosLogistica = [
    {
      title: 'Redução de 85% em Perdas',
      description: 'Controle rigoroso elimina perdas de equipamentos e materiais durante transporte e montagem.',
      icon: Shield
    },
    {
      title: 'Economia de 40% no Tempo',
      description: 'Rotas otimizadas e cronogramas inteligentes aceleram significativamente as operações.',
      icon: Timer
    },
    {
      title: 'Zero Esquecimentos',
      description: 'Checklists digitais garantem que todos os itens sejam montados e desmontados corretamente.',
      icon: CheckCircle
    },
    {
      title: 'Equipes 200% Mais Eficientes',
      description: 'Coordenação precisa e comunicação clara otimizam o trabalho de todas as equipes.',
      icon: TrendingUp
    }
  ]

  const fluxoLogistico = [
    {
      fase: 'Planejamento',
      descricao: 'Defina necessidades, calcule materiais e planeje rotas otimizadas.',
      icone: Target,
      atividades: [
        'Levantamento de necessidades',
        'Cálculo de materiais',
        'Planejamento de rotas',
        'Agendamento de equipes'
      ]
    },
    {
      fase: 'Preparação',
      descricao: 'Separe equipamentos, prepare veículos e confirme disponibilidade da equipe.',
      icone: Boxes,
      atividades: [
        'Separação de materiais',
        'Preparação de veículos',
        'Briefing de equipes',
        'Checklist pré-saída'
      ]
    },
    {
      fase: 'Transporte',
      descricao: 'Execute entregas com rastreamento em tempo real e comunicação constante.',
      icone: Navigation,
      atividades: [
        'Rastreamento GPS',
        'Comunicação em tempo real',
        'Confirmação de entregas',
        'Registro de ocorrências'
      ]
    },
    {
      fase: 'Execução',
      descricao: 'Monitore montagem, coordene equipes e garanta qualidade da operação.',
      icone: Settings,
      atividades: [
        'Supervisão de montagem',
        'Coordenação de equipes',
        'Controle de qualidade',
        'Relatórios de progresso'
      ]
    }
  ]

  const depoimentosLogistica = [
    {
      id: '1',
      name: 'Eduardo Martins',
      role: 'Diretor Operacional',
      company: 'Mega Eventos Corporativos',
      content: 'A gestão logística transformou nossa operação. Reduzimos perdas em 90% e nunca mais tivemos atrasos. O rastreamento em tempo real nos dá controle total sobre tudo.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Carla Rodrigues',
      role: 'Coordenadora Logística',
      company: 'Produtora Premium',
      content: 'O sistema de rotas otimizadas economizou 50% do nosso combustível. As equipes chegam no horário certo sempre.',
      rating: 5
    },
    {
      id: '3',
      name: 'Marcos Antonio',
      role: 'Gerente de Operações',
      company: 'Estruturas & Eventos',
      content: 'Os checklists digitais eliminaram todos os esquecimentos. Nossa equipe trabalha com muito mais confiança.',
      rating: 5
    },
    {
      id: '4',
      name: 'Fernanda Costa',
      role: 'Supervisora',
      company: 'Som & Luz Eventos',
      content: 'O centro de comando nos dá visão completa da operação. Conseguimos resolver problemas antes que virem crises.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Gestão Logística Avançada"
        description="Controle total sobre equipamentos, entregas e equipes. Sistema completo para logística de eventos com rastreamento em tempo real e otimização automática."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Logística' }
        ]}
        badge={{
          text: 'Zero Perdas',
          variant: 'success'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Recursos que Otimizam sua Operação"
        subtitle="Tecnologia de ponta para logística perfeita"
        features={recursosLogistica.map(r => ({...r, icon: '??'}))}
        variant="cards"
        columns={3}
      />

      {/* Fluxo Logístico */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-lg text-orange-500 font-medium mb-4">Processo Otimizado</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Fluxo Logístico <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Perfeito</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Do planejamento à execução, cada etapa otimizada para máxima eficiência
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {fluxoLogistico.map((fase, index) => {
                const IconeComponent = fase.icone
                return (
                  <div key={index} className="relative">
                    {/* Connection line for desktop */}
                    {index === 0 && (
                      <div className="hidden lg:block absolute top-1/2 left-full w-12 h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 transform -translate-y-1/2"></div>
                    )}
                    {index === 2 && (
                      <div className="hidden lg:block absolute top-1/2 left-full w-12 h-0.5 bg-gradient-to-r from-orange-300 to-orange-500 transform -translate-y-1/2"></div>
                    )}
                    
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <IconeComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {fase.fase}
                          </h3>
                          <div className="text-sm text-orange-500 font-medium">
                            Etapa {index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {fase.descricao}
                      </p>

                      <div className="space-y-3">
                        {fase.atividades.map((atividade, atividadeIndex) => (
                          <div key={atividadeIndex} className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{atividade}</span>
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

      {/* Dashboard Preview */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Centro de Comando <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">em Tempo Real</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Monitore toda sua operação logística em um dashboard intuitivo
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { metric: 'Veículos Ativos', value: '12', trend: '+2', icon: Truck },
                  { metric: 'Entregas Hoje', value: '34', trend: '98%', icon: Package },
                  { metric: 'Equipes em Campo', value: '8', trend: '100%', icon: Users },
                  { metric: 'Alertas Ativos', value: '2', trend: '-5', icon: AlertTriangle }
                ].map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-6 h-6 text-orange-500" />
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
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Todas as operações funcionando normalmente</span>
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
              Resultados <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Operacionais</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Impacto real na eficiência e qualidade das suas operações
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosLogistica.map((beneficio, index) => {
              const IconComponent = beneficio.icon
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {beneficio.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
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
        title="Operações que Funcionam como Relógio"
        subtitle="Veja como a logística inteligente transforma negócios"
        testimonials={depoimentosLogistica}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Logística sem Falhas?"
        description="Elimine perdas, otimize rotas e tenha controle total sobre suas operações. Sua equipe e seus clientes merecem perfeição logística."
        variant="gradient"
        buttons={[
          {
            text: 'Otimizar Logística',
            href: '/cadastro?produto=logistica',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Dashboard',
            href: '/demo?solucao=logistica',
            variant: 'outline',
            icon: 'external'
          }
        ]}
        stats={[
          { value: '85%', label: 'Redução em Perdas' },
          { value: '40%', label: 'Economia de Tempo' },
          { value: '0', label: 'Esquecimentos' },
          { value: '200%', label: 'Eficiência das Equipes' }
        ]}
        badge="Operação Perfeita"
      />

      <Footer />
    </div>
  )
}

export default LogisticaPage
