'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, CheckCircle2 } from 'lucide-react'
import { Message } from '@/types/chat'
import { MessageActions } from './MessageActions'

interface MessagePollProps {
  message: Message
  isFromMe: boolean
}

export const MessagePoll: React.FC<MessagePollProps> = ({ message, isFromMe }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Simular dados da enquete (em produção viria de message.pollData)
  const pollData = {
    question: message.content || message.body || 'Enquete',
    options: message.pollOptions || ['Opção 1', 'Opção 2', 'Opção 3'],
    allowMultiple: message.pollAllowMultiple || false,
    votes: message.pollVotes || [5, 8, 3], // Votos por opção
    totalVotes: message.pollTotalVotes || 16
  }

  const handleVote = (optionIndex: number) => {
    if (!isFromMe) {
      setSelectedOption(optionIndex)
      console.log('🗳️ Votando na opção:', optionIndex)
      // TODO: Enviar voto para a API
    }
  }

  return (
    <div className="group relative">
      <div className={`p-4 rounded-xl ${isFromMe ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'} shadow-lg min-w-[320px] max-w-md`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-full ${isFromMe ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <BarChart3 className={`w-4 h-4 ${isFromMe ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <span className={`text-xs font-medium ${isFromMe ? 'text-white/80' : 'text-gray-500'}`}>
            ENQUETE
          </span>
        </div>

        {/* Pergunta */}
        <h3 className={`text-base font-semibold mb-4 ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
          {pollData.question}
        </h3>

        {/* Opções */}
        <div className="space-y-2 mb-3">
          {pollData.options.map((option, index) => {
            const votes = pollData.votes[index] || 0
            const percentage = pollData.totalVotes > 0 ? (votes / pollData.totalVotes) * 100 : 0
            const isSelected = selectedOption === index

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVote(index)}
                disabled={isFromMe}
                className={`w-full p-3 rounded-lg relative overflow-hidden transition-all ${
                  isFromMe 
                    ? 'bg-white/10 cursor-default' 
                    : isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {/* Barra de progresso */}
                <div
                  className={`absolute inset-0 ${isFromMe ? 'bg-white/5' : 'bg-blue-200/30 dark:bg-blue-900/20'} transition-all`}
                  style={{ width: `${percentage}%` }}
                />

                {/* Conteúdo */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                    <span className={`text-sm font-medium ${isFromMe ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                      {option}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isFromMe ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
                      {votes} voto{votes !== 1 ? 's' : ''}
                    </span>
                    <span className={`text-xs font-bold ${isFromMe ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Footer */}
        <div className={`text-xs ${isFromMe ? 'text-white/70' : 'text-gray-500'} flex items-center justify-between`}>
          <span>{pollData.totalVotes} votos totais</span>
          <span>
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="absolute -top-2 -right-2">
        <MessageActions message={message} isFromMe={isFromMe} />
      </div>
    </div>
  )
}
