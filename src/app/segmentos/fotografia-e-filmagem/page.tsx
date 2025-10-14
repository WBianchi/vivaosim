'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import SegmentHero from '@/components/segments/SegmentHero'
import SegmentFeatures from '@/components/segments/SegmentFeatures'
import SegmentBenefits from '@/components/segments/SegmentBenefits'
import { Camera, Video, Image, FolderOpen, Share2, CreditCard } from 'lucide-react'

export default function FotografiaFilmagemPage() {
  const features = [
    {
      icon: Camera,
      title: 'Gestão de Sessões',
      description: 'Organize ensaios, eventos e sessões. Controle datas, locais, equipamentos e equipe.'
    },
    {
      icon: Video,
      title: 'Pacotes Personalizados',
      description: 'Crie pacotes de foto e vídeo com diferentes serviços, entregas e valores.'
    },
    {
      icon: Image,
      title: 'Galeria de Portfólio',
      description: 'Mostre seu trabalho com galerias profissionais. Impressione clientes com seu portfólio.'
    },
    {
      icon: FolderOpen,
      title: 'Entrega de Arquivos',
      description: 'Entregue fotos e vídeos de forma organizada. Galerias privadas para cada cliente.'
    },
    {
      icon: Share2,
      title: 'Contratos Digitais',
      description: 'Envie contratos, colete assinaturas e formalize acordos de forma 100% digital.'
    },
    {
      icon: CreditCard,
      title: 'Gestão Financeira',
      description: 'Controle pagamentos, parcelamentos e comissões. Emita recibos e notas fiscais.'
    }
  ]

  const benefits = [
    {
      title: 'Organize sua agenda',
      description: 'Nunca mais perca um compromisso. Gerencie todas as suas sessões e eventos em um calendário inteligente.'
    },
    {
      title: 'Agilize entregas',
      description: 'Entregue fotos e vídeos diretamente pela plataforma. Seus clientes acessam de qualquer lugar.'
    },
    {
      title: 'Profissionalize propostas',
      description: 'Envie orçamentos detalhados com seus pacotes, valores e formas de pagamento.'
    },
    {
      title: 'Aumente suas vendas',
      description: 'Mostre seu portfólio integrado às propostas. Converta mais leads em clientes.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-24">
        <SegmentHero
          badge="Solução especializada para Fotógrafos"
          title="Fotografia & Filmagem"
          subtitle="profissional"
          description="A plataforma completa para fotógrafos e cinegrafistas. Gerencie sessões, entregue arquivos e feche mais contratos."
          imageSrc="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=800&fit=crop"
          ctaText="Começar gratuitamente"
          ctaHref="#planos"
        />

        <SegmentFeatures
          title="Tudo para gerenciar seu estúdio"
          subtitle="Funcionalidades desenvolvidas para fotógrafos e cinegrafistas"
          features={features}
        />

        <SegmentBenefits
          title="Potencialize seus resultados"
          subtitle="Benefícios que vão transformar seu negócio"
          benefits={benefits}
          imageSrc="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=800&fit=crop"
          imagePosition="left"
        />
      </div>

      <Footer />
    </main>
  )
}
