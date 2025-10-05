import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RomanticTemplate from '@/components/site-templates/RomanticTemplate'
import ClassicTemplate from '@/components/site-templates/ClassicTemplate'

interface PageProps {
  params: {
    subdomain: string
  }
}

async function getSiteData(subdomain: string) {
  try {
    const site = await prisma.clientSite.findFirst({
      where: {
        subdominio: subdomain,
        status: 'PUBLICADO'
      },
      include: {
        contact: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        produtos: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return site
  } catch (error) {
    console.error('Erro ao buscar site:', error)
    return null
  }
}

export default async function SubdomainPage({ params }: PageProps) {
  const site = await getSiteData(params.subdomain)

  if (!site) {
    notFound()
  }

  // Incrementar visualizações
  await prisma.clientSite.update({
    where: { id: site.id },
    data: { visualizacoes: { increment: 1 } }
  })

  // Determinar qual template usar baseado na configuração
  const templateConfig = site.configuracoes as any
  const templateType = templateConfig?.template || 'romantic'

  if (templateType === 'classic') {
    return <ClassicTemplate site={site} />
  }

  return <RomanticTemplate site={site} />
}

export async function generateMetadata({ params }: PageProps) {
  const site = await getSiteData(params.subdomain)

  if (!site) {
    return {
      title: 'Site não encontrado'
    }
  }

  return {
    title: site.nomeEvento,
    description: site.descricaoEvento || `${site.nomeEvento} - ${new Date(site.dataEvento).toLocaleDateString('pt-BR')}`,
    openGraph: {
      title: site.nomeEvento,
      description: site.descricaoEvento,
      images: site.banner ? [site.banner] : []
    }
  }
}
