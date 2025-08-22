import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  Eye, 
  Target,
  Brain,
  Zap,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  Heart,
  MessageSquare,
  DollarSign,
  Trophy,
  Lightbulb,
  Settings,
  Filter,
  Download
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analytics Avançado | Viva o Sim - Insights que Transformam Eventos',
  description: 'Transforme dados em decisões inteligentes. Analytics avançado com IA para otimizar eventos, prever tendências e maximizar resultados.',
  keywords: 'analytics eventos, business intelligence, relatórios inteligentes, insights IA, métricas eventos, análise preditiva',
  openGraph: {
    title: 'Analytics Avançado - Dados que Revelam o Futuro',
    description: 'Inteligência artificial que transforma dados em insights acionáveis.',
    images: ['/og-analises.jpg'],
  }
}

const AnalisesPage = () => {
  const recursosAnalises = [
    {
      title: 'Dashboard Executivo',
      description: 'Visão 360° do seu negócio com KPIs essenciais, métricas em tempo real e insights automáticos gerados por IA.',
      icon: BarChart3,
      benefits: [
        'KPIs personalizáveis',
        'Atualizações em tempo real',
        'Insights automáticos',
        'Alertas inteligentes'
      ],
      link: {
        text: 'Ver dashboard',
        href: '/dashboard-executivo'
      }
    },
    {
      title: 'Análise Preditiva',
      description: 'IA que prevê vendas, demanda, problemas e oportunidades. Antecipe tendências e tome decisões proativas.',
      icon: Brain,
      benefits: [
        'Previsões precisas',
        'Modelos de machine learning',
        'Cenários futuros',
        'Recomendações automáticas'
      ],
      link: {
        text: 'Ver previsões',
        href: '/analise-preditiva'
      }
    },
    {
      title: 'Comportamento do Cliente',
      description: 'Entenda como clientes interagem com seus eventos. Jornadas, preferências, satisfação e lifetime value.',
      icon: Users,
      benefits: [
        'Mapeamento de jornadas',
        'Segmentação automática',
        'NPS em tempo real',
        'Lifetime value'
      ],
      link: {
        text: 'Analisar comportamento',
        href: '/comportamento-cliente'
      }
    },
    {
      title: 'Performance de Eventos',
      description: 'Compare eventos, identifique padrões de sucesso e otimize baseado em dados históricos e benchmarks.',
      icon: Trophy,
      benefits: [
        'Benchmarking automático',
        'Padrões de sucesso',
        'Comparações históricas',
        'Fatores de impacto'
      ],
      link: {
        text: 'Comparar eventos',
        href: '/performance-eventos'
      }
    },
    {
      title: 'Relatórios Inteligentes',
      description: 'Relatórios que se escrevem sozinhos. IA analisa dados e gera insights narrativos automaticamente.',
      icon: Eye,
      benefits: [
        'Geração automática',
        'Narrativas inteligentes',
        'Visualizações dinâmicas',
        'Exportação múltipla'
      ],
      link: {
        text: 'Gerar relatório',
        href: '/relatorios-inteligentes'
      }
    },
    {
      title: 'Centro de Analytics',
      description: 'Hub central de todas as análises com filtros avançados, queries personalizadas e alertas configuráveis.',
      icon: Settings,
      benefits: [
        'Queries personalizadas',
        'Filtros avançados',
        'Alertas configuráveis',
        'APIs de dados'
      ],
      link: {
        text: 'Acessar centro',
        href: '/centro-analytics'
      }
    }
  ]

  const beneficiosAnalises = [
    {
      title: '300% Melhores Decisões',
      description: 'Decisões baseadas em dados reais ao invés de intuição aumentam drasticamente a taxa de sucesso.',
      icon: Lightbulb
    },
    {
      title: '45% Mais Vendas',
      description: 'Insights sobre comportamento do cliente e otimizações baseadas em dados multiplicam vendas.',
      icon: TrendingUp
    },
    {
      title: '70% Menos Riscos',
      description: 'Análises preditivas antecipam problemas e oportunidades, reduzindo significativamente os riscos.',
      icon: Target
    },
    {
      title: '90% Mais Precisão',
      description: 'Previsões baseadas em IA são muito mais precisas que estimativas humanas tradicionais.',
      icon: Activity
    }
  ]

  const metricas = [
    {
      categoria: 'Vendas & Marketing',
      dados: [
        { metrica: 'Taxa Conversão', valor: '18.7%', tendencia: '+2.3%', benchmark: '15.2%' },
        { metrica: 'CAC Médio', valor: 'R$ 145', tendencia: '-8%', benchmark: 'R$ 180' },
        { metrica: 'LTV/CAC Ratio', valor: '3.8x', tendencia: '+0.6x', benchmark: '2.9x' },
        { metrica: 'ROI Marketing', valor: '420%', tendencia: '+45%', benchmark: '285%' }
      ]
    },
    {
      categoria: 'Experiência do Cliente',
      dados: [
        { metrica: 'NPS Score', valor: '72', tendencia: '+8', benchmark: '58' },
        { metrica: 'Satisfação', valor: '4.8/5', tendencia: '+0.2', benchmark: '4.3/5' },
        { metrica: 'Taxa Retenção', valor: '89%', tendencia: '+5%', benchmark: '76%' },
        { metrica: 'Tempo Resposta', valor: '2.3min', tendencia: '-0.7min', benchmark: '4.1min' }
      ]
    },
    {
      categoria: 'Operacional',
      dados: [
        { metrica: 'Produtividade', valor: '156%', tendencia: '+23%', benchmark: '100%' },
        { metrica: 'Eficiência', valor: '94.2%', tendencia: '+3.1%', benchmark: '87.5%' },
        { metrica: 'Qualidade', valor: '98.7%', tendencia: '+1.2%', benchmark: '94.3%' },
        { metrica: 'Automatização', valor: '78%', tendencia: '+12%', benchmark: '45%' }
      ]
    }
  ]

  const depoimentosAnalises = [
    {
      id: '1',
      name: 'André Silva',
      role: 'CEO',
      company: 'Eventos DataDriven',
      content: 'Os insights de IA revolucionaram nossa estratégia. Aumentamos vendas em 60% seguindo as recomendações automáticas. É como ter um consultor genial 24/7.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Mariana Oliveira',
      role: 'Diretora de Marketing',
      company: 'Premium Events',
      content: 'A análise preditiva nos permite antecipar demanda e otimizar campanhas. Nunca mais desperdiçamos budget.',
      rating: 5
    },
    {
      id: '3',
      name: 'Roberto Costa',
      role: 'COO',
      company: 'Smart Eventos',
      content: 'Dashboards executivos me dão visão completa do negócio. Posso tomar decisões rápidas baseadas em dados reais.',
      rating: 5
    },
    {
      id: '4',
      name: 'Fernanda Lima',
      role: 'Head de BI',
      company: 'Analytics Events',
      content: 'Relatórios que se escrevem sozinhos economizam 20 horas por semana. Agora focamos em ação estratégica.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Analytics Avançado com IA"
        description="Transforme dados em decisões inteligentes. Análises preditivas, insights automáticos e inteligência artificial que revela o futuro dos seus eventos."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Analytics' }
        ]}
        badge={{
          text: 'IA Integrada',
          variant: 'success'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Inteligência que Revela Insights"
        subtitle="IA avançada para análises que transformam negócios"
        features={recursosAnalises.map(r => ({...r, icon: ''}))}
        variant="cards"
        columns={3}
      />

      {/* Dashboard Analytics */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Centro de <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Inteligência</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Todas as métricas essenciais em um dashboard intuitivo
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { titulo: 'Eventos Ativos', valor: '24', icone: Calendar, cor: 'blue' },
                  { titulo: 'Participantes', valor: '15.2K', icone: Users, cor: 'green' },
                  { titulo: 'Receita Mensal', valor: 'R$ 2.8M', icone: DollarSign, cor: 'purple' },
                  { titulo: 'NPS Score', valor: '72', icone: Star, cor: 'yellow' }
                ].map((kpi, index) => {
                  const IconeComponent = kpi.icone
                  const corClasses = {
                    blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500',
                    green: 'bg-green-100 dark:bg-green-500/20 text-green-500',
                    purple: 'bg-purple-100 dark:bg-purple-500/20 text-purple-500',
                    yellow: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-500'
                  }
                  
                  return (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm">
                      <div className={`w-12 h-12 rounded-lg ${corClasses[kpi.cor as keyof typeof corClasses]} flex items-center justify-center mx-auto mb-3`}>
                        <IconeComponent className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {kpi.valor}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {kpi.titulo}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Métricas Detalhadas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {metricas.map((categoria, index) => (
                  <div key={index} className="bg-white/20 dark:bg-slate-700/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {categoria.categoria}
                    </h3>
                    <div className="space-y-4">
                      {categoria.dados.map((dado, dadoIndex) => (
                        <div key={dadoIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{dado.metrica}</span>
                            <span className="text-sm font-medium text-green-500">{dado.tendencia}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">{dado.valor}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">vs {dado.benchmark}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${75 + (dadoIndex * 5)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Análise Preditiva */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Análise <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Preditiva</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              IA que prevê o futuro baseado em padrões dos seus dados
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  titulo: 'Previsão de Vendas',
                  descricao: 'IA analisa padrões históricos e prevê vendas futuras com 95% de precisão.',
                  previsao: 'R$ 3.2M próximos 3 meses',
                  confianca: '95%',
                  icone: TrendingUp,
                  cor: 'green'
                },
                {
                  titulo: 'Demanda de Eventos',
                  descricao: 'Algoritmos identificam picos de demanda e oportunidades sazonais.',
                  previsao: '45% aumento em dezembro',
                  confianca: '89%',
                  icone: Calendar,
                  cor: 'blue'
                },
                {
                  titulo: 'Comportamento do Cliente',
                  descricao: 'Modelos de ML preveem quando clientes vão comprar ou cancelar.',
                  previsao: '234 clientes propensos',
                  confianca: '92%',
                  icone: Users,
                  cor: 'purple'
                },
                {
                  titulo: 'Otimização de Preços',
                  descricao: 'IA sugere preços ótimos baseado em demanda, concorrência e valor.',
                  previsao: '12% aumento de margem',
                  confianca: '87%',
                  icone: DollarSign,
                  cor: 'orange'
                }
              ].map((predicao, index) => {
                const IconeComponent = predicao.icone
                const corClasses = {
                  green: 'from-green-500 to-green-600',
                  blue: 'from-blue-500 to-blue-600',
                  purple: 'from-purple-500 to-purple-600',
                  orange: 'from-orange-500 to-orange-600'
                }
                
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${corClasses[predicao.cor as keyof typeof corClasses]} flex items-center justify-center shadow-lg`}>
                        <IconeComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {predicao.titulo}
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Confiança: {predicao.confianca}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                      {predicao.descricao}
                    </p>

                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Previsão</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {predicao.previsao}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Impacto <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Inteligente</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transformação real através de decisões baseadas em dados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosAnalises.map((beneficio, index) => {
              const IconComponent = beneficio.icon
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 group"
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
        title="Analytics que Transforma Decisões"
        subtitle="Veja como empresas multiplicaram resultados com inteligência de dados"
        testimonials={depoimentosAnalises}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Decisões Baseadas em IA?"
        description="Transforme dados em insights acionáveis com analytics avançado. Sua empresa merece inteligência artificial que revela oportunidades e antecipa o futuro."
        variant="gradient"
        buttons={[
          {
            text: 'Ativar Analytics',
            href: '/cadastro?produto=analytics',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Dashboard',
            href: '/demo?solucao=analytics',
            variant: 'outline',
            icon: 'external'
          }
        ]}
        stats={[
          { value: '300%', label: 'Melhores Decisões' },
          { value: '45%', label: 'Mais Vendas' },
          { value: '70%', label: 'Menos Riscos' },
          { value: '90%', label: 'Mais Precisão' }
        ]}
        badge="Inteligência Artificial"
      />

      <Footer />
    </div>
  )
}

export default AnalisesPage
