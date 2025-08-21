import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Calendar, 
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
  Map,
  Zap,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nossa História | Viva o Sim - Jornada de Inovação em Eventos',
  description: 'Conheça a história do Viva o Sim: desde o início como startup até se tornar líder em tecnologia para eventos. Uma jornada de inovação e crescimento.',
  keywords: 'história viva o sim, empresa eventos, tecnologia eventos, startup crescimento, inovação eventos',
  openGraph: {
    title: 'Nossa História - Jornada de Inovação e Crescimento',
    description: 'De startup a líder de mercado: a história de transformação digital dos eventos.',
    images: ['/og-historia.jpg'],
  }
}

const HistoriaPage = () => {
  const marcos = [
    {
      ano: '2018',
      titulo: 'O Começo',
      subtitulo: 'Fundação da empresa',
      descricao: 'Começamos como uma pequena startup com a missão de revolucionar a gestão de eventos através da tecnologia. Apenas 3 fundadores e uma visão ousada.',
      icone: Rocket,
      conquistas: [
        'Primeiro produto MVP',
        '5 clientes pioneiros',
        'R$ 50K de receita anual',
        'Equipe de 3 pessoas'
      ],
      cor: 'blue'
    },
    {
      ano: '2019',
      titulo: 'Primeira Expansão',
      subtitulo: 'Crescimento acelerado',
      descricao: 'Expandimos rapidamente com funcionalidades inovadoras e captamos nosso primeiro investimento. A demanda superou todas as expectativas.',
      icone: TrendingUp,
      conquistas: [
        'Seed Round de R$ 2M',
        '150+ clientes ativos',
        'R$ 800K de receita anual',
        'Equipe de 15 pessoas'
      ],
      cor: 'green'
    },
    {
      ano: '2020',
      titulo: 'Transformação Digital',
      subtitulo: 'Pandemia como catalisador',
      descricao: 'A pandemia acelerou a transformação digital. Desenvolvemos soluções para eventos híbridos e virtuais, salvando milhares de eventos.',
      icone: Globe,
      conquistas: [
        'Eventos virtuais/híbridos',
        '500+ clientes salvos',
        'R$ 3.5M de receita anual',
        'Equipe de 35 pessoas'
      ],
      cor: 'purple'
    },
    {
      ano: '2021',
      titulo: 'Inteligência Artificial',
      subtitulo: 'Inovação tecnológica',
      descricao: 'Introduzimos IA e automação em nossas soluções. Tornamo-nos a primeira plataforma com análises preditivas para eventos.',
      icone: Lightbulb,
      conquistas: [
        'IA e Machine Learning',
        '1.200+ clientes ativos',
        'R$ 12M de receita anual',
        'Equipe de 80 pessoas'
      ],
      cor: 'orange'
    },
    {
      ano: '2022',
      titulo: 'Expansão Nacional',
      subtitulo: 'Liderança consolidada',
      descricao: 'Expandimos para todo Brasil e nos tornamos líderes de mercado. Series A de R$ 25M para acelerar ainda mais o crescimento.',
      icone: Map,
      conquistas: [
        'Series A de R$ 25M',
        '3.000+ clientes em todo Brasil',
        'R$ 35M de receita anual',
        'Equipe de 150 pessoas'
      ],
      cor: 'red'
    },
    {
      ano: '2023-2024',
      titulo: 'Inovação Contínua',
      subtitulo: 'Futuro dos eventos',
      descricao: 'Continuamos inovando com novas tecnologias. Hoje somos a plataforma mais completa e avançada do mercado brasileiro.',
      icone: Trophy,
      conquistas: [
        'Plataforma mais completa',
        '8.000+ clientes ativos',
        'R$ 85M de receita anual',
        'Equipe de 280+ pessoas'
      ],
      cor: 'indigo'
    }
  ]

  const valores = [
    {
      valor: 'Inovação Constante',
      descricao: 'Nunca paramos de inovar. Cada dia é uma oportunidade de criar algo que transforme a experiência dos nossos clientes.',
      icone: Zap
    },
    {
      valor: 'Excelência Técnica',
      descricao: 'Buscamos a perfeição em cada linha de código, cada funcionalidade e cada interação com nossos usuários.',
      icone: Award
    },
    {
      valor: 'Foco no Cliente',
      descricao: 'Nossos clientes são a razão da nossa existência. Cada decisão é tomada pensando no seu sucesso.',
      icone: Heart
    },
    {
      valor: 'Crescimento Sustentável',
      descricao: 'Crescemos de forma responsável, construindo bases sólidas para um futuro duradouro e próspero.',
      icone: Target
    }
  ]

  const numeros = [
    { numero: '8.000+', label: 'Clientes Ativos', icone: Users },
    { numero: '50.000+', label: 'Eventos Realizados', icone: Calendar },
    { numero: '2.5M+', label: 'Participantes Impactados', icone: Globe },
    { numero: '99.8%', label: 'Uptime da Plataforma', icone: CheckCircle }
  ]

  const depoimentosHistoria = [
    {
      id: '1',
      name: 'Carlos Eduardo',
      role: 'CEO',
      company: 'Grupo EventTech',
      content: 'Acompanhamos o Viva o Sim desde o início. Ver essa jornada de crescimento e inovação constante é inspirador. São verdadeiros pioneiros.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Ana Paula Silva',
      role: 'Diretora de Eventos',
      company: 'MegaCorp Eventos',
      content: 'A evolução da plataforma ao longo dos anos é impressionante. Cada versão traz inovações que facilitam nosso trabalho.',
      rating: 5
    },
    {
      id: '3',
      name: 'Roberto Santos',
      role: 'Fundador',
      company: 'Eventos Premium',
      content: 'Testemunhei a transformação que o Viva o Sim trouxe para o mercado. Revolucionaram completamente a gestão de eventos.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Nossa Jornada de Inovação"
        description="De startup ousada a líder de mercado. Conheça a história de como transformamos a gestão de eventos no Brasil através da tecnologia e inovação constante."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Empresa', href: '/sobre' },
          { label: 'História' }
        ]}
        badge={{
          text: '6 Anos Inovando',
          variant: 'primary'
        }}
        size="large"
      />

      {/* Timeline */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Timeline de <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Crescimento</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Cada marco da nossa jornada representa conquistas, aprendizados e evolução constante
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Linha temporal central */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-300 to-orange-500"></div>
              
              <div className="space-y-12">
                {marcos.map((marco, index) => {
                  const IconeComponent = marco.icone
                  const isEven = index % 2 === 0
                  const corClasses = {
                    blue: 'from-blue-500 to-blue-600',
                    green: 'from-green-500 to-green-600',
                    purple: 'from-purple-500 to-purple-600',
                    orange: 'from-orange-500 to-orange-600',
                    red: 'from-red-500 to-red-600',
                    indigo: 'from-indigo-500 to-indigo-600'
                  }
                  
                  return (
                    <div key={index} className={`flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                      {/* Conteúdo */}
                      <div className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${corClasses[marco.cor as keyof typeof corClasses]} flex items-center justify-center shadow-lg`}>
                              <IconeComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-2xl font-bold text-orange-500">{marco.ano}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{marco.subtitulo}</div>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            {marco.titulo}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {marco.descricao}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            {marco.conquistas.map((conquista, conquistaIndex) => (
                              <div key={conquistaIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{conquista}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Separador central */}
                      <div className="hidden lg:flex w-2/12 justify-center">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${corClasses[marco.cor as keyof typeof corClasses]} flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900`}>
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                      </div>

                      {/* Espaço vazio para desktop */}
                      <div className="hidden lg:block w-5/12"></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Números Atuais */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Onde Estamos <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Hoje</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Números que refletem nossa jornada e o impacto que geramos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {numeros.map((item, index) => {
              const IconeComponent = item.icone
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <IconeComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.numero}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {item.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossos <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Valores</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Os princípios que nos guiam desde o primeiro dia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {valores.map((valor, index) => {
              const IconeComponent = valor.icone
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-6">
                    <IconeComponent className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {valor.valor}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {valor.descricao}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <TestimonialSection
        title="Testemunhas da Nossa Jornada"
        subtitle="Clientes que acompanharam nossa evolução ao longo dos anos"
        testimonials={depoimentosHistoria}
        variant="grid"
      />

      {/* CTA */}
      <CTASection
        title="Faça Parte da Nossa História"
        description="Junte-se a milhares de empresas que escolheram inovar conosco. Sua história de sucesso pode ser a próxima que contaremos."
        variant="gradient"
        buttons={[
          {
            text: 'Começar Agora',
            href: '/cadastro',
            variant: 'primary',
            icon: 'rocket'
          },
          {
            text: 'Conhecer Equipe',
            href: '/equipe',
            variant: 'outline',
            icon: 'users'
          }
        ]}
        stats={[
          { value: '6', label: 'Anos de Inovação' },
          { value: '8K+', label: 'Clientes Conquistados' },
          { value: '50K+', label: 'Eventos Realizados' },
          { value: '280+', label: 'Especialistas' }
        ]}
        badge="Jornada de Sucesso"
      />

      <Footer />
    </div>
  )
}

export default HistoriaPage
