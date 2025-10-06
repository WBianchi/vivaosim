# 🔧 Correção: Upload de Arquivos para WAHA

## 🚨 Problema
O WAHA não consegue acessar `http://localhost:3000` porque está rodando em outro servidor.

## ✅ Solução

### Opção 1: Ngrok (Desenvolvimento)
1. Instale o ngrok: `npm install -g ngrok`
2. Execute: `ngrok http 3000`
3. Copie a URL gerada (ex: `https://abc123.ngrok.io`)
4. Adicione no `.env`:
```env
PUBLIC_APP_URL="https://abc123.ngrok.io"
```

### Opção 2: IP Público (Desenvolvimento Local)
1. Descubra seu IP local: `ip addr show` ou `ifconfig`
2. Adicione no `.env`:
```env
PUBLIC_APP_URL="http://192.168.1.100:3000"  # Substitua pelo seu IP
```

### Opção 3: Domínio (Produção)
```env
PUBLIC_APP_URL="https://seu-dominio.com"
```

## 📝 Variáveis de Ambiente Necessárias

Adicione no seu `.env` (não commitado):

```env
# URL pública que o WAHA consegue acessar
PUBLIC_APP_URL="https://seu-ngrok-ou-dominio.com"

# Configuração WAHA
WAHA_API_URL="http://159.65.34.199:3001"
WAHA_API_KEY="tappyone-waha-2024-secretkey"
```

## 🧪 Como Testar

1. Reinicie o servidor Next.js
2. Envie uma imagem pelo chat
3. Verifique os logs no console:
   - ✅ "📤 URL do arquivo: https://..."
   - ✅ "📤 Enviando via WAHA..."
   - ✅ "✅ Mensagem enviada com sucesso"

## 🔍 Debug

Se ainda der erro, verifique:

1. **URL acessível?**
   ```bash
   curl https://sua-url.com/uploads/chat/arquivo.png
   ```

2. **WAHA funcionando?**
   ```bash
   curl http://159.65.34.199:3001/api/sessions \
     -H "X-Api-Key: tappyone-waha-2024-secretkey"
   ```

3. **Logs detalhados:**
   - Console do navegador (F12)
   - Terminal do servidor Next.js
   - Logs do WAHA

## 📋 Checklist

- [ ] `PUBLIC_APP_URL` configurado no `.env`
- [ ] Servidor reiniciado após mudança no `.env`
- [ ] URL é acessível externamente
- [ ] WAHA está rodando e conectado
- [ ] Pasta `public/uploads/chat` existe e tem permissões

## 💡 Dica

Para desenvolvimento rápido, use **ngrok**! É gratuito e funciona perfeitamente.
