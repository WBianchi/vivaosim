'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, Upload, Sparkles, Eye, Edit3, 
  Save, Palette, Image, Type, Layout,
  Smartphone, Monitor, Copy, ExternalLink,
  Check, X, Loader2, Calendar, MapPin, Clock,
  Users, Heart
} from 'lucide-react'

export default function SiteClientePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [siteGenerated, setSiteGenerated] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [siteUrl] = useState('joaosilva.vivaosim.com.br')

  const handleGenerateSite = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setSiteGenerated(true)
    }, 3000)
  }

  const templates = [
    { id: 1, name: 'Romântico', color: 'from-pink-400 to-red-400', icon: '💕' },
    { id: 2, name: 'Clássico', color: 'from-gray-400 to-gray-600', icon: '🎩' },
    { id: 3, name: 'Moderno', color: 'from-blue-400 to-purple-400', icon: '✨' },
    { id: 4, name: 'Rústico', color: 'from-yellow-600 to-orange-600', icon: '🌻' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meu Site do Evento</h1>
            <p className="text-gray-600 dark:text-gray-400">Crie um site personalizado com IA</p>
          </div>
        </div>
        {siteGenerated && (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar Site
            </motion.button>
          </div>
        )}
      </div>

      {!siteGenerated ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Criação */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Criar Site com IA</h3>
            
            {/* Upload de Imagem */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto de Capa
              </label>
              <div className="relative">
                {coverImage ? (
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                    <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-orange-400 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Clique para enviar</span>
                    <span className="text-xs text-gray-500">JPG, PNG até 5MB</span>
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setCoverImage(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descreva seu evento para a IA
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Ex: Casamento romântico ao ar livre, com decoração em tons de rosa e branco, cerimônia ao pôr do sol..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Templates */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Escolha um estilo
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-orange-400 transition-colors"
                  >
                    <div className={`w-full h-20 bg-gradient-to-br ${template.color} rounded-lg mb-2 flex items-center justify-center text-3xl`}>
                      {template.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Botão Gerar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateSite}
              disabled={!coverImage || !prompt || isGenerating}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando site com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Site com IA
                </>
              )}
            </motion.button>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preview</h3>
            
            <div className="space-y-4">
              {/* URL do Site */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">URL do seu site</p>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <p className="flex-1 font-mono text-sm text-gray-900 dark:text-white">{siteUrl}</p>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Dispositivos */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Visualizar em</p>
                <div className="flex gap-2">
                  <button className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2">
                    <Monitor className="w-5 h-5" />
                    <span className="text-sm">Desktop</span>
                  </button>
                  <button className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-sm">Mobile</span>
                  </button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Gerando preview com IA...</p>
                    </div>
                  </div>
                ) : coverImage && prompt ? (
                  <LandingPagePreview 
                    coverImage={coverImage}
                    eventName="João & Maria"
                    eventDate="15 de Junho de 2024"
                    eventLocation="Espaço Celebration"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Preview aparecerá aqui</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Site Gerado */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Site Publicado</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-[500px] overflow-hidden">
              <iframe 
                src="/site-gerado-ia" 
                className="w-full h-full"
                title="Preview do Site"
              />
            </div>
            
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">Site publicado com sucesso!</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Acesse em produção: {siteUrl}</p>
                </div>
                <a 
                  href="/site-gerado-ia" 
                  target="_blank" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                  Abrir Site
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Configurações do Site */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Configurações</h3>
            
            <div className="space-y-4">
              <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center gap-3 transition-colors">
                <Palette className="w-5 h-5 text-orange-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Cores e Tema</p>
                  <p className="text-xs text-gray-500">Personalize as cores</p>
                </div>
              </button>

              <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center gap-3 transition-colors">
                <Image className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Galeria de Fotos</p>
                  <p className="text-xs text-gray-500">Adicione mais fotos</p>
                </div>
              </button>

              <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center gap-3 transition-colors">
                <Type className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Textos e Conteúdo</p>
                  <p className="text-xs text-gray-500">Edite os textos</p>
                </div>
              </button>

              <button className="w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl flex items-center gap-3 transition-colors">
                <Layout className="w-5 h-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Layout e Seções</p>
                  <p className="text-xs text-gray-500">Reorganize o layout</p>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
              >
                Desativar Site
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de Preview da Landing Page
function LandingPagePreview({ coverImage, eventName, eventDate, eventLocation }: any) {
  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-500">
        {coverImage && (
          <img src={coverImage} alt="Capa" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{eventName}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {eventDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {eventLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-center gap-6 p-3 text-sm">
          <a className="text-orange-500 font-medium">Início</a>
          <a className="text-gray-600 hover:text-orange-500">Nossa História</a>
          <a className="text-gray-600 hover:text-orange-500">A Festa</a>
          <a className="text-gray-600 hover:text-orange-500">Lista de Presentes</a>
          <a className="text-gray-600 hover:text-orange-500">Confirmação</a>
        </div>
      </div>

      {/* Nossa História */}
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa História</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Uma história de amor que começou com um olhar e se transformou em uma vida juntos. 
          Convidamos você para celebrar este momento especial conosco.
        </p>
      </div>

      {/* A Festa */}
      <div className="bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">A Festa</h2>
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Cerimônia</h3>
            <p className="text-sm text-gray-600">16:00</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Recepção</h3>
            <p className="text-sm text-gray-600">17:30</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Festa</h3>
            <p className="text-sm text-gray-600">19:00</p>
          </div>
        </div>
      </div>

      {/* Lista de Presentes Preview */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lista de Presentes</h2>
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { name: 'Lua de Mel', price: 'R$ 500', icon: '✈️' },
            { name: 'Eletrodomésticos', price: 'R$ 250', icon: '🏠' },
            { name: 'Decoração', price: 'R$ 180', icon: '🎨' },
            { name: 'Experiências', price: 'R$ 300', icon: '🎁' }
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-orange-400 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.price}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg">
                  Presentear
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Confirme sua Presença</h2>
        <p className="mb-6">Sua presença é muito importante para nós!</p>
        <button className="px-6 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Confirmar Presença
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white p-6 text-center">
        <p className="text-sm opacity-75">Com amor, {eventName}</p>
        <p className="text-xs opacity-50 mt-2">Criado com VivaOSim</p>
      </div>
    </div>
  )
}
