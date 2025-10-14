'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Search, Book, MessageCircle, Video, FileText, HelpCircle } from 'lucide-react'

export default function CentralAjudaPage() {
  const categories = [
    {
      icon: Book,
      title: 'Primeiros Passos',
      description: 'Guias para começar a usar a plataforma',
      articles: 15
    },
    {
      icon: MessageCircle,
      title: 'Chat e WhatsApp',
      description: 'Tudo sobre atendimento e mensagens',
      articles: 23
    },
    {
      icon: Video,
      title: 'Tutoriais em Vídeo',
      description: 'Aprenda assistindo passo a passo',
      articles: 18
    },
    {
      icon: FileText,
      title: 'Gestão de Eventos',
      description: 'Como organizar e gerenciar eventos',
      articles: 31
    }
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Central de Ajuda
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Encontre respostas, tutoriais e guias para aproveitar ao máximo nossa plataforma
            </p>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ajuda..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.title}
                  className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {category.description}
                  </p>
                  <span className="text-orange-500 text-sm font-medium">
                    {category.articles} artigos
                  </span>
                </div>
              )
            })}
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
            <HelpCircle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Não encontrou o que procurava?</h2>
            <p className="text-white/90 mb-6">
              Nossa equipe está pronta para ajudar você
            </p>
            <button className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Falar com Suporte
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
