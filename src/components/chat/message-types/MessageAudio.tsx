'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Download, Mic } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessageAudioProps {
  message: Message
  isFromMe: boolean
}

export const MessageAudio: React.FC<MessageAudioProps> = ({ message, isFromMe }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const audioUrl = message.mediaUrl || message.content || message.body || ''

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="group relative">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg min-w-[280px] max-w-sm`}>
        {/* Ícone de Áudio */}
        <div className={`p-3 rounded-full ${isFromMe ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
          <Mic className={`w-5 h-5 ${isFromMe ? 'text-white' : 'text-blue-600'}`} />
        </div>

        {/* Player */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {/* Botão Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className={`p-2 rounded-full ${isFromMe ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} transition-colors`}
            >
              {isPlaying ? (
                <Pause className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
              ) : (
                <Play className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
              )}
            </motion.button>

            {/* Barra de Progresso */}
            <div className="flex-1">
              <div className={`w-full h-1 ${isFromMe ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'} rounded-full overflow-hidden`}>
                <div
                  className={`h-full ${isFromMe ? 'bg-white' : 'bg-blue-500'} transition-all`}
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className={`text-xs mt-1 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Botão Download */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open(audioUrl, '_blank')}
              className={`p-2 rounded-full ${isFromMe ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} transition-colors`}
            >
              <Download className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`} />
            </motion.button>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
