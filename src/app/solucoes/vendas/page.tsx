import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import VendasHero from '@/components/solucoes/vendas/VendasHero'
import VendasPipeline from '@/components/solucoes/vendas/VendasPipeline'
import VendasAutomacao from '@/components/solucoes/vendas/VendasAutomacao'
import VendasROI from '@/components/solucoes/vendas/VendasROI'
import VendasDepoimentos from '@/components/solucoes/vendas/VendasDepoimentos'
import CTASection from '@/components/shared/CTASection'

export const metadata: Metadata = {
  title: 'CRM de Vendas | Viva o Sim - Gerencie Leads e Feche Mais Contratos',
  description: 'Potencialize suas vendas de eventos com nosso CRM inteligente. Controle leads, automatize follow-ups e aumente sua taxa de conversão em até 300%.',
  keywords: 'CRM vendas eventos, gestão leads, automação vendas, funil vendas eventos, conversão clientes',
  openGraph: {
    title: 'CRM de Vendas - Multiplique seus Resultados',
    description: 'Transforme leads em clientes com o sistema de vendas mais eficiente do mercado de eventos.',
    images: ['/og-vendas.jpg'],
  }
}

const VendasPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Específico para Vendas */}
      <VendasHero />

      {/* Pipeline Visual Interativo */}
      <VendasPipeline />

      {/* Automações Inteligentes */}
      <VendasAutomacao />

      {/* ROI e Simulador */}
      <VendasROI />

      {/* Depoimentos com Métricas */}
      <VendasDepoimentos />

      {/* CTA Final */}
      <CTASection
        title="Transforme Leads em Clientes Fiéis"
        description="Junte-se a mais de 500 empresas que já multiplicaram suas vendas com nosso sistema inteligente."
        variant="gradient"
        buttons={[
          {
            text: 'Começar Vendendo Mais',
            href: '/cadastro?produto=vendas',
            variant: 'primary',
            icon: 'arrow'
          },
          {
            text: 'Agendar Demo Personalizada',
            href: '/demo?solucao=vendas',
            variant: 'outline',
            icon: 'calendar'
          }
        ]}
        stats={[
          { value: '300%', label: 'Mais Conversões' },
          { value: '75%', label: 'Menos Trabalho' },
          { value: '24/7', label: 'Automação' },
          { value: '340%', label: 'ROI Médio' }
        ]}
        badge="Sistema Mais Completo"
      />

      <Footer />
    </div>
  )
}

export default VendasPage
