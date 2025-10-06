export default function ChatInternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout simples sem TopbarAdmin ou SidebarAdmin
  // Não faz requisições de WhatsApp desnecessárias
  return (
    <div className="h-screen overflow-hidden">
      {children}
    </div>
  )
}
