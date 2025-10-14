'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import SegmentHero from '@/components/segments/SegmentHero'
import SegmentFeatures from '@/components/segments/SegmentFeatures'
import SegmentBenefits from '@/components/segments/SegmentBenefits'
import { Palette, Package, TrendingUp, FileText, Image, Calculator } from 'lucide-react'

export default function DecoracaoEventosPage() {
  const features = [
    {
      icon: Palette,
      title: 'Catálogo de Decorações',
      description: 'Organize seus estilos, temas e itens decorativos. Mostre seu portfólio aos clientes.'
    },
    {
      icon: Package,
      title: 'Controle de Inventário',
      description: 'Gerencie peças, móveis e itens decorativos. Controle estoque e disponibilidade.'
    },
    {
      icon: TrendingUp,
      title: 'Propostas Visuais',
      description: 'Crie propostas com fotos, mockups e orçamentos detalhados para cada ambiente.'
    },
    {
      icon: FileText,
      title: 'Contratos Profissionais',
      description: 'Envie contratos digitais com especificações técnicas e prazos de montagem.'
    },
    {
      icon: Image,
      title: 'Galeria de Projetos',
      description: 'Portfolio digital organizado por estilo, cor e tipo de evento realizado.'
    },
    {
      icon: Calculator,
      title: 'Cálculo de Custos',
      description: 'Calcule materiais, mão de obra e margem de lucro automaticamente.'
    }
  ]

  const benefits = [
    {
      title: 'Impressione seus clientes',
      description: 'Apresente propostas visuais incríveis com mockups 3D e referências do seu portfólio.'
    },
    {
      title: 'Controle seu estoque',
      description: 'Saiba exatamente quais peças estão disponíveis para cada data e evento.'
    },
    {
      title: 'Otimize montagens',
      description: 'Planeje logística de montagem, equipe necessária e tempo estimado.'
    },
    {
      title: 'Aumente sua margem',
      description: 'Calcule custos reais e precifique seus projetos com precisão.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-24">
        <SegmentHero
          badge="Solução especializada para Decoradores"
          title="Decoração de Eventos"
          subtitle="memoráveis"
          description="Plataforma completa para decoradores. Gerencie projetos, inventário, propostas e encante seus clientes."
          imageSrc="https://images.unsplash.com/photo-1519167758481-83f29da8c2b3?w=800&h=800&fit=crop"
          ctaText="Começar gratuitamente"
          ctaHref="#planos"
        />

        <SegmentFeatures
          title="Tudo para gerenciar suas decorações"
          subtitle="Funcionalidades desenvolvidas para decoradores"
          features={features}
        />

        <SegmentBenefits
          title="Transforme ambientes"
          subtitle="Benefícios que vão revolucionar seu negócio"
          benefits={benefits}
          imageSrc="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop"
          imagePosition="left"
        />
      </div>

      <Footer />
    </main>
  )
}
