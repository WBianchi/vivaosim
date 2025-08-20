'use client'

import React, { useState } from 'react'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import BlogHero from '@/components/blog/BlogHero'
import BlogFilters from '@/components/blog/BlogFilters'
import BlogGrid from '@/components/blog/BlogGrid'

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Todos', count: 24 },
    { id: 'estrategias', name: 'Estratégias', count: 8 },
    { id: 'tendencias', name: 'Tendências', count: 6 },
    { id: 'casos-sucesso', name: 'Casos de Sucesso', count: 5 },
    { id: 'tecnologia', name: 'Tecnologia', count: 5 }
  ]

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
      category: 'Casos de Sucesso',
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
    }
  ]

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || 
                           post.category.toLowerCase().replace(/\s+/g, '-') === activeCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen">
      <Header />
      
      <BlogHero 
        onSearch={setSearchQuery}
        onFilterChange={setActiveCategory}
      />
      
      <BlogFilters 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <BlogGrid posts={filteredPosts} />
      
      <Footer />
    </main>
  )
}

export default BlogPage
