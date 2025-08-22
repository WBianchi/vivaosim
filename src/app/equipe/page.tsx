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
  Code,
  Palette,
  BarChart3,
  Shield,
  Zap,
  Coffee,
  MapPin,
  Linkedin,
  Github,
  Twitter
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nossa Equipe | Viva o Sim - Talentos que Inovam',
  description: 'Conheça a equipe do Viva o Sim: 280+ especialistas apaixonados por tecnologia e inovação, trabalhando para revolucionar a gestão de eventos.',
  keywords: 'equipe viva o sim, time especialistas, talentos tecnologia, empresa eventos, liderança inovação',
  openGraph: {
    title: 'Nossa Equipe - Talentos que Transformam Eventos',
    description: '280+ especialistas dedicados a criar o futuro da gestão de eventos.',
    images: ['/og-equipe.jpg'],
  }
}

const EquipePage = () => {
  const lideranca = [
    {
      nome: 'Carlos Eduardo Silva',
      cargo: 'CEO & Co-fundador',
      bio: 'Visionário com 15+ anos em tecnologia. Ex-diretor de produto em grandes techs. Especialista em crescimento de startups e inovação disruptiva.',
      localizacao: 'São Paulo, SP',
      especialidades: ['Estratégia', 'Produto', 'Liderança', 'Investimentos'],
      linkedin: 'carlos-silva-ceo',
      github: 'carlossilva',
      imagem: '/team/carlos-silva.jpg',
      destaque: true
    },
    {
      nome: 'Ana Paula Rocha',
      cargo: 'CTO & Co-fundadora',
      bio: 'Arquiteta de software com paixão por IA e ML. PhD em Ciência da Computação. Lidera a inovação tecnológica e arquitetura da plataforma.',
      localizacao: 'São Paulo, SP',
      especialidades: ['IA/ML', 'Arquitetura', 'Cloud', 'DevOps'],
      linkedin: 'ana-rocha-cto',
      github: 'anarocha',
      imagem: '/team/ana-rocha.jpg',
      destaque: true
    },
    {
      nome: 'Roberto Santos',
      cargo: 'CPO & Co-fundador',
      bio: 'Product Manager experiente com foco em UX. 12+ anos criando produtos que as pessoas amam. Especialista em design thinking e metodologias ágeis.',
      localizacao: 'Rio de Janeiro, RJ',
      especialidades: ['UX/UI', 'Produto', 'Agile', 'Research'],
      linkedin: 'roberto-santos-cpo',
      github: 'robertosantos',
      imagem: '/team/roberto-santos.jpg',
      destaque: true
    },
    {
      nome: 'Marina Oliveira',
      cargo: 'Head of Growth',
      bio: 'Especialista em crescimento e marketing digital. Ex-líder de growth em unicórnios. Responsável por escalar nossa base de clientes.',
      localizacao: 'São Paulo, SP',
      especialidades: ['Growth', 'Marketing', 'Analytics', 'Conversão'],
      linkedin: 'marina-oliveira-growth',
      twitter: 'marinagrowth',
      imagem: '/team/marina-oliveira.jpg',
      destaque: false
    }
  ]

  const departamentos = [
    {
      nome: 'Engenharia',
      descricao: 'Desenvolvedores full-stack, especialistas em IA, arquitetos de software e engenheiros DevOps.',
      membros: 85,
      icone: Code,
      tecnologias: ['React', 'Node.js', 'Python', 'AI/ML', 'AWS', 'Kubernetes'],
      cor: 'blue'
    },
    {
      nome: 'Produto & Design',
      descricao: 'Product managers, UX/UI designers, pesquisadores e especialistas em experiência do usuário.',
      membros: 32,
      icone: Palette,
      tecnologias: ['Figma', 'Miro', 'Analytics', 'A/B Testing', 'Prototyping'],
      cor: 'purple'
    },
    {
      nome: 'Growth & Marketing',
      descricao: 'Especialistas em growth, marketing digital, conteúdo, SEO e aquisição de clientes.',
      membros: 28,
      icone: TrendingUp,
      tecnologias: ['Google Ads', 'HubSpot', 'Mixpanel', 'Hotjar', 'SEMrush'],
      cor: 'green'
    },
    {
      nome: 'Vendas & Sucesso',
      descricao: 'Account executives, customer success, suporte técnico e especialistas em relacionamento.',
      membros: 45,
      icone: Target,
      tecnologias: ['Salesforce', 'Intercom', 'Zendesk', 'Zoom', 'Slack'],
      cor: 'orange'
    },
    {
      nome: 'Operações',
      descricao: 'Especialistas em operações, segurança, compliance, RH e administração corporativa.',
      membros: 38,
      icone: Shield,
      tecnologias: ['AWS Security', 'Compliance', 'BambooHR', 'Slack', 'Notion'],
      cor: 'red'
    },
    {
      nome: 'Data & Analytics',
      descricao: 'Cientistas de dados, analistas, especialistas em BI e engenheiros de dados.',
      membros: 22,
      icone: BarChart3,
      tecnologias: ['Python', 'SQL', 'Tableau', 'Apache Spark', 'BigQuery'],
      cor: 'indigo'
    }
  ]

  const cultura = [
    {
      valor: 'Remote First',
      descricao: 'Trabalho 100% remoto com encontros presenciais trimestrais. Flexibilidade para trabalhar de qualquer lugar.',
      icone: Globe
    },
    {
      valor: 'Crescimento Contínuo',
      descricao: 'Budget de R$ 5K/ano por pessoa para cursos, conferências e desenvolvimento profissional.',
      icone: TrendingUp
    },
    {
      valor: 'Inovação Livre',
      descricao: '20% do tempo dedicado a projetos pessoais e experimentação. Hackathons mensais e prototipação.',
      icone: Lightbulb
    },
    {
      valor: 'Wellbeing Total',
      descricao: 'Plano de saúde premium, terapia online, ginástica laboral e apoio integral ao bem-estar.',
      icone: Heart
    },
    {
      valor: 'Equity Program',
      descricao: 'Todos fazem parte do sucesso. Programa de stock options para toda equipe desde o primeiro dia.',
      icone: Trophy
    },
    {
      valor: 'Diversidade Real',
      descricao: '52% pessoas não-binárias e mulheres, 40% pessoas negras, 15% pessoas LGBTQIA+. Inclusão genuína.',
      icone: Users
    }
  ]

  const numeros = [
    { numero: '280+', label: 'Especialistas', icone: Users },
    { numero: '25', label: 'Países Representados', icone: Globe },
    { numero: '4.9/5', label: 'Satisfação Interna', icone: Star },
    { numero: '95%', label: 'Retenção de Talentos', icone: Heart }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Talentos que Transformam o Futuro"
        description="Conheça os 280+ especialistas apaixonados que trabalham todos os dias para revolucionar a gestão de eventos através da tecnologia e inovação."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Empresa', href: '/sobre' },
          { label: 'Equipe' }
        ]}
        badge={{
          text: '280+ Talentos',
          variant: 'primary'
        }}
        size="large"
      />

      {/* Liderança */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Liderança</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Fundadores e líderes que guiam nossa visão e estratégia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {lideranca.map((lider, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 ${
                  lider.destaque ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {lider.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {lider.nome}
                  </h3>
                  <div className="text-orange-500 font-medium mb-4">{lider.cargo}</div>
                  
                  <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{lider.localizacao}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  {lider.bio}
                </p>

                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Especialidades:</div>
                  <div className="flex flex-wrap gap-2">
                    {lider.especialidades.map((esp, espIndex) => (
                      <span
                        key={espIndex}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  {lider.linkedin && (
                    <a href={`https://linkedin.com/in/${lider.linkedin}`} className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {lider.github && (
                    <a href={`https://github.com/${lider.github}`} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {lider.twitter && (
                    <a href={`https://twitter.com/${lider.twitter}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departamentos */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossos <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Departamentos</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Especialistas organizados em times multidisciplinares
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departamentos.map((dept, index) => {
              const IconeComponent = dept.icone
              const corClasses = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                green: 'from-green-500 to-green-600',
                orange: 'from-orange-500 to-orange-600',
                red: 'from-red-500 to-red-600',
                indigo: 'from-indigo-500 to-indigo-600'
              }
              
              return (
                <div
                  key={index}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${corClasses[dept.cor as keyof typeof corClasses]} flex items-center justify-center shadow-lg`}>
                      <IconeComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{dept.nome}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{dept.membros} pessoas</div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {dept.descricao}
                  </p>

                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tecnologias:</div>
                    <div className="flex flex-wrap gap-2">
                      {dept.tecnologias.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                        >
                          {tech}
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

      {/* Números da Equipe */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa Equipe em <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Números</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {numeros.map((item, index) => {
              const IconeComponent = item.icone
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
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

      {/* Cultura */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Cultura</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Valores e práticas que tornam o Viva o Sim um lugar especial para trabalhar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cultura.map((item, index) => {
              const IconeComponent = item.icone
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
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

      {/* CTA */}
      <CTASection
        title="Quer Fazer Parte da Nossa Equipe?"
        description="Estamos sempre em busca de talentos excepcionais que compartilhem nossa paixão por inovação e excelência. Venha transformar o futuro dos eventos conosco."
        variant="gradient"
        buttons={[
          {
            text: 'Ver Vagas Abertas',
            href: '/carreiras',
            variant: 'primary',
            icon: 'users'
          },
          {
            text: 'Conhecer Cultura',
            href: '/carreiras#cultura',
            variant: 'outline',
            icon: 'users'
          }
        ]}
        stats={[
          { value: '280+', label: 'Especialistas' },
          { value: '25', label: 'Países' },
          { value: '4.9/5', label: 'Satisfação' },
          { value: '95%', label: 'Retenção' }
        ]}
        badge="Junte-se a Nós"
      />

      <Footer />
    </div>
  )
}

export default EquipePage
