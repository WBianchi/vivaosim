'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Shield, Lock, Eye, FileCheck, Download, Trash2 } from 'lucide-react'

export default function LGPDPage() {
  const rights = [
    {
      icon: Eye,
      title: 'Acesso aos Dados',
      description: 'Solicite uma cópia de todos os dados pessoais que mantemos sobre você'
    },
    {
      icon: FileCheck,
      title: 'Correção de Dados',
      description: 'Atualize ou corrija informações incompletas ou desatualizadas'
    },
    {
      icon: Download,
      title: 'Portabilidade',
      description: 'Exporte seus dados em formato estruturado para uso em outros serviços'
    },
    {
      icon: Trash2,
      title: 'Exclusão',
      description: 'Solicite a eliminação definitiva dos seus dados pessoais'
    },
    {
      icon: Lock,
      title: 'Anonimização',
      description: 'Peça para tornar seus dados anônimos e não identificáveis'
    },
    {
      icon: Shield,
      title: 'Revogação',
      description: 'Revogue o consentimento para uso dos seus dados a qualquer momento'
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
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Lei Geral de Proteção de Dados
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              LGPD - Seus Direitos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Estamos comprometidos com a proteção dos seus dados pessoais
            </p>
          </div>

          {/* What is LGPD */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              O que é a LGPD?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que regula o tratamento de dados pessoais, garantindo mais controle aos cidadãos sobre suas informações.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Na Viva o Sim, seguimos rigorosamente os princípios da LGPD para proteger sua privacidade e garantir a segurança dos seus dados.
            </p>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Seus Direitos como Titular de Dados
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {rights.map((right, index) => {
                const IconComponent = right.icon
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {right.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {right.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* How We Protect */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Como Protegemos seus Dados
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  1. Bases Legais para Tratamento
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tratamos seus dados apenas com base em hipóteses legais válidas: consentimento, execução de contrato, cumprimento de obrigação legal, proteção ao crédito, e legítimo interesse.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  2. Medidas de Segurança
                </h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Criptografia de ponta a ponta (SSL/TLS)</li>
                  <li>Controles de acesso baseados em função</li>
                  <li>Monitoramento 24/7 de segurança</li>
                  <li>Backups automáticos e seguros</li>
                  <li>Testes regulares de vulnerabilidade</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  3. Transferência Internacional
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Quando necessário transferir dados internacionalmente, garantimos que o país destinatário oferece grau adequado de proteção ou utilizamos cláusulas contratuais padrão.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  4. Minimização de Dados
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coletamos apenas dados estritamente necessários para a finalidade específica. Não mantemos informações desnecessárias ou excessivas.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  5. Transparência
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Você sempre saberá quais dados coletamos, como usamos e com quem compartilhamos. Informamos sobre qualquer alteração no tratamento.
                </p>
              </div>
            </div>
          </div>

          {/* Exercise Your Rights */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Como Exercer seus Direitos
            </h2>
            <p className="text-white/90 mb-6">
              Para exercer qualquer um dos seus direitos previstos na LGPD, entre em contato com nosso Encarregado de Dados (DPO):
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  📧
                </div>
                <div>
                  <div className="text-sm text-white/80">E-mail</div>
                  <div className="font-semibold">privacidade@vivaosim.com.br</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  📱
                </div>
                <div>
                  <div className="text-sm text-white/80">WhatsApp</div>
                  <div className="font-semibold">(11) 99999-9999</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/80 mt-6">
              Responderemos sua solicitação em até 15 dias úteis conforme estabelecido pela LGPD
            </p>
          </div>

          {/* Incident Response */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Resposta a Incidentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Em caso de incidente de segurança que possa acarretar risco aos seus direitos e liberdades:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>Notificaremos você em prazo razoável</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>Comunicaremos a ANPD quando apropriado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>Tomaremos medidas imediatas para mitigar impactos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold mt-1">•</span>
                <span>Forneceremos orientações sobre como se proteger</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
