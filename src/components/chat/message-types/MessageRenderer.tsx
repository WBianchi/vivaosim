'use client'

import React from 'react'
import { Message, MessageType } from '@/types/chat'
import {
  MessageText,
  MessageImage,
  MessageVideo,
  MessageAudio,
  MessageDocument,
  MessagePoll,
  MessageList,
  MessageEvent,
  MessageContact,
  MessageLocation
} from './index'

interface MessageRendererProps {
  message: Message
  isFromMe: boolean
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ message, isFromMe }) => {
  // Determinar o tipo da mensagem
  const getMessageType = (): MessageType => {
    // Se tem tipo definido explicitamente
    if (message.type) return message.type

    // Detectar por campos presentes
    if (message.mediaUrl) {
      if (message.mediaUrl.includes('image') || message.mimeType?.includes('image')) {
        return MessageType.IMAGE
      }
      if (message.mediaUrl.includes('video') || message.mimeType?.includes('video')) {
        return MessageType.VIDEO
      }
      if (message.mediaUrl.includes('audio') || message.mimeType?.includes('audio')) {
        return MessageType.AUDIO
      }
      return MessageType.DOCUMENT
    }

    if (message.latitude && message.longitude) return MessageType.LOCATION
    if (message.contactName || message.contactPhone) return MessageType.CONTACT
    if (message.pollOptions) return MessageType.POLL
    if (message.listSections) return MessageType.LIST
    if (message.eventTitle) return MessageType.EVENT

    return MessageType.TEXT
  }

  const messageType = getMessageType()

  // Renderizar o componente apropriado
  switch (messageType) {
    case MessageType.IMAGE:
      return <MessageImage message={message} isFromMe={isFromMe} />
    
    case MessageType.VIDEO:
      return <MessageVideo message={message} isFromMe={isFromMe} />
    
    case MessageType.AUDIO:
    case MessageType.VOICE: // Push to Talk (áudio de voz)
      return <MessageAudio message={message} isFromMe={isFromMe} />
    
    case MessageType.DOCUMENT:
    case MessageType.FILE:
      return <MessageDocument message={message} isFromMe={isFromMe} />
    
    case MessageType.POLL:
      return <MessagePoll message={message} isFromMe={isFromMe} />
    
    case MessageType.LIST:
      return <MessageList message={message} isFromMe={isFromMe} />
    
    case MessageType.EVENT:
      return <MessageEvent message={message} isFromMe={isFromMe} />
    
    case MessageType.CONTACT:
      return <MessageContact message={message} isFromMe={isFromMe} />
    
    case MessageType.LOCATION:
      return <MessageLocation message={message} isFromMe={isFromMe} />
    
    case MessageType.TEXT:
    default:
      return <MessageText message={message} isFromMe={isFromMe} />
  }
}
