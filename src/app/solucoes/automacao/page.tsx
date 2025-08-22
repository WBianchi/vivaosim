import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Zap, 
  Bot, 
  Workflow, 
  Clock, 
  Shield, 
  Repeat,
  Settings,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Target,
  Timer,
  Gauge,
  Cpu,
  Network,
  RefreshCw
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Automação Inteligente | Viva o Sim - Workflows que Economizam 80% do Tempo',
  description: 'Automatize processos repetitivos, crie workflows inteligentes e elimine trabalho manual. IA que aprende e otimiza operações automaticamente.',
  keywords: 'automação processos eventos, workflows inteligentes, IA automação, eliminar trabalho manual, otimização processos',
  openGraph: {
    title: 'Automação Inteligente - Processos que se Executam Sozinhos',
    description: 'Workflows inteligentes que economizam 80% do tempo operacional.',
    images: ['/og-automacao.jpg'],
  }
}

const AutomacaoPage = () => {
  const recursosAutomacao = [
    {
      title: 'Workflows Inteligentes',
      description: 'Crie fluxos automatizados complexos sem código. Condições, loops, integrações e IA que otimiza processos em tempo real.',
      icon: Workflow,
      benefits: [
        'Editor visual drag & drop',
        'Condições inteligentes',
        'Loops e repetições',
        'Otimização automática'
      ],
      link: {
        text: 'Criar workflow',
        href: '/workflows'
      }
    },
    {
      title: 'Assistente IA Avançado',
      description: 'IA que aprende seus processos e sugere automações. Executa tarefas complexas, responde clientes e toma decisões inteligentes.',
      icon: Bot,
      benefits: [
        'Aprendizado contínuo',
        'Decisões inteligentes',
        'Atendimento 24/7',
        'Sugestões automáticas'
      ],
      link: {
        text: 'Configurar IA',
        href: '/assistente-ia'
      }
    },
    {
      title: 'Triggers Comportamentais',
      description: 'Automações baseadas em ações e comportamentos. Dispare fluxos automaticamente quando clientes fazem ações específicas.',
      icon: Target,
      benefits: [
        'Triggers personalizados',
        'Análise comportamental',
        'Respostas instantâneas',
        'Segmentação automática'
      ],
      link: {
        text: 'Definir triggers',
        href: '/triggers'
      }
    },
    {
      title: 'Integração Universal',
      description: 'Conecte qualquer sistema ou ferramenta. APIs, webhooks, Zapier e integrações nativas com centenas de aplicações.',
      icon: Network,
      benefits: [
        '500+ integrações',
        'APIs abertas',
        'Webhooks bidirecionais',
        'Sincronização em tempo real'
      ],
      link: {
        text: 'Ver integrações',
        href: '/integracoes'
      }
    },
    {
      title: 'Agendamentos Inteligentes',
      description: 'Agende tarefas com precisão cirúrgica. Execução em horários específicos, com base em dados ou condições complexas.',
      icon: Clock,
      benefits: [
        'Agendamento preciso',
        'Condições complexas',
        'Execução distribuída',
        'Monitoramento ativo'
      ],
      link: {
        text: 'Agendar tarefas',
        href: '/agendamentos'
      }
    },
    {
      title: 'Centro de Controle',
      description: 'Dashboard completo para monitorar todas as automações. Logs detalhados, métricas de performance e alertas inteligentes.',
      icon: Gauge,
      benefits: [
        'Monitoramento em tempo real',
        'Logs detalhados',
        'Alertas inteligentes',
        'Métricas de performance'
      ],
      link: {
        text: 'Monitorar automações',
        href: '/centro-controle'
      }
    }
  ]

  const beneficiosAutomacao = [
    {
      title: '80% Menos Trabalho Manual',
      description: 'Automação elimina tarefas repetitivas, liberando equipe para atividades estratégicas e criativas.',
      icon: Timer
    },
    {
      title: '99.9% de Precisão',
      description: 'Processos automatizados eliminam erros humanos e garantem execução perfeita sempre.',
      icon: Shield
    },
    {
      title: '24/7 Operação Contínua',
      description: 'Sistemas que nunca param. Processos funcionam mesmo fora do horário comercial.',
      icon: RefreshCw
    },
    {
      title: '300% Mais Produtividade',
      description: 'Equipes focam no que realmente importa enquanto automação cuida do operacional.',
      icon: BarChart3
    }
  ]

  const exemplosAutomacao = [
    {
      processo: 'Onboarding Automático',
      descricao: 'Cliente se cadastra e recebe automaticamente email de boas-vindas, acesso ao sistema e agendamento de demo.',
      passos: [
        'Cliente faz cadastro',
        'Email boas-vindas enviado',
        'Acesso liberado automaticamente',
        'Demo agendada via IA',
        'Sequência de emails educativos'
      ],
      economia: '90% menos tempo manual'
    },
    {
      processo: 'Cobrança Inteligente',
      descricao: 'Sistema detecta pagamento em atraso e executa sequência automática de cobrança personalizada.',
      passos: [
        'Detecta atraso no pagamento',
        'Envia lembrete amigável',
        'Escala cobrança progressivamente',
        'Negocia parcelamento automático',
        'Atualiza status no sistema'
      ],
      economia: '75% redução inadimplência'
    },
    {
      processo: 'Suporte Preditivo',
      descricao: 'IA identifica problemas potenciais e resolve automaticamente ou alerta equipe antes que virem reclamações.',
      passos: [
        'IA monitora indicadores',
        'Detecta anomalias',
        'Tenta resolução automática',
        'Alerta equipe se necessário',
        'Documenta solução'
      ],
      economia: '60% menos tickets suporte'
    }
  ]

  const depoimentosAutomacao = [
    {
      id: '1',
      name: 'Renata Costa',
      role: 'COO',
      company: 'Eventos & Cia',
      content: 'A automação revolucionou nossa operação. Eliminamos 85% do trabalho manual e triplicamos nossa capacidade sem contratar mais pessoas. É impressionante.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Daniel Oliveira',
      role: 'Diretor de TI',
      company: 'MegaEventos',
      content: 'Os workflows inteligentes integram todos nossos sistemas. Tudo funciona em harmonia perfeita 24/7.',
      rating: 5
    },
    {
      id: '3',
      name: 'Patricia Mendes',
      role: 'Gerente Operacional',
      company: 'Prime Produções',
      content: 'O assistente IA aprende nossos processos e otimiza constantemente. Cada semana fica mais inteligente.',
      rating: 5
    },
    {
      id: '4',
      name: 'João Carlos',
      role: 'CEO',
      company: 'Estrutura Total',
      content: 'ROI da automação foi 400% no primeiro ano. Nunca vi tecnologia com impacto tão direto no resultado.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Automação Inteligente Total"
        description="Elimine 80% do trabalho manual com workflows inteligentes. IA que aprende, otimiza e executa processos complexos automaticamente."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Automação' }
        ]}
        badge={{
          text: '24/7 Ativo',
          variant: 'success'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Tecnologia que Trabalha por Você"
        subtitle="Automação inteligente que nunca para"
        features={recursosAutomacao.map(r => ({...r, icon: ''}))}
        variant="cards"
        columns={3}
      />

      {/* Exemplos de Automação */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-lg text-orange-500 font-medium mb-4">Casos Reais</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Automações que <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Transformam Negócios</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Veja exemplos reais de como a automação elimina trabalho manual
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            {exemplosAutomacao.map((exemplo, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {exemplo.processo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {exemplo.descricao}
                    </p>
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{exemplo.economia}</span>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="flex flex-col space-y-4">
                      {exemplo.passos.map((passo, passoIndex) => (
                        <div key={passoIndex} className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                              {passoIndex + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-300">{passo}</p>
                          </div>
                          {passoIndex < exemplo.passos.length - 1 && (
                            <div className="w-4 h-0.5 bg-orange-300 dark:bg-orange-600"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard de Automação */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Centro de Controle <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Inteligente</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Monitore e controle todas as automações em tempo real
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { metric: 'Workflows Ativos', value: '24', trend: '+3', icon: Workflow, status: 'success' },
                  { metric: 'Execuções Hoje', value: '1,247', trend: '+15%', icon: Zap, status: 'success' },
                  { metric: 'Taxa de Sucesso', value: '99.8%', trend: '+0.2%', icon: CheckCircle, status: 'success' },
                  { metric: 'Tempo Economizado', value: '180h', trend: '+25h', icon: Timer, status: 'info' }
                ].map((item, index) => {
                  const IconComponent = item.icon
                  const statusColors = {
                    success: 'bg-green-100 dark:bg-green-500/20 text-green-500',
                    info: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500',
                    warning: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-500'
                  }
                  
                  return (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm">
                      <div className={`w-12 h-12 rounded-lg ${statusColors[item.status as keyof typeof statusColors]} flex items-center justify-center mx-auto mb-3`}>
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

              {/* Status das Automações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/20 dark:bg-slate-700/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Workflows Mais Ativos
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Email Marketing Automático', execucoes: '345', status: 'success' },
                      { name: 'Onboarding Clientes', execucoes: '128', status: 'success' },
                      { name: 'Cobrança Inteligente', execucoes: '67', status: 'success' },
                      { name: 'Suporte Preditivo', execucoes: '234', status: 'success' }
                    ].map((workflow, index) => (
                      <div key={index} className="flex items-center justify-between p-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${workflow.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{workflow.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {workflow.execucoes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/20 dark:bg-slate-700/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Economia de Tempo - Última Semana
                  </h3>
                  <div className="h-32 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 dark:from-orange-800 dark:via-orange-700 dark:to-orange-600 rounded-lg flex items-end justify-between p-4">
                    {[20, 35, 45, 60, 55, 70, 80].map((height, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-800 rounded-sm shadow-sm relative group cursor-pointer"
                        style={{
                          height: `${height}%`,
                          width: '12%'
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                          {height}h
                        </div>
                      </div>
                    ))}
                  </div>
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
              Impacto <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Transformador</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Resultados que mudam completamente a forma como você trabalha
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosAutomacao.map((beneficio, index) => {
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
        title="Automação que Realmente Funciona"
        subtitle="Transformação comprovada em operações reais"
        testimonials={depoimentosAutomacao}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Trabalhar Menos e Produzir Mais?"
        description="Elimine 80% do trabalho manual com automação inteligente. Sua equipe merece focar no que realmente importa enquanto a IA cuida do operacional."
        variant="gradient"
        buttons={[
          {
            text: 'Automatizar Processos',
            href: '/cadastro?produto=automacao',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Workflows',
            href: '/demo?solucao=automacao',
            variant: 'outline',
            icon: 'external'
          }
        ]}
        stats={[
          { value: '80%', label: 'Menos Trabalho Manual' },
          { value: '99.9%', label: 'Precisão' },
          { value: '24/7', label: 'Operação Contínua' },
          { value: '300%', label: 'Mais Produtividade' }
        ]}
        badge="Inteligência Artificial"
      />

      <Footer />
    </div>
  )
}

export default AutomacaoPage
