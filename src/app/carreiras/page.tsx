import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Heart, 
  Lightbulb, 
  Globe,
  Code,
  Palette,
  BarChart3,
  Shield,
  Target,
  Award,
  Coffee,
  Zap,
  BookOpen,
  Headphones,
  Rocket,
  Star,
  Clock,
  MapPin,
  DollarSign,
  Gamepad2,
  Wifi,
  Home
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Carreiras | Viva o Sim - Junte-se ao Futuro dos Eventos',
  description: 'Faça parte da equipe que está revolucionando a gestão de eventos. Vagas abertas, cultura inovadora, benefícios únicos e crescimento acelerado.',
  keywords: 'vagas viva o sim, trabalhar viva o sim, carreiras tecnologia, vagas eventos, cultura empresa, benefícios funcionários',
  openGraph: {
    title: 'Carreiras - Transforme o Futuro dos Eventos Conosco',
    description: 'Oportunidades únicas para talentos que querem fazer a diferença.',
    images: ['/og-carreiras.jpg'],
  }
}

const CarreirasPage = () => {
  const vagasAbertas = [
    {
      titulo: 'Senior Full Stack Developer',
      departamento: 'Engenharia',
      tipo: 'Full-time',
      localizacao: 'Remote',
      salario: 'R$ 12K - 18K',
      descricao: 'Desenvolva features que impactam milhares de eventos. React, Node.js, AWS, IA.',
      icone: Code,
      requisitos: ['React', 'Node.js', 'AWS', 'MongoDB', '5+ anos exp'],
      destaque: true
    },
    {
      titulo: 'Product Designer',
      departamento: 'Produto',
      tipo: 'Full-time',
      localizacao: 'Remote',
      salario: 'R$ 10K - 15K',
      descricao: 'Crie experiências que encantam usuários. UX/UI, Design Systems, Prototipação.',
      icone: Palette,
      requisitos: ['Figma', 'Design Systems', 'UX Research', '4+ anos exp'],
      destaque: false
    },
    {
      titulo: 'Growth Marketing Manager',
      departamento: 'Marketing',
      tipo: 'Full-time',
      localizacao: 'Remote',
      salario: 'R$ 9K - 14K',
      descricao: 'Escale nossa base de usuários. Performance, SEO, Analytics, Automação.',
      icone: TrendingUp,
      requisitos: ['Google Analytics', 'Facebook Ads', 'SEO', '3+ anos exp'],
      destaque: false
    },
    {
      titulo: 'Customer Success Manager',
      departamento: 'Sucesso',
      tipo: 'Full-time',
      localizacao: 'Remote',
      salario: 'R$ 7K - 11K',
      descricao: 'Garanta o sucesso dos nossos clientes. Relacionamento, suporte, expansão.',
      icone: Users,
      requisitos: ['CRM', 'Relacionamento', 'Inglês', '2+ anos exp'],
      destaque: false
    },
    {
      titulo: 'Data Scientist',
      departamento: 'Data',
      tipo: 'Full-time',
      localizacao: 'Remote',
      salario: 'R$ 11K - 16K',
      descricao: 'Transforme dados em insights. ML, Python, Analytics, Modelos Preditivos.',
      icone: BarChart3,
      requisitos: ['Python', 'ML', 'SQL', 'Estatística', '3+ anos exp'],
      destaque: true
    },
    {
      titulo: 'DevOps Engineer',
      departamento: 'Engenharia',
      tipo: 'Full-time',
      localizacao: 'Remote',
      salario: 'R$ 13K - 19K',
      descricao: 'Mantenha nossa infraestrutura escalável. AWS, K8s, CI/CD, Monitoring.',
      icone: Shield,
      requisitos: ['AWS', 'Kubernetes', 'Docker', 'Terraform', '4+ anos exp'],
      destaque: false
    }
  ]

  const beneficios = [
    {
      titulo: 'Salários Competitivos',
      descricao: 'Salários acima do mercado + participação nos lucros + stock options para todos.',
      icone: DollarSign
    },
    {
      titulo: 'Home Office Total',
      descricao: 'Trabalho 100% remoto com ajuda de custo para home office e equipamentos.',
      icone: Home
    },
    {
      titulo: 'Plano de Saúde Premium',
      descricao: 'Plano de saúde e odontológico premium para você e sua família, sem desconto.',
      icone: Heart
    },
    {
      titulo: 'Desenvolvimento Contínuo',
      descricao: 'R$ 5K/ano para cursos, conferências, certificações e desenvolvimento pessoal.',
      icone: BookOpen
    },
    {
      titulo: 'Férias Ilimitadas',
      descricao: 'Política de férias flexível. Descanse quando precisar, trabalhe quando estiver bem.',
      icone: Coffee
    },
    {
      titulo: 'Horário Flexível',
      descricao: 'Defina seus horários de trabalho. Core hours apenas para reuniões essenciais.',
      icone: Clock
    },
    {
      titulo: 'Equipamentos Top',
      descricao: 'MacBook Pro, monitor 4K, cadeira ergonômica e tudo que precisar para trabalhar bem.',
      icone: Zap
    },
    {
      titulo: 'Wellbeing Total',
      descricao: 'Terapia online, app de meditação, ginástica laboral e apoio psicológico completo.',
      icone: Target
    }
  ]

  const cultura = [
    {
      valor: 'Transparência Radical',
      descricao: 'Todas as informações da empresa são compartilhadas. Salários, métricas, estratégias - tudo é aberto.',
      icone: Globe
    },
    {
      valor: 'Autonomia Total',
      descricao: 'Você define como, quando e onde trabalhar. Confiamos na sua capacidade de entregar resultados.',
      icone: Rocket
    },
    {
      valor: 'Aprendizado Contínuo',
      descricao: 'Cultura de experimentação, erro e aprendizado. Incentivamos riscos calculados e inovação.',
      icone: Lightbulb
    },
    {
      valor: 'Diversidade Real',
      descricao: 'Ambiente inclusivo de verdade. 52% mulheres e pessoas não-binárias, 40% pessoas negras.',
      icone: Users
    }
  ]

  const processo = [
    {
      etapa: 'Candidatura',
      descricao: 'Envie seu currículo e portfólio. Analisamos todas as candidaturas com carinho.',
      tempo: '2 dias',
      icone: Briefcase
    },
    {
      etapa: 'Triagem Inicial',
      descricao: 'Bate-papo de 30min com RH para nos conhecermos melhor e tirar dúvidas.',
      tempo: '3 dias',
      icone: Users
    },
    {
      etapa: 'Desafio Técnico',
      descricao: 'Desafio prático (2-4h) para demonstrar suas habilidades em cenário real.',
      tempo: '1 semana',
      icone: Code
    },
    {
      etapa: 'Entrevista Final',
      descricao: 'Conversa com o time e liderança. Focamos em fit cultural e visão de futuro.',
      tempo: '3 dias',
      icone: Star
    },
    {
      etapa: 'Proposta',
      descricao: 'Proposta completa com salário, benefícios e equity. Negociamos juntos.',
      tempo: '2 dias',
      icone: Award
    }
  ]

  const depoimentosFuncionarios = [
    {
      id: '1',
      name: 'Mariana Silva',
      role: 'Senior Product Designer',
      company: 'Viva o Sim',
      content: 'Aqui eu tenho liberdade para inovar e criar produtos que realmente impactam. A cultura de transparência e autonomia é única. Melhor decisão da minha carreira.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Rafael Costa',
      role: 'Full Stack Developer',
      company: 'Viva o Sim',
      content: 'Tecnologia de ponta, desafios incríveis e time excepcional. Aqui eu cresço como profissional e pessoa todos os dias.',
      rating: 5
    },
    {
      id: '3',
      name: 'Camila Santos',
      role: 'Growth Marketing',
      company: 'Viva o Sim',
      content: 'O investimento em desenvolvimento pessoal é real. Já fiz 3 cursos este ano e participei de 2 conferências internacionais.',
      rating: 5
    },
    {
      id: '4',
      name: 'Lucas Fernandes',
      role: 'Data Scientist',
      company: 'Viva o Sim',
      content: 'Home office verdadeiro, horários flexíveis e foco em resultados. Trabalho melhor e sou mais feliz aqui.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Junte-se ao Futuro dos Eventos"
        description="Faça parte da equipe que está revolucionando a gestão de eventos no Brasil. Oportunidades únicas, cultura inovadora e crescimento acelerado para talentos excepcionais."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Empresa', href: '/sobre' },
          { label: 'Carreiras' }
        ]}
        badge={{
          text: 'Vagas Abertas',
          variant: 'success'
        }}
        size="large"
      />

      {/* Vagas Abertas */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Vagas <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Abertas</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Oportunidades para impactar milhões de pessoas através da tecnologia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vagasAbertas.map((vaga, index) => {
              const IconeComponent = vaga.icone
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-8 border hover:scale-105 transition-all duration-300 ${
                    vaga.destaque 
                      ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {vaga.destaque && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-medium mb-4">
                      ⭐ Destaque
                    </div>
                  )}

                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                      <IconeComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{vaga.departamento}</div>
                      <div className="text-xs text-gray-400">{vaga.tipo} • {vaga.localizacao}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {vaga.titulo}
                  </h3>

                  <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
                    {vaga.salario}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {vaga.descricao}
                  </p>

                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Requisitos:</div>
                    <div className="flex flex-wrap gap-2">
                      {vaga.requisitos.map((req, reqIndex) => (
                        <span
                          key={reqIndex}
                          className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Candidatar-se
                  </button>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Não encontrou a vaga ideal? Envie seu currículo mesmo assim!
            </p>
            <button className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Candidatura Espontânea
            </button>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Benefícios <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Únicos</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Investimos em você porque acreditamos no seu potencial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => {
              const IconeComponent = beneficio.icone
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <IconeComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {beneficio.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {beneficio.descricao}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cultura */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Cultura</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Valores que tornam o Viva o Sim um lugar especial para trabalhar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cultura.map((item, index) => {
              const IconeComponent = item.icone
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-6">
                    <IconeComponent className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.valor}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Processo Seletivo */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Processo <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Seletivo</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Processo transparente e humanizado para conhecer você de verdade
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Linha conectora */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-300 to-orange-500"></div>
              
              <div className="space-y-12">
                {processo.map((etapa, index) => {
                  const IconeComponent = etapa.icone
                  const isEven = index % 2 === 0
                  
                  return (
                    <div key={index} className={`flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Conteúdo */}
                      <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                              <IconeComponent className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{etapa.etapa}</h3>
                              <div className="text-sm text-orange-500 font-medium">{etapa.tempo}</div>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {etapa.descricao}
                          </p>
                        </div>
                      </div>

                      {/* Separador central */}
                      <div className="hidden md:flex w-2/12 justify-center">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>

                      {/* Espaço vazio para desktop */}
                      <div className="hidden md:block w-5/12"></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <TestimonialSection
        title="O que Nosso Time Diz"
        subtitle="Experiências reais de quem trabalha conosco"
        testimonials={depoimentosFuncionarios}
        variant="grid"
      />

      {/* CTA */}
      <CTASection
        title="Sua Jornada Começa Agora"
        description="Junte-se a 280+ talentos excepcionais que estão construindo o futuro da gestão de eventos. Oportunidades únicas para crescer, inovar e fazer a diferença."
        variant="gradient"
        buttons={[
          {
            text: 'Ver Todas as Vagas',
            href: '#vagas',
            variant: 'primary',
            icon: 'briefcase'
          },
          {
            text: 'Candidatura Espontânea',
            href: 'mailto:rh@vivaosim.com',
            variant: 'outline',
            icon: 'mail'
          }
        ]}
        stats={[
          { value: '15+', label: 'Vagas Abertas' },
          { value: '4.9/5', label: 'Satisfação' },
          { value: '95%', label: 'Retenção' },
          { value: '100%', label: 'Remote' }
        ]}
        badge="Junte-se a Nós"
      />

      <Footer />
    </div>
  )
}

export default CarreirasPage
