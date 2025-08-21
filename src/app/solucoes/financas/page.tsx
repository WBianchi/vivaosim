import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  DollarSign, 
  Receipt,
  FileText,
  BarChart3,
  Wallet,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  Calendar,
  Users,
  Building,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gestão Financeira | Viva o Sim - Controle Total das Finanças do Evento',
  description: 'Gerencie orçamentos, controle custos, monitore receitas e gere relatórios financeiros completos para eventos lucrativos e sustentáveis.',
  keywords: 'gestão financeira eventos, controle orçamento, análise custos, receitas eventos, relatórios financeiros, lucro eventos',
  openGraph: {
    title: 'Gestão Financeira - Eventos Lucrativos e Sustentáveis',
    description: 'Controle financeiro completo para maximizar lucros e eliminar surpresas.',
    images: ['/og-financas.jpg'],
  }
}

const FinancasPage = () => {
  const recursosFinancas = [
    {
      title: 'Orçamento Inteligente',
      description: 'Crie orçamentos detalhados com categorias automáticas, previsões de custos e comparação com eventos similares.',
      icon: Calculator,
      benefits: [
        'Orçamentos automáticos',
        'Categorização inteligente',
        'Previsões baseadas em IA',
        'Comparação histórica'
      ],
      link: {
        text: 'Criar orçamento',
        href: '/orcamento-inteligente'
      }
    },
    {
      title: 'Controle de Custos',
      description: 'Monitore gastos em tempo real, defina limites por categoria e receba alertas antes dos custos saírem do controle.',
      icon: Wallet,
      benefits: [
        'Monitoramento em tempo real',
        'Limites por categoria',
        'Alertas automáticos',
        'Aprovações de gastos'
      ],
      link: {
        text: 'Controlar custos',
        href: '/controle-custos'
      }
    },
    {
      title: 'Gestão de Receitas',
      description: 'Acompanhe vendas de ingressos, patrocínios, stands e outras receitas. Previsões de arrecadação em tempo real.',
      icon: TrendingUp,
      benefits: [
        'Dashboard de vendas',
        'Previsão de receitas',
        'Múltiplas fontes',
        'Análise de performance'
      ],
      link: {
        text: 'Gerenciar receitas',
        href: '/gestao-receitas'
      }
    },
    {
      title: 'Fluxo de Caixa',
      description: 'Visualize entradas e saídas futuras, antecipe necessidades de capital e mantenha o fluxo sempre positivo.',
      icon: BarChart3,
      benefits: [
        'Projeção 12 meses',
        'Cenários otimista/pessimista',
        'Alertas de caixa baixo',
        'Planejamento de investimentos'
      ],
      link: {
        text: 'Projetar fluxo',
        href: '/fluxo-caixa'
      }
    },
    {
      title: 'Relatórios Financeiros',
      description: 'Relatórios automáticos de DRE, margem de lucro, ROI por evento e análises comparativas detalhadas.',
      icon: FileText,
      benefits: [
        'DRE automática',
        'Análise de margem',
        'ROI por evento',
        'Benchmarking interno'
      ],
      link: {
        text: 'Gerar relatórios',
        href: '/relatorios-financeiros'
      }
    },
    {
      title: 'Centro Financeiro',
      description: 'Dashboard executivo com KPIs financeiros, alertas inteligentes e insights acionáveis para tomada de decisão.',
      icon: PieChart,
      benefits: [
        'KPIs em tempo real',
        'Insights automáticos',
        'Alertas inteligentes',
        'Visão executiva'
      ],
      link: {
        text: 'Acessar centro',
        href: '/centro-financeiro'
      }
    }
  ]

  const beneficiosFinancas = [
    {
      title: '35% Mais Lucro',
      description: 'Controle rigoroso de custos e otimização de receitas aumentam significativamente a margem de lucro.',
      icon: TrendingUp
    },
    {
      title: '90% Menos Surpresas',
      description: 'Monitoramento em tempo real e alertas inteligentes eliminam surpresas financeiras desagradáveis.',
      icon: Shield
    },
    {
      title: '50% Menos Tempo',
      description: 'Automação de relatórios e cálculos reduz drasticamente o tempo gasto em controle financeiro.',
      icon: Clock
    },
    {
      title: '100% Transparência',
      description: 'Dashboards claros e relatórios detalhados oferecem visibilidade completa da saúde financeira.',
      icon: CheckCircle
    }
  ]

  const kpisFinanceiros = [
    {
      categoria: 'Receitas',
      metricas: [
        { nome: 'Receita Total', valor: 'R$ 2.8M', variacao: '+18%', status: 'success' },
        { nome: 'Ticket Médio', valor: 'R$ 850', variacao: '+12%', status: 'success' },
        { nome: 'Taxa Conversão', valor: '24.5%', variacao: '+3.2%', status: 'success' }
      ]
    },
    {
      categoria: 'Custos',
      metricas: [
        { nome: 'Custo Total', valor: 'R$ 1.9M', variacao: '+8%', status: 'warning' },
        { nome: 'Custo por Participante', valor: 'R$ 580', variacao: '-5%', status: 'success' },
        { nome: 'Margem Operacional', valor: '32.1%', variacao: '+4.1%', status: 'success' }
      ]
    },
    {
      categoria: 'Lucratividade',
      metricas: [
        { nome: 'Lucro Líquido', valor: 'R$ 900K', variacao: '+28%', status: 'success' },
        { nome: 'ROI Médio', valor: '47.3%', variacao: '+9.2%', status: 'success' },
        { nome: 'Payback Médio', valor: '4.2 meses', variacao: '-0.8m', status: 'success' }
      ]
    }
  ]

  const depoimentosFinancas = [
    {
      id: '1',
      name: 'Carlos Mendes',
      role: 'CFO',
      company: 'Eventos Premium',
      content: 'A gestão financeira revolucionou nossa operação. Aumentamos o lucro em 40% no primeiro ano e eliminamos completamente as surpresas orçamentárias.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Juliana Santos',
      role: 'Controladora',
      company: 'MegaEventos',
      content: 'O controle de custos em tempo real nos permite tomar decisões rápidas. Nunca mais estouramos orçamento.',
      rating: 5
    },
    {
      id: '3',
      name: 'Ricardo Alves',
      role: 'Diretor Financeiro',
      company: 'Produtora Elite',
      content: 'Os relatórios automáticos economizam 15 horas por semana. Agora focamos em análise estratégica ao invés de planilhas.',
      rating: 5
    },
    {
      id: '4',
      name: 'Amanda Costa',
      role: 'Sócia-Diretora',
      company: 'Prime Eventos',
      content: 'A transparência financeira nos permite mostrar ROI real para clientes. Isso virou nosso diferencial competitivo.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Gestão Financeira Inteligente"
        description="Maximize lucros, controle custos e elimine surpresas. Sistema completo de gestão financeira para eventos lucrativos e sustentáveis."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Finanças' }
        ]}
        badge={{
          text: '35% Mais Lucro',
          variant: 'success'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Ferramentas para Saúde Financeira"
        subtitle="Controle total sobre receitas, custos e lucratividade"
        features={recursosFinancas}
        variant="cards"
        columns={3}
      />

      {/* Dashboard Financeiro */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Dashboard <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Financeiro</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Métricas essenciais para decisões financeiras inteligentes
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
              {/* KPIs Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { titulo: 'Receita Mensal', valor: 'R$ 2.8M', variacao: '+18%', icone: DollarSign, cor: 'green' },
                  { titulo: 'Margem Lucro', valor: '32.1%', variacao: '+4.1%', icone: TrendingUp, cor: 'blue' },
                  { titulo: 'Custos Totais', valor: 'R$ 1.9M', variacao: '+8%', icone: Receipt, cor: 'orange' },
                  { titulo: 'ROI Médio', valor: '47.3%', variacao: '+9.2%', icone: Target, cor: 'purple' }
                ].map((kpi, index) => {
                  const IconeComponent = kpi.icone
                  const corClasses = {
                    green: 'bg-green-100 dark:bg-green-500/20 text-green-500',
                    blue: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500',
                    orange: 'bg-orange-100 dark:bg-orange-500/20 text-orange-500',
                    purple: 'bg-purple-100 dark:bg-purple-500/20 text-purple-500'
                  }
                  
                  return (
                    <div key={index} className="text-center p-4 rounded-xl bg-white/30 dark:bg-slate-700/30 backdrop-blur-sm">
                      <div className={`w-12 h-12 rounded-lg ${corClasses[kpi.cor as keyof typeof corClasses]} flex items-center justify-center mx-auto mb-3`}>
                        <IconeComponent className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {kpi.valor}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {kpi.titulo}
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">{kpi.variacao}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Métricas Detalhadas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {kpisFinanceiros.map((categoria, index) => (
                  <div key={index} className="bg-white/20 dark:bg-slate-700/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      {categoria.categoria === 'Receitas' && <DollarSign className="w-5 h-5 mr-2 text-green-500" />}
                      {categoria.categoria === 'Custos' && <Receipt className="w-5 h-5 mr-2 text-orange-500" />}
                      {categoria.categoria === 'Lucratividade' && <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />}
                      {categoria.categoria}
                    </h3>
                    <div className="space-y-4">
                      {categoria.metricas.map((metrica, metricaIndex) => (
                        <div key={metricaIndex} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{metrica.nome}</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">{metrica.valor}</div>
                          </div>
                          <div className={`flex items-center space-x-1 ${
                            metrica.status === 'success' ? 'text-green-500' : 
                            metrica.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {metrica.variacao.startsWith('+') ? 
                              <ArrowUpRight className="w-4 h-4" /> : 
                              <ArrowDownRight className="w-4 h-4" />
                            }
                            <span className="text-sm font-medium">{metrica.variacao}</span>
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

      {/* Fluxo de Caixa Visual */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Fluxo de Caixa <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Projetado</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Antecipe necessidades e mantenha o caixa sempre saudável
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">R$ 3.2M</div>
                  <div className="text-gray-600 dark:text-gray-300">Entrada Prevista</div>
                  <div className="text-sm text-green-500 mt-1">+22% vs. último mês</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">R$ 2.1M</div>
                  <div className="text-gray-600 dark:text-gray-300">Saída Projetada</div>
                  <div className="text-sm text-orange-500 mt-1">+8% vs. último mês</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">R$ 1.1M</div>
                  <div className="text-gray-600 dark:text-gray-300">Saldo Líquido</div>
                  <div className="text-sm text-blue-500 mt-1">+52% vs. último mês</div>
                </div>
              </div>

              {/* Gráfico de Fluxo Simulado */}
              <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Projeção Próximos 6 Meses
                </h3>
                <div className="h-40 bg-gradient-to-r from-green-200 via-blue-300 to-green-400 dark:from-green-800 dark:via-blue-700 dark:to-green-600 rounded-lg flex items-end justify-between p-4">
                  {[85, 92, 78, 95, 88, 100].map((altura, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className="bg-white dark:bg-slate-800 rounded-sm shadow-sm min-w-8"
                        style={{
                          height: `${altura}%`,
                          width: '12%'
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Resultados <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Financeiros</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Impacto real na saúde financeira dos seus eventos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosFinancas.map((beneficio, index) => {
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
        title="Finanças que Geram Mais Lucro"
        subtitle="Veja como empresas multiplicaram seus resultados financeiros"
        testimonials={depoimentosFinancas}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Eventos Mais Lucrativos?"
        description="Maximize lucros, controle custos e elimine surpresas financeiras. Sua empresa merece gestão financeira inteligente que multiplica resultados."
        variant="gradient"
        buttons={[
          {
            text: 'Otimizar Finanças',
            href: '/cadastro?produto=financas',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Dashboard',
            href: '/demo?solucao=financas',
            variant: 'outline',
            icon: 'external'
          }
        ]}
        stats={[
          { value: '35%', label: 'Mais Lucro' },
          { value: '90%', label: 'Menos Surpresas' },
          { value: '50%', label: 'Menos Tempo' },
          { value: '100%', label: 'Transparência' }
        ]}
        badge="Inteligência Financeira"
      />

      <Footer />
    </div>
  )
}

export default FinancasPage
