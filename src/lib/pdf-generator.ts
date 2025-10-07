import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Função para gerar PDF do orçamento
export function generateQuotePDF(quote: any) {
  const doc = new jsPDF()
  
  // Cores
  const primaryColor: [number, number, number] = [249, 115, 22] // orange-500
  const textColor: [number, number, number] = [31, 41, 55] // gray-800
  const lightGray: [number, number, number] = [243, 244, 246] // gray-100
  
  // Logo/Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('ORÇAMENTO', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nº ${quote.id.substring(0, 8).toUpperCase()}`, 105, 30, { align: 'center' })
  
  // Informações do Cliente
  let yPos = 50
  doc.setTextColor(...textColor)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Dados do Cliente', 15, yPos)
  
  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Cliente: ${quote.client?.name || 'N/A'}`, 15, yPos)
  yPos += 6
  if (quote.client?.email) {
    doc.text(`Email: ${quote.client.email}`, 15, yPos)
    yPos += 6
  }
  if (quote.client?.phone) {
    doc.text(`Telefone: ${quote.client.phone}`, 15, yPos)
    yPos += 6
  }
  
  // Informações do Orçamento
  yPos += 5
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Informações do Orçamento', 15, yPos)
  
  yPos += 8
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Título: ${quote.title}`, 15, yPos)
  yPos += 6
  
  if (quote.description) {
    const descLines = doc.splitTextToSize(`Descrição: ${quote.description}`, 180)
    doc.text(descLines, 15, yPos)
    yPos += (descLines.length * 6)
  }
  
  doc.text(`Data de Criação: ${new Date(quote.createdAt).toLocaleDateString('pt-BR')}`, 15, yPos)
  yPos += 6
  
  if (quote.expiresAt) {
    doc.text(`Válido até: ${new Date(quote.expiresAt).toLocaleDateString('pt-BR')}`, 15, yPos)
    yPos += 6
  }
  
  // Tabela de Itens
  yPos += 5
  const tableData = quote.items.map((item: any) => [
    item.name || item.description,
    item.quantity?.toString() || '1',
    `R$ ${Number(item.unitPrice || item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    `R$ ${Number(item.total || (item.quantity * item.unitPrice)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  ])
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Qtd', 'Valor Unit.', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    },
    margin: { left: 15, right: 15 }
  })
  
  // Totais
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 50
  yPos = finalY + 10
  
  const subtotal = Number(quote.value || quote.amount || 0)
  const discount = Number(quote.discount || 0)
  const total = subtotal - discount
  
  // Fundo para totais
  doc.setFillColor(...lightGray)
  doc.rect(120, yPos - 5, 75, 30, 'F')
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', 125, yPos)
  doc.text(`R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 190, yPos, { align: 'right' })
  
  yPos += 7
  if (discount > 0) {
    doc.text('Desconto:', 125, yPos)
    doc.text(`- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 190, yPos, { align: 'right' })
    yPos += 7
  }
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('TOTAL:', 125, yPos)
  doc.setTextColor(...primaryColor)
  doc.text(`R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 190, yPos, { align: 'right' })
  
  // Footer
  doc.setTextColor(...textColor)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const pageHeight = doc.internal.pageSize.height
  doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, 105, pageHeight - 15, { align: 'center' })
  doc.text('Este é um orçamento válido e pode ser aceito pelo cliente', 105, pageHeight - 10, { align: 'center' })
  
  // Salvar PDF
  doc.save(`orcamento-${quote.id.substring(0, 8)}.pdf`)
}

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
