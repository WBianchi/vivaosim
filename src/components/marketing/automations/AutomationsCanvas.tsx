'use client'

interface AutomationsCanvasProps {
  nodes: any[]
  edges: any[]
  onNodesChange: (nodes: any[]) => void
  onEdgesChange: (edges: any[]) => void
}

export const AutomationsCanvas: React.FC<AutomationsCanvasProps> = ({
  nodes, edges, onNodesChange, onEdgesChange
}) => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Arraste elementos da barra lateral para começar
          </p>
          <div className="w-64 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center">
            <p className="text-gray-400">Canvas de Automação</p>
          </div>
        </div>
      </div>
    </div>
  )
}
