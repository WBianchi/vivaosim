'use client'

import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock,
  User,
  MapPin,
  Video,
  Phone
} from 'lucide-react'

interface SchedulesCalendarProps {
  schedules: any[]
  onScheduleSelect: (schedule: any) => void
  onScheduleMove?: (scheduleId: string, newDate: Date) => void
}

export const SchedulesCalendar: React.FC<SchedulesCalendarProps> = ({ schedules, onScheduleSelect, onScheduleMove }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedSchedule, setDraggedSchedule] = useState<any>(null)

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Dias do mês anterior para completar a primeira semana
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = new Date(year, month, -i)
      days.push({
        date: prevDay,
        isCurrentMonth: false,
        schedules: []
      })
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day)
      const daySchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.dateTime)
        return scheduleDate.toDateString() === dayDate.toDateString()
      })

      days.push({
        date: dayDate,
        isCurrentMonth: true,
        schedules: daySchedules
      })
    }

    // Dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const nextDay = new Date(year, month + 1, day)
      days.push({
        date: nextDay,
        isCurrentMonth: false,
        schedules: []
      })
    }

    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'online': return Video
      case 'phone': return Phone
      case 'in_person': return MapPin
      case 'hybrid': return Video
      default: return MapPin
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500'
      case 'in_progress': return 'bg-orange-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade do calendário */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <div
            key={index}
            onDragOver={(e) => {
              if (draggedSchedule) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (draggedSchedule && onScheduleMove) {
                // Cria nova data mantendo a hora original
                const originalDate = new Date(draggedSchedule.dateTime || draggedSchedule.startDateTime)
                const newDate = new Date(day.date)
                newDate.setHours(originalDate.getHours())
                newDate.setMinutes(originalDate.getMinutes())
                newDate.setSeconds(0)
                newDate.setMilliseconds(0)
                
                onScheduleMove(draggedSchedule.id, newDate)
                setDraggedSchedule(null)
              }
            }}
            className={`min-h-32 p-2 border-r border-b border-gray-100 dark:border-gray-700 transition-colors ${
              !day.isCurrentMonth 
                ? 'bg-gray-50 dark:bg-gray-800' 
                : 'bg-white dark:bg-gray-800'
            } ${
              isToday(day.date) 
                ? 'bg-orange-50 dark:bg-orange-900/20' 
                : ''
            } ${
              draggedSchedule && day.isCurrentMonth
                ? 'bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-400 dark:ring-orange-600'
                : ''
            }`}
          >
            {/* Número do dia */}
            <div className={`text-sm font-medium mb-2 ${
              !day.isCurrentMonth 
                ? 'text-gray-400' 
                : isToday(day.date)
                  ? 'text-orange-600 font-bold'
                  : 'text-gray-900 dark:text-white'
            }`}>
              {day.date.getDate()}
            </div>

            {/* Agendamentos do dia */}
            <div className="space-y-1.5">
              {day.schedules.slice(0, 3).map((schedule) => {
                const FormatIcon = getFormatIcon(schedule.format)
                const isDragging = draggedSchedule?.id === schedule.id
                
                return (
                  <div
                    key={schedule.id}
                    draggable
                    onDragStart={(e: React.DragEvent) => {
                      e.stopPropagation()
                      setDraggedSchedule(schedule)
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                    onDragEnd={() => {
                      setDraggedSchedule(null)
                    }}
                    onClick={() => onScheduleSelect(schedule)}
                    className={`w-full text-left p-2 rounded-lg bg-white dark:bg-gray-700 border-l-2 border-orange-500 shadow-sm hover:shadow transition-shadow cursor-move ${
                      isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'
                    }`}
                    style={{ transition: 'opacity 0.15s, transform 0.15s' }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {new Date(schedule.dateTime).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-gray-900 dark:text-white truncate mb-1">
                      {schedule.title}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FormatIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {schedule.client.name}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Indicador de mais agendamentos */}
              {day.schedules.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-0.5">
                  +{day.schedules.length - 3} mais
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
