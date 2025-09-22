'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeProvider'

interface Dataset {
  label: string
  data: number[]
  color: string
}

interface TrendChartProps {
  data: {
    labels: string[]
    datasets: Dataset[]
  }
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme()
  const { labels, datasets } = data

  // Calcular valores máximos para normalização
  const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data))
  const minValue = Math.min(...datasets.flatMap(dataset => dataset.data))
  const range = maxValue - minValue

  // Função para converter valor em coordenada Y
  const getY = (value: number) => {
    const normalized = (value - minValue) / range
    return 200 - (normalized * 160) // 200px altura, com 20px margem top/bottom
  }

  // Função para gerar path SVG
  const generatePath = (dataPoints: number[]) => {
    const width = 400
    const stepX = width / (dataPoints.length - 1)
    
    let path = `M 0 ${getY(dataPoints[0])}`
    
    for (let i = 1; i < dataPoints.length; i++) {
      const x = i * stepX
      const y = getY(dataPoints[i])
      path += ` L ${x} ${y}`
    }
    
    return path
  }

  return (
    <div className="w-full h-64 relative">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {datasets.map((dataset, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dataset.color }}
            />
            <span className={cn(
              'text-sm font-medium',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              {dataset.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-48 overflow-hidden">
        <svg 
          viewBox="0 0 400 200" 
          className="w-full h-full"
        >
          {/* Grid Lines */}
          <defs>
            <pattern 
              id="grid" 
              width="40" 
              height="40" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#grid)" />

          {/* Area fills */}
          {datasets.map((dataset, index) => {
            const path = generatePath(dataset.data)
            const areaPath = path + ` L 400 200 L 0 200 Z`
            
            return (
              <motion.path
                key={`area-${index}`}
                d={areaPath}
                fill={dataset.color}
                fillOpacity="0.1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            )
          })}

          {/* Lines */}
          {datasets.map((dataset, index) => (
            <motion.path
              key={`line-${index}`}
              d={generatePath(dataset.data)}
              fill="none"
              stroke={dataset.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: index * 0.3 }}
            />
          ))}

          {/* Data Points */}
          {datasets.map((dataset, datasetIndex) => 
            dataset.data.map((value, pointIndex) => {
              const x = (pointIndex * 400) / (dataset.data.length - 1)
              const y = getY(value)
              
              return (
                <motion.circle
                  key={`point-${datasetIndex}-${pointIndex}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={dataset.color}
                  stroke={isDarkMode ? '#1e293b' : '#ffffff'}
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: datasetIndex * 0.3 + pointIndex * 0.1 
                  }}
                  className="drop-shadow-sm"
                />
              )
            })
          )}
        </svg>

        {/* X-axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {labels.map((label, index) => (
            <motion.span
              key={index}
              className={cn(
                'text-xs font-medium',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Y-axis Labels */}
      <div className="absolute left-0 top-8 bottom-4 flex flex-col justify-between">
        {[maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), minValue].map((value, index) => (
          <motion.span
            key={index}
            className={cn(
              'text-xs font-medium -ml-8',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {value.toLocaleString()}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
