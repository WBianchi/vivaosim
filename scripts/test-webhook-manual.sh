#!/bin/bash

# Teste manual do webhook
echo "🧪 TESTANDO WEBHOOK MANUALMENTE"
echo "================================"
echo ""

# URL do webhook (ajuste conforme necessário)
WEBHOOK_URL="${1:-http://159.65.34.199:8081/webhooks/whatsapp}"

echo "📍 URL: $WEBHOOK_URL"
echo ""

# Payload de teste
PAYLOAD='{
  "event": "message",
  "session": "session-test",
  "payload": {
    "id": "test-123",
    "timestamp": 1234567890,
    "from": "5518997200106@c.us",
    "fromMe": false,
    "to": "test@c.us",
    "body": "Olá, teste de webhook!",
    "type": "text"
  }
}'

echo "📦 Payload:"
echo "$PAYLOAD" | jq '.'
echo ""

echo "📤 Enviando requisição..."
echo ""

# Enviar requisição
RESPONSE=$(curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s)

echo "📥 Resposta:"
echo "$RESPONSE"
echo ""

echo "✅ Teste concluído!"
echo ""
echo "💡 Verifique os logs da Vercel em:"
echo "   https://vercel.com/seu-projeto/logs"
