'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Heart,
  Calendar,
  MapPin,
  Users,
  Gift,
  Globe,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  ExternalLink,
  Package,
  Eye,
  Download
} from 'lucide-react'

export default function DashboardClientePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [clientSite, setClientSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'contrato' | 'presentes' | 'convidados' | 'site'>('visao-geral')

  useEffect(() => {
    fetchUserData()
    fetchClientSite()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        
        if (data.user.role !== 'CLIENTE') {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientSite = async () => {
    try {
      const response = await fetch('/api/sites/clientes/my-site')
      const data = await response.json()
      
      if (data.success && data.site) {
        setClientSite(data.site)
      }
    } catch (error) {
      console.error('Erro ao buscar site:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const diasRestantes = clientSite?.dataEvento 
    ? Math.ceil((new Date(clientSite.dataEvento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header com Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Olá, {user?.name?.split(' ')[0]}! 💕
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {clientSite ? clientSite.nomeEvento : 'Bem-vindo à sua área'}
              </p>
            </div>
          </div>
          
          {clientSite && diasRestantes > 0 && (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl px-6 py-4 text-center border border-pink-200 dark:border-pink-800">
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{diasRestantes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">dias restantes</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button
            onClick={() => setActiveTab('visao-geral')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'visao-geral'
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('contrato')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'contrato'
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Meu Contrato
          </button>
          <button
            onClick={() => setActiveTab('presentes')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'presentes'
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Meus Presentes
          </button>
          <button
            onClick={() => setActiveTab('convidados')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'convidados'
                ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Convidados
          </button>
          {clientSite && (
            <button
              onClick={() => setActiveTab('site')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === 'site'
                  ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Meu Site
            </button>
          )}
        </div>
      </div>

      {/* Visão Geral */}
      {activeTab === 'visao-geral' && (
        <>
          {/* Info Cards */}
          {clientSite && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data do Evento</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(clientSite.dataEvento).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {clientSite.localEvento && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Local</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{clientSite.localEvento}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {clientSite.status === 'PUBLICADO' ? 'Publicado' : 'Rascunho'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {clientSite && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clientSite._count?.convidados || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Convidados</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clientSite.confirmados || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmados</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Gift className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clientSite._count?.produtos || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Presentes</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clientSite._count?.recebimentos || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recebidos</p>
              </div>
            </div>
          )}

          {/* Site Preview */}
          {clientSite && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Seu Site</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
                  <Heart className="w-16 h-16 text-purple-500" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Endereço do Site</p>
                    <a
                      href={`https://${clientSite.subdominio}.vivaosim.com.br`}
                      target="_blank"
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      {clientSite.subdominio}.vivaosim.com.br
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Visualizações</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {clientSite.visualizacoes || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => window.open(`https://${clientSite.subdominio}.vivaosim.com.br`, '_blank')}
                    className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visualizar Site
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sem site */}
          {!clientSite && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Seu site ainda não foi configurado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Entre em contato com seu atendente para criar seu site personalizado
              </p>
            </div>
          )}
        </>
      )}

      {/* Meu Contrato */}
      {activeTab === 'contrato' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalhes do Contrato</h2>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center gap-2">
              <Download className="w-4 h-4" />
              Baixar PDF
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize e gerencie seu contrato. Em breve você poderá assinar digitalmente.
          </p>
        </div>
      )}

      {/* Meus Presentes */}
      {activeTab === 'presentes' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lista de Presentes</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {clientSite?._count?.recebimentos || 0} de {clientSite?._count?.produtos || 0} presentes recebidos
                </span>
              </div>
            </div>
            
            {clientSite?._count?.produtos > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Placeholder para lista de presentes */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seus presentes aparecerão aqui
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum presente cadastrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Entre em contato com seu atendente para adicionar presentes à sua lista
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Convidados */}
      {activeTab === 'convidados' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Meus Convidados</h2>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie sua lista de convidados
            </p>
          </div>
        </div>
      )}

      {/* Meu Site */}
      {activeTab === 'site' && clientSite && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Meu Site</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
              <Heart className="w-16 h-16 text-purple-500" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Endereço do Site</p>
                <a
                  href={`https://${clientSite.subdominio}.vivaosim.com.br`}
                  target="_blank"
                  className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 text-lg"
                >
                  {clientSite.subdominio}.vivaosim.com.br
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  clientSite.status === 'PUBLICADO'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {clientSite.status === 'PUBLICADO' ? '✅ Publicado' : '⏳ Rascunho'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {clientSite.visualizacoes || 0}
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => window.open(`https://${clientSite.subdominio}.vivaosim.com.br`, '_blank')}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar Site
                </button>
                {clientSite.dominioCustom && (
                  <button
                    onClick={() => window.open(`https://${clientSite.dominioCustom}`, '_blank')}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Ver Domínio Custom
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
