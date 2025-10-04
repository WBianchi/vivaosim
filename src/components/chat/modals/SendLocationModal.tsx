'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, MapPin, Navigation } from 'lucide-react'

interface SendLocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (locationData: {
    latitude: number
    longitude: number
    address?: string
    name?: string
  }) => void
  chatName: string
}

export const SendLocationModal: React.FC<SendLocationModalProps> = ({
  isOpen,
  onClose,
  onSend,
  chatName
}) => {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  if (!isOpen) return null

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          setIsGettingLocation(false)
          
          // Tentar obter endereço via reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
            .then(res => res.json())
            .then(data => {
              if (data.display_name) {
                setAddress(data.display_name)
              }
            })
            .catch(err => console.error('Erro ao buscar endereço:', err))
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          alert('Não foi possível obter sua localização')
          setIsGettingLocation(false)
        }
      )
    } else {
      alert('Geolocalização não suportada pelo navegador')
      setIsGettingLocation(false)
    }
  }

  const handleSend = () => {
    const lat = parseFloat(latitude)
    const lon = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lon)) {
      alert('Coordenadas inválidas')
      return
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert('Coordenadas fora do intervalo válido')
      return
    }

    onSend({
      latitude: lat,
      longitude: lon,
      address: address.trim() || undefined,
      name: name.trim() || undefined
    })

    // Reset
    setLatitude('')
    setLongitude('')
    setAddress('')
    setName('')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enviar Localização
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Para: {chatName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Botão de Localização Atual */}
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
          >
            <Navigation className={`w-5 h-5 ${isGettingLocation ? 'animate-spin' : ''}`} />
            {isGettingLocation ? 'Obtendo localização...' : 'Usar Minha Localização Atual'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">ou insira manualmente</span>
            </div>
          </div>

          {/* Nome do Local */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Local (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Minha Casa, Escritório..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              maxLength={100}
            />
          </div>

          {/* Coordenadas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-23.550520"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-46.633308"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço (opcional)
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Endereço completo..."
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
              maxLength={500}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={!latitude || !longitude}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar Localização
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
