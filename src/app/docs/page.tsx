'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Book, Code, Terminal, Package, Zap, FileText } from 'lucide-react'

export default function DocumentacaoPage() {
  const sections = [
    {
      icon: Book,
      title: 'Guia de Início Rápido',
      description: 'Configure sua conta em minutos',
      href: '#quickstart'
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Documentação completa da API',
      href: '#api'
    },
    {
      icon: Terminal,
      title: 'SDK & Libraries',
      description: 'Bibliotecas em várias linguagens',
      href: '#sdk'
    },
    {
      icon: Package,
      title: 'Integrações',
      description: 'Conecte com outras ferramentas',
      href: '#integrations'
    },
    {
      icon: Zap,
      title: 'Webhooks',
      description: 'Receba eventos em tempo real',
      href: '#webhooks'
    },
    {
      icon: FileText,
      title: 'Changelog',
      description: 'Histórico de atualizações',
      href: '#changelog'
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
              <Book className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Documentação Técnica
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Documentação Completa
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tudo que você precisa para integrar e usar nossa plataforma
            </p>
          </div>

          {/* Sections Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <a
                  key={section.title}
                  href={section.href}
                  className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 group"
                >
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </a>
              )
            })}
          </div>

          {/* Code Example */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-mono">Exemplo de Integração</span>
              <span className="text-orange-400 text-xs">JavaScript</span>
            </div>
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import { VivaOSimSDK } from '@vivaosim/sdk';

const client = new VivaOSimSDK({
  apiKey: 'your-api-key-here'
});

// Criar um novo evento
const evento = await client.events.create({
  titulo: 'Casamento João & Maria',
  data: '2024-12-25',
  local: 'Espaço Garden'
});

console.log('Evento criado:', evento.id);`}
            </pre>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
