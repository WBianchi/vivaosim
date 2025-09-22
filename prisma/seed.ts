import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (opcional - descomente se quiser resetar)
  // await prisma.userSession.deleteMany()
  // await prisma.oAuthAccount.deleteMany()
  // await prisma.user.deleteMany()

  // Criar usuário Administrador
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vivaosim.com' },
    update: {},
    create: {
      name: 'Administrador Sistema',
      email: 'admin@vivaosim.com',
      password: adminPassword,
      role: UserRole.ADMINISTRADOR,
      status: UserStatus.ATIVO,
      emailVerified: new Date(),
      phone: '(11) 99999-0001',
      city: 'São Paulo',
      state: 'SP',
      country: 'BR'
    }
  })

  // Criar usuário Atendente
  const atendentePassword = await bcrypt.hash('Atendente123!', 12)
  const atendente = await prisma.user.upsert({
    where: { email: 'atendente@vivaosim.com' },
    update: {},
    create: {
      name: 'Maria Silva Atendente',
      email: 'atendente@vivaosim.com',
      password: atendentePassword,
      role: UserRole.ATENDENTE,
      status: UserStatus.ATIVO,
      emailVerified: new Date(),
      phone: '(11) 99999-0002',
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'BR'
    }
  })

  // Criar usuário Assinante
  const assinantePassword = await bcrypt.hash('Assinante123!', 12)
  const assinante = await prisma.user.upsert({
    where: { email: 'assinante@vivaosim.com' },
    update: {},
    create: {
      name: 'João Santos Assinante',
      email: 'assinante@vivaosim.com',
      password: assinantePassword,
      role: UserRole.ASSINANTE,
      status: UserStatus.ATIVO,
      emailVerified: new Date(),
      phone: '(11) 99999-0003',
      city: 'Belo Horizonte',
      state: 'MG',
      country: 'BR',
      cpf: '123.456.789-01'
    }
  })

  // Criar usuário Cliente
  const clientePassword = await bcrypt.hash('Cliente123!', 12)
  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@vivaosim.com' },
    update: {},
    create: {
      name: 'Ana Costa Cliente',
      email: 'cliente@vivaosim.com',
      password: clientePassword,
      role: UserRole.CLIENTE,
      status: UserStatus.ATIVO,
      emailVerified: new Date(),
      phone: '(11) 99999-0004',
      city: 'Curitiba',
      state: 'PR',
      country: 'BR',
      cpf: '987.654.321-09'
    }
  })

  // Criar um usuário Cliente Pessoa Jurídica
  const empresaPassword = await bcrypt.hash('Empresa123!', 12)
  const empresa = await prisma.user.upsert({
    where: { email: 'empresa@vivaosim.com' },
    update: {},
    create: {
      name: 'Eventos & Cia Ltda',
      email: 'empresa@vivaosim.com',
      password: empresaPassword,
      role: UserRole.CLIENTE,
      status: UserStatus.ATIVO,
      emailVerified: new Date(),
      phone: '(11) 3333-4444',
      city: 'São Paulo',
      state: 'SP',
      country: 'BR',
      cnpj: '12.345.678/0001-90'
    }
  })

  console.log('✅ Usuários criados com sucesso!')
  console.log('\n📋 Credenciais de acesso:')
  console.log('\n👑 ADMINISTRADOR:')
  console.log(`   Email: ${admin.email}`)
  console.log('   Senha: Admin123!')
  console.log('   Acesso: /admin')

  console.log('\n🎧 ATENDENTE:')
  console.log(`   Email: ${atendente.email}`)
  console.log('   Senha: Atendente123!')
  console.log('   Acesso: /dashboard')

  console.log('\n💎 ASSINANTE:')
  console.log(`   Email: ${assinante.email}`)
  console.log('   Senha: Assinante123!')
  console.log('   Acesso: /dashboard')

  console.log('\n👤 CLIENTE (Pessoa Física):')
  console.log(`   Email: ${cliente.email}`)
  console.log('   Senha: Cliente123!')
  console.log('   Acesso: /profile')

  console.log('\n🏢 CLIENTE (Pessoa Jurídica):')
  console.log(`   Email: ${empresa.email}`)
  console.log('   Senha: Empresa123!')
  console.log('   Acesso: /profile')

  console.log('\n🚀 Todos os usuários estão ativos e verificados!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
