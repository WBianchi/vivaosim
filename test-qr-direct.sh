#!/bin/bash

echo "🔍 TESTANDO QR CODE DIRETO WAHA"
echo "================================"

WAHA_BASE_URL="http://159.65.34.199:3001"
WAHA_API_KEY="tappyone-waha-2024-secretkey"

# Usar uma das sessões que já existem no WAHA
echo "1️⃣ Listando sessões existentes..."
curl -X GET "$WAHA_BASE_URL/api/sessions" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -s | jq .

echo ""
echo "2️⃣ Tentando QR Code da sessão 'default'..."
curl -X GET "$WAHA_BASE_URL/api/default/auth/qr" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -s

echo ""
echo "3️⃣ Tentando QR Code da sessão undefined..."
curl -X GET "$WAHA_BASE_URL/api/sessions/undefined/auth/qr" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -s

echo ""
echo "4️⃣ Testando nossa API local..."
curl -X GET "http://localhost:3000/api/whatsapp/sessions/undefined/qr" \
  -H "Authorization: Bearer fake-token" \
  -s
