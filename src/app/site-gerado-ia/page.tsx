'use client'

import { Calendar, MapPin, Clock, Users, Heart, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function SiteGeradoIA() {
  const [showConfirmForm, setShowConfirmForm] = useState(false)

  // Dados dinâmicos que viriam da IA/banco
  const eventData = {
    groomName: 'João Silva',
    brideName: 'Maria Costa',
    eventDate: '15 de Junho de 2024',
    eventTime: '16:00',
    eventLocation: 'Espaço Celebration',
    eventAddress: 'Rua das Flores, 123 - São Paulo, SP',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    ourStory: 'Nossa história começou em uma tarde de verão, quando nossos olhares se cruzaram pela primeira vez. Desde então, cada dia tem sido uma nova página de amor, cumplicidade e felicidade. Agora, queremos celebrar este momento especial com as pessoas que mais amamos.',
    primaryColor: '#f97316', // orange-500
    secondaryColor: '#fb923c' // orange-400
  }

  const gifts = [
    { id: 1, name: 'Lua de Mel - Maldivas', price: 500, icon: '✈️', category: 'Viagem' },
    { id: 2, name: 'Kit Chá de Cozinha', price: 250, icon: '🍳', category: 'Casa' },
    { id: 3, name: 'Jogo de Toalhas', price: 180, icon: '🛁', category: 'Casa' },
    { id: 4, name: 'Aparelho de Jantar', price: 450, icon: '🍽️', category: 'Casa' },
    { id: 5, name: 'Experiência Spa', price: 300, icon: '💆', category: 'Experiência' },
    { id: 6, name: 'Smart TV 55"', price: 2500, icon: '📺', category: 'Eletrônicos' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventData.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif mb-4">
              {eventData.groomName} & {eventData.brideName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">Vamos nos casar!</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-lg">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {eventData.eventDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {eventData.eventTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {eventData.eventLocation}
              </span>
            </div>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-4">
            <a href="#nossa-historia" className="text-gray-700 hover:text-orange-500 transition-colors">Nossa História</a>
            <a href="#a-festa" className="text-gray-700 hover:text-orange-500 transition-colors">A Festa</a>
            <a href="#presentes" className="text-gray-700 hover:text-orange-500 transition-colors">Lista de Presentes</a>
            <a href="#confirmacao" className="text-gray-700 hover:text-orange-500 transition-colors">Confirmação</a>
          </div>
        </div>
      </nav>

      {/* Nossa História */}
      <section id="nossa-historia" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif text-gray-900 mb-8">Nossa História</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-orange-400 w-20"></div>
              <Heart className="w-6 h-6 text-orange-500" />
              <div className="h-px bg-orange-400 w-20"></div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {eventData.ourStory}
            </p>
          </motion.div>
        </div>
      </section>

      {/* A Festa */}
      <section id="a-festa" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif text-gray-900 mb-8">A Festa</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cerimônia</h3>
              <p className="text-gray-600">{eventData.eventTime}</p>
              <p className="text-sm text-gray-500 mt-2">Chegue com 30 minutos de antecedência</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local</h3>
              <p className="text-gray-600">{eventData.eventLocation}</p>
              <p className="text-sm text-gray-500 mt-2">{eventData.eventAddress}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recepção</h3>
              <p className="text-gray-600">Logo após a cerimônia</p>
              <p className="text-sm text-gray-500 mt-2">Festa até o amanhecer!</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lista de Presentes */}
      <section id="presentes" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Lista de Presentes</h2>
            <p className="text-gray-600">Sua presença é o nosso maior presente, mas se desejar nos presentear...</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{gift.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{gift.name}</h3>
                      <p className="text-sm text-gray-500">{gift.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">R$ {gift.price}</span>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                    Presentear
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Prefere transferência?</p>
            <div className="inline-block bg-gray-100 rounded-lg p-6">
              <p className="font-semibold text-gray-900 mb-2">PIX</p>
              <p className="text-gray-700">joao.maria.casamento@email.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmação de Presença */}
      <section id="confirmacao" className="py-20 px-4 bg-gradient-to-br from-orange-400 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-serif text-white mb-4">Confirme sua Presença</h2>
            <p className="text-white/90 mb-8 text-lg">
              Sua presença é fundamental para tornar nosso dia ainda mais especial!
            </p>
            
            {!showConfirmForm ? (
              <button
                onClick={() => setShowConfirmForm(true)}
                className="px-8 py-4 bg-white text-orange-500 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Confirmar Presença
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-8 max-w-md mx-auto"
              >
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Seu telefone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Quantos acompanhantes?</option>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                  <textarea
                    placeholder="Alguma restrição alimentar ou observação?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Enviar Confirmação
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-serif mb-4">
            {eventData.groomName} & {eventData.brideName}
          </h3>
          <p className="text-gray-400 mb-2">{eventData.eventDate}</p>
          <p className="text-gray-500 text-sm mt-8">
            Site criado com ❤️ por VivaOSim
          </p>
        </div>
      </footer>
    </div>
  )
}
