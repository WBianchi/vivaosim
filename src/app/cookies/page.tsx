'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Cookie, Check, X, Settings } from 'lucide-react'

export default function CookiesPage() {
  const cookieTypes = [
    {
      type: 'Essenciais',
      icon: Check,
      color: 'green',
      required: true,
      description: 'Necessários para o funcionamento básico da plataforma',
      examples: [
        'Autenticação de sessão',
        'Preferências de idioma',
        'Segurança e proteção contra fraudes'
      ]
    },
    {
      type: 'Funcionais',
      icon: Settings,
      color: 'blue',
      required: false,
      description: 'Melhoram a experiência com recursos personalizados',
      examples: [
        'Lembrar suas preferências',
        'Modo claro/escuro',
        'Configurações de notificação'
      ]
    },
    {
      type: 'Analíticos',
      icon: Check,
      color: 'purple',
      required: false,
      description: 'Nos ajudam a entender como você usa a plataforma',
      examples: [
        'Páginas visitadas',
        'Tempo de uso',
        'Recursos mais utilizados'
      ]
    },
    {
      type: 'Marketing',
      icon: X,
      color: 'orange',
      required: false,
      description: 'Personalizam anúncios e comunicações',
      examples: [
        'Rastreamento de campanhas',
        'Remarketing',
        'Análise de conversão'
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-500/20 rounded-full mb-6">
              <Cookie className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Transparência
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Política de Cookies
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Entenda como usamos cookies e como você pode controlá-los
            </p>
          </div>

          {/* What are Cookies */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              O que são Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles ajudam o site a lembrar suas preferências e melhorar sua experiência de navegação.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Tipos de Cookies que Usamos
            </h2>
            
            <div className="space-y-6">
              {cookieTypes.map((cookie) => {
                const IconComponent = cookie.icon
                return (
                  <div
                    key={cookie.type}
                    className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cookie.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                          cookie.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          cookie.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                          'bg-orange-100 dark:bg-orange-500/20'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            cookie.color === 'green' ? 'text-green-600' :
                            cookie.color === 'blue' ? 'text-blue-600' :
                            cookie.color === 'purple' ? 'text-purple-600' :
                            'text-orange-500'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {cookie.type}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {cookie.description}
                          </p>
                        </div>
                      </div>
                      {cookie.required && (
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full whitespace-nowrap">
                          Obrigatório
                        </span>
                      )}
                    </div>
                    
                    <div className="pl-15">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Exemplos:
                      </p>
                      <ul className="space-y-1">
                        {cookie.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* How to Control */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Como Controlar Cookies
            </h2>
            <p className="text-white/90 mb-6">
              Você pode gerenciar suas preferências de cookies de várias formas:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Através das configurações do seu navegador</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>No painel de preferências da nossa plataforma</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Usando ferramentas de opt-out de terceiros</span>
              </li>
            </ul>
          </div>

          {/* Third Party Cookies */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Cookies de Terceiros
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Utilizamos serviços de terceiros que podem definir cookies, incluindo:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li><strong>Google Analytics:</strong> Para análise de tráfego e uso</li>
                <li><strong>Stripe:</strong> Para processamento seguro de pagamentos</li>
                <li><strong>Vercel:</strong> Para hospedagem e performance</li>
                <li><strong>Intercom:</strong> Para suporte ao cliente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Atualizações desta Política
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Podemos atualizar esta política periodicamente. Recomendamos que você revise regularmente para se manter informado sobre como protegemos suas informações.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Contato
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Se tiver dúvidas sobre nossa política de cookies, entre em contato:{' '}
                <a href="mailto:privacidade@vivaosim.com.br" className="text-orange-500 hover:text-orange-600">
                  privacidade@vivaosim.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
