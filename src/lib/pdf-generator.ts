// Função para gerar PDF do contrato
export async function generateContractPDF(contract: any) {
  // Criar conteúdo HTML do PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .contract-number {
          color: #666;
          font-size: 14px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        .info-section {
          margin: 30px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 10px;
          background: #f5f5f5;
        }
        .label {
          font-weight: bold;
          color: #555;
        }
        .content {
          margin: 30px 0;
          padding: 20px;
          border: 1px solid #ddd;
          background: #fafafa;
          white-space: pre-wrap;
        }
        .signatures {
          margin-top: 60px;
          display: flex;
          justify-content: space-around;
        }
        .signature-box {
          text-align: center;
          width: 40%;
        }
        .signature-line {
          border-top: 2px solid #333;
          margin-top: 60px;
          padding-top: 10px;
        }
        .signature-image {
          max-width: 200px;
          max-height: 80px;
          margin: 10px auto;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="contract-number">Contrato Nº ${contract.numero || 'N/A'}</div>
        <div class="title">${contract.title || 'Contrato'}</div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="label">Cliente:</span>
          <span>${contract.contact?.name || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span>${contract.contact?.email || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="label">Telefone:</span>
          <span>${contract.contact?.phone || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="label">Valor:</span>
          <span>R$ ${(typeof contract.amount === 'object' ? Number(contract.amount) : contract.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        ${contract.eventDate ? `
        <div class="info-row">
          <span class="label">Data do Evento:</span>
          <span>${new Date(contract.eventDate).toLocaleDateString('pt-BR')}</span>
        </div>
        ` : ''}
      </div>

      ${contract.description ? `
      <div class="info-section">
        <h3>Descrição</h3>
        <p>${contract.description}</p>
      </div>
      ` : ''}

      ${contract.content ? `
      <div class="info-section">
        <h3>Conteúdo do Contrato</h3>
        <div class="content">${contract.content}</div>
      </div>
      ` : ''}

      <div class="signatures">
        <div class="signature-box">
          <h4>Assinatura do Cliente</h4>
          ${contract.clientSignature ? `
            <img src="${contract.clientSignature}" class="signature-image" />
            <div class="signature-line">
              ${contract.contact?.name || 'Cliente'}<br>
              ${contract.clientSignedAt ? new Date(contract.clientSignedAt).toLocaleString('pt-BR') : ''}
            </div>
          ` : `
            <div class="signature-line">
              _______________________________<br>
              ${contract.contact?.name || 'Cliente'}
            </div>
          `}
        </div>

        <div class="signature-box">
          <h4>Assinatura do Prestador</h4>
          ${contract.providerSignature ? `
            <img src="${contract.providerSignature}" class="signature-image" />
            <div class="signature-line">
              ${contract.createdBy?.name || 'Prestador'}<br>
              ${contract.providerSignedAt ? new Date(contract.providerSignedAt).toLocaleString('pt-BR') : ''}
            </div>
          ` : `
            <div class="signature-line">
              _______________________________<br>
              ${contract.createdBy?.name || 'Prestador'}
            </div>
          `}
        </div>
      </div>

      <div class="footer">
        Documento gerado em ${new Date().toLocaleString('pt-BR')}<br>
        Este é um documento digital válido com assinaturas eletrônicas
      </div>
    </body>
    </html>
  `

  // Criar um blob com o HTML
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  // Abrir em nova janela para impressão/PDF
  const printWindow = window.open(url, '_blank')
  
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }, 250)
    }
  }
}
