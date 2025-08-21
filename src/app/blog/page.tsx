'use client'

import React, { useState } from 'react'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import BlogHero from '@/components/blog/BlogHero'
import BlogGrid from '@/components/blog/BlogGrid'

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const allPosts = [
    {
      id: '1',
      title: '10 Estratégias Comprovadas para Aumentar suas Vendas de Eventos em 2024',
      excerpt: 'Descubra as técnicas mais eficazes para converter mais leads em clientes e aumentar seu ticket médio no mercado de eventos.',
      category: 'Estratégias',
      author: 'Marina Santos',
      authorAvatar: '👩‍💼',
      date: '2024-01-15',
      readTime: '8 min',
      slug: 'estrategias-vendas-eventos-2024'
    },
    {
      id: '2',
      title: 'Como Automatizar seu Atendimento no WhatsApp sem Perder o Toque Humano',
      excerpt: 'Aprenda a configurar chatbots inteligentes que mantêm a personalização e aumentam a satisfação dos clientes.',
      category: 'Tecnologia',
      author: 'Carlos Mendes',
      authorAvatar: '👨‍💻',
      date: '2024-01-12',
      readTime: '6 min',
      slug: 'automatizar-whatsapp-eventos'
    },
    {
      id: '3',
      title: 'Case: Como a Elegance Eventos Cresceu 300% Usando CRM Inteligente',
      excerpt: 'Conheça a história completa de transformação digital que levou uma empresa familiar ao topo do mercado.',
      category: 'Cases',
      author: 'Ana Paula Costa',
      authorAvatar: '👩‍🎨',
      date: '2024-01-10',
      readTime: '12 min',
      slug: 'case-elegance-eventos-crescimento'
    },
    {
      id: '4',
      title: 'Tendências de Casamentos 2024: O que Seus Clientes Estão Procurando',
      excerpt: 'Descubra as principais tendências que estão moldando o mercado de casamentos e como se posicionar.',
      category: 'Tendências',
      author: 'Juliana Oliveira',
      authorAvatar: '👩‍💼',
      date: '2024-01-08',
      readTime: '5 min',
      slug: 'tendencias-casamentos-2024'
    },
    {
      id: '5',
      title: 'Precificação Inteligente: Como Definir Preços que Vendem e Geram Lucro',
      excerpt: 'Metodologia completa para precificar seus serviços de forma competitiva e lucrativa no mercado atual.',
      category: 'Estratégias',
      author: 'Roberto Silva',
      authorAvatar: '👨‍💼',
      date: '2024-01-05',
      readTime: '10 min',
      slug: 'precificacao-inteligente-eventos'
    },
    {
      id: '6',
      title: 'IA no Mercado de Eventos: Ferramentas que Estão Revolucionando o Setor',
      excerpt: 'Como a inteligência artificial está transformando a gestão de eventos e criando novas oportunidades.',
      category: 'Tecnologia',
      author: 'Fernando Costa',
      authorAvatar: '👨‍🔬',
      date: '2024-01-03',
      readTime: '7 min',
      slug: 'ia-mercado-eventos'
    },
    {
      id: '7',
      title: 'Marketing Digital para Eventos: Guia Completo 2024',
      excerpt: 'Estratégias de marketing digital que realmente funcionam para empresas de eventos.',
      category: 'Marketing',
      author: 'Patricia Lima',
      authorAvatar: '👩‍💻',
      date: '2024-01-20',
      readTime: '9 min',
      slug: 'marketing-digital-eventos-2024'
    },
    {
      id: '8',
      title: 'Gestão Financeira para Empresas de Eventos',
      excerpt: 'Como organizar as finanças e aumentar a lucratividade do seu negócio de eventos.',
      category: 'Financeiro',
      author: 'Marcos Oliveira',
      authorAvatar: '👨‍💼',
      date: '2024-01-18',
      readTime: '11 min',
      slug: 'gestao-financeira-eventos'
    },
    {
      id: '9',
      title: 'Fornecedores de Eventos: Como Escolher os Melhores Parceiros',
      excerpt: 'Critérios essenciais para selecionar fornecedores que agreguem valor ao seu negócio.',
      category: 'Gestão',
      author: 'Carla Santos',
      authorAvatar: '👩‍🎯',
      date: '2024-01-16',
      readTime: '6 min',
      slug: 'como-escolher-fornecedores-eventos'
    },
    {
      id: '10',
      title: 'Eventos Sustentáveis: Tendência que Veio para Ficar',
      excerpt: 'Como implementar práticas sustentáveis em eventos e atrair clientes conscientes.',
      category: 'Sustentabilidade',
      author: 'Rafael Green',
      authorAvatar: '👨‍🌱',
      date: '2024-01-14',
      readTime: '8 min',
      slug: 'eventos-sustentaveis-2024'
    },
    {
      id: '11',
      title: 'Protocolos de Segurança em Eventos: Guia Atualizado',
      excerpt: 'Tudo que você precisa saber sobre segurança e protocolos em eventos corporativos.',
      category: 'Segurança',
      author: 'Amanda Silva',
      authorAvatar: '👮‍♀️',
      date: '2024-01-11',
      readTime: '13 min',
      slug: 'protocolos-seguranca-eventos'
    },
    {
      id: '12',
      title: 'Buffet para Eventos: Tendências e Inovações',
      excerpt: 'As principais tendências gastronômicas para eventos em 2024.',
      category: 'Gastronomia',
      author: 'Chef Bruno Costa',
      authorAvatar: '👨‍🍳',
      date: '2024-01-09',
      readTime: '7 min',
      slug: 'tendencias-buffet-eventos-2024'
    },
    {
      id: '13',
      title: 'Decoração de Eventos: Como Criar Ambientes Memoráveis',
      excerpt: 'Dicas profissionais para criar decorações que encantam e marcam.',
      category: 'Decoração',
      author: 'Isabela Flores',
      authorAvatar: '👩‍🎨',
      date: '2024-01-07',
      readTime: '10 min',
      slug: 'decoracao-eventos-memoraveis'
    },
    {
      id: '14',
      title: 'Eventos Corporativos: ROI e Métricas de Sucesso',
      excerpt: 'Como medir o retorno sobre investimento em eventos corporativos.',
      category: 'Corporativo',
      author: 'Daniela Martins',
      authorAvatar: '👩‍💼',
      date: '2024-01-06',
      readTime: '12 min',
      slug: 'roi-metricas-eventos-corporativos'
    },
    {
      id: '15',
      title: 'Streaming e Eventos Híbridos: O Futuro dos Eventos',
      excerpt: 'Como combinar eventos presenciais e virtuais para maximizar alcance.',
      category: 'Tecnologia',
      author: 'Pedro Tech',
      authorAvatar: '👨‍💻',
      date: '2024-01-04',
      readTime: '9 min',
      slug: 'eventos-hibridos-streaming-2024'
    },
    {
      id: '16',
      title: 'Contratos para Eventos: Cláusulas Essenciais',
      excerpt: 'Tudo sobre contratos, cláusulas de segurança e proteção jurídica.',
      category: 'Jurídico',
      author: 'Dr. Ricardo Leis',
      authorAvatar: '👨‍⚖️',
      date: '2024-01-02',
      readTime: '15 min',
      slug: 'contratos-eventos-clausulas-essenciais'
    }
  ]

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <main className="min-h-screen">
      <Header />
      
      <BlogHero onSearch={setSearchQuery} />
      
      <BlogGrid posts={filteredPosts} />
      
      <Footer />
    </main>
  )
}

export default BlogPage
