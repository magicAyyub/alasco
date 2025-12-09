import type { ScheduleConfig, ActivityType } from "./schedule-types"

export function timeToHours(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h + m / 60
}

export function calculateBlockPosition(start: string, end: string, dayStart: string, dayEnd: string) {
  const dayStartHours = timeToHours(dayStart)
  const dayEndHours = timeToHours(dayEnd)
  const totalHours = dayEndHours - dayStartHours

  const startHours = timeToHours(start)
  const endHours = timeToHours(end)

  const topPercent = ((startHours - dayStartHours) / totalHours) * 100
  const heightPercent = ((endHours - startHours) / totalHours) * 100

  return { topPercent, heightPercent }
}

export function calculatePercentage(start: string, end: string, dayStart: string, dayEnd: string): number {
  const dayStartHours = timeToHours(dayStart)
  const dayEndHours = timeToHours(dayEnd)
  const totalHours = dayEndHours - dayStartHours

  const startHours = timeToHours(start)
  const endHours = timeToHours(end)

  return Math.round(((endHours - startHours) / totalHours) * 100)
}

export function formatDateRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart)
  const end = new Date(weekEnd)

  const startDay = start.getDate()
  const endDay = end.getDate()
  const month = start.toLocaleDateString("fr-FR", { month: "long" })
  const year = start.getFullYear()

  return `${startDay} - ${endDay} ${month} ${year}`
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

export function getActivityStyle(type: ActivityType, config: ScheduleConfig) {
  return config.activityTypes[type]
}
