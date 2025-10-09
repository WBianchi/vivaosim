'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Sparkles, 
  MessageSquare, 
  Layout, 
  Mail,
  X,
  RotateCcw,
  Save,
  Droplet,
  Paintbrush
} from 'lucide-react'
import { 
  FiSidebar, 
  FiMessageSquare, 
  FiMail 
} from 'react-icons/fi'
import { 
  BsLayoutSidebarInset, 
  BsChatDots, 
  BsPalette 
} from 'react-icons/bs'
import { cn } from '@/lib/utils'

interface CustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: any
  updateTopbar: (settings: any) => void
  updateSidebar: (settings: any) => void
  updateChat: (settings: any) => void
  updateMessages: (settings: any) => void
  resetSettings: () => void
}

type TabType = 'topbar' | 'sidebar' | 'chat' | 'messages'

const PRESET_GRADIENTS = [
  { name: 'Oceano', from: '#3b82f6', to: '#06b6d4', icon: '🌊' },
  { name: 'Pôr do Sol', from: '#fb923c', to: '#ec4899', icon: '🌅' },
  { name: 'Floresta', from: '#22c55e', to: '#10b981', icon: '🌲' },
  { name: 'Aurora', from: '#a855f7', to: '#ec4899', icon: '✨' },
  { name: 'Fogo', from: '#ef4444', to: '#f97316', icon: '🔥' },
  { name: 'Noite', from: '#4f46e5', to: '#7c3aed', icon: '🌙' },
  { name: 'Limão', from: '#84cc16', to: '#22c55e', icon: '🍋' },
  { name: 'Rosa', from: '#ec4899', to: '#f43f5e', icon: '🌸' },
]

const PRESET_COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Roxo', value: '#a855f7' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Ciano', value: '#06b6d4' },
]

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  isOpen,
  onClose,
  settings,
  updateTopbar,
  updateSidebar,
  updateChat,
  updateMessages,
  resetSettings
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('topbar')
  const [colorMode, setColorMode] = useState<'solid' | 'gradient'>('gradient')
  
  // Estados para cores customizadas
  const [customColor, setCustomColor] = useState('#3b82f6')
  const [customGradientFrom, setCustomGradientFrom] = useState('#3b82f6')
  const [customGradientTo, setCustomGradientTo] = useState('#06b6d4')

  const tabs = [
    { id: 'topbar' as TabType, label: 'Topbar', icon: Layout },
    { id: 'sidebar' as TabType, label: 'Sidebar', icon: FiSidebar },
    { id: 'chat' as TabType, label: 'Chat', icon: BsChatDots },
    { id: 'messages' as TabType, label: 'Mensagens', icon: FiMessageSquare },
  ]

  const handleApplyGradient = (from: string, to: string) => {
    const update = {
      type: 'gradient',
      gradientFrom: from,
      gradientTo: to
    }

    switch (activeTab) {
      case 'topbar':
        updateTopbar(update)
        break
      case 'sidebar':
        updateSidebar(update)
        break
      case 'chat':
        updateChat(update)
        break
      case 'messages':
        updateMessages(update)
        break
    }
  }

  const handleApplySolidColor = (color: string) => {
    const update = {
      type: 'solid',
      solidColor: color
    }

    switch (activeTab) {
      case 'topbar':
        updateTopbar(update)
        break
      case 'sidebar':
        updateSidebar(update)
        break
      case 'chat':
        updateChat(update)
        break
      case 'messages':
        updateMessages(update)
        break
    }
  }

  const handleApplyCustomGradient = () => {
    handleApplyGradient(customGradientFrom, customGradientTo)
  }

  const handleApplyCustomColor = () => {
    handleApplySolidColor(customColor)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-0 top-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] w-[420px] max-h-[700px] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BsPalette className="w-5 h-5 text-orange-500" />
            Customizar Interface
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={resetSettings}
              className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Resetar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-all',
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Modo de Cor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Cor
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setColorMode('gradient')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
                colorMode === 'gradient'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Degradê</span>
            </button>
            <button
              onClick={() => setColorMode('solid')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
                colorMode === 'solid'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              )}
            >
              <Droplet className="w-4 h-4" />
              <span className="text-sm font-medium">Sólida</span>
            </button>
          </div>
        </div>

        {/* Gradientes Preset */}
        {colorMode === 'gradient' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Degradês Prontos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_GRADIENTS.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => handleApplyGradient(gradient.from, gradient.to)}
                    className="group relative overflow-hidden rounded-lg h-16 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <span className="text-2xl mb-1">{gradient.icon}</span>
                      <span className="text-xs font-semibold drop-shadow-lg">{gradient.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Degradê Customizado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Criar Degradê Personalizado
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cor Inicial</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customGradientFrom}
                        onChange={(e) => setCustomGradientFrom(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customGradientFrom}
                        onChange={(e) => setCustomGradientFrom(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cor Final</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customGradientTo}
                        onChange={(e) => setCustomGradientTo(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customGradientTo}
                        onChange={(e) => setCustomGradientTo(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="#06b6d4"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Preview */}
                <div 
                  className="h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  style={{
                    background: `linear-gradient(135deg, ${customGradientFrom}, ${customGradientTo})`
                  }}
                />
                
                <button
                  onClick={handleApplyCustomGradient}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Paintbrush className="w-4 h-4" />
                  Aplicar Degradê
                </button>
              </div>
            </div>
          </>
        )}

        {/* Cores Sólidas */}
        {colorMode === 'solid' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Cores Prontas
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleApplySolidColor(color.value)}
                    className="group relative overflow-hidden rounded-lg h-16 border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:scale-105"
                    style={{ backgroundColor: color.value }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white drop-shadow-lg">{color.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cor Customizada */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Cor Personalizada
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-20 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="#3b82f6"
                  />
                </div>
                
                <button
                  onClick={handleApplyCustomColor}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Paintbrush className="w-4 h-4" />
                  Aplicar Cor
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💾 Suas configurações são salvas automaticamente no navegador
        </p>
      </div>
    </motion.div>
  )
}
