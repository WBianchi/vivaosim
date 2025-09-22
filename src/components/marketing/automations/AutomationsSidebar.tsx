'use client'

export const AutomationsSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Triggers & Ações</h3>
      <div className="space-y-2">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move">
          <p className="text-sm font-medium">Novo Lead</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move">
          <p className="text-sm font-medium">Enviar Email</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move">
          <p className="text-sm font-medium">Enviar WhatsApp</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move">
          <p className="text-sm font-medium">Aguardar</p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-move">
          <p className="text-sm font-medium">Condição</p>
        </div>
      </div>
    </div>
  )
}
