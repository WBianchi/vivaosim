'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Shield, Lock, Eye, Database } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-500/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Sua Privacidade
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Política de Privacidade
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Última atualização: 14 de Outubro de 2024
            </p>
          </div>

          {/* Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <Lock className="w-6 h-6 text-orange-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Segurança</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Seus dados protegidos com criptografia</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <Eye className="w-6 h-6 text-orange-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Transparência</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Você sabe o que coletamos</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <Database className="w-6 h-6 text-orange-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Controle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie seus dados a qualquer momento</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Informações que Coletamos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Coletamos informações que você nos fornece diretamente:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Nome, e-mail e telefone ao criar sua conta</li>
                <li>Informações de pagamento (processadas por terceiros)</li>
                <li>Dados de uso da plataforma e preferências</li>
                <li>Conteúdo que você cria (eventos, contatos, propostas)</li>
                <li>Mensagens e comunicações através da plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. Como Usamos suas Informações
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar sua conta</li>
                <li>Enviar notificações e atualizações importantes</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Análises e melhorias de produto</li>
                <li>Prevenir fraudes e abusos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Compartilhamento de Dados
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Não vendemos seus dados pessoais. Compartilhamos informações apenas:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Com prestadores de serviços (hospedagem, pagamentos)</li>
                <li>Para cumprir obrigações legais</li>
                <li>Para proteger direitos e segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. Segurança dos Dados
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais, incluindo:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Criptografia SSL/TLS em todas as conexões</li>
                <li>Armazenamento seguro em servidores certificados</li>
                <li>Backups regulares e redundância de dados</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Seus Direitos (LGPD)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                De acordo com a LGPD, você tem direito a:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar anonimização ou exclusão</li>
                <li>Revogar consentimento</li>
                <li>Portabilidade de dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Cookies e Tecnologias
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode gerenciar preferências de cookies nas configurações do navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Retenção de Dados
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Mantemos seus dados pelo tempo necessário para fornecer os serviços e cumprir obrigações legais. Após o cancelamento da conta, dados são anonimizados ou excluídos conforme aplicável.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Contato e DPO
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato com nosso Encarregado de Dados (DPO):{' '}
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
