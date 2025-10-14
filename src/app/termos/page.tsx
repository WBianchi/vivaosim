'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { FileText, Shield, AlertCircle } from 'lucide-react'

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-500/20 rounded-full mb-6">
              <FileText className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Documentação Legal
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Termos de Uso
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Última atualização: 14 de Outubro de 2024
            </p>
          </div>

          {/* Notice */}
          <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6 mb-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Importante
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Ao utilizar nossa plataforma, você concorda com estes termos. Por favor, leia com atenção.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Ao acessar e usar a plataforma Viva o Sim, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com alguma parte destes termos, não utilize nossos serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Descrição do Serviço
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                A Viva o Sim é uma plataforma de gestão de eventos que oferece ferramentas para organização, planejamento, atendimento ao cliente e gestão financeira para profissionais do mercado de eventos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Cadastro e Conta
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Para utilizar nossos serviços, você deve:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a confidencialidade de sua senha</li>
                <li>Ser maior de 18 anos ou ter consentimento legal</li>
                <li>Não compartilhar sua conta com terceiros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Uso Aceitável
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Você concorda em NÃO:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                <li>Violar direitos de propriedade intelectual</li>
                <li>Transmitir vírus ou códigos maliciosos</li>
                <li>Fazer engenharia reversa do software</li>
                <li>Usar bots ou scripts automatizados sem autorização</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Propriedade Intelectual
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Todo o conteúdo, marcas, logotipos e código-fonte da plataforma são propriedade da Viva o Sim e protegidos por leis de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Planos e Pagamentos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Os serviços são oferecidos mediante assinatura. O não pagamento pode resultar na suspensão ou cancelamento da conta. Reembolsos seguem nossa política específica.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Limitação de Responsabilidade
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                A Viva o Sim não se responsabiliza por danos indiretos, perdas de dados ou lucros cessantes. Utilizamos da plataforma é por sua conta e risco.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Modificações
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As mudanças entram em vigor imediatamente após publicação.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Contato
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Para questões sobre estes termos, entre em contato conosco em:{' '}
                <a href="mailto:legal@vivaosim.com.br" className="text-orange-500 hover:text-orange-600">
                  legal@vivaosim.com.br
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
