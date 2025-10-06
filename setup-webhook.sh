#!/bin/bash

# Configurar webhook do WAHA para auto-resposta com IA

SESSION="user_fb8da1d7_1759623553528"
WEBHOOK_URL="http://159.65.34.199:8081/webhooks/whatsapp"
WAHA_URL="http://159.65.34.199:3000"
API_KEY="tappyone-waha-2024-secretkey"

echo "🔧 Configurando webhook para sessão: $SESSION"
echo "📍 URL do webhook: $WEBHOOK_URL"
echo ""

# Configurar webhook
curl -X POST "$WAHA_URL/api/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $API_KEY" \
  -d "{
    \"url\": \"$WEBHOOK_URL\",
    \"events\": [\"message\", \"message.any\"],
    \"session\": \"$SESSION\"
  }"

echo ""
echo ""
echo "✅ Webhook configurado!"
echo ""
echo "Para testar, envie uma mensagem para o WhatsApp e veja os logs do servidor Next.js"
