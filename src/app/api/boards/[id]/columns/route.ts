import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createColumnSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  color: z.string().default('#6B7280'),
  position: z.number().optional()
})

// GET - Listar colunas do board
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const columns = await prisma.kanbanColumn.findMany({
      where: { boardId: params.id },
      orderBy: { position: 'asc' },
      include: {
        clients: {
          include: {
            tags: true,
            assignedTo: true,
            quotes: {
              select: {
                total: true
              }
            },
            _count: {
              select: {
                tickets: true,
                contracts: true,
                quotes: true,
                schedules: true,
                appointments: true,
                contactNotes: true
              }
            }
          }
        },
        _count: {
          select: { clients: true }
        }
      }
    })

    // Calcular o valor total dos orçamentos para cada cliente
    const columnsWithValues = await Promise.all(columns.map(async column => ({
      ...column,
      clients: await Promise.all(column.clients.map(async client => {
        const totalValue = client.quotes.reduce((sum, quote) => {
          const quoteTotal = typeof quote.total === 'string' 
            ? parseFloat(quote.total) 
            : typeof quote.total === 'object' && quote.total !== null
            ? parseFloat(quote.total.toString())
            : Number(quote.total)
          return sum + (quoteTotal || 0)
        }, 0)
        
        // Buscar agente atribuído a este contato
        const agent = await prisma.agent.findFirst({
          where: { contactId: client.id },
          select: {
            id: true,
            name: true,
            model: true,
            status: true
          }
        })
        
        // Remover quotes do retorno e adicionar apenas o value calculado
        const { quotes, _count, ...clientData } = client
        
        const result = {
          ...clientData,
          value: totalValue,
          tickets: _count.tickets,
          contracts: _count.contracts,
          quotesCount: _count.quotes,
          schedules: (_count.schedules || 0) + (_count.appointments || 0), // Soma schedules + appointments
          notes: _count.contactNotes || 0,
          agent: agent || null // Agente IA atribuído
        }
        
        // Debug: Log para ver as contagens
        if (result.notes > 0 || result.tickets > 0) {
          console.log(`📊 Cliente ${clientData.name}:`, {
            notes: result.notes,
            tickets: result.tickets,
            contracts: result.contracts,
            quotes: result.quotesCount,
            schedules: result.schedules,
            agent: agent?.name || 'Nenhum'
          })
        }
        
        return result
      }))
    })))

    return NextResponse.json({ columns: columnsWithValues })
  } catch (error) {
    console.error('❌ Erro ao listar colunas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova coluna
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, color, position } = createColumnSchema.parse(body)

    // Se não especificar posição, colocar no final
    const finalPosition = position ?? (await prisma.kanbanColumn.count({
      where: { boardId: params.id }
    }))

    const column = await prisma.kanbanColumn.create({
      data: {
        title,
        color,
        position: finalPosition,
        boardId: params.id
      }
    })

    console.log('✅ Coluna criada:', column.title)
    return NextResponse.json({ column }, { status: 201 })
  } catch (error) {
    console.error('❌ Erro ao criar coluna:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
