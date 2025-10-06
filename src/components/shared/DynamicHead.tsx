'use client'

import { useEffect, useState } from 'react'

export default function DynamicHead() {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/settings/site')
        const data = await response.json()
        
        if (data.success && data.config) {
          setConfig(data.config)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar config:', error)
      }
    }

    loadConfig()

    // Listener para atualização em tempo real
    const handleConfigUpdate = (event: any) => {
      const newConfig = event.detail
      if (newConfig) {
        setConfig(newConfig)
      }
    }

    window.addEventListener('siteConfigUpdated', handleConfigUpdate)
    return () => window.removeEventListener('siteConfigUpdated', handleConfigUpdate)
  }, [])

  useEffect(() => {
    if (!config) return

    // Atualizar título
    if (config.titulo) {
      document.title = config.titulo
    }

    // Atualizar descrição meta
    if (config.descricao) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', config.descricao)
    }

    // Atualizar keywords meta
    if (config.palavrasChave) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', config.palavrasChave)
    }

    // Atualizar favicon
    if (config.favicon) {
      // Remover favicons antigos
      const oldFavicons = document.querySelectorAll('link[rel*="icon"]')
      oldFavicons.forEach(favicon => favicon.remove())

      // Adicionar novo favicon
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = config.favicon
      document.head.appendChild(link)

      // Adicionar apple-touch-icon também
      const appleTouchIcon = document.createElement('link')
      appleTouchIcon.rel = 'apple-touch-icon'
      appleTouchIcon.href = config.favicon
      document.head.appendChild(appleTouchIcon)
    }
  }, [config])

  return null // Componente não renderiza nada
}
