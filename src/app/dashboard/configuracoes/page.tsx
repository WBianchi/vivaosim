'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Palette, 
  Building, 
  Search, 
  Globe, 
  Shield, 
  Bell,
  Save,
  Upload,
  Eye,
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  FileText,
  Hash,
  Type,
  Users,
  Lock,
  Check,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeProvider'

const tabs = [
  { id: 'seo', label: 'SEO & Meta', icon: Search },
  { id: 'branding', label: 'Marca & Visual', icon: Palette },
  { id: 'company', label: 'Empresa', icon: Building },
  { id: 'permissions', label: 'Permissões', icon: Shield },
  { id: 'system', label: 'Sistema', icon: Settings }
]

const rolePermissions = {
  ADMINISTRADOR: ['dashboard', 'chat', 'kanban', 'vendas', 'financeiro', 'atendentes', 'assinantes', 'clientes', 'afiliados', 'agendamentos', 'orcamentos', 'contratos', 'sites', 'marketing', 'funil', 'campanhas', 'automacoes', 'integracoes', 'fluxograma', 'chatbot', 'agentes', 'chat-interno', 'tags', 'tickets', 'disparos', 'blog', 'relatorios', 'configuracoes'],
  ASSINANTE: ['dashboard', 'chat', 'kanban', 'vendas', 'financeiro', 'atendentes', 'clientes', 'agendamentos', 'orcamentos', 'contratos', 'sites', 'marketing', 'funil', 'campanhas', 'automacoes', 'integracoes', 'fluxograma', 'chatbot', 'agentes', 'chat-interno', 'tags', 'tickets', 'disparos', 'blog', 'relatorios'],
  ATENDENTE: ['dashboard', 'chat', 'kanban', 'clientes', 'agendamentos', 'chatbot', 'chat-interno', 'tags', 'tickets'],
  CLIENTE: ['contrato', 'custos', 'site', 'compras', 'perfil', 'chat-interno', 'tickets']
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('seo')
  const [settings, setSettings] = useState({
    // SEO
    siteTitle: 'VivaOSim - Sistema de Gestão',
    siteDescription: 'Plataforma completa para gestão de negócios e atendimento ao cliente',
    keywords: 'gestão, CRM, atendimento, vendas',
    favicon: '/favicon.ico',
    
    // Branding
    logo: '/logo.png',
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    fontFamily: 'Inter',
    
    // Company
    companyName: 'VivaOSim Solutions',
    cnpj: '00.000.000/0001-00',
    email: 'contato@vivaosim.com',
    phone: '(11) 99999-9999',
    address: 'Rua Example, 123',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    
    // System
    notifications: true,
    darkMode: false,
    language: 'pt-BR'
  })
  
  const { isDarkMode } = useTheme()

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (data.success) {
        // Aqui você pode mostrar uma notificação de sucesso
        console.log('✅ Configurações salvas com sucesso!')
        
        // Se mudou cores ou logo, pode aplicar as mudanças
        if (settings.primaryColor || settings.secondaryColor) {
          document.documentElement.style.setProperty('--primary-color', settings.primaryColor)
          document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor)
        }
      } else {
        console.error('❌ Erro ao salvar:', data.error)
      }
    } catch (error) {
      console.error('❌ Erro na requisição:', error)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Título do Site
            </label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => updateSetting('siteTitle', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Descrição Meta
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
              rows={3}
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Palavras-chave
            </label>
            <input
              type="text"
              value={settings.keywords}
              onChange={(e) => updateSetting('keywords', e.target.value)}
              placeholder="Separadas por vírgula"
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
        </div>
        
        <div className={cn('p-6 rounded-2xl', isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50')}>
          <h3 className={cn('font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900')}>Preview</h3>
          <div className="space-y-2">
            <div className="text-blue-600 text-lg font-medium">{settings.siteTitle}</div>
            <div className="text-green-700 text-sm">vivaosim.com</div>
            <div className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-600')}>{settings.siteDescription}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBrandingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Logo Principal
            </label>
            <div className={cn('border-2 border-dashed rounded-xl p-6 text-center', isDarkMode ? 'border-slate-600' : 'border-gray-300')}>
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>Arraste uma imagem ou clique para enviar</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Cor Primária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className={cn('flex-1 px-3 py-2 rounded-lg border text-sm', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
                />
              </div>
            </div>
            
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                  className={cn('flex-1 px-3 py-2 rounded-lg border text-sm', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className={cn('p-6 rounded-2xl', isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50')}>
          <h3 className={cn('font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900')}>Preview das Cores</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: settings.primaryColor }}
              />
              <span className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-600')}>Cor Primária</span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: settings.secondaryColor }}
              />
              <span className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-600')}>Cor Secundária</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCompanyTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
            Nome da Empresa
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => updateSetting('companyName', e.target.value)}
            className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
          />
        </div>
        
        <div>
          <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
            CNPJ
          </label>
          <input
            type="text"
            value={settings.cnpj}
            onChange={(e) => updateSetting('cnpj', e.target.value)}
            className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Telefone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
            Endereço
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => updateSetting('address', e.target.value)}
            className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Cidade
            </label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => updateSetting('city', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Estado
            </label>
            <input
              type="text"
              value={settings.state}
              onChange={(e) => updateSetting('state', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              País
            </label>
            <input
              type="text"
              value={settings.country}
              onChange={(e) => updateSetting('country', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <div className={cn('p-4 rounded-xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-yellow-50 border-yellow-200')}>
        <div className="flex items-center gap-2 text-yellow-600">
          <Shield className="w-5 h-5" />
          <span className="font-medium">Controle de Permissões por Role</span>
        </div>
        <p className="text-sm mt-1 text-yellow-600/80">
          Configure quais seções cada tipo de usuário pode acessar no menu lateral.
        </p>
      </div>
      
      <div className="grid gap-6">
        {Object.entries(rolePermissions).map(([role, permissions]) => (
          <div key={role} className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
            <h3 className={cn('font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              <Users className="w-5 h-5" />
              {role}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['dashboard', 'chat', 'kanban', 'vendas', 'financeiro', 'atendentes', 'assinantes', 'clientes', 'afiliados', 'agendamentos', 'orcamentos', 'contratos', 'sites', 'marketing', 'funil', 'campanhas', 'automacoes', 'integracoes', 'fluxograma', 'chatbot', 'agentes', 'chat-interno', 'tags', 'tickets', 'disparos', 'blog', 'relatorios', 'configuracoes', 'contrato', 'custos', 'site', 'compras', 'perfil'].map((permission) => (
                <label key={permission} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.includes(permission)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                    readOnly
                  />
                  <span className={cn('text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
            <h3 className={cn('font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900')}>Notificações</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSetting('notifications', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <div className={cn('text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                    Notificações Push
                  </div>
                  <div className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                    Receber notificações no navegador
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
            <h3 className={cn('font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900')}>Idioma</h3>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
        
        <div className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
          <h3 className={cn('font-semibold mb-4', isDarkMode ? 'text-white' : 'text-gray-900')}>Sistema</h3>
          <div className="space-y-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Versão da Plataforma
              </label>
              <div className={cn('px-4 py-3 rounded-xl border text-sm', isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600')}>
                v2.1.0 - Build 2024.01.20
              </div>
            </div>
            
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Última Atualização
              </label>
              <div className={cn('px-4 py-3 rounded-xl border text-sm', isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600')}>
                20 de Janeiro, 2024 às 14:30
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'seo': return renderSEOTab()
      case 'branding': return renderBrandingTab()
      case 'company': return renderCompanyTab()
      case 'permissions': return renderPermissionsTab()
      case 'system': return renderSystemTab()
      default: return renderSEOTab()
    }
  }

  return (
    <div className="h-full w-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className={cn('text-3xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900')}>
          Configurações Gerais
        </h1>
        <p className={cn('text-sm mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
          Configure todos os aspectos da sua plataforma
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : isDarkMode
                    ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Content */}
      <div className="mb-8">
        {renderTabContent()}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-5 h-5" />
          Salvar Configurações
        </motion.button>
      </div>
    </div>
  )
}
