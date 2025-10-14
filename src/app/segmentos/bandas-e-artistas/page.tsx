'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import SegmentHero from '@/components/segments/SegmentHero'
import SegmentFeatures from '@/components/segments/SegmentFeatures'
import SegmentBenefits from '@/components/segments/SegmentBenefits'
import { Music, Calendar, DollarSign, Users, FileText, TrendingUp } from 'lucide-react'

export default function BandasArtistasPage() {
  const features = [
    {
      icon: Music,
      title: 'Gestão de Shows',
      description: 'Organize apresentações, repertórios e equipamentos. Controle cada detalhe dos seus shows.'
    },
    {
      icon: Calendar,
      title: 'Agenda de Eventos',
      description: 'Gerencie datas, locais e horários. Nunca mais se perca entre compromissos.'
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Gerencie cachês, adiantamentos e pagamentos. Emita recibos profissionais.'
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Organize músicos, técnicos e equipe de apoio. Controle escalas e pagamentos.'
    },
    {
      icon: FileText,
      title: 'Contratos e Riders',
      description: 'Crie contratos profissionais e riders técnicos personalizados para cada evento.'
    },
    {
      icon: TrendingUp,
      title: 'Relatórios de Performance',
      description: 'Acompanhe faturamento, eventos realizados e crescimento da sua carreira.'
    }
  ]

  const benefits = [
    {
      title: 'Organize sua carreira',
      description: 'Tenha controle total da sua agenda, shows e compromissos em uma plataforma profissional.'
    },
    {
      title: 'Gerencie sua equipe',
      description: 'Escale músicos e técnicos com facilidade. Controle pagamentos e distribua funções.'
    },
    {
      title: 'Profissionalize contratos',
      description: 'Envie contratos digitais com riders técnicos completos. Impressione contratantes.'
    },
    {
      title: 'Aumente seu faturamento',
      description: 'Análises detalhadas mostram quais eventos e períodos são mais lucrativos.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-24">
        <SegmentHero
          badge="Solução especializada para Músicos"
          title="Bandas & Artistas"
          subtitle="profissionais"
          description="Plataforma completa para bandas e artistas gerenciarem shows, agenda, equipe e finanças em um só lugar."
          imageSrc="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=800&fit=crop"
          ctaText="Começar gratuitamente"
          ctaHref="#planos"
        />

        <SegmentFeatures
          title="Tudo para gerenciar sua carreira"
          subtitle="Funcionalidades pensadas para bandas e artistas"
          features={features}
        />

        <SegmentBenefits
          title="Profissionalize sua música"
          subtitle="Benefícios que vão impulsionar sua carreira"
          benefits={benefits}
          imageSrc="https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=800&fit=crop"
          imagePosition="right"
        />
      </div>

      <Footer />
    </main>
  )
}
