import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'
import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  Lightbulb, 
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nós | Viva o Sim - Plataforma Completa para Gestão de Eventos',
  description: 'Conheça a história do Viva o Sim, nossa missão de transformar a gestão de eventos e como ajudamos mais de 50 mil profissionais a realizarem eventos inesquecíveis.',
  keywords: 'sobre viva o sim, gestão de eventos, história empresa, missão visão valores, equipe eventos',
  openGraph: {
    title: 'Sobre o Viva o Sim - Nossa História e Missão',
    description: 'Descubra como o Viva o Sim se tornou a plataforma líder em gestão de eventos no Brasil.',
    images: ['/og-sobre.jpg'],
  }
}

const SobrePage = () => {
  const valores = [
    {
      title: 'Inovação Constante',
      description: 'Sempre buscando novas tecnologias e soluções para simplificar a gestão de eventos e surpreender nossos clientes.',
      icon: Lightbulb,
      benefits: [
        'Tecnologia de ponta',
        'Atualizações frequentes',
        'Recursos exclusivos'
      ]
    },
    {
      title: 'Experiência do Cliente',
      description: 'Colocamos nossos clientes no centro de tudo o que fazemos, oferecendo suporte excepcional e soluções personalizadas.',
      icon: Heart,
      benefits: [
        'Suporte 24/7',
        'Onboarding personalizado',
        'Feedback contínuo'
      ]
    },
    {
      title: 'Transparência Total',
      description: 'Mantemos comunicação clara, preços justos e processos transparentes em todos os nossos relacionamentos.',
      icon: Shield,
      benefits: [
        'Sem taxas ocultas',
        'Comunicação clara',
        'Políticas transparentes'
      ]
    },
    {
      title: 'Resultados Reais',
      description: 'Focamos em entregar resultados mensuráveis que impactem positivamente o negócio dos nossos clientes.',
      icon: Target,
      benefits: [
        'ROI comprovado',
        'Métricas claras',
        'Cases de sucesso'
      ]
    },
    {
      title: 'Comunidade Forte',
      description: 'Construímos uma comunidade de profissionais de eventos que se apoiam mutuamente e crescem juntos.',
      icon: Users,
      benefits: [
        'Rede de contatos',
        'Eventos exclusivos',
        'Troca de experiências'
      ]
    },
    {
      title: 'Excelência Operacional',
      description: 'Mantemos os mais altos padrões de qualidade em todos os nossos produtos, serviços e processos.',
      icon: Award,
      benefits: [
        'Certificações ISO',
        'Processos otimizados',
        'Qualidade garantida'
      ]
    }
  ]

  const conquistas = [
    {
      title: 'Liderança no Mercado',
      description: 'Reconhecidos como a plataforma líder em gestão de eventos no Brasil, com presença em mais de 200 cidades.',
      icon: TrendingUp,
      link: {
        text: 'Ver prêmios',
        href: '/premios'
      }
    },
    {
      title: 'Tecnologia Avançada',
      description: 'Investimos constantemente em P&D para oferecer as soluções mais avançadas do mercado.',
      icon: Zap,
      link: {
        text: 'Conhecer tecnologia',
        href: '/tecnologia'
      }
    },
    {
      title: 'Impacto Global',
      description: 'Nossa plataforma já facilitou mais de 1 milhão de eventos ao redor do mundo, conectando pessoas e criando memórias.',
      icon: Globe,
      link: {
        text: 'Ver casos globais',
        href: '/casos-sucesso'
      }
    },
    {
      title: 'Suporte Excepcional',
      description: 'Nossa equipe de suporte altamente treinada garante que nossos clientes tenham a melhor experiência possível.',
      icon: Clock,
      link: {
        text: 'Falar com suporte',
        href: '/suporte'
      }
    }
  ]

  const depoimentos = [
    {
      id: '1',
      name: 'Maria Silva',
      role: 'CEO',
      company: 'Eventos Premium',
      content: 'O Viva o Sim transformou completamente nossa operação. Conseguimos aumentar nossa produtividade em 300% e nossos clientes estão mais satisfeitos do que nunca.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'João Santos',
      role: 'Diretor',
      company: 'Buffet Excellence',
      content: 'Depois de testar várias plataformas, o Viva o Sim foi a única que realmente entendeu nossas necessidades.',
      rating: 5
    },
    {
      id: '3',
      name: 'Ana Costa',
      role: 'Produtora',
      company: 'Festas & Cia',
      content: 'A facilidade de uso e a qualidade do suporte fazem toda a diferença no nosso dia a dia.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Sobre o Viva o Sim"
        description="Transformamos ideias em experiências inesquecíveis. Conheça nossa história, valores e como estamos revolucionando o mercado de eventos no Brasil."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Sobre' }
        ]}
        badge={{
          text: 'Empresa Brasileira',
          variant: 'primary'
        }}
        size="large"
      />

      {/* Nossa História */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Nossa <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">História</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Tudo começou em 2019, quando percebemos que os profissionais de eventos precisavam de uma solução mais inteligente e integrada para gerenciar seus negócios.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  O Problema que Identificamos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Profissionais de eventos talentosos perdiam tempo precioso com planilhas desorganizadas, 
                  comunicação fragmentada e processos manuais que poderiam ser automatizados.
                </p>
                <div className="space-y-3">
                  {[
                    'Gestão financeira complexa',
                    'Comunicação dispersa com clientes',
                    'Controle manual de fornecedores',
                    'Relatórios demorados e imprecisos'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      A Solução Nasceu
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Uma plataforma completa e intuitiva
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Hoje, 5 Anos Depois
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Somos a plataforma de gestão de eventos mais utilizada no Brasil, 
                ajudando mais de <strong>50.000 profissionais</strong> a transformarem 
                suas paixões em negócios prósperos e sustentáveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <FeatureGrid
        title="Nossos Valores"
        subtitle="Os princípios que nos guiam"
        features={valores}
        variant="cards"
        columns={3}
      />

      {/* Conquistas */}
      <FeatureGrid
        title="Nossas Conquistas"
        subtitle="Resultados que nos orgulham"
        features={conquistas}
        variant="list"
        columns={2}
      />

      {/* Depoimentos */}
      <TestimonialSection
        title="O que Nossos Clientes Dizem"
        subtitle="Histórias reais de sucesso"
        testimonials={depoimentos}
        variant="featured"
      />

      {/* CTA */}
      <CTASection
        title="Pronto para Transformar seu Negócio?"
        description="Junte-se a mais de 50.000 profissionais que já descobriram como o Viva o Sim pode revolucionar a gestão de eventos."
        variant="gradient"
        buttons={[
          {
            text: 'Começar Agora',
            href: '/cadastro',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Falar com Consultor',
            href: '/contato',
            variant: 'outline',
            icon: 'phone'
          }
        ]}
        stats={[
          { value: '50k+', label: 'Clientes Ativos' },
          { value: '1M+', label: 'Eventos Realizados' },
          { value: '99.9%', label: 'Uptime' },
          { value: '24/7', label: 'Suporte' }
        ]}
        badge="Líder no Mercado"
      />

      <Footer />
    </div>
  )
}

export default SobrePage
