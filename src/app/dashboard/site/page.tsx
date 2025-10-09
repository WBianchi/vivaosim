'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, Upload, Eye, Save, Palette, Image as ImageIcon,
  Type, Sparkles, Check, ArrowLeft, ArrowRight, Monitor, Package,
  Heart, Lock
} from 'lucide-react'

interface SiteConfig {
  // Básico
  nomeEvento: string
  tipoEvento: string
  dataEvento: string
  localEvento: string
  descricao: string
  
  // Visual
  logo: string
  banner: string[]
  galeria: string[]
  
  // Design
  template: 'romantic' | 'classic'
  corPrimaria: string
  corSecundaria: string
  corDestaque: string
  fontePrimaria: string
  fonteSecundaria: string
  roundButtons: number
  roundSessoes: number
  roundColunas: number
  
  // Presentes
  presentes: Array<{
    id: string
    nome: string
    preco: number
    descricao: string
    foto: string
  }>
  presentesSelecionados?: string[]
}

export default function SitePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteData, setSiteData] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<SiteConfig>({
    nomeEvento: '',
    tipoEvento: 'CASAMENTO',
    dataEvento: '',
    localEvento: '',
    descricao: '',
    logo: '',
    banner: [],
    galeria: [],
    template: 'romantic',
    corPrimaria: '#FF6B35',
    corSecundaria: '#004E89',
    corDestaque: '#FFC857',
    fontePrimaria: 'Inter',
    fonteSecundaria: 'Playfair Display',
    roundButtons: 8,
    roundSessoes: 12,
    roundColunas: 8,
    presentes: []
  })
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchSiteData()
  }, [])

  const fetchSiteData = async () => {
    try {
      const response = await fetch('/api/sites/clientes/my-site')
      const data = await response.json()
      
      if (data.success && data.site) {
        setSiteData(data.site)
        
        // Buscar IDs dos produtos vinculados ao site
        const presentesSelecionados = data.site.produtos?.map((p: any) => p.id) || []
        
        // Buscar banner e galeria do configuracoes (JSON)
        const configuracoes = data.site.configuracoes as any || {}
        const banner = Array.isArray(configuracoes.banner) ? configuracoes.banner : []
        const galeria = Array.isArray(configuracoes.galeria) ? configuracoes.galeria : []
        
        // Preencher config com dados existentes
        setConfig({
          nomeEvento: data.site.nomeEvento || '',
          tipoEvento: data.site.tipoEvento || 'CASAMENTO',
          dataEvento: data.site.dataEvento ? new Date(data.site.dataEvento).toISOString().split('T')[0] : '',
          localEvento: data.site.localEvento || '',
          descricao: data.site.descricaoEvento || '',
          logo: data.site.logo || '',
          banner: banner,
          galeria: galeria,
          template: 'romantic',
          corPrimaria: data.site.corPrimaria || '#FF6B35',
          corSecundaria: data.site.corSecundaria || '#004E89',
          corDestaque: data.site.corDestaque || '#FFC857',
          fontePrimaria: data.site.fontePrimaria || 'Inter',
          fonteSecundaria: data.site.fonteSecundaria || 'Playfair Display',
          roundButtons: data.site.roundButtons || 8,
          roundSessoes: data.site.roundSessoes || 12,
          roundColunas: data.site.roundColunas || 8,
          presentes: [],
          presentesSelecionados: presentesSelecionados
        })
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('📤 Enviando config:', config)
      console.log('📸 Banner:', config.banner)
      console.log('🖼️ Galeria:', config.galeria)
      
      const response = await fetch('/api/sites/clientes/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const data = await response.json()
      console.log('📥 Resposta:', data)

      if (data.success) {
        alert('✅ Site salvo com sucesso!')
        fetchSiteData()
      } else {
        alert('❌ ' + (data.error || 'Erro ao salvar'))
      }
    } catch (error) {
      console.error('❌ Erro ao salvar:', error)
      alert('❌ Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!confirm('Publicar o site? Ele ficará visível no seu link público.')) return
    
    setSaving(true)
    try {
      // PRIMEIRO: Salvar todas as configurações
      console.log('💾 Salvando antes de publicar...')
      const saveResponse = await fetch('/api/sites/clientes/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const saveData = await saveResponse.json()
      console.log('📥 Resposta do save:', saveData)

      if (!saveData.success) {
        alert('❌ Erro ao salvar: ' + (saveData.error || 'Erro desconhecido'))
        setSaving(false)
        return
      }

      // DEPOIS: Publicar
      console.log('🚀 Publicando...')
      const response = await fetch('/api/sites/clientes/publish', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Site publicado! Acesse em: ' + data.url)
        fetchSiteData()
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao publicar:', error)
      alert('❌ Erro ao publicar')
    } finally {
      setSaving(false)
    }
  }

  const steps = [
    { id: 0, title: 'Template', icon: <Monitor className="w-5 h-5" /> },
    { id: 1, title: 'Informações', icon: <Type className="w-5 h-5" /> },
    { id: 2, title: 'Visual', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 3, title: 'Design', icon: <Palette className="w-5 h-5" /> },
    { id: 4, title: 'Presentes', icon: <Sparkles className="w-5 h-5" /> }
  ]

  const handleImageUpload = async (field: 'logo' | 'banner' | 'galeria', file: File) => {
    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Imagem muito grande! Máximo 5MB')
      return
    }

    // Upload para servidor
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', field === 'logo' ? 'logos' : field === 'banner' ? 'banners' : 'galeria')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        if (field === 'logo') {
          setConfig({ ...config, logo: data.url })
        } else if (field === 'banner') {
          setConfig({ ...config, banner: [...config.banner, data.url] })
        } else if (field === 'galeria') {
          setConfig({ ...config, galeria: [...config.galeria, data.url] })
        }
      } else {
        alert('❌ Erro ao fazer upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('❌ Erro ao fazer upload')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Se não tem site, mostrar mensagem
  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <Globe className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Site ainda não criado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Seu site está sendo preparado. Entre em contato com o suporte para ativar seu site personalizado.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/cliente'}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Site</h1>
            <p className="text-gray-600 dark:text-gray-400">Personalize seu site do evento</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            {showPreview ? 'Fechar' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            Publicar
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === step.id
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {step.icon}
                <span className="font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {currentStep === 0 && (
              <TemplateStep config={config} setConfig={setConfig} />
            )}
            {currentStep === 1 && (
              <InfoStep config={config} setConfig={setConfig} />
            )}
            {currentStep === 2 && (
              <VisualStep config={config} setConfig={setConfig} onImageUpload={handleImageUpload} />
            )}
            {currentStep === 3 && (
              <DesignStep config={config} setConfig={setConfig} />
            )}
            {currentStep === 4 && (
              <PresentesStep config={config} setConfig={setConfig} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Atualizar Site'}
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal config={config} onClose={() => setShowPreview(false)} />
      )}
    </div>
  )
}

// Step Components
function TemplateStep({ config, setConfig }: any) {
  const templates = [
    {
      id: 'romantic',
      nome: 'Romântico',
      descricao: 'Design elegante e delicado com slider, galeria e animações',
      preview: (
        <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 relative">
          {/* Header Preview */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />
              <span className="text-xs font-bold text-rose-500">Evento</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-600">
              <span>Início</span>
              <span>Galeria</span>
              <span>Presentes</span>
            </div>
            <div className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-semibold">
              Ver Presentes
            </div>
          </div>

          {/* Hero Preview */}
          <div className="absolute inset-0 flex items-center justify-center pt-12">
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-rose-500" fill="currentColor" />
              <div className="text-xl font-bold text-rose-600 mb-1">Seu Evento</div>
              <div className="text-xs text-gray-600 mb-2">📅 Data • 📍 Local</div>
              <div className="bg-white px-4 py-1.5 rounded-full text-xs font-semibold text-gray-900 inline-block">
                Ver Lista
              </div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-6 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
          </div>

          {/* Badge */}
          <div className="absolute top-16 right-3 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
            ✨ Novo
          </div>
        </div>
      )
    },
    {
      id: 'classic',
      nome: 'Clássico',
      descricao: 'Design atemporal e sofisticado (em breve)',
      preview: (
        <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 relative flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">Em Breve</p>
            <p className="text-xs text-gray-500 mt-1">Estamos trabalhando neste template</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha seu template</h3>
        <p className="text-gray-600 dark:text-gray-400">Selecione o estilo que mais combina com seu evento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => template.id === 'romantic' && setConfig({ ...config, template: template.id })}
            disabled={template.id !== 'romantic'}
            className={`p-6 rounded-2xl border-2 transition-all text-left ${
              config.template === template.id
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : template.id === 'romantic'
                ? 'border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:shadow-lg'
                : 'border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
            }`}
          >
            {template.preview}
            <div className="mt-4">
              <h4 className="font-semibold text-lg mb-2">{template.nome}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{template.descricao}</p>
            </div>
            {config.template === template.id && (
              <div className="mt-4 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">Selecionado</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function InfoStep({ config, setConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Informações do Evento</h3>
        <p className="text-gray-600 dark:text-gray-400">Conte mais sobre seu evento especial</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Nome do Evento *</label>
          <input
            type="text"
            required
            value={config.nomeEvento}
            onChange={(e) => setConfig({ ...config, nomeEvento: e.target.value })}
            placeholder="Ex: Casamento Ana & Carlos"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Data do Evento *</label>
          <input
            type="date"
            required
            value={config.dataEvento}
            onChange={(e) => setConfig({ ...config, dataEvento: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Local</label>
          <input
            type="text"
            value={config.localEvento}
            onChange={(e) => setConfig({ ...config, localEvento: e.target.value })}
            placeholder="Ex: Fazenda Vista Alegre"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={config.descricao}
            onChange={(e) => setConfig({ ...config, descricao: e.target.value })}
            rows={4}
            placeholder="Conte a história do seu evento..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

function VisualStep({ config, setConfig, onImageUpload }: any) {
  const [nomeParaLogo, setNomeParaLogo] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Imagens e Visual</h3>
        <p className="text-gray-600 dark:text-gray-400">Adicione fotos para personalizar seu site</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Logo</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            {config.logo ? (
              <img src={config.logo} alt="Logo" className="max-h-32 mx-auto mb-2" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-3">Ou use o nome como logo</p>
                <input
                  type="text"
                  value={nomeParaLogo}
                  onChange={(e) => setNomeParaLogo(e.target.value)}
                  placeholder="Digite o nome"
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                />
                <button
                  onClick={() => {
                    if (nomeParaLogo.trim()) {
                      setConfig({ ...config, logo: `text:${nomeParaLogo}` })
                      setNomeParaLogo('')
                    }
                  }}
                  className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600"
                >
                  Usar como Logo
                </button>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onImageUpload('logo', e.target.files[0])}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload" className="text-sm text-orange-500 cursor-pointer hover:text-orange-600 block mt-2">
              {config.logo ? 'Alterar logo' : 'Upload logo'}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Banner Principal</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && Array.from(e.target.files).forEach(f => onImageUpload('banner', f))}
              className="hidden"
              id="banner-upload"
            />
            <label htmlFor="banner-upload" className="text-sm text-orange-500 cursor-pointer hover:text-orange-600">
              Upload banners ({config.banner.length})
            </label>
          </div>
        </div>
      </div>

      {config.banner.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {config.banner.map((img: string, i: number) => (
            <div key={i} className="relative group">
              <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
              <button
                onClick={() => setConfig({ ...config, banner: config.banner.filter((_: any, idx: number) => idx !== i) })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Galeria de Fotos */}
      <div>
        <label className="block text-sm font-medium mb-2">Galeria de Fotos</label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && Array.from(e.target.files).forEach(f => onImageUpload('galeria', f))}
            className="hidden"
            id="galeria-upload"
          />
          <label htmlFor="galeria-upload" className="text-sm text-orange-500 cursor-pointer hover:text-orange-600">
            Upload fotos da galeria ({config.galeria.length})
          </label>
        </div>
      </div>

      {config.galeria.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {config.galeria.map((img: string, i: number) => (
            <div key={i} className="relative group">
              <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
              <button
                onClick={() => setConfig({ ...config, galeria: config.galeria.filter((_: any, idx: number) => idx !== i) })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DesignStep({ config, setConfig }: any) {
  const colorKits = [
    {
      nome: 'Romântico',
      primaria: '#FF6B9D',
      secundaria: '#C44569',
      destaque: '#FFC312'
    },
    {
      nome: 'Elegante',
      primaria: '#2C3E50',
      secundaria: '#34495E',
      destaque: '#E74C3C'
    },
    {
      nome: 'Tropical',
      primaria: '#00B894',
      secundaria: '#00CEC9',
      destaque: '#FDCB6E'
    },
    {
      nome: 'Sunset',
      primaria: '#FF6B35',
      secundaria: '#F7931E',
      destaque: '#FDC830'
    },
    {
      nome: 'Ocean',
      primaria: '#0984E3',
      secundaria: '#74B9FF',
      destaque: '#00CEC9'
    },
    {
      nome: 'Lavanda',
      primaria: '#A29BFE',
      secundaria: '#6C5CE7',
      destaque: '#FD79A8'
    }
  ]

  const fontes = [
    { nome: 'Inter', value: 'Inter, sans-serif' },
    { nome: 'Roboto', value: 'Roboto, sans-serif' },
    { nome: 'Open Sans', value: 'Open Sans, sans-serif' },
    { nome: 'Lato', value: 'Lato, sans-serif' },
    { nome: 'Montserrat', value: 'Montserrat, sans-serif' },
    { nome: 'Poppins', value: 'Poppins, sans-serif' }
  ]

  const fontesTitulos = [
    { nome: 'Playfair Display', value: 'Playfair Display, serif' },
    { nome: 'Merriweather', value: 'Merriweather, serif' },
    { nome: 'Lora', value: 'Lora, serif' },
    { nome: 'Crimson Text', value: 'Crimson Text, serif' },
    { nome: 'Cormorant', value: 'Cormorant, serif' },
    { nome: 'Dancing Script', value: 'Dancing Script, cursive' }
  ]

  const aplicarKit = (kit: any) => {
    setConfig({
      ...config,
      corPrimaria: kit.primaria,
      corSecundaria: kit.secundaria,
      corDestaque: kit.destaque
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Design e Cores</h3>
        <p className="text-gray-600 dark:text-gray-400">Personalize as cores e estilos do seu site</p>
      </div>

      {/* Kits de Cores */}
      <div>
        <label className="block text-sm font-medium mb-3">Kits de Cores Prontos</label>
        <div className="grid grid-cols-3 gap-3">
          {colorKits.map((kit) => (
            <button
              key={kit.nome}
              onClick={() => aplicarKit(kit)}
              className="p-4 border-2 rounded-xl hover:border-orange-500 transition-all group"
            >
              <div className="flex gap-2 mb-2">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: kit.primaria }} />
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: kit.secundaria }} />
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: kit.destaque }} />
              </div>
              <p className="text-sm font-medium">{kit.nome}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cores Personalizadas */}
      <div>
        <label className="block text-sm font-medium mb-3">Ou personalize suas cores</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-2">Cor Primária</label>
            <input
              type="color"
              value={config.corPrimaria}
              onChange={(e) => setConfig({ ...config, corPrimaria: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">Cor Secundária</label>
            <input
              type="color"
              value={config.corSecundaria}
              onChange={(e) => setConfig({ ...config, corSecundaria: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-2">Cor Destaque</label>
            <input
              type="color"
              value={config.corDestaque}
              onChange={(e) => setConfig({ ...config, corDestaque: e.target.value })}
              className="w-full h-12 rounded-lg cursor-pointer border"
            />
          </div>
        </div>
      </div>

      {/* Fontes */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-3">Fonte dos Títulos</label>
          <select
            value={config.fonteSecundaria}
            onChange={(e) => setConfig({ ...config, fonteSecundaria: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            style={{ fontFamily: config.fonteSecundaria }}
          >
            {fontesTitulos.map((fonte) => (
              <option key={fonte.value} value={fonte.value} style={{ fontFamily: fonte.value }}>
                {fonte.nome}
              </option>
            ))}
          </select>
          <p className="text-2xl mt-3" style={{ fontFamily: config.fonteSecundaria }}>
            Exemplo de Título
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Fonte dos Parágrafos</label>
          <select
            value={config.fontePrimaria}
            onChange={(e) => setConfig({ ...config, fontePrimaria: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            style={{ fontFamily: config.fontePrimaria }}
          >
            {fontes.map((fonte) => (
              <option key={fonte.value} value={fonte.value} style={{ fontFamily: fonte.value }}>
                {fonte.nome}
              </option>
            ))}
          </select>
          <p className="text-sm mt-3" style={{ fontFamily: config.fontePrimaria }}>
            Exemplo de parágrafo com esta fonte selecionada.
          </p>
        </div>
      </div>

      {/* Arredondamentos */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Botões: {config.roundButtons}px</label>
          <input
            type="range"
            min="0"
            max="24"
            value={config.roundButtons}
            onChange={(e) => setConfig({ ...config, roundButtons: +e.target.value })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Seções: {config.roundSessoes}px</label>
          <input
            type="range"
            min="0"
            max="32"
            value={config.roundSessoes}
            onChange={(e) => setConfig({ ...config, roundSessoes: +e.target.value })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Cards: {config.roundColunas}px</label>
          <input
            type="range"
            min="0"
            max="24"
            value={config.roundColunas}
            onChange={(e) => setConfig({ ...config, roundColunas: +e.target.value })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

function PresentesStep({ config, setConfig }: any) {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>(config.presentesSelecionados || [])

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      
      if (data.success) {
        setProdutos(data.produtos.filter((p: any) => p.ativo))
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProduto = (id: string) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id]
    
    setSelectedIds(newSelected)
    setConfig({ ...config, presentesSelecionados: newSelected })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Lista de Presentes</h3>
          <p className="text-gray-600 dark:text-gray-400">Selecione os presentes que aparecerão no site</p>
        </div>
        <div className="text-sm text-gray-600">
          {selectedIds.length} de {produtos.length} selecionados
        </div>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum presente cadastrado</p>
          <p className="text-sm text-gray-500 mt-2">
            Vá em "Presentes" para adicionar produtos primeiro
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto: any) => {
            const isSelected = selectedIds.includes(produto.id)
            return (
              <motion.div
                key={produto.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleProduto(produto.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                }`}
              >
                <div className="relative">
                  {produto.imagem ? (
                    <img 
                      src={produto.imagem} 
                      alt={produto.nome} 
                      className="w-full h-32 object-cover rounded-lg mb-2" 
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold mb-1">{produto.nome}</h4>
                <p className="text-orange-600 font-bold">R$ {Number(produto.preco).toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {produto.vendidos}/{produto.quantidade} vendidos
                </p>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PreviewModal({ config, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Preview do Site</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            ✕
          </button>
        </div>
        <div className="p-8" style={{ backgroundColor: config.corSecundaria }}>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {config.logo && <img src={config.logo} alt="Logo" className="h-16 mb-8" />}
            <h1 className="text-4xl font-bold mb-4" style={{ color: config.corPrimaria }}>{config.nomeEvento}</h1>
            <p className="text-gray-600 mb-8">{config.descricao}</p>
            {config.banner[0] && <img src={config.banner[0]} alt="Banner" className="w-full h-64 object-cover rounded-lg" />}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
