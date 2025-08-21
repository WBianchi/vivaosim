import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import FeatureGrid from '@/components/shared/FeatureGrid'
import TestimonialSection from '@/components/shared/TestimonialSection'
import CTASection from '@/components/shared/CTASection'

// Dados dos segmentos
const segmentosData = {
  'casamentos': {
    title: 'Casamentos e Cerimônias',
    subtitle: 'Transforme sonhos em realidade com gestão perfeita',
    description: 'Plataforma completa para wedding planners e cerimonialistas organizarem casamentos inesquecíveis com eficiência e elegância.',
    hero: {
      badge: 'Wedding Planners',
      title: 'Casamentos Perfeitos',
      description: 'Gerencie cada detalhe do grande dia com nossa plataforma especializada em casamentos e cerimônias.'
    },
    features: [
      {
        title: 'Timeline de Casamento',
        description: 'Cronograma detalhado com todas as etapas do planejamento e execução.',
        icon: 'calendar'
      },
      {
        title: 'Gestão de Fornecedores',
        description: 'Catálogo completo de fornecedores especializados em casamentos.',
        icon: 'users'
      },
      {
        title: 'Lista de Convidados',
        description: 'Controle de confirmações, restrições alimentares e acomodações.',
        icon: 'list'
      },
      {
        title: 'Orçamento Inteligente',
        description: 'Controle financeiro com categorias específicas para casamentos.',
        icon: 'calculator'
      },
      {
        title: 'Cardápio e Catering',
        description: 'Planejamento completo do menu e serviços de alimentação.',
        icon: 'utensils'
      },
      {
        title: 'Decoração e Layout',
        description: 'Ferramenta visual para planejar decoração e disposição do espaço.',
        icon: 'palette'
      }
    ],
    testimonials: [
      {
        id: 'casamentos-1',
        name: 'Marina Santos',
        role: 'Wedding Planner',
        company: 'Momentos Únicos',
        content: 'O Viva o Sim revolucionou meu trabalho. Consigo gerenciar 15 casamentos simultaneamente com total controle.',
        rating: 5,
        avatar: '/testimonials/marina-santos.jpg'
      },
      {
        id: 'casamentos-2',
        name: 'Ricardo e Paula',
        role: 'Noivos',
        company: 'Casamento dos Sonhos',
        content: 'Nossa wedding planner usou a plataforma e pudemos acompanhar cada detalhe. O casamento saiu perfeito!',
        rating: 5,
        avatar: '/testimonials/ricardo-paula.jpg'
      }
    ],
    stats: [
      { value: '2.500+', label: 'Casamentos Realizados' },
      { value: '450', label: 'Wedding Planners' },
      { value: '98%', label: 'Noivos Satisfeitos' },
      { value: '30%', label: 'Economia de Tempo' }
    ]
  },
  'corporativos': {
    title: 'Eventos Corporativos',
    subtitle: 'Eventos corporativos que impulsionam negócios',
    description: 'Gerencie conferências, workshops, treinamentos e eventos de networking com profissionalismo e eficiência máxima.',
    hero: {
      badge: 'Eventos Corporativos',
      title: 'Profissionalismo Total',
      description: 'Plataforma especializada para eventos corporativos, conferências e treinamentos empresariais.'
    },
    features: [
      {
        title: 'Gestão de Palestrantes',
        description: 'Controle de agenda, requisitos técnicos e materiais dos speakers.',
        icon: 'mic'
      },
      {
        title: 'Credenciamento Digital',
        description: 'Check-in automatizado com QR codes and badges personalizados.',
        icon: 'qr-code'
      },
      {
        title: 'Networking Inteligente',
        description: 'Facilite conexões entre participantes com interesses similares.',
        icon: 'network'
      },
      {
        title: 'Transmissão Híbrida',
        description: 'Eventos presenciais e online integrados em uma única plataforma.',
        icon: 'video'
      },
      {
        title: 'Analytics Avançado',
        description: 'Métricas de engajamento, ROI e feedback dos participantes.',
        icon: 'analytics'
      },
      {
        title: 'Compliance e Segurança',
        description: 'Atenda regulamentações corporativas e protocolos de segurança.',
        icon: 'shield'
      }
    ],
    testimonials: [
      {
        id: 'corporativos-1',
        name: 'Carlos Mendes',
        role: 'Gerente de Eventos',
        company: 'TechCorp Brasil',
        content: 'Realizamos nossa conferência anual com 2.000 participantes sem nenhum problema. A plataforma é impecável.',
        rating: 5,
        avatar: '/testimonials/carlos-mendes.jpg'
      },
      {
        id: 'corporativos-2',
        name: 'Ana Rodrigues',
        role: 'Diretora de RH',
        company: 'InnovaCorp',
        content: 'Os treinamentos online ficaram muito mais engajantes. O ROI dos nossos eventos dobrou.',
        rating: 5,
        avatar: '/testimonials/ana-rodrigues.jpg'
      }
    ],
    stats: [
      { value: '850+', label: 'Eventos Corporativos' },
      { value: '120K', label: 'Executivos Conectados' },
      { value: '95%', label: 'Satisfação Empresas' },
      { value: '40%', label: 'Redução de Custos' }
    ]
  },
  'aniversarios': {
    title: 'Aniversários e Comemorações',
    subtitle: 'Celebrações memoráveis para todas as idades',
    description: 'Organize festas de aniversário, comemorações familiares e celebrações especiais com alegria e organização.',
    hero: {
      badge: 'Festas & Celebrações',
      title: 'Momentos Especiais',
      description: 'Plataforma dedicada para aniversários, festas familiares e comemorações inesquecíveis.'
    },
    features: [
      {
        title: 'Temas Personalizados',
        description: 'Catálogo com centenas de temas e decorações para todas as idades.',
        icon: 'palette'
      },
      {
        title: 'Lista de Presentes',
        description: 'Integração com lojas online para listas de presentes compartilhadas.',
        icon: 'gift'
      },
      {
        title: 'Animação e Entretenimento',
        description: 'Rede de animadores, DJs e entertainers especializados.',
        icon: 'music'
      },
      {
        title: 'Buffet Inteligente',
        description: 'Calculadora de quantidade e seleção de cardápios por faixa etária.',
        icon: 'utensils'
      },
      {
        title: 'Fotografia Colaborativa',
        description: 'Album compartilhado onde convidados podem adicionar fotos e vídeos.',
        icon: 'camera'
      },
      {
        title: 'Convites Digitais',
        description: 'Convites animados personalizados com confirmação online.',
        icon: 'mail'
      }
    ],
    testimonials: [
      {
        id: 'aniversarios-1',
        name: 'Juliana Lima',
        role: 'Mãe e Organizadora',
        company: 'Família Lima',
        content: 'O aniversário de 5 anos da minha filha foi perfeito! A plataforma facilitou tudo, desde os convites até a decoração.',
        rating: 5,
        avatar: '/testimonials/juliana-lima.jpg'
      },
      {
        id: 'aniversarios-2',
        name: 'Roberto Silva',
        role: 'Festeiro',
        company: '50 Anos Memoráveis',
        content: 'Minha festa de 50 anos foi um sucesso. Consegui organizar tudo online e os convidados adoraram os convites digitais.',
        rating: 5,
        avatar: '/testimonials/roberto-silva.jpg'
      }
    ],
    stats: [
      { value: '5.200+', label: 'Aniversários Organizados' },
      { value: '78%', label: 'Festas Infantis' },
      { value: '92%', label: 'Satisfação Famílias' },
      { value: '25%', label: 'Economia vs Tradicional' }
    ]
  }
  // Adicionarei mais segmentos conforme necessário
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
  const segmento = segmentosData[slug as keyof typeof segmentosData]
  
  if (!segmento) {
    return {
      title: 'Segmento não encontrado | Viva o Sim'
    }
  }

  return {
    title: `${segmento.title} | Viva o Sim - Gestão Especializada`,
    description: segmento.description,
    keywords: `${segmento.title.toLowerCase()}, eventos ${slug}, gestão ${slug}, planejamento ${slug}`,
    openGraph: {
      title: `${segmento.title} - Especialização que faz a diferença`,
      description: segmento.description,
      images: [`/og-${slug}.jpg`],
    }
  }
}

export function generateStaticParams() {
  return Object.keys(segmentosData).map((slug) => ({
    slug: slug,
  }))
}

const SegmentoPage = ({ params }: PageProps) => {
  const { slug } = params
  const segmento = segmentosData[slug as keyof typeof segmentosData]

  if (!segmento) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title={segmento.hero.title}
        description={segmento.hero.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Segmentos', href: '/segmentos' },
          { label: segmento.title }
        ]}
        badge={{
          text: segmento.hero.badge,
          variant: 'primary'
        }}
        size="large"
      />

      {/* Features Section */}
      <FeatureGrid
        title="Recursos Especializados"
        description={`Funcionalidades desenvolvidas especificamente para ${segmento.title.toLowerCase()}`}
        features={segmento.features}
        variant="gradient"
        columns={3}
      />

      {/* Testimonials */}
      <TestimonialSection
        title="Histórias de Sucesso"
        description={`Veja como profissionais de ${segmento.title.toLowerCase()} estão transformando seus eventos`}
        testimonials={segmento.testimonials}
        variant="cards"
      />

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Resultados <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Comprovados</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Números que demonstram nossa especialização em {segmento.title.toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {segmento.stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50"
              >
                <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title={`Especialista em ${segmento.title}`}
        description={`Descubra como nossa plataforma pode transformar seus ${segmento.title.toLowerCase()}. Teste grátis por 14 dias.`}
        variant="gradient"
        buttons={[
          {
            text: 'Começar Teste Grátis',
            href: '/cadastro',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Ver Demo Especializada',
            href: `/demo/${slug}`,
            variant: 'outline',
            icon: 'play'
          }
        ]}
        stats={segmento.stats}
        badge={`Especialização ${segmento.hero.badge}`}
      />

      <Footer />
    </div>
  )
}

export default SegmentoPage
