'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import SegmentHero from '@/components/segments/SegmentHero'
import SegmentFeatures from '@/components/segments/SegmentFeatures'
import SegmentBenefits from '@/components/segments/SegmentBenefits'
import { Calendar, Users, FileText, Clock, CheckCircle, TrendingUp, MessageCircle, Sparkles } from 'lucide-react'

export default function AssessoriaCerimonialPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Gestão de Eventos',
      description: 'Organize casamentos, formaturas e cerimônias com cronogramas detalhados e controle total de cada etapa.'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'CRM especializado para assessores cerimonialistas. Acompanhe cada cliente desde o primeiro contato até o pós-evento.'
    },
    {
      icon: FileText,
      title: 'Contratos e Propostas',
      description: 'Crie contratos profissionais, envie propostas personalizadas e gerencie assinaturas digitais.'
    },
    {
      icon: Clock,
      title: 'Timeline de Evento',
      description: 'Monte cronogramas visuais com horários detalhados para cerimônia, recepção e todos os momentos especiais.'
    },
    {
      icon: CheckCircle,
      title: 'Checklist Completo',
      description: 'Checklists personalizáveis para cada tipo de evento. Nunca mais esqueça nenhum detalhe importante.'
    },
    {
      icon: TrendingUp,
      title: 'Relatórios Financeiros',
      description: 'Acompanhe receitas, despesas e lucratividade de cada evento. Controle financeiro completo.'
    }
  ]

  const benefits = [
    {
      title: 'Aumente sua produtividade',
      description: 'Automatize tarefas repetitivas e foque no que realmente importa: criar experiências inesquecíveis para seus clientes.'
    },
    {
      title: 'Profissionalize seu atendimento',
      description: 'Impressione seus clientes com propostas personalizadas, contratos profissionais e comunicação organizada.'
    },
    {
      title: 'Gerencie múltiplos eventos',
      description: 'Organize casamentos, formaturas e cerimônias simultaneamente sem perder o controle de nenhum detalhe.'
    },
    {
      title: 'Integração com fornecedores',
      description: 'Conecte-se com buffets, decoradores, fotógrafos e outros fornecedores. Tudo em um só lugar.'
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-24">
        <SegmentHero
          badge="Solução especializada para Assessores"
          title="Assessoria Cerimonial"
          subtitle="que encanta"
          description="A plataforma completa para assessores cerimonialistas organizarem eventos memoráveis. Do planejamento à execução, tudo em um só lugar."
          imageSrc="https://images.unsplash.com/photo-1519167758481-83f29da8c2b3?w=800&h=800&fit=crop"
          ctaText="Começar gratuitamente"
          ctaHref="#planos"
        />

        <SegmentFeatures
          title="Tudo que você precisa para eventos perfeitos"
          subtitle="Funcionalidades desenvolvidas especialmente para assessores cerimonialistas"
          features={features}
        />

        <SegmentBenefits
          title="Transforme sua forma de trabalhar"
          subtitle="Benefícios que vão revolucionar sua assessoria"
          benefits={benefits}
          imageSrc="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=800&fit=crop"
          imagePosition="left"
        />
      </div>

      <Footer />
    </main>
  )
}
