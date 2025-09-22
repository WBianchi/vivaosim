# 📋 MODELO DE RELACIONAMENTO CLIENTE ↔ WHATSAPP

## 🎯 ESTRATÉGIA DE VINCULAÇÃO

### **Campo Chave: `whatsappChatId`**
```prisma
model Client {
  id                String    @id @default(cuid())
  
  // Dados básicos
  name              String
  email             String?
  phone             String    // Telefone principal (WhatsApp)
  additionalPhone   String?   // Telefone adicional
  document          String?   // CPF/CNPJ
  company           String?
  address           String?
  notes             String?
  
  // 🔗 RELACIONAMENTO WHATSAPP - CAMPO CHAVE
  whatsappChatId    String?   @unique  // ← VINCULA AO CHAT DO WAHA
  whatsappNumber    String?   // Backup do número
  whatsappName      String?   // Nome original do WhatsApp
  
  // Metadata
  source            String    @default("whatsapp") // whatsapp, website, referral
  status            ClientStatus @default(LEAD)     // LEAD, CLIENTE, INATIVO
  createdFrom       String?   // chat-conversion, manual, import
  
  // Relacionamentos
  schedules         Schedule[]
  quotes            Quote[]
  contracts         Contract[]
  tickets           Ticket[]
  tags              ClientTag[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@map("clients")
}

enum ClientStatus {
  LEAD
  CLIENTE
  PROSPECT
  INATIVO
}
```

## 🚀 FLUXO DE VINCULAÇÃO

### **1. Chat WhatsApp → Lead Fresco**
```typescript
// Chat do WAHA
const wahaChat = {
  id: "5511999999999@c.us",    // ← ESTE É O CHAT ID ÚNICO
  name: "João Silva",
  contact: { phone: "+5511999999999" }
}
```

### **2. Primeira Ação Business → Converter Cliente**
```typescript
const clientData = {
  name: "João Silva Santos",           // Completado pelo usuário
  email: "joao@email.com",            // Completado pelo usuário  
  phone: "+5511999999999",            // Do WhatsApp (disabled)
  whatsappChatId: "5511999999999@c.us", // ← CAMPO CHAVE DE VINCULAÇÃO
  whatsappNumber: "+5511999999999",    // Backup
  whatsappName: "João Silva",          // Nome original
  source: "whatsapp",
  status: "LEAD",
  createdFrom: "chat-conversion"
}
```

### **3. Verificação de Cliente Existente**
```typescript
// Verificar se já existe cliente com este chatId
const existingClient = await prisma.client.findUnique({
  where: { whatsappChatId: chat.id }
})

if (existingClient) {
  // Cliente já existe → Executar ação diretamente
  return handleClientAction(actionId, existingClient)
} else {
  // Lead fresco → Abrir formulário de conversão
  return handleCreateClient(actionId)
}
```

## 🔄 BENEFÍCIOS DESTA ABORDAGEM

### ✅ **Vantagens:**
- **Vinculação única** via `whatsappChatId`
- **Lead fresco** não polui banco
- **Conversão intencional** em ações business
- **Dados completos** capturados de uma vez
- **Rastreabilidade** total (source, createdFrom)
- **Backup de dados** (whatsappNumber, whatsappName)

### 🎯 **Uso Prático:**
```typescript
// Buscar cliente pelo chat
const client = await prisma.client.findUnique({
  where: { whatsappChatId: "5511999999999@c.us" },
  include: { schedules: true, quotes: true, tickets: true }
})

// Criar agendamento para este cliente
const schedule = await prisma.schedule.create({
  data: {
    clientId: client.id,
    title: "Reunião de briefing",
    datetime: new Date("2025-01-15T10:00:00")
  }
})
```

## 📊 RELATÓRIOS POSSÍVEIS

- **Conversões WhatsApp → Cliente**
- **Performance por fonte (source)**
- **Leads vs Clientes ativos**
- **Histórico completo por chat**
- **ROI por canal de aquisição**

---
**🔗 RELACIONAMENTO: `Chat.id` ↔ `Client.whatsappChatId`**
