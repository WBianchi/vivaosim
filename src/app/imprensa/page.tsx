import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PageHero from '@/components/shared/PageHero'
import CTASection from '@/components/shared/CTASection'
import { 
  Newspaper, 
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
  Download,
  Image,
  FileText,
  Mic,
  Video,
  Camera,
  Mail,
  Phone,
  Calendar,
  ExternalLink
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Imprensa | Viva o Sim - Sala de Imprensa e Recursos para Mídia',
  description: 'Recursos para imprensa do Viva o Sim: press releases, kit de imprensa, contatos, prêmios e reconhecimentos. Informações oficiais para jornalistas.',
  keywords: 'imprensa viva o sim, press release, kit imprensa, mídia eventos, prêmios reconhecimentos, contato imprensa',
  openGraph: {
    title: 'Sala de Imprensa - Recursos Oficiais para Mídia',
    description: 'Informações, recursos e contatos oficiais para jornalistas e mídia.',
    images: ['/og-imprensa.jpg'],
  }
}

const ImprensaPage = () => {
  const noticias = [
    {
      data: '15 Dez 2024',
      titulo: 'Viva o Sim Capta R$ 50M em Series B para Expansão Internacional',
      resumo: 'Nova rodada de investimento liderada pela Andreessen Horowitz visa acelerar crescimento na América Latina e desenvolvimento de IA.',
      categoria: 'Investimento',
      link: '#',
      destaque: true
    },
    {
      data: '28 Nov 2024',
      titulo: 'Plataforma Atinge Marca de 10 Milhões de Participantes em Eventos',
      resumo: 'Marco histórico reflete crescimento exponencial da digitalização de eventos no Brasil pós-pandemia.',
      categoria: 'Milestone',
      link: '#',
      destaque: false
    },
    {
      data: '10 Nov 2024',
      titulo: 'Viva o Sim Vence Prêmio Startup do Ano na ABStartups Awards',
      resumo: 'Reconhecimento como a startup que mais impactou o ecossistema de eventos e tecnologia em 2024.',
      categoria: 'Prêmio',
      link: '#',
      destaque: false
    },
    {
      data: '22 Out 2024',
      titulo: 'CEO Carlos Silva Entre os 40 Under 40 da Forbes Brasil',
      resumo: 'Fundador da Viva o Sim reconhecido como um dos jovens líderes mais influentes do país.',
      categoria: 'Reconhecimento',
      link: '#',
      destaque: false
    },
    {
      data: '05 Out 2024',
      titulo: 'Parceria Estratégica com Google Cloud para IA Avançada',
      resumo: 'Integração com Google AI Platform vai potencializar recursos de análise preditiva e automação.',
      categoria: 'Parceria',
      link: '#',
      destaque: false
    },
    {
      data: '18 Set 2024',
      titulo: 'Expansão para México e Argentina Oficialmente Lançada',
      resumo: 'Primeiro passo da internacionalização marca entrada no mercado latino-americano de eventos.',
      categoria: 'Expansão',
      link: '#',
      destaque: false
    }
  ]

  const premios = [
    {
      ano: '2024',
      premio: 'Startup do Ano',
      organizacao: 'ABStartups Awards',
      categoria: 'Melhor Startup B2B',
      descricao: 'Reconhecimento como a startup que mais impactou o ecossistema empresarial brasileiro.'
    },
    {
      ano: '2024',
      premio: 'Top 100 Startups to Watch',
      organizacao: 'LinkedIn',
      categoria: 'Tecnologia',
      descricao: 'Selecionada entre as 100 startups mais promissoras do mundo pela LinkedIn.'
    },
    {
      ano: '2023',
      premio: 'Prêmio Inovação',
      organizacao: 'Sebrae Nacional',
      categoria: 'Transformação Digital',
      descricao: 'Premiada pela contribuição para transformação digital de pequenas e médias empresas.'
    },
    {
      ano: '2023',
      premio: 'Best SaaS Product',
      organizacao: 'SaaS Awards Brasil',
      categoria: 'Eventos & Marketing',
      descricao: 'Melhor produto SaaS na categoria de gestão de eventos e marketing digital.'
    }
  ]

  const executivos = [
    {
      nome: 'Carlos Eduardo Silva',
      cargo: 'CEO & Co-fundador',
      bio: 'Visionário com 15+ anos em tecnologia. Especialista em crescimento de startups e inovação disruptiva.',
      email: 'carlos.silva@vivaosim.com',
      linkedin: 'carlos-silva-ceo',
      disponibilidade: 'Entrevistas por agendamento'
    },
    {
      nome: 'Ana Paula Rocha',
      cargo: 'CTO & Co-fundadora',
      bio: 'Arquiteta de software com paixão por IA e ML. PhD em Ciência da Computação.',
      email: 'ana.rocha@vivaosim.com',
      linkedin: 'ana-rocha-cto',
      disponibilidade: 'Temas técnicos e inovação'
    },
    {
      nome: 'Roberto Santos',
      cargo: 'CPO & Co-fundador',
      bio: 'Product Manager experiente com foco em UX. Especialista em design thinking.',
      email: 'roberto.santos@vivaosim.com',
      linkedin: 'roberto-santos-cpo',
      disponibilidade: 'Produto e experiência do usuário'
    }
  ]

  const recursos = [
    {
      titulo: 'Kit de Imprensa Completo',
      descricao: 'Logos, fotos, informações corporativas e dados da empresa.',
      formato: 'ZIP (25MB)',
      icone: Download
    },
    {
      titulo: 'Banco de Imagens HD',
      descricao: 'Fotos oficiais da empresa, eventos e equipe em alta resolução.',
      formato: 'JPG/PNG',
      icone: Image
    },
    {
      titulo: 'Fact Sheet Atualizado',
      descricao: 'Dados, métricas e informações essenciais sobre a empresa.',
      formato: 'PDF',
      icone: FileText
    },
    {
      titulo: 'Logos e Identidade Visual',
      descricao: 'Logotipos em diversos formatos e guia de uso da marca.',
      formato: 'SVG/PNG/AI',
      icone: Target
    }
  ]

  const contatos = [
    {
      area: 'Assessoria de Imprensa',
      nome: 'Mariana Comunicação',
      email: 'imprensa@vivaosim.com',
      telefone: '+55 11 9999-8888',
      especialidade: 'Contato principal para mídia'
    },
    {
      area: 'Relações Públicas',
      nome: 'Paula Martins',
      email: 'rp@vivaosim.com',
      telefone: '+55 11 9999-7777',
      especialidade: 'Eventos corporativos e parcerias'
    },
    {
      area: 'Investidores',
      nome: 'Ricardo Finanças',
      email: 'investors@vivaosim.com',
      telefone: '+55 11 9999-6666',
      especialidade: 'Relações com investidores'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        title="Sala de Imprensa"
        description="Recursos completos para jornalistas e mídia. Press releases, kit de imprensa, contatos executivos e informações oficiais sobre o Viva o Sim."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Empresa', href: '/sobre' },
          { label: 'Imprensa' }
        ]}
        badge={{
          text: 'Recursos para Mídia',
          variant: 'primary'
        }}
        size="large"
      />

      {/* Últimas Notícias */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Últimas <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Notícias</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Press releases e anúncios oficiais mais recentes
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {noticias.map((noticia, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border hover:scale-105 transition-all duration-300 ${
                  noticia.destaque 
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-gray-200 dark:border-slate-700'
                }`}
              >
                {noticia.destaque && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-medium mb-4">
                    🔥 Destaque
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {noticia.data}
                    </div>
                    <span className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                      {noticia.categoria}
                    </span>
                  </div>
                  <button className="text-orange-500 hover:text-orange-600 flex items-center space-x-1 text-sm font-medium">
                    <span>Ler mais</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {noticia.titulo}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {noticia.resumo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prêmios e Reconhecimentos */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Prêmios e <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Reconhecimentos</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Reconhecimentos da indústria e mídia especializada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {premios.map((premio, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-orange-500">{premio.ano}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{premio.categoria}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {premio.premio}
                </h3>

                <div className="text-orange-500 font-medium mb-4">
                  {premio.organizacao}
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {premio.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos para Imprensa */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Recursos para <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Mídia</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Downloads e materiais oficiais para jornalistas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recursos.map((recurso, index) => {
              const IconeComponent = recurso.icone
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <IconeComponent className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {recurso.titulo}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    {recurso.descricao}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {recurso.formato}
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors">
                    Download
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Executivos Disponíveis */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Executivos <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Disponíveis</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Liderança disponível para entrevistas e comentários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {executivos.map((exec, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 hover:scale-105 transition-all duration-300"
              >
                {/* Avatar placeholder */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {exec.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {exec.nome}
                  </h3>
                  <div className="text-orange-500 font-medium mb-4">{exec.cargo}</div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {exec.bio}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>{exec.email}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {exec.disponibilidade}
                  </div>
                </div>

                <button className="w-full mt-6 bg-orange-100 dark:bg-orange-500/20 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-orange-600 dark:text-orange-400 font-medium py-3 px-6 rounded-lg transition-colors">
                  Agendar Entrevista
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contatos */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Contatos de <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Imprensa</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Equipe especializada para atendimento à mídia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contatos.map((contato, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-orange-500" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {contato.area}
                </h3>
                <div className="text-orange-500 font-medium mb-4">{contato.nome}</div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {contato.email}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {contato.telefone}
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {contato.especialidade}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Atendimento Prioritário para Mídia
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Garantimos resposta em até 2 horas úteis para solicitações de imprensa
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                  Contato Urgente
                </button>
                <button className="bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg border border-gray-200 dark:border-slate-600 transition-colors">
                  Agendar Pauta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Precisa de Mais Informações?"
        description="Nossa equipe de imprensa está sempre disponível para fornecer informações adicionais, agendar entrevistas e atender solicitações da mídia."
        variant="gradient"
        buttons={[
          {
            text: 'Contatar Imprensa',
            href: 'mailto:imprensa@vivaosim.com',
            variant: 'primary',
            icon: 'mail'
          },
          {
            text: 'Download Kit Completo',
            href: '#recursos',
            variant: 'outline',
            icon: 'download'
          }
        ]}
        stats={[
          { value: '50+', label: 'Matérias Publicadas' },
          { value: '15', label: 'Prêmios Recebidos' },
          { value: '2h', label: 'Tempo de Resposta' },
          { value: '100%', label: 'Transparência' }
        ]}
        badge="Sala de Imprensa"
      />

      <Footer />
    </div>
  )
}

export default ImprensaPage
