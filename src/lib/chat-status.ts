export type AttendanceStatusCode = 'AGUARDANDO' | 'EM_ANDAMENTO' | 'PAUSADO' | 'FINALIZADO'

interface StatusStyle {
  label: string
  badgeClass: string
  dotClass: string
  textClass: string
  hoverClass: string
}

const attendanceStatusStyles: Record<AttendanceStatusCode, StatusStyle> = {
  AGUARDANDO: {
    label: 'Aguardando atendimento',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-600 dark:text-amber-300',
    hoverClass: 'hover:bg-amber-50 dark:hover:bg-amber-900/20'
  },
  EM_ANDAMENTO: {
    label: 'Em atendimento',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-600 dark:text-blue-300',
    hoverClass: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
  },
  PAUSADO: {
    label: 'Atendimento pausado',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    dotClass: 'bg-purple-500',
    textClass: 'text-purple-600 dark:text-purple-300',
    hoverClass: 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
  },
  FINALIZADO: {
    label: 'Atendimento finalizado',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600 dark:text-emerald-300',
    hoverClass: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
  }
}

const contactStatusLabels: Record<string, string> = {
  LEAD_FRESCO: 'Lead fresco',
  LEAD_QUALIFICADO: 'Lead qualificado',
  PROSPECT: 'Prospect',
  CLIENTE: 'Cliente',
  INATIVO: 'Inativo'
}

export interface StatusDisplayInfo {
  code?: string
  label: string
  badgeClass: string
  dotClass: string
}

const defaultStatusDisplay: StatusDisplayInfo = {
  label: 'Sem status',
  badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  dotClass: 'bg-gray-400'
}

const attendanceStatusDescriptions: Record<AttendanceStatusCode, string> = {
  AGUARDANDO: 'Cliente aguardando retorno da equipe',
  EM_ANDAMENTO: 'Atendimento sendo conduzido neste momento',
  PAUSADO: 'Atendimento pausado temporariamente',
  FINALIZADO: 'Atendimento concluído com sucesso'
}

export const ATTENDANCE_STATUS_OPTIONS = Object.entries(attendanceStatusStyles).map(([code, style]) => ({
  code: code as AttendanceStatusCode,
  label: style.label,
  description: attendanceStatusDescriptions[code as AttendanceStatusCode],
  badgeClass: style.badgeClass,
  dotClass: style.dotClass,
  textClass: style.textClass,
  hoverClass: style.hoverClass
}))

export function resolveStatusDisplay(status?: { code?: string; label?: string | null }): StatusDisplayInfo | null {
  if (!status || (!status.code && !status.label)) {
    return null
  }

  const code = status.code as AttendanceStatusCode | undefined

  if (code && attendanceStatusStyles[code]) {
    const style = attendanceStatusStyles[code]
    return {
      code,
      label: status.label || style.label,
      badgeClass: style.badgeClass,
      dotClass: style.dotClass
    }
  }

  const label = status.label || formatStatusLabel(status.code)

  return {
    code: status.code,
    label,
    badgeClass: defaultStatusDisplay.badgeClass,
    dotClass: defaultStatusDisplay.dotClass
  }
}

export function formatStatusLabel(code?: string | null): string {
  if (!code) return defaultStatusDisplay.label
  if (contactStatusLabels[code]) return contactStatusLabels[code]

  return code
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
