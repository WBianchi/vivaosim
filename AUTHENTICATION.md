# Sistema de Autenticação - Viva o Sim

Este documento descreve o sistema de autenticação implementado no projeto Viva o Sim.

## 🔐 Características

- **JWT customizado** (sem NextAuth)
- **Múltiplos roles** de usuário (Administrador, Atendente, Assinante, Cliente)
- **Sessions persistentes** com refresh tokens
- **OAuth** com Google e Facebook
- **Verificação de email** obrigatória
- **Reset de senha** seguro
- **Middleware de proteção** de rotas
- **Rate limiting** para tentativas de login

## 🏗️ Arquitetura

### Models (Prisma)
- **User**: Dados do usuário e configurações de segurança
- **UserSession**: Sessions JWT com refresh tokens
- **OAuthAccount**: Contas OAuth (Google/Facebook)

### APIs (/api/auth/)
- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/register` - Registro de nova conta
- `POST /api/auth/logout` - Logout e invalidação de session
- `POST /api/auth/refresh` - Renovação de access token
- `POST /api/auth/forgot-password` - Solicitação de reset de senha
- `POST /api/auth/reset-password` - Reset de senha com token
- `POST /api/auth/verify-email` - Verificação de email
- `POST /api/auth/resend-verification` - Reenvio de email de verificação

### Páginas
- `/login` - Página de login com OAuth
- `/cadastro` - Registro em 2 etapas (dados pessoais + documentos)
- `/verify-email` - Verificação de email

## 🚀 Setup

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` baseado no `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vivaosim?schema=public"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key-here-make-it-long-and-random"
JWT_REFRESH_SECRET="your-refresh-jwt-secret-key-here-make-it-different"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# App Configuration
APP_URL="http://localhost:3000"
```

### 3. Configurar banco de dados
```bash
# Gerar cliente Prisma
pnpm db:generate

# Executar migrações
pnpm db:migrate

# (Opcional) Abrir Prisma Studio
pnpm db:studio
```

### 4. Integrar AuthProvider
Adicione o `AuthProvider` no layout principal (`app/layout.tsx`):

```tsx
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## 👥 Roles e Permissões

### Administrador
- Acesso total ao sistema
- Gerenciar usuários e roles
- Acessar dashboard administrativo (`/admin`)

### Atendente
- Gerenciar leads e eventos
- Acessar CRM (`/dashboard`, `/crm`)
- Não pode gerenciar usuários

### Assinante
- Acessar funcionalidades premium
- Gerenciar próprios eventos
- Acessar dashboard (`/dashboard`)

### Cliente
- Visualizar próprios eventos
- Perfil básico (`/profile`)

## 🛡️ Segurança

### Tokens
- **Access Token**: JWT de curta duração (15 minutos)
- **Refresh Token**: JWT de longa duração (7-30 dias)
- Refresh tokens são armazenados como cookies httpOnly

### Proteções
- Rate limiting (5 tentativas de login por 15 minutos)
- Conta bloqueada temporariamente após 5 tentativas
- Senha forte obrigatória (8+ chars, maiúscula, minúscula, número)
- Verificação de email obrigatória
- Tokens de reset de senha expiram em 1 hora

### Middleware
- Proteção automática de rotas baseada em autenticação
- Redirecionamento baseado em roles
- Headers com informações do usuário para APIs

## 🔄 Fluxo de Autenticação

### Login
1. Usuário envia email/senha
2. Sistema valida credenciais
3. Gera access token (15min) e refresh token (7-30 dias)
4. Refresh token salvo como cookie httpOnly
5. Access token retornado para cliente
6. Redirecionamento baseado no role

### Refresh
1. Access token expira
2. Cliente faz request com refresh token (cookie)
3. Sistema valida refresh token
4. Gera novo access token
5. Atualiza refresh token (opcional)

### Logout
1. Cliente solicita logout
2. Sistema invalida session no banco
3. Remove cookies do navegador

## 📝 Uso no Frontend

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, loading } = useAuth()
  
  if (loading) return <div>Carregando...</div>
  
  if (!user) {
    return <button onClick={() => login(email, password)}>Login</button>
  }
  
  return (
    <div>
      <p>Olá, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## 🔧 Próximos Passos

- [ ] Implementar integração OAuth (Google/Facebook)
- [ ] Configurar envio de emails (verificação/reset)
- [ ] Adicionar 2FA (autenticação em duas etapas)
- [ ] Implementar auditoria de login
- [ ] Dashboard para gerenciamento de usuários
- [ ] Logs de segurança

## 🐛 Troubleshooting

### Erro: "Token inválido"
- Verificar se JWT_SECRET está configurado
- Limpar cookies e localStorage
- Tentar fazer login novamente

### Erro: "Conta bloqueada"
- Aguardar 15 minutos ou resetar no banco:
```sql
UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'user@example.com';
```

### Problemas de CORS
- Verificar se APP_URL está correto no .env
- Configurar headers CORS se necessário
