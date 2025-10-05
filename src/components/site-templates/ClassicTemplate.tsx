'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Gift, Mail, Phone } from 'lucide-react'

interface SiteData {
  id: string
  nomeEvento: string
  dataEvento: Date
  localEvento: string | null
  descricaoEvento: string | null
  logo: string | null
  banner: string | null
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
    foto: string | null
    disponivel: boolean
  }>
  contact: {
    name: string
    email: string
    phone: string
  }
}

export default function ClassicTemplate({ site }: { site: SiteData }) {
  const [selectedPresente, setSelectedPresente] = useState<any>(null)

  const dataFormatada = new Date(site.dataEvento).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: site.fontePrimaria }}>
      {/* Header Elegante */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {site.logo && (
              <img src={site.logo} alt={site.nomeEvento} className="h-16" />
            )}
            <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider">
              <a href="#inicio" className="hover:opacity-70 transition">Início</a>
              <a href="#sobre" className="hover:opacity-70 transition">Sobre</a>
              <a href="#presentes" className="hover:opacity-70 transition">Presentes</a>
              <a href="#contato" className="hover:opacity-70 transition">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero com Banner */}
      <section id="inicio" className="relative h-screen flex items-center justify-center">
        {site.banner && (
          <>
            <div className="absolute inset-0">
              <img src={site.banner} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 
            className="text-5xl md:text-7xl font-serif mb-6"
            style={{ fontFamily: site.fonteSecundaria, color: '#fff' }}
          >
            {site.nomeEvento}
          </h1>
          <div className="flex items-center justify-center gap-6 text-lg mb-8 flex-wrap">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded">
              <Calendar className="w-5 h-5" />
              <span>{dataFormatada}</span>
            </div>
            {site.localEvento && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded">
                <MapPin className="w-5 h-5" />
                <span>{site.localEvento}</span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Sobre o Evento */}
      {site.descricaoEvento && (
        <section id="sobre" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 
              className="text-4xl font-serif mb-8"
              style={{ fontFamily: site.fonteSecundaria, color: site.corPrimaria }}
            >
              Nossa História
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {site.descricaoEvento}
            </p>
          </div>
        </section>
      )}

      {/* Lista de Presentes */}
      <section id="presentes" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Gift 
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: site.corPrimaria }}
            />
            <h2 
              className="text-4xl font-serif mb-4"
              style={{ fontFamily: site.fonteSecundaria, color: site.corPrimaria }}
            >
              Lista de Presentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sua presença é o nosso maior presente, mas se desejar nos presentear, escolha um item especial
            </p>
          </div>

          {site.produtos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {site.produtos.filter(p => p.disponivel).map((presente) => (
                <motion.div
                  key={presente.id}
                  whileHover={{ y: -8 }}
                  className="bg-white shadow-md hover:shadow-xl transition-shadow"
                  style={{ borderRadius: `${site.roundColunas}px` }}
                >
                  {presente.foto && (
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={presente.foto} 
                        alt={presente.nome}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: `${site.roundColunas}px ${site.roundColunas}px 0 0` }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{presente.nome}</h3>
                    {presente.descricao && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{presente.descricao}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: site.corDestaque }}
                      >
                        R$ {presente.preco.toFixed(2)}
                      </span>
                      <button
                        onClick={() => setSelectedPresente(presente)}
                        className="px-6 py-2 text-white font-medium transition hover:opacity-90"
                        style={{
                          backgroundColor: site.corPrimaria,
                          borderRadius: `${site.roundButtons}px`
                        }}
                      >
                        Presentear
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Gift className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Lista de presentes em breve</p>
            </div>
          )}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 
              className="text-4xl font-serif mb-8"
              style={{ fontFamily: site.fonteSecundaria, color: site.corPrimaria }}
            >
              Contato
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-lg">
                <Mail className="w-5 h-5" style={{ color: site.corSecundaria }} />
                <a href={`mailto:${site.contact.email}`} className="hover:underline">
                  {site.contact.email}
                </a>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <Phone className="w-5 h-5" style={{ color: site.corSecundaria }} />
                <a href={`tel:${site.contact.phone}`} className="hover:underline">
                  {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 text-white text-center"
        style={{ backgroundColor: site.corSecundaria }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} {site.nomeEvento} • Powered by Viva o Sim
        </p>
      </footer>

      {/* Modal Pagamento */}
      {selectedPresente && (
        <PaymentModal 
          presente={selectedPresente}
          siteId={site.id}
          onClose={() => setSelectedPresente(null)}
          primaryColor={site.corPrimaria}
          accentColor={site.corDestaque}
        />
      )}
    </div>
  )
}

function PaymentModal({ presente, siteId, onClose, primaryColor, accentColor }: any) {
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
        alert('✅ Pagamento processado com sucesso!')
        onClose()
      } else {
        alert('❌ ' + (data.error || 'Erro ao processar pagamento'))
      }
    } catch (error) {
      alert('❌ Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">{presente.nome}</h3>
          {presente.descricao && (
            <p className="text-gray-600 text-sm mb-4">{presente.descricao}</p>
          )}
          <div className="text-4xl font-bold" style={{ color: accentColor }}>
            R$ {presente.preco.toFixed(2)}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setPaymentMethod('pix')}
            className={`w-full p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'pix'
                ? 'border-current bg-opacity-10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={paymentMethod === 'pix' ? { borderColor: primaryColor, backgroundColor: `${primaryColor}15` } : {}}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                💳
              </div>
              <div className="text-left">
                <div className="font-semibold">PIX</div>
                <div className="text-sm text-gray-500">Pagamento instantâneo</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'card'
                ? 'border-current bg-opacity-10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={paymentMethod === 'card' ? { borderColor: primaryColor, backgroundColor: `${primaryColor}15` } : {}}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                💎
              </div>
              <div className="text-left">
                <div className="font-semibold">Cartão de Crédito</div>
                <div className="text-sm text-gray-500">Parcelamento disponível</div>
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-6 py-3 text-white rounded-xl transition disabled:opacity-50 hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
