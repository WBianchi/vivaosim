'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Globe, Plus, Search, ExternalLink, Eye, Settings } from 'lucide-react'
import { getAuthToken } from '@/lib/auth-token'
import { motion } from 'framer-motion'

interface AllSitesSidebarProps {
  isOpen: boolean
  onClose: () => void
  chatId?: string
}

export function AllSitesSidebar({ isOpen, onClose, chatId }: AllSitesSidebarProps) {
  const [loading, setLoading] = useState(false)
  const [sites, setSites] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [creating, setCreating] = useState(false)
  const [contactData, setContactData] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      fetchSites()
    }
  }, [isOpen, chatId])

  const fetchSites = async () => {
    setLoading(true)
    try {
      console.log(`🔍 AllSitesSidebar: Buscando sites... (chatId: ${chatId || 'todos'})`)
      
      const response = await fetch('/api/sites/clientes')
      const data = await response.json()
      
      console.log('🌐 AllSitesSidebar: Resposta da API:', data)
      
      if (data.success && data.sites) {
        // Se tiver chatId, buscar o contato primeiro
        let filteredSites = data.sites
        
        if (chatId) {
          console.log('🔍 Buscando contato pelo chatId:', chatId)
          
          // Buscar o contato pelo whatsappChatId
          const contactResponse = await fetch(`/api/contacts/check-chat?chatId=${chatId}`)
          const contactData = await contactResponse.json()
          
          console.log('📱 Contato encontrado:', contactData)
          
          if (contactData.exists && contactData.contact) {
            setContactData(contactData.contact)
            const contactId = contactData.contact.id
            console.log('🎯 Filtrando sites pelo contactId:', contactId)
            
            filteredSites = data.sites.filter((site: any) => site.contactId === contactId)
            console.log(`✅ ${filteredSites.length} sites encontrados para este contato`)
          } else {
            console.log('⚠️ Contato não encontrado, mostrando todos os sites')
          }
        }
        
        setSites(filteredSites)
        console.log(`✅ AllSitesSidebar: ${filteredSites.length} sites carregados`)
      }
    } catch (error) {
      console.error('❌ AllSitesSidebar: Erro ao buscar sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSite = async () => {
    if (!contactData) {
      alert('❌ Contato não encontrado')
      return
    }

    setCreating(true)
    try {
      // Gerar subdomain baseado no nome do contato
      const subdomain = contactData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50) + '-' + Date.now()

      const response = await fetch(`/api/contacts/${contactData.id}/site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain,
          title: `Site de ${contactData.name}`,
          description: `Site personalizado de ${contactData.name}`,
          theme: 'romantic',
          primaryColor: '#FF6B35',
          status: 'draft'
        })
      })

      if (response.ok) {
        alert('✅ Site criado com sucesso!')
        fetchSites()
      } else {
        const error = await response.json()
        alert('❌ ' + (error.message || 'Erro ao criar site'))
      }
    } catch (error) {
      console.error('Erro ao criar site:', error)
      alert('❌ Erro ao criar site')
    } finally {
      setCreating(false)
    }
  }

  const handlePublishSite = async (siteId: string) => {
    if (!confirm('Publicar este site? Ele ficará visível publicamente.')) return

    try {
      const response = await fetch('/api/sites/clientes/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId })
      })

      if (response.ok) {
        alert('✅ Site publicado com sucesso!')
        fetchSites()
      } else {
        const error = await response.json()
        alert('❌ ' + (error.message || 'Erro ao publicar site'))
      }
    } catch (error) {
      console.error('Erro ao publicar site:', error)
      alert('❌ Erro ao publicar site')
    }
  }

  const filteredSites = sites.filter(site => 
    site.nomeEvento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.subdominio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'inactive': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'draft': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'maintenance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    }
    return colors[status] || colors.draft
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'active': 'Ativo',
      'inactive': 'Inativo',
      'draft': 'Rascunho',
      'maintenance': 'Manutenção'
    }
    return labels[status] || status
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content 
          className="fixed right-0 top-0 h-full w-[480px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
          aria-describedby="sites-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <Dialog.Title asChild>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {chatId ? 'Site do Cliente' : 'Todos os Sites'}
                  </h2>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <p id="sites-description" className="text-xs text-gray-500 dark:text-gray-400">
                    {sites.length} site(s) configurado(s)
                  </p>
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Busca */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar sites..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lista de Sites */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredSites.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {searchTerm ? 'Nenhum site encontrado' : 'Nenhum site configurado'}
                </p>
                {chatId && contactData && !searchTerm && (
                  <button
                    onClick={handleCreateSite}
                    disabled={creating}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    {creating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Criando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Criar Site para {contactData.name}
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSites.map((site) => (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                          {site.nomeEvento || site.name || 'Site do Evento'}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(site.statusPublicacao || site.status)}`}>
                            {getStatusLabel(site.statusPublicacao || site.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Domain */}
                    {(site.subdominio || site.domain) && (
                      <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <a 
                            href={`/${site.subdominio || site.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate flex-1"
                          >
                            /{site.subdominio || site.domain}
                          </a>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    )}

                    {/* Custom Domain */}
                    {site.dominioCustom && (
                      <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-500" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">Domínio próprio:</span>
                          <a 
                            href={`https://${site.dominioCustom}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline truncate flex-1"
                          >
                            {site.dominioCustom}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Theme Colors */}
                    {(site.corPrimaria || site.corSecundaria) && (
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Cores:</span>
                        {site.corPrimaria && (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-6 h-6 rounded border-2 border-white dark:border-gray-700 shadow"
                              style={{ backgroundColor: site.corPrimaria }}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{site.corPrimaria}</span>
                          </div>
                        )}
                        {site.corSecundaria && (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-6 h-6 rounded border-2 border-white dark:border-gray-700 shadow"
                              style={{ backgroundColor: site.corSecundaria }}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{site.corSecundaria}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-blue-200 dark:border-blue-800">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                        onClick={() => window.open(`/${site.subdominio || site.domain}`, '_blank')}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Visualizar
                      </motion.button>
                      {(site.statusPublicacao === 'RASCUNHO' || site.status === 'RASCUNHO') && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                          onClick={() => handlePublishSite(site.id)}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Publicar
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Configurar
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
