import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function migrateImagesToBlob() {
  console.log('🚀 Iniciando migração de imagens para Vercel Blob...')

  try {
    // Buscar todos os sites
    const sites = await prisma.clientSite.findMany()

    console.log(`📊 Encontrados ${sites.length} sites para migrar`)

    for (const site of sites) {
      console.log(`\n🌐 Migrando site: ${site.nomeEvento || site.id}`)
      
      let updated = false
      const config = site.configuracoes as any || {}

      // Migrar logo
      if (site.logo && site.logo.startsWith('/uploads/')) {
        console.log(`  📸 Migrando logo: ${site.logo}`)
        const newUrl = await migrateImage(site.logo)
        if (newUrl) {
          await prisma.clientSite.update({
            where: { id: site.id },
            data: { logo: newUrl }
          })
          console.log(`  ✅ Logo migrado: ${newUrl}`)
          updated = true
        }
      }

      // Migrar banner
      if (site.banner && site.banner.startsWith('/uploads/')) {
        console.log(`  📸 Migrando banner: ${site.banner}`)
        const newUrl = await migrateImage(site.banner)
        if (newUrl) {
          await prisma.clientSite.update({
            where: { id: site.id },
            data: { banner: newUrl }
          })
          console.log(`  ✅ Banner migrado: ${newUrl}`)
          updated = true
        }
      }

      // Migrar banners do config
      if (config.banner && Array.isArray(config.banner)) {
        const newBanners = []
        for (const bannerUrl of config.banner) {
          if (bannerUrl.startsWith('/uploads/')) {
            console.log(`  📸 Migrando banner config: ${bannerUrl}`)
            const newUrl = await migrateImage(bannerUrl)
            newBanners.push(newUrl || bannerUrl)
          } else {
            newBanners.push(bannerUrl)
          }
        }
        config.banner = newBanners
        updated = true
      }

      // Migrar galeria
      if (config.galeria && Array.isArray(config.galeria)) {
        const newGaleria = []
        for (const imgUrl of config.galeria) {
          if (imgUrl.startsWith('/uploads/')) {
            console.log(`  📸 Migrando galeria: ${imgUrl}`)
            const newUrl = await migrateImage(imgUrl)
            newGaleria.push(newUrl || imgUrl)
          } else {
            newGaleria.push(imgUrl)
          }
        }
        config.galeria = newGaleria
        updated = true
      }

      // Atualizar configurações se houver mudanças
      if (updated && (config.banner || config.galeria)) {
        await prisma.clientSite.update({
          where: { id: site.id },
          data: { configuracoes: config }
        })
        console.log(`  ✅ Configurações atualizadas`)
      }
    }

    console.log('\n✅ Migração concluída com sucesso!')
  } catch (error) {
    console.error('❌ Erro na migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function migrateImage(localPath: string): Promise<string | null> {
  try {
    // Caminho completo do arquivo
    const fullPath = path.join(process.cwd(), 'public', localPath)

    // Verificar se o arquivo existe
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️  Arquivo não encontrado: ${fullPath}`)
      return null
    }

    // Ler o arquivo
    const fileBuffer = fs.readFileSync(fullPath)
    const fileName = path.basename(localPath)
    const folder = localPath.includes('/logos/') ? 'logos' 
                 : localPath.includes('/banners/') ? 'banners'
                 : 'galeria'

    // Upload para Vercel Blob
    const blob = await put(`${folder}/${fileName}`, fileBuffer, {
      access: 'public',
      addRandomSuffix: false
    })

    return blob.url
  } catch (error) {
    console.error(`  ❌ Erro ao migrar ${localPath}:`, error)
    return null
  }
}

// Executar migração
migrateImagesToBlob()
