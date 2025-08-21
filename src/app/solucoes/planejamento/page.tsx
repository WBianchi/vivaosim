import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'

export const metadata: Metadata = {
  title: 'Planejamento de Eventos | Viva o Sim - Organize Eventos Perfeitos sem Stress',
  description: 'Planeje eventos impecáveis com nossa ferramenta completa. Cronogramas automáticos, gestão de tarefas, controle de fornecedores e muito mais.',
  keywords: 'planejamento eventos, cronograma eventos, gestão tarefas, organização eventos, timeline eventos',
  openGraph: {
    title: 'Planejamento de Eventos - Do Caos à Perfeição',
    description: 'Transforme ideias em eventos perfeitos com nosso sistema de planejamento inteligente.',
    images: ['/og-planejamento.jpg'],
  }
}

const PlanejamentoPage = () => {
  const recursosPlanejamento = [
    {
      title: 'Cronograma Inteligente',
      description: 'Crie cronogramas detalhados que se ajustam automaticamente. Visualize todo o projeto em uma timeline clara e intuitiva.',
      icon: 'calendar',
      benefits: [
        'Timeline visual interativa',
        'Ajustes automáticos',
        'Marcos importantes destacados',
        'Sincronização com equipes'
      ],
      link: {
        text: 'Criar cronograma',
        href: '/cronograma-eventos'
      }
    },
    {
      title: 'Gestão de Tarefas',
      description: 'Organize todas as atividades do evento. Delegue responsabilidades, defina prazos e acompanhe o progresso em tempo real.',
      icon: 'check-square',
      benefits: [
        'Listas de tarefas personalizáveis',
        'Delegação automática',
        'Notificações de prazo',
        'Dashboard de progresso'
      ],
      link: {
        text: 'Organizar tarefas',
        href: '/gestao-tarefas'
      }
    },
    {
      title: 'Controle de Fornecedores',
      description: 'Gerencie todos os fornecedores em um só lugar. Contratos, pagamentos, entregas e comunicação centralizada.',
      icon: 'users',
      benefits: [
        'Base de fornecedores',
        'Controle de contratos',
        'Agenda de entregas',
        'Avaliação de performance'
      ],
      link: {
        text: 'Gerenciar fornecedores',
        href: '/fornecedores'
      }
    },
    {
      title: 'Layout e Espaços',
      description: 'Visualize e planeje o layout do evento. Ferramentas de design para criar plantas baixas e organizar espaços.',
      icon: 'map-pin',
      benefits: [
        'Designer de layout',
        'Templates de espaços',
        'Cálculo de capacidade',
        'Visualização 3D'
      ],
      link: {
        text: 'Projetar layout',
        href: '/layout-eventos'
      }
    },
    {
      title: 'Documentação Completa',
      description: 'Tenha todos os documentos organizados e acessíveis. Contratos, briefings, checklists e relatórios em um só lugar.',
      icon: 'file-text',
      benefits: [
        'Biblioteca de documentos',
        'Templates profissionais',
        'Controle de versões',
        'Compartilhamento seguro'
      ],
      link: {
        text: 'Organizar documentos',
        href: '/documentacao'
      }
    },
    {
      title: 'Alertas e Lembretes',
      description: 'Nunca esqueça detalhes importantes. Sistema inteligente de alertas para prazos, pagamentos e ações críticas.',
      icon: 'alert-triangle',
      benefits: [
        'Alertas personalizados',
        'Lembretes automáticos',
        'Escalation de prioridades',
        'Multi-canal de notificação'
      ],
      link: {
        text: 'Configurar alertas',
        href: '/alertas-lembretes'
      }
    }
  ]

  const beneficiosPlanejamento = [
    {
      title: 'Redução de 70% no Tempo de Planejamento',
      description: 'Automações e templates aceleram drasticamente o processo de organização de eventos.',
      icon: 'clock'
    },
    {
      title: 'Zero Imprevistos',
      description: 'Sistema de alertas e cronogramas detalhados eliminam surpresas desagradáveis.',
      icon: 'shield'
    },
    {
      title: 'Equipes 300% Mais Produtivas',
      description: 'Comunicação clara e delegação eficiente otimizam o trabalho de toda a equipe.',
      icon: 'trending-up'
    },
    {
      title: 'Eventos Sempre no Prazo',
      description: 'Cronogramas inteligentes garantem que tudo aconteça no momento certo.',
      icon: 'trophy'
    }
  ]

  const etapasPlanejamento = [
    {
      titulo: 'Briefing Inicial',
      descricao: 'Colete todas as informações do cliente e crie o documento base do evento.',
      icone: 'file-text',
      detalhes: [
        'Questionário inteligente',
        'Coleta de referências',
        'Definição de objetivos',
        'Orçamento preliminar'
      ]
    },
    {
      titulo: 'Cronograma Master',
      descricao: 'Desenvolva a timeline completa com todas as etapas e marcos do projeto.',
      icone: 'calendar',
      detalhes: [
        'Timeline visual',
        'Marcos importantes',
        'Dependências de tarefas',
        'Buffer de segurança'
      ]
    },
    {
      titulo: 'Montagem da Equipe',
      descricao: 'Selecione fornecedores, distribua responsabilidades e crie canais de comunicação.',
      icone: 'users',
      detalhes: [
        'Seleção de fornecedores',
        'Definição de papéis',
        'Canais de comunicação',
        'Contratos e acordos'
      ]
    },
    {
      titulo: 'Execução Monitorada',
      descricao: 'Acompanhe o progresso em tempo real e faça ajustes quando necessário.',
      icone: 'bar-chart-3',
      detalhes: [
        'Dashboard em tempo real',
        'Alertas automáticos',
        'Relatórios de progresso',
        'Ajustes dinâmicos'
      ]
    }
  ]

  const depoimentosPlanejamento = [
    {
      id: '1',
      name: 'Patricia Mendes',
      role: 'Wedding Planner Senior',
      company: 'Momentos Únicos',
      content: 'O sistema de planejamento mudou minha vida profissional. Consegui reduzir o tempo de organização em 80% e agora posso focar no que realmente importa: criar experiências incríveis para meus clientes.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'André Carvalho',
      role: 'Produtor Executivo',
      company: 'Mega Produções',
      content: 'Com eventos corporativos de grande porte, o cronograma inteligente é essencial. Nunca mais tivemos atrasos ou imprevistos.',
      rating: 5
    },
    {
      id: '3',
      name: 'Juliana Santos',
      role: 'Diretora Criativa',
      company: 'Festas Premium',
      content: 'A gestão de fornecedores ficou muito mais simples. Tudo centralizado e com controle total dos contratos e entregas.',
      rating: 5
    },
    {
      id: '4',
      name: 'Rafael Lima',
      role: 'Coordenador',
      company: 'Eventos Corporativos SP',
      content: 'Os alertas automáticos salvam nossos eventos. Nunca mais esquecemos prazos importantes ou pagamentos.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Planejamento Inteligente"
        description="Transforme ideias em eventos perfeitos com nosso sistema completo de planejamento. Cronogramas automáticos, gestão de equipes e controle total do processo."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Soluções', href: '/solucoes' },
          { label: 'Planejamento' }
        ]}
        badge={{
          text: 'Zero Imprevistos',
          variant: 'primary'
        }}
        size="large"
      />

      {/* Recursos Principais */}
      <FeatureGrid
        title="Recursos que Simplificam o Planejamento"
        subtitle="Ferramentas profissionais para eventos perfeitos"
        features={recursosPlanejamento}
        variant="cards"
        columns={3}
      />

      {/* Processo de Planejamento */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-lg text-orange-500 font-medium mb-4">Metodologia Comprovada</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Como Planejamos <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Eventos Perfeitos</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Processo estruturado que elimina imprevistos e garante resultados excepcionais
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {etapasPlanejamento.map((etapa, index) => {
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className={`flex items-center mb-16 ${isEven ? 'flex-row' : 'flex-row-reverse'} lg:mb-24`}>
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className={`${isEven ? 'text-left' : 'text-right lg:text-left'}`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center ${isEven ? 'mr-4' : 'ml-4 lg:mr-4 lg:ml-0 order-2 lg:order-1'}`}>
                          <span className="text-orange-500 font-bold text-lg">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <h3 className={`text-2xl font-bold text-gray-900 dark:text-white ${isEven ? '' : 'order-1 lg:order-2'}`}>
                          {etapa.titulo}
                        </h3>
                      </div>
                      
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {etapa.descricao}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {etapa.detalhes.map((detalhe, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">{detalhe}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-lg"></div>
                        </div>
                      </div>
                      
                      {/* Connection line to next step */}
                      {index < etapasPlanejamento.length - 1 && (
                        <div className="hidden lg:block absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-16 bg-gradient-to-b from-orange-300 to-orange-500 mt-8"></div>
                          <div className="w-4 h-4 rounded-full bg-orange-500 transform -translate-x-1.5"></div>
                        </div>
                      )}

                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-orange-200 dark:bg-orange-800/50 animate-pulse"></div>
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-orange-300 dark:bg-orange-700/50 animate-pulse delay-1000"></div>
                    </div>
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
              Resultados que <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Transformam</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Veja o impacto real do planejamento inteligente nos seus eventos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficiosPlanejamento.map((beneficio, index) => {
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded"></div>
                    </div>
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

      {/* Checklist Interativo */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Checklist Completo <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Incluído</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Mais de 500 itens organizados por categoria e tipo de evento
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { categoria: 'Pré-Evento', itens: 89, cor: 'from-blue-500 to-blue-600' },
              { categoria: 'Durante Evento', itens: 156, cor: 'from-green-500 to-green-600' },
              { categoria: 'Pós-Evento', itens: 67, cor: 'from-purple-500 to-purple-600' },
              { categoria: 'Fornecedores', itens: 124, cor: 'from-orange-500 to-orange-600' },
              { categoria: 'Documentação', itens: 67, cor: 'from-red-500 to-red-600' },
              { categoria: 'Cronogramas', itens: 45, cor: 'from-teal-500 to-teal-600' }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.cor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center">
                    <div className="w-3 h-2 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  {item.categoria}
                </h3>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.itens}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    itens incluídos
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Personalizáveis
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <TestimonialSection
        title="Profissionais que não Vivem Mais sem"
        subtitle="Veja como o planejamento inteligente transformou carreiras"
        testimonials={depoimentosPlanejamento}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Eventos sem Imprevistos?"
        description="Elimine o stress do planejamento e foque no que você faz de melhor: criar experiências inesquecíveis para seus clientes."
        variant="gradient"
        buttons={[
          {
            text: 'Começar Planejamento',
            href: '/cadastro?produto=planejamento',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Demo Completa',
            href: '/demo?solucao=planejamento',
            variant: 'outline',
            icon: 'play'
          }
        ]}
        stats={[
          { value: '70%', label: 'Menos Tempo Planejando' },
          { value: '0', label: 'Imprevistos' },
          { value: '300%', label: 'Equipes Mais Produtivas' },
          { value: '500+', label: 'Itens no Checklist' }
        ]}
        badge="Eventos Sempre Perfeitos"
      />

      <Footer />
    </div>
  )
}

export default PlanejamentoPage
