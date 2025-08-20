'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeProvider'

interface PostContentProps {
  content: string
}

const PostContent = ({ content }: PostContentProps) => {
  const { isDarkMode } = useTheme()

  // Mock content sections for demonstration
  const sections = [
    {
      type: 'paragraph',
      content: 'O mercado de eventos está em constante evolução, e para se manter competitivo, é essencial adotar estratégias comprovadas que realmente funcionam. Neste artigo, vamos explorar as 10 técnicas mais eficazes para aumentar suas vendas e conquistar mais clientes.'
    },
    {
      type: 'heading',
      content: '1. Defina seu Público-Alvo com Precisão'
    },
    {
      type: 'paragraph',
      content: 'Conhecer profundamente seu público é o primeiro passo para o sucesso. Analise dados demográficos, comportamentais e psicográficos dos seus clientes ideais. Isso permitirá criar ofertas mais assertivas e campanhas de marketing direcionadas.'
    },
    {
      type: 'quote',
      content: 'Empresas que segmentam adequadamente seu público têm 67% mais chances de aumentar suas vendas.',
      author: 'Estudo Marketing Institute 2024'
    },
    {
      type: 'heading',
      content: '2. Invista em um CRM Inteligente'
    },
    {
      type: 'paragraph',
      content: 'Um sistema de CRM bem configurado é fundamental para acompanhar leads, automatizar follow-ups e personalizar o atendimento. Ferramentas como o Viva o Sim oferecem automação completa do processo de vendas.'
    },
    {
      type: 'list',
      items: [
        'Automação de follow-ups por WhatsApp',
        'Gestão completa de leads e oportunidades',
        'Relatórios detalhados de performance',
        'Integração com redes sociais'
      ]
    },
    {
      type: 'heading',
      content: '3. Crie Propostas Irresistíveis'
    },
    {
      type: 'paragraph',
      content: 'Suas propostas devem ser mais do que uma lista de serviços. Conte uma história, mostre o valor único que você oferece e inclua elementos visuais que impressionem o cliente desde o primeiro contato.'
    }
  ]

  const renderSection = (section: any, index: number) => {
    const baseClasses = `${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`
    
    switch (section.type) {
      case 'heading':
        return (
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-4 mt-8`}
          >
            {section.content}
          </motion.h2>
        )
      
      case 'paragraph':
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`${baseClasses} mb-6 leading-relaxed text-lg`}
          >
            {section.content}
          </motion.p>
        )
      
      case 'quote':
        return (
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`border-l-4 border-orange-500 pl-6 py-4 my-8 ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-orange-50'
            } rounded-r-lg`}
          >
            <p className={`text-lg italic ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            } mb-2`}>
              &ldquo;{section.content}&rdquo;
            </p>
            <cite className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              — {section.author}
            </cite>
          </motion.blockquote>
        )
      
      case 'list':
        return (
          <motion.ul
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`${baseClasses} mb-6 space-y-3`}
          >
            {section.items.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0" />
                <span className="text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </motion.ul>
        )
      
      default:
        return null
    }
  }

  return (
    <section className={`py-16 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            {sections.map((section, index) => renderSection(section, index))}
            
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`mt-12 p-8 rounded-2xl ${
                isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
              } border ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              }`}
            >
              <h3 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-4`}>
                Pronto para implementar essas estratégias?
              </h3>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6`}>
                O Viva o Sim oferece todas as ferramentas necessárias para colocar essas estratégias em prática e multiplicar seus resultados.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Começar agora
              </motion.button>
            </motion.div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default PostContent
