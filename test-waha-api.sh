#!/bin/bash

echo "🚀 TESTANDO API WAHA - WhatsApp Integration"
echo "========================================="

WAHA_BASE_URL="http://159.65.34.199:3001"
WAHA_API_KEY="tappyone-waha-2024-secretkey"
SESSION_NAME="test-session-$(date +%s)"

echo ""
echo "1️⃣ Testando conexão com WAHA..."
curl -X GET "$WAHA_BASE_URL/api/sessions" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s

echo ""
echo "2️⃣ Criando nova sessão: $SESSION_NAME"
curl -X POST "$WAHA_BASE_URL/api/sessions" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -d "{
    \"name\": \"$SESSION_NAME\",
    \"config\": {
      \"webhooks\": [{
        \"url\": \"http://159.65.34.199:8081/webhooks/whatsapp\",
        \"events\": [\"message\", \"state.change\"]
      }]
    }
  }" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s

echo ""
echo "3️⃣ Aguardando 3 segundos para sessão inicializar..."
sleep 3

echo ""
echo "4️⃣ Tentando obter QR Code (JSON)..."
curl -X GET "$WAHA_BASE_URL/api/sessions/$SESSION_NAME/auth/qr" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s

echo ""
echo "4b️⃣ Tentando obter QR Code (Imagem)..."
curl -X GET "$WAHA_BASE_URL/api/sessions/$SESSION_NAME/auth/qr?format=image" \
  -H "Accept: image/png" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s --output qr-test.png

echo ""
echo "5️⃣ Verificando status da sessão..."
curl -X GET "$WAHA_BASE_URL/api/sessions/$SESSION_NAME" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s

echo ""
echo "6️⃣ Limpeza - Parando sessão..."
curl -X POST "$WAHA_BASE_URL/api/sessions/$SESSION_NAME/stop" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s

echo ""
echo "7️⃣ Limpeza - Deletando sessão..."
curl -X DELETE "$WAHA_BASE_URL/api/sessions/$SESSION_NAME" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $WAHA_API_KEY" \
  -w "\n📊 Status: %{http_code} | Tempo: %{time_total}s\n" \
  -s

echo ""
echo "✅ Teste completo!"
echo "Se todos os status foram 200/201, a API WAHA está funcionando."
