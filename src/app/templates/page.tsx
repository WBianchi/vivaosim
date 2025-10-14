'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { FileText, Download, Star, Users } from 'lucide-react'

export default function TemplatesPage() {
  const templates = [
    {
      title: 'Contrato de Assessoria Cerimonial',
      category: 'Contratos',
      downloads: 2543,
      rating: 4.9,
      description: 'Modelo completo de contrato para assessores cerimonialistas'
    },
    {
      title: 'Proposta Comercial Buffet',
      category: 'Propostas',
      downloads: 1872,
      rating: 4.8,
      description: 'Template profissional de proposta para serviços de buffet'
    },
    {
      title: 'Checklist de Casamento',
      category: 'Checklists',
      downloads: 3421,
      rating: 5.0,
      description: 'Lista completa com todas as etapas do planejamento'
    },
    {
      title: 'Cronograma de Evento',
      category: 'Planejamento',
      downloads: 2156,
      rating: 4.7,
      description: 'Timeline detalhada para organização de eventos'
    },
    {
      title: 'Orçamento de Decoração',
      category: 'Financeiro',
      downloads: 1645,
      rating: 4.9,
      description: 'Planilha de custos para projetos de decoração'
    },
    {
      title: 'Briefing de Cliente',
      category: 'Atendimento',
      downloads: 2987,
      rating: 4.8,
      description: 'Formulário para captar necessidades do cliente'
    }
  ]

  const categories = ['Todos', 'Contratos', 'Propostas', 'Checklists', 'Planejamento', 'Financeiro', 'Atendimento']

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-500/20 rounded-full mb-6">
              <FileText className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Recursos Gratuitos
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Templates Prontos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Baixe gratuitamente modelos profissionais para seu negócio de eventos
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white rounded-full font-medium transition-all border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {templates.map((template, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {template.rating}
                    </span>
                  </div>
                </div>
                
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-orange-500" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {template.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Download className="w-4 h-4" />
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                  
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-all">
                    Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Quer mais templates exclusivos?</h2>
            <p className="text-white/90 mb-6">
              Assinantes têm acesso a centenas de templates premium
            </p>
            <button className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Ver Planos
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
