'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageLocationProps {
  message: Message
  isFromMe: boolean
}

export const MessageLocation: React.FC<MessageLocationProps> = ({ message, isFromMe }) => {
  // Dados da localização (em produção viria de message)
  const locationData = {
    latitude: message.latitude || -23.5505,
    longitude: message.longitude || -46.6333,
    title: message.locationTitle || 'Localização',
    address: message.locationAddress || ''
  }

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${locationData.latitude},${locationData.longitude}&zoom=15&size=400x200&markers=color:red%7C${locationData.latitude},${locationData.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}`

  const handleOpenMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}`,
      '_blank'
    )
  }

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${locationData.latitude},${locationData.longitude}`,
      '_blank'
    )
  }

  return (
    <div className="group relative">
      <div className={`rounded-xl overflow-hidden ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg max-w-sm`}>
        {/* Mapa */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          <img
            src={staticMapUrl}
            alt="Mapa"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback se a API key não estiver configurada
              e.currentTarget.src = `https://via.placeholder.com/400x200/6366f1/ffffff?text=${encodeURIComponent(locationData.title)}`
            }}
          />
          
          {/* Ícone de Pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" />
          </div>
        </div>

        {/* Informações */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-full ${isFromMe ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <MapPin className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-red-600'}`} />
            </div>
            <span className={`text-xs font-medium ${isFromMe ? 'text-white/80' : 'text-gray-500'}`}>
              LOCALIZAÇÃO
            </span>
          </div>

          {/* Título */}
          <h3 className={`text-base font-bold mb-1 ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
            {locationData.title}
          </h3>

          {/* Endereço */}
          {locationData.address && (
            <p className={`text-sm mb-3 ${isFromMe ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
              {locationData.address}
            </p>
          )}

          {/* Coordenadas */}
          <p className={`text-xs mb-3 font-mono ${isFromMe ? 'text-white/60' : 'text-gray-500'}`}>
            {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
          </p>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenMaps}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg ${
                isFromMe 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400'
              } transition-colors`}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">Abrir Mapa</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetDirections}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg ${
                isFromMe 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400'
              } transition-colors`}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-sm font-medium">Rotas</span>
            </motion.button>
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-3 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
