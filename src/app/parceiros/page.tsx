import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import CTASection from '@/components/shared/CTASection'
import { 
  Users, 
  Award, 
  Building, 
  TrendingUp, 
  Target,
  Heart,
  Lightbulb,
  Globe,
  Rocket,
  Star,
  Trophy,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Briefcase,
  Network
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Parceiros | Viva o Sim - Ecossistema de Parcerias Estratégicas',
  description: 'Conheça nossos parceiros estratégicos: integrações tecnológicas, canais de vendas, fornecedores e aliados que potencializam nosso crescimento.',
  keywords: 'parceiros viva o sim, integrações, canais vendas, fornecedores, parcerias estratégicas, ecossistema tecnológico',
  openGraph: {
    title: 'Parceiros - Ecossistema de Colaboração e Crescimento',
    description: 'Parcerias que amplificam valor e aceleram inovação.',
    images: ['/og-parceiros.jpg'],
  }
}

const ParceirosPage = () => {
  const tiposParceria = [
    {
      tipo: 'Integrações Tecnológicas',
      descricao: 'Parcerias com plataformas complementares para oferecer soluções integradas aos clientes.',
      icone: Network,
      beneficios: ['APIs compartilhadas', 'Marketplace conjunto', 'Co-desenvolvimento', 'Suporte técnico'],
      exemplos: ['Zoom', 'Stripe', 'Mailchimp', 'Google Workspace']
    },
    {
      tipo: 'Canais de Vendas',
      descricao: 'Revendedores e distribuidores autorizados que expandem nosso alcance de mercado.',
      icone: TrendingUp,
      beneficios: ['Comissões atrativas', 'Treinamento completo', 'Material de vendas', 'Suporte dedicado'],
      exemplos: ['Agências de Marketing', 'Consultorias', 'Revendas TI', 'Freelancers']
    },
    {
      tipo: 'Fornecedores Estratégicos',
      descricao: 'Fornecedores de tecnologia, infraestrutura e serviços que sustentam nossa operação.',
      icone: Building,
      beneficios: ['Contratos preferenciais', 'SLA garantido', 'Inovação conjunta', 'Crescimento mútuo'],
      exemplos: ['AWS', 'Google Cloud', 'Microsoft', 'Twilio']
    },
    {
      tipo: 'Parceiros de Negócios',
      descricao: 'Empresas complementares que criam soluções conjuntas e expandem nosso portfólio.',
      icone: Users,
      beneficios: ['Go-to-market conjunto', 'Cross-selling', 'Recursos compartilhados', 'Inovação colaborativa'],
      exemplos: ['Eventbrite', 'Sympla', 'Adobe', 'Salesforce']
    }
  ]

  const parceirosDestaque = [
    {
      nome: 'Google Cloud',
      tipo: 'Tecnologia',
      relacao: 'Partner Premier',
      descricao: 'Infraestrutura cloud, IA e machine learning para nossa plataforma.',
      logo: 'google-cloud',
      beneficios: ['Escalabilidade global', 'IA avançada', 'Segurança enterprise', 'Suporte 24/7'],
      desde: '2021'
    },
    {
      nome: 'Stripe',
      tipo: 'Pagamentos',
      relacao: 'Integration Partner',
      descricao: 'Processamento de pagamentos seguro e eficiente para eventos.',
      logo: 'stripe',
      beneficios: ['Pagamentos globais', 'Baixas taxas', 'APIs flexíveis', 'Compliance total'],
      desde: '2019'
    },
    {
      nome: 'Zoom',
      tipo: 'Comunicação',
      relacao: 'ISV Partner',
      descricao: 'Integração nativa para eventos híbridos e virtuais.',
      logo: 'zoom',
      beneficios: ['Eventos ilimitados', 'Recursos avançados', 'Gravação cloud', 'Analytics integrado'],
      desde: '2020'
    },
    {
      nome: 'Salesforce',
      tipo: 'CRM',
      relacao: 'AppExchange Partner',
      descricao: 'Sincronização bidirecional com o CRM mais usado do mundo.',
      logo: 'salesforce',
      beneficios: ['Sync automático', 'Leads qualificados', 'Pipeline unificado', 'Relatórios conjuntos'],
      desde: '2022'
    }
  ]

  const programaParceiros = [
    {
      nivel: 'Bronze Partner',
      investimento: 'Gratuito',
      comissao: '15%',
      beneficios: [
        'Acesso ao portal de parceiros',
        'Materiais de marketing básicos',
        'Suporte via email',
        'Treinamento online'
      ],
      requisitos: [
        'Cadastro aprovado',
        'Pelo menos 1 venda/mês',
        'Conhecimento básico do produto'
      ]
    },
    {
      nivel: 'Silver Partner',
      investimento: 'R$ 2.500/mês',
      comissao: '25%',
      beneficios: [
        'Tudo do Bronze +',
        'Account manager dedicado',
        'Leads exclusivos',
        'Co-marketing aprovado',
        'Descontos especiais'
      ],
      requisitos: [
        '6+ meses como Bronze',
        'R$ 50K+ em vendas',
        'Certificação avançada',
        'Case de sucesso'
      ]
    },
    {
      nivel: 'Gold Partner',
      investimento: 'R$ 5.000/mês',
      comissao: '35%',
      beneficios: [
        'Tudo do Silver +',
        'Território exclusivo',
        'Desenvolvimento conjunto',
        'Eventos premium',
        'Roadmap antecipado'
      ],
      requisitos: [
        '12+ meses como Silver',
        'R$ 200K+ em vendas',
        'Equipe dedicada',
        'Múltiplos cases'
      ]
    }
  ]

  const beneficiosParceiro = [
    {
      titulo: 'Comissões Atrativas',
      descricao: 'Até 35% de comissão recorrente sobre vendas realizadas através da parceria.',
      icone: DollarSign
    },
    {
      titulo: 'Suporte Dedicado',
      descricao: 'Account managers especializados e suporte técnico prioritário para parceiros.',
      icone: Users
    },
    {
      titulo: 'Materiais Exclusivos',
      descricao: 'Kit completo de vendas, apresentações, cases e materiais de marketing personalizados.',
      icone: Briefcase
    },
    {
      titulo: 'Treinamento Completo',
      descricao: 'Certificações, workshops e treinamentos contínuos sobre produtos e mercado.',
      icone: Trophy
    },
    {
      titulo: 'Co-Marketing',
      descricao: 'Campanhas conjuntas, eventos e ações de marketing para amplificar resultados.',
      icone: Rocket
    },
    {
      titulo: 'Inovação Conjunta',
      descricao: 'Participação no roadmap de produto e desenvolvimento de soluções customizadas.',
      icone: Lightbulb
    }
  ]

  const processoAdesao = [
    {
      etapa: 'Candidatura',
      descricao: 'Preencha o formulário de candidatura com informações sobre sua empresa.',
      tempo: '1 dia',
      icone: Briefcase
    },
    {
      etapa: 'Avaliação',
      descricao: 'Nossa equipe analisa o fit estratégico e potencial da parceria.',
      tempo: '3-5 dias',
      icone: Target
    },
    {
      etapa: 'Apresentação',
      descricao: 'Reunião para apresentar oportunidades e alinhar expectativas mútuas.',
      tempo: '1 semana',
      icone: Users
    },
    {
      etapa: 'Negociação',
      descricao: 'Definição de termos, condições e estrutura da parceria.',
      tempo: '1-2 semanas',
      icone: Users
    },
    {
      etapa: 'Onboarding',
      descricao: 'Treinamento, configuração de sistemas e início das atividades.',
      tempo: '2-3 semanas',
      icone: Rocket
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Ecossistema de Parcerias"
        description="Construímos um ecossistema robusto de parceiros estratégicos que amplificam nosso valor e aceleram a inovação. Junte-se a empresas líderes que confiam no Viva o Sim."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Empresa', href: '/sobre' },
          { label: 'Parceiros' }
        ]}
        badge={{
          text: '200+ Parceiros',
          variant: 'success'
        }}
        size="large"
      />

      {/* Tipos de Parceria */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Tipos de <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Parceria</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Múltiplas formas de colaboração para crescimento mútuo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiposParceria.map((tipo, index) => {
              const IconeComponent = tipo.icone
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                      <IconeComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-4">
                      {tipo.tipo}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {tipo.descricao}
                  </p>

                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Benefícios:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {tipo.beneficios.map((beneficio, beneficioIndex) => (
                        <div key={beneficioIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{beneficio}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Exemplos:</div>
                    <div className="flex flex-wrap gap-2">
                      {tipo.exemplos.map((exemplo, exemploIndex) => (
                        <span
                          key={exemploIndex}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium"
                        >
                          {exemplo}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Parceiros Destaque */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Parceiros <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Estratégicos</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Empresas líderes que confiam e colaboram conosco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {parceirosDestaque.map((parceiro, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    {/* Logo placeholder */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {parceiro.nome.split(' ')[0].substring(0, 2)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{parceiro.nome}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{parceiro.tipo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-500">{parceiro.relacao}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Desde {parceiro.desde}</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {parceiro.descricao}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {parceiro.beneficios.map((beneficio, beneficioIndex) => (
                    <div key={beneficioIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programa de Parceiros */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Programa de <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Parceiros</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Três níveis de parceria com benefícios crescentes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programaParceiros.map((nivel, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border hover:scale-105 transition-all duration-300 ${
                  index === 1 
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 relative' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-gray-200 dark:border-slate-700'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {nivel.nivel}
                  </h3>
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {nivel.investimento}
                  </div>
                  <div className="text-lg text-green-600 dark:text-green-400 font-semibold">
                    {nivel.comissao} comissão
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Benefícios:</h4>
                    <div className="space-y-2">
                      {nivel.beneficios.map((beneficio, beneficioIndex) => (
                        <div key={beneficioIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{beneficio}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requisitos:</h4>
                    <div className="space-y-2">
                      {nivel.requisitos.map((requisito, requisitoIndex) => (
                        <div key={requisitoIndex} className="flex items-center space-x-3">
                          <Target className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{requisito}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className={`w-full mt-8 font-medium py-3 px-6 rounded-lg transition-colors ${
                  index === 1 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white'
                }`}>
                  Candidatar-se
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios de ser Parceiro */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Benefícios de ser <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Parceiro</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Vantagens exclusivas para parceiros certificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficiosParceiro.map((beneficio, index) => {
              const IconeComponent = beneficio.icone
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <IconeComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {beneficio.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {beneficio.descricao}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Processo de Adesão */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Como se Tornar <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Parceiro</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Processo simples e transparente para iniciar nossa parceria
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Linha conectora */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 to-orange-500 transform -translate-y-1/2"></div>
              
              <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
                {processoAdesao.map((etapa, index) => {
                  const IconeComponent = etapa.icone
                  return (
                    <div key={index} className="flex flex-col items-center text-center relative">
                      <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg mb-4 relative z-10">
                        <IconeComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 max-w-xs">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {etapa.etapa}
                        </h3>
                        <div className="text-sm text-orange-500 font-medium mb-3">
                          {etapa.tempo}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {etapa.descricao}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Pronto para uma Parceria de Sucesso?"
        description="Junte-se a mais de 200 parceiros que já escolheram crescer conosco. Oportunidades exclusivas, suporte dedicado e crescimento acelerado esperam por você."
        variant="gradient"
        buttons={[
          {
            text: 'Tornar-se Parceiro',
            href: '/parceiros/candidatura',
            variant: 'primary',
            icon: 'users'
          },
          {
            text: 'Falar com Especialista',
            href: 'mailto:parceiros@vivaosim.com',
            variant: 'outline',
            icon: 'phone'
          }
        ]}
        stats={[
          { value: '200+', label: 'Parceiros Ativos' },
          { value: '35%', label: 'Comissão Máxima' },
          { value: '24/7', label: 'Suporte Dedicado' },
          { value: '90%', label: 'Satisfação Parceiros' }
        ]}
        badge="Ecossistema de Parceiros"
      />

      <Footer />
    </div>
  )
}

export default ParceirosPage
