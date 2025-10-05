import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString())
    const userEmail = payload.email

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user || user.role !== 'CLIENTE') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const body = await request.json()
    
    console.log('📥 Body recebido:', JSON.stringify(body, null, 2))
    console.log('📸 Banner recebido:', body.banner)
    console.log('🖼️ Galeria recebida:', body.galeria)
    
    const {
      nomeEvento,
      dataEvento,
      localEvento,
      descricao,
      logo,
      banner,
      galeria,
      corPrimaria,
      corSecundaria,
      corDestaque,
      fontePrimaria,
      fonteSecundaria,
      roundButtons,
      roundSessoes,
      roundColunas,
      presentesSelecionados
    } = body

    // Buscar site do cliente
    const contact = await prisma.contact.findFirst({
      where: { email: userEmail }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 })
    }

    const site = await prisma.clientSite.findFirst({
      where: { contactId: contact.id }
    })

    if (!site) {
      return NextResponse.json({ error: 'Site não encontrado' }, { status: 404 })
    }

    // Preparar dados para atualização
    const updateData: any = {
      ...(nomeEvento && { nomeEvento }),
      ...(dataEvento && { dataEvento: new Date(dataEvento) }),
      ...(localEvento !== undefined && { localEvento }),
      ...(descricao !== undefined && { descricaoEvento: descricao }),
      ...(logo !== undefined && { logo }),
      ...(corPrimaria && { corPrimaria }),
      ...(corSecundaria && { corSecundaria }),
      ...(corDestaque && { corDestaque }),
      ...(fontePrimaria && { fontePrimaria }),
      ...(fonteSecundaria && { fonteSecundaria }),
      ...(roundButtons !== undefined && { roundButtons }),
      ...(roundSessoes !== undefined && { roundSessoes }),
      ...(roundColunas !== undefined && { roundColunas }),
      updatedAt: new Date()
    }

    // Banner e galeria como JSON
    if (banner !== undefined || galeria !== undefined) {
      const currentConfig = (site.configuracoes as any) || {}
      updateData.configuracoes = {
        ...currentConfig,
        banner: banner !== undefined ? banner : (currentConfig.banner || []),
        galeria: galeria !== undefined ? galeria : (currentConfig.galeria || [])
      }
    }

    // Atualizar site
    const updatedSite = await prisma.clientSite.update({
      where: { id: site.id },
      data: updateData
    })

    // Presentes são gerenciados separadamente - não precisa fazer nada aqui
    // Os produtos já existem e são apenas selecionados para exibição

    return NextResponse.json({
      success: true,
      site: updatedSite,
      message: 'Site atualizado com sucesso!'
    })
  } catch (error: any) {
    console.error('❌ ERRO COMPLETO:', error)
    console.error('❌ Stack:', error.stack)
    console.error('❌ Message:', error.message)
    return NextResponse.json(
      { 
        error: 'Erro ao atualizar site',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
