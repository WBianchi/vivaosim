'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageEventProps {
  message: Message
  isFromMe: boolean
}

export const MessageEvent: React.FC<MessageEventProps> = ({ message, isFromMe }) => {
  // Simular dados do evento (em produção viria de message.eventData)
  const eventData = {
    title: message.eventTitle || 'Evento',
    description: message.eventDescription || '',
    startDate: message.eventStartDate || new Date().toISOString(),
    endDate: message.eventEndDate || new Date().toISOString(),
    location: message.eventLocation || '',
    attendees: message.eventAttendees || []
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleAddToCalendar = () => {
    console.log('📅 Adicionar ao calendário:', eventData)
    // TODO: Implementar integração com calendário
  }

  return (
    <div className="group relative">
      <div className={`p-4 rounded-xl ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg min-w-[320px] max-w-md`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-full ${isFromMe ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/30'}`}>
            <Calendar className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-green-600'}`} />
          </div>
          <span className={`text-xs font-medium ${isFromMe ? 'text-white/80' : 'text-gray-500'}`}>
            EVENTO
          </span>
        </div>

        {/* Título */}
        <h3 className={`text-lg font-bold mb-3 ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
          {eventData.title}
        </h3>

        {/* Descrição */}
        {eventData.description && (
          <p className={`text-sm mb-3 ${isFromMe ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
            {eventData.description}
          </p>
        )}

        {/* Detalhes */}
        <div className="space-y-2 mb-3">
          {/* Data e Hora */}
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm font-medium ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                {formatDate(eventData.startDate)}
              </p>
              <p className={`text-xs ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
                {formatTime(eventData.startDate)} - {formatTime(eventData.endDate)}
              </p>
            </div>
          </div>

          {/* Localização */}
          {eventData.location && (
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`} />
              <p className={`text-sm ${isFromMe ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}>
                {eventData.location}
              </p>
            </div>
          )}

          {/* Participantes */}
          {eventData.attendees.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className={`w-4 h-4 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`} />
              <p className={`text-sm ${isFromMe ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}>
                {eventData.attendees.length} participante{eventData.attendees.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Botão de Ação */}
        {!isFromMe && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCalendar}
            className="w-full p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium text-sm transition-all"
          >
            Adicionar ao Calendário
          </motion.button>
        )}

        {/* Timestamp */}
        <div className={`text-xs mt-3 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
