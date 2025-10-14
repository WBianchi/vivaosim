'use client'

import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import { Video, Calendar, Clock, Users } from 'lucide-react'

export default function WebinarsPage() {
  const webinars = [
    {
      title: 'Como organizar eventos corporativos de sucesso',
      date: '15 Nov, 2024',
      time: '14:00 - 15:30',
      participants: 234,
      status: 'upcoming'
    },
    {
      title: 'Gestão financeira para buffets e catering',
      date: '20 Nov, 2024',
      time: '16:00 - 17:00',
      participants: 189,
      status: 'upcoming'
    },
    {
      title: 'Marketing digital para fotógrafos de eventos',
      date: '08 Nov, 2024',
      time: '10:00 - 11:30',
      participants: 456,
      status: 'recorded'
    },
    {
      title: 'Automação de processos em assessoria cerimonial',
      date: '01 Nov, 2024',
      time: '15:00 - 16:00',
      participants: 312,
      status: 'recorded'
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
              <Video className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Aprenda com especialistas
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Webinars Gratuitos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Participe dos nossos webinars e aprenda as melhores práticas do mercado de eventos
            </p>
          </div>

          {/* Webinars List */}
          <div className="max-w-4xl mx-auto space-y-6">
            {webinars.map((webinar, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {webinar.status === 'upcoming' ? (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                          PRÓXIMO
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs font-semibold rounded-full">
                          GRAVADO
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {webinar.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{webinar.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{webinar.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{webinar.participants} inscritos</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all whitespace-nowrap">
                    {webinar.status === 'upcoming' ? 'Inscrever-se' : 'Assistir gravação'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
            <Video className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Receba avisos de novos webinars</h2>
            <p className="text-white/90 mb-6">
              Cadastre-se e seja notificado quando novos webinars estiverem disponíveis
            </p>
            <button className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Cadastrar E-mail
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
