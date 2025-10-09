'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Heart, Gift, Users, Clock, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react'

interface SiteData {
  id: string
  nomeEvento: string
  dataEvento: Date
  localEvento: string | null
  descricaoEvento: string | null
  logo: string | null
  banner: string | null
  configuracoes: any // JSON com banner e galeria
  corPrimaria: string
  corSecundaria: string
  corDestaque: string
  fontePrimaria: string
  fonteSecundaria: string
  roundButtons: number
  roundSessoes: number
  roundColunas: number
  produtos: Array<{
    id: string
    nome: string
    descricao: string | null
    preco: number
    imagem: string | null
    ativo: boolean
  }>
  contact: {
    name: string
    email: string
    phone: string
  }
}

// Função para corrigir URLs de imagens
const fixImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  
  // Se já é uma URL completa válida, retorna
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Se contém localhost, substitui pelo domínio atual
    if (url.includes('localhost')) {
      return url.replace(/https?:\/\/localhost:\d+/, window.location.origin)
    }
    return url
  }
  
  // Se é um caminho relativo, adiciona o origin
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`
  }
  
  return url
}

export default function RomanticTemplate({ site }: { site: SiteData }) {
  const [selectedPresente, setSelectedPresente] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Extrair banner e galeria do configuracoes e corrigir URLs
  const bannerImages = (site.configuracoes?.banner || []).map(fixImageUrl)
  const galeriaImages = (site.configuracoes?.galeria || []).map(fixImageUrl)

  const styles = {
    primary: site.corPrimaria,
    secondary: site.corSecundaria,
    accent: site.corDestaque,
    fontPrimary: site.fontePrimaria,
    fontSecondary: site.fonteSecundaria,
    roundBtn: `${site.roundButtons}px`,
    roundSection: `${site.roundSessoes}px`,
    roundCard: `${site.roundColunas}px`
  }

  // Auto-play do slider
  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
      }, 5000) // Muda a cada 5 segundos
      return () => clearInterval(interval)
    }
  }, [bannerImages.length])

  const dataFormatada = new Date(site.dataEvento).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const handleComprarPresente = (presente: any) => {
    setSelectedPresente(presente)
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: styles.fontPrimary }}>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {site.logo ? (
                <img src={fixImageUrl(site.logo)} alt={site.nomeEvento} className="h-12 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <Heart className="w-8 h-8" style={{ color: styles.primary }} fill={styles.primary} />
                  <span className="font-bold text-xl" style={{ color: styles.primary }}>
                    {site.nomeEvento.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Menu Centralizado */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <a 
                href="#inicio" 
                className="text-sm font-medium hover:scale-105 transition-all"
                style={{ color: styles.primary }}
              >
                Início
              </a>
              {galeriaImages.length > 0 && (
                <a 
                  href="#galeria" 
                  className="text-sm font-medium hover:scale-105 transition-all"
                  style={{ color: styles.primary }}
                >
                  Galeria
                </a>
              )}
              <a 
                href="#presentes" 
                className="text-sm font-medium hover:scale-105 transition-all"
                style={{ color: styles.primary }}
              >
                Presentes
              </a>
              <a 
                href="#contato" 
                className="text-sm font-medium hover:scale-105 transition-all"
                style={{ color: styles.primary }}
              >
                Contato
              </a>
            </nav>

            {/* Botão CTA */}
            <a
              href="#presentes"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: styles.accent,
                borderRadius: styles.roundBtn
              }}
            >
              <Gift className="w-4 h-4" />
              Ver Presentes
            </a>

            {/* Menu Mobile */}
            <button className="md:hidden p-2">
              <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-800"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section com Slider */}
      <section 
        id="inicio" 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ paddingTop: '80px' }}
      >
        {/* Background Slider */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {bannerImages.length > 0 ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${bannerImages[currentSlide]})`,
                    filter: 'brightness(0.6)'
                  }}
                />
              </motion.div>
            ) : (
              <div 
                className="absolute inset-0"
                style={{ 
                  background: `linear-gradient(135deg, ${site.corPrimaria}22, ${site.corSecundaria}22)`
                }}
              />
            )}
          </AnimatePresence>

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Controles do Slider */}
        {bannerImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {bannerImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Conteúdo */}
        <div className="relative z-10 text-center px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart 
              className="w-16 h-16 mx-auto mb-6 drop-shadow-lg"
              fill="white"
            />
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-2xl"
              style={{ fontFamily: styles.fontSecondary }}
            >
              {site.nomeEvento}
            </h1>
            <div className="flex items-center justify-center gap-8 text-lg mb-8 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span>{dataFormatada}</span>
              </div>
              {site.localEvento && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="w-5 h-5" />
                  <span>{site.localEvento}</span>
                </div>
              )}
            </div>
            {site.descricaoEvento && (
              <p className="text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg">
                {site.descricaoEvento}
              </p>
            )}
            <a
              href="#presentes"
              className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold transition-all hover:scale-105 shadow-2xl"
              style={{ borderRadius: styles.roundBtn }}
            >
              Ver Lista de Presentes
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contador Regressivo com Mensagem IA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <CountdownTimer 
            targetDate={new Date(site.dataEvento)} 
            accent={styles.accent}
            eventName={site.nomeEvento}
            eventDescription={site.descricaoEvento}
          />
        </div>
      </section>

      {/* Galeria de Fotos */}
      {galeriaImages.length > 0 && (
        <section 
          id="galeria" 
          className="py-20"
          style={{ backgroundColor: `${styles.primary}05` }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${styles.primary}15` }}>
                  <ImageIcon className="w-5 h-5" style={{ color: styles.primary }} />
                  <span className="text-sm font-semibold" style={{ color: styles.primary }}>GALERIA</span>
                </div>
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ 
                    fontFamily: styles.fontSecondary,
                    color: styles.primary
                  }}
                >
                  Nossos Momentos
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Momentos especiais que queremos compartilhar com você
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galeriaImages.map((img: string, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-square cursor-pointer overflow-hidden group"
                  style={{ borderRadius: styles.roundCard }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`Galeria ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Presentes */}
      <section 
        id="presentes" 
        className="py-20"
        style={{ backgroundColor: `${styles.secondary}11` }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${styles.accent}15` }}>
                <Gift className="w-5 h-5" style={{ color: styles.accent }} />
                <span className="text-sm font-semibold" style={{ color: styles.accent }}>PRESENTES</span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ 
                  fontFamily: styles.fontSecondary,
                  color: styles.primary
                }}
              >
                Lista de Presentes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Escolha um presente especial e nos ajude a realizar nossos sonhos
              </p>
            </motion.div>
          </div>

          {site.produtos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {site.produtos.filter(p => p.ativo).map((presente, index) => (
                <motion.div
                  key={presente.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className="bg-white shadow-lg overflow-hidden relative group"
                  style={{ borderRadius: styles.roundCard }}
                >
                  {/* Badge de Destaque */}
                  {index < 3 && (
                    <div 
                      className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: styles.accent }}
                    >
                      ⭐ Popular
                    </div>
                  )}

                  {presente.imagem && (
                    <div className="relative overflow-hidden h-56">
                      <img 
                        src={presente.imagem} 
                        alt={presente.nome}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1" style={{ color: styles.primary }}>
                      {presente.nome}
                    </h3>
                    {presente.descricao && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{presente.descricao}</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Valor</p>
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: styles.accent }}
                        >
                          R$ {Number(presente.preco).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleComprarPresente(presente)}
                        className="px-6 py-3 text-white font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                        style={{
                          backgroundColor: styles.accent,
                          borderRadius: styles.roundBtn
                        }}
                      >
                        <Gift className="w-4 h-4" />
                        Presentear
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Nenhum presente disponível no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${styles.secondary}15` }}>
                <Users className="w-5 h-5" style={{ color: styles.secondary }} />
                <span className="text-sm font-semibold" style={{ color: styles.secondary }}>CONTATO</span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ 
                  fontFamily: styles.fontSecondary,
                  color: styles.primary
                }}
              >
                Entre em Contato
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Ficou com alguma dúvida? Entre em contato conosco!
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Nome */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${styles.primary}15` }}>
                  <Users className="w-6 h-6" style={{ color: styles.primary }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Organizador</h3>
                <p className="text-gray-600 text-center text-sm">{site.contact.name}</p>
              </motion.div>

              {/* Card Email */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${styles.accent}15` }}>
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">E-mail</h3>
                <a href={`mailto:${site.contact.email}`} className="text-gray-600 hover:underline text-center text-sm block">
                  {site.contact.email}
                </a>
              </motion.div>

              {/* Card Telefone */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${styles.secondary}15` }}>
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Telefone</h3>
                <a href={`tel:${site.contact.phone}`} className="text-gray-600 hover:underline text-center text-sm block">
                  {site.contact.phone}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${styles.primary}, ${styles.secondary})`,
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Coluna 1 - Logo e Descrição */}
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-8 h-8" fill="white" />
                <h3 className="text-2xl font-bold" style={{ fontFamily: styles.fontSecondary }}>
                  {site.nomeEvento}
                </h3>
              </div>
              <p className="text-white/80 text-sm">
                {site.descricaoEvento || 'Celebre conosco este momento especial'}
              </p>
            </div>

            {/* Coluna 2 - Links Rápidos */}
            <div className="text-white">
              <h4 className="font-bold mb-4 text-lg">Links Rápidos</h4>
              <div className="space-y-2">
                <a href="#inicio" className="block text-white/80 hover:text-white transition-colors text-sm">
                  → Início
                </a>
                {galeriaImages.length > 0 && (
                  <a href="#galeria" className="block text-white/80 hover:text-white transition-colors text-sm">
                    → Galeria
                  </a>
                )}
                <a href="#presentes" className="block text-white/80 hover:text-white transition-colors text-sm">
                  → Lista de Presentes
                </a>
                <a href="#contato" className="block text-white/80 hover:text-white transition-colors text-sm">
                  → Contato
                </a>
              </div>
            </div>

            {/* Coluna 3 - Informações */}
            <div className="text-white">
              <h4 className="font-bold mb-4 text-lg">Informações</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>{dataFormatada}</span>
                </div>
                {site.localEvento && (
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span>{site.localEvento}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="w-4 h-4" />
                  <span>{site.contact.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/80 text-sm">
              <p>© {new Date().getFullYear()} {site.nomeEvento} - Todos os direitos reservados</p>
              <div className="flex items-center gap-2">
                <span>Criado com</span>
                <Heart className="w-4 h-4 animate-pulse" fill="white" />
                <span>por</span>
                <a 
                  href="https://vivaosim.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-white hover:underline"
                >
                  Viva o Sim
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Pagamento */}
      {selectedPresente && (
        <PaymentModal 
          presente={selectedPresente}
          siteId={site.id}
          onClose={() => setSelectedPresente(null)}
          accent={styles.accent}
        />
      )}

      {/* Lightbox da Galeria */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navegação entre imagens */}
            {galeriaImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const currentIndex = galeriaImages.indexOf(selectedImage)
                    const prevIndex = (currentIndex - 1 + galeriaImages.length) % galeriaImages.length
                    setSelectedImage(galeriaImages[prevIndex])
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const currentIndex = galeriaImages.indexOf(selectedImage)
                    const nextIndex = (currentIndex + 1) % galeriaImages.length
                    setSelectedImage(galeriaImages[nextIndex])
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CountdownTimer({ targetDate, accent, eventName, eventDescription }: { 
  targetDate: Date
  accent: string
  eventName: string
  eventDescription: string | null
}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [aiMessage, setAiMessage] = useState('')

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date()
    if (difference > 0) {
      return {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      }
    }
    return null
  }

  // Gerar mensagem personalizada com IA
  useEffect(() => {
    const generateMessage = () => {
      const timeData = calculateTimeLeft()
      const eventType = eventName.toLowerCase().includes('casamento') ? 'casamento' : 'evento'
      
      if (!timeData) {
        return '🎉 O grande dia chegou! Que este momento seja repleto de amor, alegria e memórias inesquecíveis!'
      }

      const { dias } = timeData
      
      // Mensagens personalizadas baseadas no tempo restante
      if (dias === 0) {
        return `✨ Hoje é o dia! ${eventName} está acontecendo agora! Que seja um dia mágico e inesquecível!`
      } else if (dias === 1) {
        return `💫 Falta apenas 1 dia! Amanhã será o grande dia de ${eventName}. A emoção está no ar!`
      } else if (dias <= 7) {
        return `🌟 A contagem regressiva está quase no fim! Em ${dias} dias, ${eventName} se tornará realidade. Prepare-se para momentos incríveis!`
      } else if (dias <= 30) {
        return `💝 ${eventName} está chegando! Faltam ${dias} dias para celebrarmos juntos este momento especial.`
      } else if (dias <= 60) {
        return `🎊 A ansiedade está crescendo! Em ${dias} dias, ${eventName} será celebrado com muito amor e alegria.`
      } else if (dias <= 90) {
        return `💕 ${eventName} está se aproximando! Faltam ${dias} dias para este dia tão esperado.`
      } else {
        return `🌸 ${eventName} será em ${dias} dias! Cada dia que passa nos aproxima deste momento único e especial.`
      }
    }

    setAiMessage(generateMessage())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
      setAiMessage(generateMessage())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [targetDate, eventName])

  if (!timeLeft) {
    return (
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold mb-4" style={{ color: accent }}>
          O grande dia chegou! 🎉
        </div>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          {aiMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensagem Personalizada com IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
          {aiMessage}
        </p>
      </motion.div>

      {/* Contador */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
        {Object.entries(timeLeft).map(([key, value]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <div className="relative">
              <div 
                className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-br from-current to-current bg-clip-text"
                style={{ color: accent }}
              >
                {value}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full" style={{ backgroundColor: accent, opacity: 0.3 }} />
            </div>
            <div className="text-sm md:text-base text-gray-600 uppercase font-semibold mt-3">
              {key}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PaymentModal({ presente, siteId, onClose, accent }: any) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pagamentos/processar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          produtoId: presente.id,
          metodo: paymentMethod
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Pagamento iniciado! Verifique as instruções.')
        onClose()
      } else {
        alert('❌ ' + data.error)
      }
    } catch (error) {
      alert('❌ Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
      >
        <h3 className="text-2xl font-bold mb-4">{presente.nome}</h3>
        <p className="text-3xl font-bold mb-6" style={{ color: accent }}>
          R$ {Number(presente.preco).toFixed(2).replace('.', ',')}
        </p>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => setPaymentMethod('pix')}
            className={`w-full p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'pix' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            💳 Pagar com PIX
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 border-2 rounded-lg transition-colors ${
              paymentMethod === 'card' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            💎 Pagar com Cartão
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-3 text-white rounded-lg disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {loading ? 'Processando...' : 'Confirmar'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
