'use client'

import React, { useState, useEffect } from 'react'
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
  X,
  Image,
  Palette as PaletteIcon,
  Box,
  Square,
  Circle,
  Edit3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeProvider'

const tabs = [
  { id: 'site', label: 'Site', icon: Globe },
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
  const [activeTab, setActiveTab] = useState('site')
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    // SEO
    siteTitle: 'VivaOSim - Sistema de Gestão',
    siteDescription: 'Plataforma completa para gestão de negócios e atendimento ao cliente',
    keywords: 'gestão, CRM, atendimento, vendas',
    favicon: '/favicon.ico',
    
    // Branding
    logo: '/logo.png',
    logoSize: 'medium',
    logoWidth: 40,
    logoHeight: 40,
    
    // Tema Visual
    corPrimaria: '#F97316',
    corSecundaria: '#EA580C',
    corDestaque: '#FB923C',
    corSucesso: '#10B981',
    corErro: '#EF4444',
    corAlerta: '#F59E0B',
    corInfo: '#3B82F6',
    corTextoTitulo: '#111827',
    corTextoParagrafo: '#374151',
    corTextoSecundario: '#6B7280',
    corTextoMutado: '#9CA3AF',
    corFundoPrincipal: '#FFFFFF',
    corFundoSecundario: '#F9FAFB',
    corFundoTerciario: '#F3F4F6',
    corBordaPrimaria: '#E5E7EB',
    corBordaSecundaria: '#D1D5DB',
    corBordaDestaque: '#F97316',
    corBotaoPrimario: '#F97316',
    corBotaoSecundario: '#6B7280',
    corBotaoTexto: '#FFFFFF',
    fontePrimaria: 'Inter',
    fonteSecundaria: 'Inter',
    fonteMonospace: 'Fira Code',
    tamanhoFontePequena: '0.875rem',
    tamanhoFonteNormal: '1rem',
    tamanhoFonteMedia: '1.125rem',
    tamanhoFonteGrande: '1.25rem',
    tamanhoFonteTitulo: '1.875rem',
    roundPequeno: '0.25rem',
    roundNormal: '0.5rem',
    roundMedio: '0.75rem',
    roundGrande: '1rem',
    roundBotao: '0.75rem',
    roundInput: '0.5rem',
    roundCard: '1rem',
    roundModal: '1.5rem',
    espacamentoPequeno: '0.5rem',
    espacamentoNormal: '1rem',
    espacamentoMedio: '1.5rem',
    espacamentoGrande: '2rem',
    sombraPequena: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sombraNormal: '0 1px 3px rgba(0, 0, 0, 0.1)',
    sombraMedia: '0 4px 6px rgba(0, 0, 0, 0.1)',
    sombraGrande: '0 10px 15px rgba(0, 0, 0, 0.1)',
    espessuraBordaPequena: '1px',
    espessuraBordaNormal: '2px',
    espessuraBordaGrossa: '3px',
    
    // Company
    companyName: 'VivaOSim Solutions',
    cnpj: '',
    email: 'contato@vivaosim.com',
    phone: '',
    address: 'Rua Example, 123',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    horarioAbertura: '08:00',
    horarioFechamento: '18:00',
    diasAtendimento: 'Segunda a Sexta',
    
    // System
    darkMode: false,
    modoManutencao: false,
    smtpAtivo: false,
    smtpEmail: 'smtp@vivaosim.com.br',
    smtpHost: 'smtp.hostinger.com',
    smtpSenha: 'Lala147??',
    smtpPorta: 465,
    smtpSecure: true
  })
  
  const { isDarkMode } = useTheme()

  // Carregar configurações do site ao montar o componente
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Carregar configurações do site
        const siteResponse = await fetch('/api/settings/site')
        const siteData = await siteResponse.json()
        
        if (siteData.success && siteData.config) {
          setSettings(prev => ({
            ...prev,
            siteTitle: siteData.config.titulo || prev.siteTitle,
            siteDescription: siteData.config.descricao || prev.siteDescription,
            keywords: siteData.config.palavrasChave || prev.keywords,
            logo: siteData.config.logo || prev.logo,
            logoSize: siteData.config.logoSize || prev.logoSize,
            logoWidth: siteData.config.logoWidth || prev.logoWidth,
            logoHeight: siteData.config.logoHeight || prev.logoHeight,
            favicon: siteData.config.favicon || prev.favicon
          }))
        }

        // Carregar informações da empresa
        const companyResponse = await fetch('/api/settings/company')
        const companyData = await companyResponse.json()
        
        if (companyData.success && companyData.company) {
          setSettings(prev => ({
            ...prev,
            companyName: companyData.company.nomeEmpresa || prev.companyName,
            cnpj: companyData.company.cnpj || prev.cnpj,
            email: companyData.company.email || prev.email,
            phone: companyData.company.telefone || prev.phone,
            address: companyData.company.endereco || prev.address,
            city: companyData.company.cidade || prev.city,
            state: companyData.company.estado || prev.state,
            country: companyData.company.pais || prev.country,
            horarioAbertura: companyData.company.horarioAbertura || prev.horarioAbertura,
            horarioFechamento: companyData.company.horarioFechamento || prev.horarioFechamento,
            diasAtendimento: companyData.company.diasAtendimento || prev.diasAtendimento
          }))
        }

        // Carregar tema visual
        const themeResponse = await fetch('/api/settings/theme')
        const themeData = await themeResponse.json()
        
        if (themeData.success && themeData.theme) {
          setSettings(prev => ({
            ...prev,
            corPrimaria: themeData.theme.corPrimaria || prev.corPrimaria,
            corSecundaria: themeData.theme.corSecundaria || prev.corSecundaria,
            corDestaque: themeData.theme.corDestaque || prev.corDestaque,
            corSucesso: themeData.theme.corSucesso || prev.corSucesso,
            corErro: themeData.theme.corErro || prev.corErro,
            corAlerta: themeData.theme.corAlerta || prev.corAlerta,
            corInfo: themeData.theme.corInfo || prev.corInfo,
            corTextoTitulo: themeData.theme.corTextoTitulo || prev.corTextoTitulo,
            corTextoParagrafo: themeData.theme.corTextoParagrafo || prev.corTextoParagrafo,
            corTextoSecundario: themeData.theme.corTextoSecundario || prev.corTextoSecundario,
            corTextoMutado: themeData.theme.corTextoMutado || prev.corTextoMutado,
            corFundoPrincipal: themeData.theme.corFundoPrincipal || prev.corFundoPrincipal,
            corFundoSecundario: themeData.theme.corFundoSecundario || prev.corFundoSecundario,
            corFundoTerciario: themeData.theme.corFundoTerciario || prev.corFundoTerciario,
            corBordaPrimaria: themeData.theme.corBordaPrimaria || prev.corBordaPrimaria,
            corBordaSecundaria: themeData.theme.corBordaSecundaria || prev.corBordaSecundaria,
            corBordaDestaque: themeData.theme.corBordaDestaque || prev.corBordaDestaque,
            corBotaoPrimario: themeData.theme.corBotaoPrimario || prev.corBotaoPrimario,
            corBotaoSecundario: themeData.theme.corBotaoSecundario || prev.corBotaoSecundario,
            corBotaoTexto: themeData.theme.corBotaoTexto || prev.corBotaoTexto,
            fontePrimaria: themeData.theme.fontePrimaria || prev.fontePrimaria,
            fonteSecundaria: themeData.theme.fonteSecundaria || prev.fonteSecundaria,
            fonteMonospace: themeData.theme.fonteMonospace || prev.fonteMonospace,
            tamanhoFontePequena: themeData.theme.tamanhoFontePequena || prev.tamanhoFontePequena,
            tamanhoFonteNormal: themeData.theme.tamanhoFonteNormal || prev.tamanhoFonteNormal,
            tamanhoFonteMedia: themeData.theme.tamanhoFonteMedia || prev.tamanhoFonteMedia,
            tamanhoFonteGrande: themeData.theme.tamanhoFonteGrande || prev.tamanhoFonteGrande,
            tamanhoFonteTitulo: themeData.theme.tamanhoFonteTitulo || prev.tamanhoFonteTitulo,
            roundPequeno: themeData.theme.roundPequeno || prev.roundPequeno,
            roundNormal: themeData.theme.roundNormal || prev.roundNormal,
            roundMedio: themeData.theme.roundMedio || prev.roundMedio,
            roundGrande: themeData.theme.roundGrande || prev.roundGrande,
            roundBotao: themeData.theme.roundBotao || prev.roundBotao,
            roundInput: themeData.theme.roundInput || prev.roundInput,
            roundCard: themeData.theme.roundCard || prev.roundCard,
            roundModal: themeData.theme.roundModal || prev.roundModal,
            espacamentoPequeno: themeData.theme.espacamentoPequeno || prev.espacamentoPequeno,
            espacamentoNormal: themeData.theme.espacamentoNormal || prev.espacamentoNormal,
            espacamentoMedio: themeData.theme.espacamentoMedio || prev.espacamentoMedio,
            espacamentoGrande: themeData.theme.espacamentoGrande || prev.espacamentoGrande,
            sombraPequena: themeData.theme.sombraPequena || prev.sombraPequena,
            sombraNormal: themeData.theme.sombraNormal || prev.sombraNormal,
            sombraMedia: themeData.theme.sombraMedia || prev.sombraMedia,
            sombraGrande: themeData.theme.sombraGrande || prev.sombraGrande,
            espessuraBordaPequena: themeData.theme.espessuraBordaPequena || prev.espessuraBordaPequena,
            espessuraBordaNormal: themeData.theme.espessuraBordaNormal || prev.espessuraBordaNormal,
            espessuraBordaGrossa: themeData.theme.espessuraBordaGrossa || prev.espessuraBordaGrossa
          }))
        }

        // Carregar configurações do sistema
        const systemResponse = await fetch('/api/settings/system')
        const systemData = await systemResponse.json()
        
        if (systemData.success && systemData.config) {
          setSettings(prev => ({
            ...prev,
            darkMode: systemData.config.darkMode ?? prev.darkMode,
            modoManutencao: systemData.config.modoManutencao ?? prev.modoManutencao,
            smtpAtivo: systemData.config.smtpAtivo ?? prev.smtpAtivo,
            smtpEmail: systemData.config.smtpEmail || prev.smtpEmail,
            smtpHost: systemData.config.smtpHost || prev.smtpHost,
            smtpSenha: systemData.config.smtpSenha || prev.smtpSenha,
            smtpPorta: systemData.config.smtpPorta || prev.smtpPorta,
            smtpSecure: systemData.config.smtpSecure ?? prev.smtpSecure
          }))
        }
      } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSaveSite = async () => {
    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const siteResponse = await fetch('/api/settings/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: settings.siteTitle,
          descricao: settings.siteDescription,
          palavrasChave: settings.keywords,
          logo: settings.logo,
          logoSize: settings.logoSize,
          logoWidth: settings.logoWidth,
          logoHeight: settings.logoHeight,
          favicon: settings.favicon
        })
      })

      const siteData = await siteResponse.json()

      if (siteData.success) {
        alert('✅ Configurações do site salvas com sucesso!')
        window.dispatchEvent(new CustomEvent('siteConfigUpdated', { detail: siteData.config }))
      } else {
        alert('❌ Erro: ' + siteData.error)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      alert('❌ Erro ao salvar configurações do site')
    }
  }

  const handleSaveCompany = async () => {
    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const companyResponse = await fetch('/api/settings/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nomeEmpresa: settings.companyName,
          cnpj: settings.cnpj,
          email: settings.email,
          telefone: settings.phone,
          endereco: settings.address,
          cidade: settings.city,
          estado: settings.state,
          pais: settings.country,
          horarioAbertura: settings.horarioAbertura,
          horarioFechamento: settings.horarioFechamento,
          diasAtendimento: settings.diasAtendimento
        })
      })

      const companyData = await companyResponse.json()

      if (companyData.success) {
        alert('✅ Informações da empresa salvas com sucesso!')
      } else {
        alert('❌ Erro: ' + companyData.error)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      alert('❌ Erro ao salvar informações da empresa')
    }
  }

  const handleSaveSystem = async () => {
    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const systemResponse = await fetch('/api/settings/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          darkMode: settings.darkMode,
          modoManutencao: settings.modoManutencao,
          smtpAtivo: settings.smtpAtivo,
          smtpEmail: settings.smtpEmail,
          smtpHost: settings.smtpHost,
          smtpSenha: settings.smtpSenha,
          smtpPorta: settings.smtpPorta,
          smtpSecure: settings.smtpSecure
        })
      })

      const systemData = await systemResponse.json()

      if (systemData.success) {
        alert('✅ Configurações do sistema salvas com sucesso!')
      } else {
        alert('❌ Erro: ' + systemData.error)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      alert('❌ Erro ao salvar configurações do sistema')
    }
  }

  const handleSaveTheme = async () => {
    try {
      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const themeResponse = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          corPrimaria: settings.corPrimaria,
          corSecundaria: settings.corSecundaria,
          corDestaque: settings.corDestaque,
          corSucesso: settings.corSucesso,
          corErro: settings.corErro,
          corAlerta: settings.corAlerta,
          corInfo: settings.corInfo,
          corTextoTitulo: settings.corTextoTitulo,
          corTextoParagrafo: settings.corTextoParagrafo,
          corTextoSecundario: settings.corTextoSecundario,
          corTextoMutado: settings.corTextoMutado,
          corFundoPrincipal: settings.corFundoPrincipal,
          corFundoSecundario: settings.corFundoSecundario,
          corFundoTerciario: settings.corFundoTerciario,
          corBordaPrimaria: settings.corBordaPrimaria,
          corBordaSecundaria: settings.corBordaSecundaria,
          corBordaDestaque: settings.corBordaDestaque,
          corBotaoPrimario: settings.corBotaoPrimario,
          corBotaoSecundario: settings.corBotaoSecundario,
          corBotaoTexto: settings.corBotaoTexto,
          fontePrimaria: settings.fontePrimaria,
          fonteSecundaria: settings.fonteSecundaria,
          fonteMonospace: settings.fonteMonospace,
          tamanhoFontePequena: settings.tamanhoFontePequena,
          tamanhoFonteNormal: settings.tamanhoFonteNormal,
          tamanhoFonteMedia: settings.tamanhoFonteMedia,
          tamanhoFonteGrande: settings.tamanhoFonteGrande,
          tamanhoFonteTitulo: settings.tamanhoFonteTitulo,
          roundPequeno: settings.roundPequeno,
          roundNormal: settings.roundNormal,
          roundMedio: settings.roundMedio,
          roundGrande: settings.roundGrande,
          roundBotao: settings.roundBotao,
          roundInput: settings.roundInput,
          roundCard: settings.roundCard,
          roundModal: settings.roundModal,
          espacamentoPequeno: settings.espacamentoPequeno,
          espacamentoNormal: settings.espacamentoNormal,
          espacamentoMedio: settings.espacamentoMedio,
          espacamentoGrande: settings.espacamentoGrande,
          sombraPequena: settings.sombraPequena,
          sombraNormal: settings.sombraNormal,
          sombraMedia: settings.sombraMedia,
          sombraGrande: settings.sombraGrande,
          espessuraBordaPequena: settings.espessuraBordaPequena,
          espessuraBordaNormal: settings.espessuraBordaNormal,
          espessuraBordaGrossa: settings.espessuraBordaGrossa
        })
      })

      const themeData = await themeResponse.json()

      if (themeData.success) {
        alert('✅ Tema visual salvo com sucesso!')
        document.documentElement.style.setProperty('--color-primary', settings.corPrimaria)
        document.documentElement.style.setProperty('--color-secondary', settings.corSecundaria)
      } else {
        alert('❌ Erro: ' + themeData.error)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      alert('❌ Erro ao salvar tema visual')
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Máscaras de input
  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', type === 'logo' ? 'logos' : 'favicons')

      const token = localStorage.getItem('accessToken') || 
                   document.cookie.split(';').find(c => c.trim().startsWith('accessToken='))?.split('=')[1]

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        updateSetting(type, data.url)
        console.log(`✅ ${type} enviado:`, data.url)
      } else {
        console.error('❌ Erro no upload:', data.error)
        alert('Erro ao enviar arquivo: ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error)
      alert('Erro ao enviar arquivo')
    }
  }


  const FONTES_DISPONIVEIS = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 
    'Ubuntu', 'Nunito', 'Playfair Display', 'Merriweather', 'PT Sans', 'Fira Sans',
    'Work Sans', 'Archivo', 'Rubik', 'DM Sans', 'Space Grotesk', 'Manrope',
    'Fira Code', 'JetBrains Mono', 'Source Code Pro', 'IBM Plex Mono', 'Courier New'
  ]

  const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div>
      <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>{label}</label>
      <div className="flex gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-12 h-12 rounded-2xl cursor-pointer shadow-md" style={{ border: '3px solid', borderColor: isDarkMode ? '#374151' : '#E5E7EB' }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" className={cn('flex-1 px-3 py-2 rounded-lg border text-sm', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')} />
      </div>
    </div>
  )

  const renderBrandingTab = () => (
    <div className="space-y-8">
      {/* Cores Principais */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <PaletteIcon className="w-5 h-5" />
          Cores Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker label="Cor Primária" value={settings.corPrimaria} onChange={(v) => updateSetting('corPrimaria', v)} />
          <ColorPicker label="Cor Secundária" value={settings.corSecundaria} onChange={(v) => updateSetting('corSecundaria', v)} />
          <ColorPicker label="Cor Destaque" value={settings.corDestaque} onChange={(v) => updateSetting('corDestaque', v)} />
          <ColorPicker label="Cor Sucesso" value={settings.corSucesso} onChange={(v) => updateSetting('corSucesso', v)} />
          <ColorPicker label="Cor Erro" value={settings.corErro} onChange={(v) => updateSetting('corErro', v)} />
          <ColorPicker label="Cor Alerta" value={settings.corAlerta} onChange={(v) => updateSetting('corAlerta', v)} />
          <ColorPicker label="Cor Info" value={settings.corInfo} onChange={(v) => updateSetting('corInfo', v)} />
        </div>
      </div>

      {/* Cores de Texto */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Type className="w-5 h-5" />
          Cores de Texto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker label="Texto Título" value={settings.corTextoTitulo} onChange={(v) => updateSetting('corTextoTitulo', v)} />
          <ColorPicker label="Texto Parágrafo" value={settings.corTextoParagrafo} onChange={(v) => updateSetting('corTextoParagrafo', v)} />
          <ColorPicker label="Texto Secundário" value={settings.corTextoSecundario} onChange={(v) => updateSetting('corTextoSecundario', v)} />
          <ColorPicker label="Texto Mutado" value={settings.corTextoMutado} onChange={(v) => updateSetting('corTextoMutado', v)} />
        </div>
      </div>

      {/* Cores de Fundo */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Square className="w-5 h-5" />
          Cores de Fundo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker label="Fundo Principal" value={settings.corFundoPrincipal} onChange={(v) => updateSetting('corFundoPrincipal', v)} />
          <ColorPicker label="Fundo Secundário" value={settings.corFundoSecundario} onChange={(v) => updateSetting('corFundoSecundario', v)} />
          <ColorPicker label="Fundo Terciário" value={settings.corFundoTerciario} onChange={(v) => updateSetting('corFundoTerciario', v)} />
        </div>
      </div>

      {/* Cores de Bordas */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Box className="w-5 h-5" />
          Cores de Bordas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker label="Borda Primária" value={settings.corBordaPrimaria} onChange={(v) => updateSetting('corBordaPrimaria', v)} />
          <ColorPicker label="Borda Secundária" value={settings.corBordaSecundaria} onChange={(v) => updateSetting('corBordaSecundaria', v)} />
          <ColorPicker label="Borda Destaque" value={settings.corBordaDestaque} onChange={(v) => updateSetting('corBordaDestaque', v)} />
        </div>
      </div>

      {/* Cores de Botões */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Circle className="w-5 h-5" />
          Cores de Botões
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorPicker label="Botão Primário" value={settings.corBotaoPrimario} onChange={(v) => updateSetting('corBotaoPrimario', v)} />
          <ColorPicker label="Botão Secundário" value={settings.corBotaoSecundario} onChange={(v) => updateSetting('corBotaoSecundario', v)} />
          <ColorPicker label="Texto do Botão" value={settings.corBotaoTexto} onChange={(v) => updateSetting('corBotaoTexto', v)} />
        </div>
        
        {/* Preview de Botão com Degradê */}
        <div className={cn('mt-4 p-6 rounded-2xl', isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50')}>
          <h4 className={cn('text-sm font-semibold mb-3', isDarkMode ? 'text-white' : 'text-gray-900')}>Preview com Degradê</h4>
          <div className="flex gap-3 flex-wrap">
            <button 
              style={{ 
                background: `linear-gradient(to right, ${settings.corPrimaria}, ${settings.corSecundaria})`,
                color: settings.corBotaoTexto 
              }}
              className="px-6 py-3 rounded-xl font-medium shadow-lg"
            >
              Primário → Secundário
            </button>
            <button 
              style={{ 
                background: `linear-gradient(to right, ${settings.corBotaoPrimario}, ${settings.corDestaque})`,
                color: settings.corBotaoTexto 
              }}
              className="px-6 py-3 rounded-xl font-medium shadow-lg"
            >
              Botão → Destaque
            </button>
            <button 
              style={{ 
                background: `linear-gradient(135deg, ${settings.corPrimaria}, ${settings.corDestaque})`,
                color: settings.corBotaoTexto 
              }}
              className="px-6 py-3 rounded-xl font-medium shadow-lg"
            >
              Diagonal
            </button>
          </div>
          <p className={cn('text-xs mt-3', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
            💡 Use estas cores para criar botões com degradê: <code className={cn('px-2 py-1 rounded', isDarkMode ? 'bg-slate-700' : 'bg-gray-200')}>linear-gradient(to right, corPrimaria, corSecundaria)</code>
          </p>
        </div>
      </div>

      {/* Fontes */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Edit3 className="w-5 h-5" />
          Fontes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>Fonte Primária</label>
            <select value={settings.fontePrimaria} onChange={(e) => updateSetting('fontePrimaria', e.target.value)} className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}>
              {FONTES_DISPONIVEIS.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>Fonte Secundária</label>
            <select value={settings.fonteSecundaria} onChange={(e) => updateSetting('fonteSecundaria', e.target.value)} className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}>
              {FONTES_DISPONIVEIS.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>Fonte Monospace</label>
            <select value={settings.fonteMonospace} onChange={(e) => updateSetting('fonteMonospace', e.target.value)} className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}>
              {FONTES_DISPONIVEIS.filter(f => ['Fira Code', 'JetBrains Mono', 'Source Code Pro', 'IBM Plex Mono', 'Courier New'].includes(f)).map(font => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Circle className="w-5 h-5" />
          Arredondamento (Border Radius)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['roundPequeno', 'roundNormal', 'roundMedio', 'roundGrande', 'roundBotao', 'roundInput', 'roundCard', 'roundModal'].map((key) => (
            <div key={key}>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>{key.replace('round', '')}</label>
              <input type="text" value={settings[key as keyof typeof settings] as string} onChange={(e) => updateSetting(key, e.target.value)} placeholder="0.5rem" className={cn('w-full px-3 py-2 rounded-lg border text-sm', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')} />
            </div>
          ))}
        </div>
      </div>
      <SaveButton onClick={handleSaveTheme} label="Salvar Tema Visual" />
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
            onChange={(e) => updateSetting('cnpj', maskCNPJ(e.target.value))}
            placeholder="00.000.000/0000-00"
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
              onChange={(e) => updateSetting('phone', maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Horário Abertura
            </label>
            <input
              type="time"
              value={settings.horarioAbertura}
              onChange={(e) => updateSetting('horarioAbertura', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Horário Fechamento
            </label>
            <input
              type="time"
              value={settings.horarioFechamento}
              onChange={(e) => updateSetting('horarioFechamento', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Dias de Atendimento
            </label>
            <input
              type="text"
              value={settings.diasAtendimento}
              onChange={(e) => updateSetting('diasAtendimento', e.target.value)}
              placeholder="Segunda a Sexta"
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
      <SaveButton onClick={handleSaveCompany} label="Salvar Informações da Empresa" />
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
      {/* Aparência */}
      <div className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
        <h3 className={cn('font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Eye className="w-5 h-5" />
          Aparência
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className={cn('text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Modo Escuro (Dark Mode)
              </div>
              <div className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                Ativar tema escuro da plataforma
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateSetting('darkMode', e.target.checked)}
              className="w-12 h-6 rounded-full appearance-none cursor-pointer transition-colors relative checked:bg-orange-500 bg-gray-300"
            />
          </label>
        </div>
      </div>

      {/* Modo Manutenção */}
      <div className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
        <h3 className={cn('font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Lock className="w-5 h-5" />
          Modo Manutenção
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className={cn('text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Ativar Modo Manutenção
              </div>
              <div className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                Bloqueia acesso temporariamente para manutenção
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.modoManutencao}
              onChange={(e) => updateSetting('modoManutencao', e.target.checked)}
              className="w-12 h-6 rounded-full appearance-none cursor-pointer transition-colors relative checked:bg-red-500 bg-gray-300"
            />
          </label>
        </div>
      </div>

      {/* Configurações SMTP */}
      <div className={cn('p-6 rounded-2xl border', isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200')}>
        <h3 className={cn('font-semibold mb-4 flex items-center gap-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
          <Mail className="w-5 h-5" />
          Configurações SMTP
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer mb-4">
            <div>
              <div className={cn('text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Ativar Envio de E-mails
              </div>
              <div className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                Habilitar servidor SMTP
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.smtpAtivo}
              onChange={(e) => updateSetting('smtpAtivo', e.target.checked)}
              className="w-12 h-6 rounded-full appearance-none cursor-pointer transition-colors relative checked:bg-green-500 bg-gray-300"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                E-mail SMTP
              </label>
              <input
                type="email"
                value={settings.smtpEmail}
                onChange={(e) => updateSetting('smtpEmail', e.target.value)}
                disabled={!settings.smtpAtivo}
                className={cn('w-full px-4 py-3 rounded-xl border', 
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200',
                  !settings.smtpAtivo && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Host SMTP
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => updateSetting('smtpHost', e.target.value)}
                disabled={!settings.smtpAtivo}
                className={cn('w-full px-4 py-3 rounded-xl border', 
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200',
                  !settings.smtpAtivo && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Senha SMTP
              </label>
              <input
                type="password"
                value={settings.smtpSenha}
                onChange={(e) => updateSetting('smtpSenha', e.target.value)}
                disabled={!settings.smtpAtivo}
                className={cn('w-full px-4 py-3 rounded-xl border', 
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200',
                  !settings.smtpAtivo && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>

            <div>
              <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Porta SMTP
              </label>
              <input
                type="number"
                value={settings.smtpPorta}
                onChange={(e) => updateSetting('smtpPorta', parseInt(e.target.value))}
                disabled={!settings.smtpAtivo}
                className={cn('w-full px-4 py-3 rounded-xl border', 
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200',
                  !settings.smtpAtivo && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smtpSecure}
              onChange={(e) => updateSetting('smtpSecure', e.target.checked)}
              disabled={!settings.smtpAtivo}
              className={cn('rounded text-orange-500 focus:ring-orange-500', !settings.smtpAtivo && 'opacity-50 cursor-not-allowed')}
            />
            <div>
              <div className={cn('text-sm font-medium', isDarkMode ? 'text-white' : 'text-gray-900')}>
                Conexão Segura (SSL/TLS)
              </div>
              <div className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                Usar conexão criptografada
              </div>
            </div>
          </label>
        </div>
      </div>

      <SaveButton onClick={handleSaveSystem} label="Salvar Configurações do Sistema" />
    </div>
  )

  const SaveButton = ({ onClick, label = 'Salvar Configurações' }: { onClick: () => void, label?: string }) => (
    <div className="flex justify-end mt-6">
      <motion.button
        onClick={onClick}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className="w-5 h-5" />
        {label}
      </motion.button>
    </div>
  )

  const renderSiteTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              <Globe className="w-4 h-4 inline mr-2" />
              Título do Site
            </label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => updateSetting('siteTitle', e.target.value)}
              placeholder="Ex: Viva o Sim - Sistema de Gestão"
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
            <p className={cn('text-xs mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
              Aparece na aba do navegador e nos resultados de busca
            </p>
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              <FileText className="w-4 h-4 inline mr-2" />
              Descrição
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => updateSetting('siteDescription', e.target.value)}
              rows={4}
              placeholder="Descreva seu site de forma clara e atraente para SEO"
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
            <p className={cn('text-xs mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
              Descrição meta para SEO (recomendado: 150-160 caracteres)
            </p>
          </div>
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              <Hash className="w-4 h-4 inline mr-2" />
              Palavras-chave
            </label>
            <input
              type="text"
              value={settings.keywords}
              onChange={(e) => updateSetting('keywords', e.target.value)}
              placeholder="gestão, CRM, atendimento, vendas"
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            />
            <p className={cn('text-xs mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
              Separe as palavras-chave por vírgula
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              <Image className="w-4 h-4 inline mr-2" />
              Logo
            </label>
            <p className={cn('text-xs mb-3', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
              Envie sua logo personalizada. Se não enviar, será exibido o logo padrão "Viva o Sim" com ícone laranja.
            </p>
            <div className={cn('border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors', isDarkMode ? 'border-slate-600 bg-slate-800/50' : 'border-gray-300 bg-gray-50')}>
              {settings.logo ? (
                <div className="space-y-3">
                  <img src={settings.logo} alt="Logo" className="max-h-24 mx-auto" />
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileUpload(file, 'logo')
                        }
                        input.click()
                      }}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateSetting('logo', '')
                        updateSetting('logoSize', 'medium')
                        updateSetting('logoWidth', 40)
                        updateSetting('logoHeight', 40)
                      }}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(file, 'logo')
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>Clique para enviar uma imagem</p>
                  <p className={cn('text-xs mt-1', isDarkMode ? 'text-gray-500' : 'text-gray-500')}>PNG, JPG, SVG (máx 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              Tamanho da Logo
            </label>
            <p className={cn('text-xs mb-2', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
              Escolha o tamanho da logo exibida no header e sidebar
            </p>
            <select
              value={settings.logoSize}
              onChange={(e) => updateSetting('logoSize', e.target.value)}
              className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
            >
              <option value="small">Pequeno (32px)</option>
              <option value="medium">Médio (40px)</option>
              <option value="large">Grande (56px)</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {settings.logoSize === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                  Largura (px)
                </label>
                <input
                  type="number"
                  value={settings.logoWidth}
                  onChange={(e) => updateSetting('logoWidth', parseInt(e.target.value))}
                  className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
                  min="20"
                  max="200"
                />
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
                  Altura (px)
                </label>
                <input
                  type="number"
                  value={settings.logoHeight}
                  onChange={(e) => updateSetting('logoHeight', parseInt(e.target.value))}
                  className={cn('w-full px-4 py-3 rounded-xl border transition-all', isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200')}
                  min="20"
                  max="200"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDarkMode ? 'text-white' : 'text-gray-900')}>
              <Eye className="w-4 h-4 inline mr-2" />
              Favicon
            </label>
            <div className={cn('border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-orange-500 transition-colors', isDarkMode ? 'border-slate-600 bg-slate-800/50' : 'border-gray-300 bg-gray-50')}>
              {settings.favicon ? (
                <div className="space-y-3">
                  <img src={settings.favicon} alt="Favicon" className="w-16 h-16 mx-auto" />
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/x-icon,image/png,image/svg+xml'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileUpload(file, 'favicon')
                        }
                        input.click()
                      }}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting('favicon', '')}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/x-icon,image/png,image/svg+xml'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(file, 'favicon')
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>Clique para enviar</p>
                  <p className={cn('text-xs mt-1', isDarkMode ? 'text-gray-500' : 'text-gray-500')}>ICO, PNG, SVG (32x32 ou 64x64)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SaveButton onClick={handleSaveSite} label="Salvar Configurações do Site" />
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'site': return renderSiteTab()
      case 'branding': return renderBrandingTab()
      case 'company': return renderCompanyTab()
      case 'permissions': return renderPermissionsTab()
      case 'system': return renderSystemTab()
      default: return renderSiteTab()
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
      <div>
        {renderTabContent()}
      </div>
    </div>
  )
}
