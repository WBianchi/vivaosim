'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Award, TrendingUp, Users, Star } from 'lucide-react'

export default function CasosSucessoPage() {
  const cases = [
    {
      company: 'Assessoria Elegância',
      segment: 'Assessoria Cerimonial',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b3?w=400&h=300&fit=crop',
      growth: '+180%',
      metric: 'eventos organizados',
      quote: 'A plataforma revolucionou nossa forma de trabalhar. Conseguimos atender 3x mais clientes sem aumentar a equipe.',
      author: 'Maria Silva',
      role: 'CEO'
    },
    {
      company: 'Buffet Premium',
      segment: 'Buffet & Catering',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
      growth: '+250%',
      metric: 'faturamento',
      quote: 'O controle de custos e gestão de estoque nos permitiu aumentar nossa margem em 40%.',
      author: 'João Santos',
      role: 'Proprietário'
    },
    {
      company: 'Foto Arte Studio',
      segment: 'Fotografia',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop',
      growth: '+120%',
      metric: 'contratos fechados',
      quote: 'As propostas automatizadas e portfólio integrado aumentaram nossa taxa de conversão drasticamente.',
      author: 'Ana Costa',
      role: 'Fotógrafa'
    }
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-500/20 rounded-full mb-6">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Histórias Reais
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Casos de Sucesso
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Conheça empresas que transformaram seus negócios com nossa plataforma
            </p>
          </div>

          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-16">
            <div className="grid md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">50k+</div>
                <div className="text-white/90">Clientes Ativos</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-white/90">Eventos Realizados</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-white/90">Satisfação</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">+150%</div>
                <div className="text-white/90">Crescimento Médio</div>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="space-y-12">
            {cases.map((case_, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto">
                    <img
                      src={case_.image}
                      alt={case_.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold rounded-full mb-4">
                      {case_.segment}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {case_.company}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {case_.growth}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-500">
                          {case_.metric}
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <blockquote className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
                      "{case_.quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        {case_.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {case_.author}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {case_.role}, {case_.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para ser nosso próximo caso de sucesso?
            </h2>
            <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all text-lg">
              Começar Gratuitamente
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
