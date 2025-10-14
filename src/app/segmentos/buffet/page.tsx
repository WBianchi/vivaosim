'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import SegmentHero from '@/components/segments/SegmentHero'
import SegmentFeatures from '@/components/segments/SegmentFeatures'
import SegmentBenefits from '@/components/segments/SegmentBenefits'
import { UtensilsCrossed, Calculator, ShoppingCart, Users, ClipboardList, BarChart3 } from 'lucide-react'

export default function BuffetPage() {
  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Cardápios Digitais',
      description: 'Crie e gerencie cardápios personalizados para cada evento. Organize pratos, ingredientes e custos.'
    },
    {
      icon: Calculator,
      title: 'Calculadora de Custos',
      description: 'Calcule automaticamente custos por pessoa, margem de lucro e preço final do serviço.'
    },
    {
      icon: ShoppingCart,
      title: 'Gestão de Compras',
      description: 'Liste ingredientes, controle estoque e gerencie compras com fornecedores integrados.'
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Escale garçons, cozinheiros e equipe. Controle horários e pagamentos de cada evento.'
    },
    {
      icon: ClipboardList,
      title: 'Controle de Produção',
      description: 'Organize a produção dos pratos. Da preparação ao serviço, controle cada etapa.'
    },
    {
      icon: BarChart3,
      title: 'Análise de Performance',
      description: 'Relatórios detalhados de vendas, custos, lucro e satisfação dos clientes.'
    }
  ]

  const benefits = [
    {
      title: 'Reduza desperdícios',
      description: 'Planeje compras com precisão baseado no número exato de convidados e nas preferências alimentares.'
    },
    {
      title: 'Aumente sua margem',
      description: 'Calcule custos reais e defina preços competitivos mantendo a lucratividade do seu negócio.'
    },
    {
      title: 'Escale sua operação',
      description: 'Gerencie múltiplos eventos simultaneamente com controle total da produção e equipe.'
    },
    {
      title: 'Impressione seus clientes',
      description: 'Apresente propostas profissionais com fotos dos pratos, cardápios detalhados e valores transparentes.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-24">
        <SegmentHero
          badge="Solução especializada para Buffets"
          title="Buffet & Catering"
          subtitle="de excelência"
          description="Plataforma completa para buffets e serviços de catering. Gerencie cardápios, custos, produção e equipe em um só lugar."
          imageSrc="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=800&fit=crop"
          ctaText="Começar gratuitamente"
          ctaHref="#planos"
        />

        <SegmentFeatures
          title="Tudo para gerenciar seu buffet"
          subtitle="Funcionalidades pensadas para buffets e catering"
          features={features}
        />

        <SegmentBenefits
          title="Otimize sua operação"
          subtitle="Benefícios que vão transformar seu buffet"
          benefits={benefits}
          imageSrc="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop"
          imagePosition="right"
        />
      </div>

      <Footer />
    </main>
  )
}
