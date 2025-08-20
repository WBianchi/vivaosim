'use client'

import React from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import PostHero from '@/components/blog/PostHero'
import PostContent from '@/components/blog/PostContent'
import PostNavigation from '@/components/blog/PostNavigation'
import RelatedPosts from '@/components/blog/RelatedPosts'

interface PageProps {
  params: {
    slug: string
  }
}

const SinglePostPage = ({ params }: PageProps) => {
  // Mock post data - in real app, this would come from CMS/API
  const posts = {
    'estrategias-vendas-eventos-2024': {
      id: '1',
      title: '10 Estratégias Comprovadas para Aumentar suas Vendas de Eventos em 2024',
      excerpt: 'Descubra as técnicas mais eficazes para converter mais leads em clientes e aumentar seu ticket médio no mercado de eventos.',
      content: 'Conteúdo completo do artigo...',
      category: 'Estratégias',
      author: 'Marina Santos',
      authorAvatar: '👩‍💼',
      date: '2024-01-15',
      readTime: '8 min',
      slug: 'estrategias-vendas-eventos-2024'
    },
    'automatizar-whatsapp-eventos': {
      id: '2',
      title: 'Como Automatizar seu Atendimento no WhatsApp sem Perder o Toque Humano',
      excerpt: 'Aprenda a configurar chatbots inteligentes que mantêm a personalização e aumentam a satisfação dos clientes.',
      content: 'Conteúdo completo do artigo...',
      category: 'Tecnologia',
      author: 'Carlos Mendes',
      authorAvatar: '👨‍💻',
      date: '2024-01-12',
      readTime: '6 min',
      slug: 'automatizar-whatsapp-eventos'
    },
    'case-elegance-eventos-crescimento': {
      id: '3',
      title: 'Case: Como a Elegance Eventos Cresceu 300% Usando CRM Inteligente',
      excerpt: 'Conheça a história completa de transformação digital que levou uma empresa familiar ao topo do mercado.',
      content: 'Conteúdo completo do artigo...',
      category: 'Casos de Sucesso',
      author: 'Ana Paula Costa',
      authorAvatar: '👩‍🎨',
      date: '2024-01-10',
      readTime: '12 min',
      slug: 'case-elegance-eventos-crescimento'
    },
    'tendencias-casamentos-2024': {
      id: '4',
      title: 'Tendências de Casamentos 2024: O que Seus Clientes Estão Procurando',
      excerpt: 'Descubra as principais tendências que estão moldando o mercado de casamentos e como se posicionar.',
      content: 'Conteúdo completo do artigo...',
      category: 'Tendências',
      author: 'Juliana Oliveira',
      authorAvatar: '👩‍💼',
      date: '2024-01-08',
      readTime: '5 min',
      slug: 'tendencias-casamentos-2024'
    },
    'precificacao-inteligente-eventos': {
      id: '5',
      title: 'Precificação Inteligente: Como Definir Preços que Vendem e Geram Lucro',
      excerpt: 'Metodologia completa para precificar seus serviços de forma competitiva e lucrativa no mercado atual.',
      content: 'Conteúdo completo do artigo...',
      category: 'Estratégias',
      author: 'Roberto Silva',
      authorAvatar: '👨‍💼',
      date: '2024-01-05',
      readTime: '10 min',
      slug: 'precificacao-inteligente-eventos'
    },
    'ia-mercado-eventos': {
      id: '6',
      title: 'IA no Mercado de Eventos: Ferramentas que Estão Revolucionando o Setor',
      excerpt: 'Como a inteligência artificial está transformando a gestão de eventos e criando novas oportunidades.',
      content: 'Conteúdo completo do artigo...',
      category: 'Tecnologia',
      author: 'Fernando Costa',
      authorAvatar: '👨‍🔬',
      date: '2024-01-03',
      readTime: '7 min',
      slug: 'ia-mercado-eventos'
    }
  }

  const post = posts[params.slug as keyof typeof posts]
  
  if (!post) {
    notFound()
  }

  // Get navigation posts
  const postIds = Object.keys(posts)
  const currentIndex = postIds.indexOf(params.slug)
  const previousPost = currentIndex > 0 ? posts[postIds[currentIndex - 1] as keyof typeof posts] : undefined
  const nextPost = currentIndex < postIds.length - 1 ? posts[postIds[currentIndex + 1] as keyof typeof posts] : undefined

  // Get related posts (excluding current post)
  const relatedPosts = Object.values(posts)
    .filter(p => p.slug !== params.slug)
    .slice(0, 3)

  return (
    <main className="min-h-screen">
      <Header />
      
      <PostHero 
        title={post.title}
        excerpt={post.excerpt}
        category={post.category}
        author={post.author}
        authorAvatar={post.authorAvatar}
        date={post.date}
        readTime={post.readTime}
      />
      
      <PostContent content={post.content} />
      
      <PostNavigation 
        previousPost={previousPost ? {
          title: previousPost.title,
          slug: previousPost.slug
        } : undefined}
        nextPost={nextPost ? {
          title: nextPost.title,
          slug: nextPost.slug
        } : undefined}
      />
      
      <RelatedPosts posts={relatedPosts} />
      
      <Footer />
    </main>
  )
}

export default SinglePostPage
