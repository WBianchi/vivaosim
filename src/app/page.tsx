import React from 'react'
import Header from '@/components/institutional/Header'
import Footer from '@/components/institutional/Footer'
import CtaHero from '@/components/institutional/CtaHero'
import Beneficios from '@/components/institutional/Beneficios'
import Demo from '@/components/institutional/Demo'
import Vantagens from '@/components/institutional/Vantagens'
import Avaliacoes from '@/components/institutional/Avaliacoes'
import Numeros from '@/components/institutional/Numeros'
import Planos from '@/components/institutional/Planos'
import PostsCarrousel from '@/components/institutional/PostsCarrousel'
import Historias from '@/components/institutional/Historias'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <section id="inicio">
        <CtaHero />
      </section>
      <section id="beneficios">
        <Beneficios />
      </section>
      <section id="demo">
        <Demo />
      </section>
      <section id="vantagens">
        <Vantagens />
      </section>
      <section id="avaliacoes">
        <Avaliacoes />
      </section>
      <section id="numeros">
        <Numeros />
      </section>
      <section id="planos">
        <Planos />
      </section>
      <section id="blog">
        <PostsCarrousel />
      </section>
      <section id="sobre">
        <Historias />
      </section>
      <Footer />
    </main>
  )
}
