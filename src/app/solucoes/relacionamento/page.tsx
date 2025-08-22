import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'

export const metadata: Metadata = {
  title: 'CRM de Relacionamento | Viva o Sim - Fidelize Clientes e Gere Mais Indicações',
  description: 'Construa relacionamentos duradouros com seus clientes através de comunicação personalizada, follow-up automático e experiência excepcional.',
  keywords: 'CRM relacionamento, fidelização clientes, experiência cliente, follow-up automático, satisfação cliente eventos',
  openGraph: {
    title: 'CRM de Relacionamento - Clientes Apaixonados pelo seu Trabalho',
    description: 'Transforme clientes ocasionais em fãs fiéis que indicam seu trabalho.',
    images: ['/og-relacionamento.jpg'],
  }
}

const RelacionamentoPage = () => {
  const recursosRelacionamento = [
    {
      title: 'Histórico Completo do Cliente',
      description: 'Tenha toda a jornada do cliente em suas mãos. Preferências, eventos realizados, feedback e muito mais.',
      icon: 'users',
      benefits: [
        'Perfil completo do cliente',
        'Histórico de eventos',
        'Preferências registradas',
        'Timeline de interações'
      ],
      link: {
        text: 'Ver perfil cliente',
        href: '/perfil-cliente'
      }
    },
    {
      title: 'Comunicação Personalizada',
      description: 'Envie mensagens no tom certo, no momento perfeito. Templates inteligentes que se adaptam ao perfil de cada cliente.',
      icon: 'message-circle',
      benefits: [
        'Templates personalizáveis',
        'Segmentação avançada',
        'Multi-canal integrado',
        'Mensagens contextuais'
      ],
      link: {
        text: 'Personalizar mensagens',
        href: '/comunicacao-personalizada'
      }
    },
    {
      title: 'Follow-up Inteligente',
      description: 'Nunca perca o contato. Sistema acompanha automaticamente cada cliente e sugere próximas ações.',
      icon: 'bell',
      benefits: [
        'Lembretes automáticos',
        'Sugestões de ações',
        'Cronograma personalizado',
        'Alertas importantes'
      ],
      link: {
        text: 'Configurar follow-up',
        href: '/follow-up-automatico'
      }
    },
    {
      title: 'Gestão de Satisfação',
      description: 'Monitore a satisfação em tempo real. Pesquisas automáticas e indicadores de felicidade do cliente.',
      icon: 'smile',
      benefits: [
        'NPS automático',
        'Pesquisas personalizadas',
        'Alerts de insatisfação',
        'Dashboard de satisfação'
      ],
      link: {
        text: 'Medir satisfação',
        href: '/satisfacao-cliente'
      }
    },
    {
      title: 'Programa de Fidelidade',
      description: 'Recompense clientes fiéis com benefícios exclusivos. Crie um programa que incentiva repetição e indicações.',
      icon: 'gift',
      benefits: [
        'Sistema de pontos',
        'Recompensas automáticas',
        'Níveis de fidelidade',
        'Benefícios exclusivos'
      ],
      link: {
        text: 'Criar programa',
        href: '/programa-fidelidade'
      }
    },
    {
      title: 'Central de Indicações',
      description: 'Transforme clientes satisfeitos em embaixadores da marca. Gerencie e recompense indicações automaticamente.',
      icon: 'target',
      benefits: [
        'Tracking de indicações',
        'Recompensas automáticas',
        'Links personalizados',
        'Dashboard de performance'
      ],
      link: {
        text: 'Gerenciar indicações',
        href: '/central-indicacoes'
      }
    }
  ]

  const beneficiosRelacionamento = [
    {
      title: 'Aumento de 250% em Indicações',
      description: 'Clientes satisfeitos indicam naturalmente. Nosso sistema facilita e recompensa esse processo.',
      icon: 'trophy'
    },
    {
      title: 'Retenção de 90% dos Clientes',
      description: 'Follow-up consistente e experiência excepcional mantém clientes sempre próximos.',
      icon: 'heart'
    },
    {
      title: 'NPS Médio de 9.2',
      description: 'Sistema de satisfação garante que problemas sejam resolvidos antes de se tornarem críticos.',
      icon: 'star'
    },
    {
      title: 'Economia de 4h por Dia',
      description: 'Automações inteligentes liberam tempo para você focar no que realmente importa.',
      icon: 'clock'
    }
  ]

  const casosDeUso = [
    {
      title: 'Pós-Evento Automatizado',
      description: 'Sistema envia automaticamente pesquisa de satisfação, agradecimento e convite para próximos eventos.',
      icon: 'check-circle',
      etapas: [
        'Evento finalizado',
        'Pesquisa de satisfação enviada',
        'Agradecimento personalizado',
        'Convite para novos eventos'
      ]
    },
    {
      title: 'Aniversário de Casamento',
      description: 'Lembre automaticamente dos aniversários de casamento dos seus clientes com mensagens especiais.',
      icon: 'calendar',
      etapas: [
        'Data registrada no sistema',
        'Lembrete criado automaticamente',
        'Mensagem enviada na data',
        'Oportunidade de novo evento'
      ]
    },
    {
      title: 'Cliente Inativo',
      description: 'Identifique clientes que não fazem eventos há muito tempo e reative o relacionamento.',
      icon: 'zap',
      etapas: [
        'Sistema identifica inatividade',
        'Campanha de reativação',
        'Oferta especial enviada',
        'Cliente reengajado'
      ]
    }
  ]

  const depoimentosRelacionamento = [
    {
      id: '1',
      name: 'Luciana Oliveira',
      role: 'Wedding Planner',
      company: 'Sonhos Realizados',
      content: 'Depois do Viva o Sim, meus clientes se tornaram meus maiores defensores. 80% dos meus novos contratos vêm de indicações. O sistema de follow-up é simplesmente perfeito!',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Ricardo Fernandes',
      role: 'Proprietário',
      company: 'Espaço Felicidade',
      content: 'O programa de fidelidade aumentou nossa retenção em 300%. Clientes adoram os benefícios e sempre voltam.',
      rating: 5
    },
    {
      id: '3',
      name: 'Daniela Costa',
      role: 'Gestora',
      company: 'Buffet Premium',
      content: 'Nunca mais esqueci um aniversário ou data importante. Os clientes ficam impressionados com o cuidado.',
      rating: 5
    },
    {
      id: '4',
      name: 'Fernando Silva',
      role: 'Diretor',
      company: 'Eventos Especiais',
      content: 'Nossa satisfação do cliente subiu para 98%. O sistema nos ajuda a resolver problemas antes que virem reclamações.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="CRM de Relacionamento"
        description="Construa relacionamentos duradouros que geram negócios recorrentes. Transforme clientes ocasionais em fãs fiéis que indicam seu trabalho naturalmente."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Relacionamento' }
        ]}
        badge={{
          text: 'Fidelização Garantida',
          variant: 'success'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Recursos que Fortalecem Relacionamentos"
        subtitle="Tudo para criar conexões duradouras"
        features={recursosRelacionamento}
        variant="cards"
        columns={3}
      />

      {/* Casos de Uso */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-lg text-orange-500 font-medium mb-4">Automações Inteligentes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Como o Sistema <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Trabalha por Você</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Automações inteligentes que cuidam dos seus clientes 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {casosDeUso.map((caso, index) => {
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-6">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {caso.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {caso.description}
                  </p>

                  <div className="space-y-3">
                    {caso.etapas.map((etapa, etapaIndex) => (
                      <div key={etapaIndex} className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                          {etapaIndex + 1}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{etapa}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Resultados que <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Impressionam</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              O que nossos clientes alcançam com o CRM de Relacionamento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosRelacionamento.map((beneficio, index) => {
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
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

      {/* Jornada do Cliente */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Jornada do <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Cliente Perfeita</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Do primeiro contato ao cliente fidelizado
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  fase: 'Primeiro Contato',
                  descrição: 'Sistema registra preferências e cria perfil completo automaticamente.',
                  icon: 'users',
                  cor: 'from-blue-500 to-blue-600'
                },
                {
                  fase: 'Durante o Evento',
                  descrição: 'Acompanhamento em tempo real e coleta de feedback instantâneo.',
                  icon: 'sparkles',
                  cor: 'from-green-500 to-green-600'
                },
                {
                  fase: 'Pós-Evento',
                  descrição: 'Follow-up automático com pesquisa de satisfação e agradecimento.',
                  icon: 'heart',
                  cor: 'from-orange-500 to-orange-600'
                },
                {
                  fase: 'Fidelização',
                  descrição: 'Comunicação contínua, benefícios exclusivos e programa de indicações.',
                  icon: 'trophy',
                  cor: 'from-purple-500 to-purple-600'
                }
              ].map((fase, index) => {
                const IconComponent = fase.icon
                return (
                  <div key={index} className="text-center relative">
                    {/* Connector Line */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 transform translate-x-4" />
                    )}
                    
                    <div className="relative mb-6">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${fase.cor} flex items-center justify-center mx-auto shadow-lg`}>
                        <div className="w-12 h-12 text-white"><IconComponent /></div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {fase.fase}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {fase.descrição}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <TestimonialSection
        title="Clientes que se Tornaram Fãs"
        subtitle="Veja como o relacionamento transforma negócios"
        testimonials={depoimentosRelacionamento}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Fidelizar seus Clientes?"
        description="Construa relacionamentos que duram para sempre e geram negócios recorrentes. Seus clientes merecem uma experiência excepcional."
        variant="gradient"
        buttons={[
          {
            text: 'Começar Teste Grátis',
            href: '/cadastro?produto=relacionamento',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Demonstração',
            href: '/demo?solucao=relacionamento',
            variant: 'outline',
            icon: 'play'
          }
        ]}
        stats={[
          { value: '250%', label: 'Mais Indicações' },
          { value: '90%', label: 'Retenção de Clientes' },
          { value: '9.2', label: 'NPS Médio' },
          { value: '4h', label: 'Economizadas por Dia' }
        ]}
        badge="Relacionamento que Gera Resultados"
      />

      <Footer />
    </div>
  )
}

export default RelacionamentoPage
