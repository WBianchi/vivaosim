#!/bin/bash

# Substitua pelo chatId real do WhatsApp
CHAT_ID="${1:-5511999999999@c.us}"

echo "🧪 Testando webhook com chatId: $CHAT_ID"

curl -X POST http://localhost:3002/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message",
    "session": "default",
    "payload": {
      "id": "test_'$(date +%s)'",
      "timestamp": '$(date +%s)',
      "from": "'$CHAT_ID'",
      "fromMe": false,
      "to": "5511888888888@c.us",
      "body": "Olá, preciso de ajuda",
      "type": "text"
    }
  }'

echo ""
echo "✅ Webhook enviado!"
