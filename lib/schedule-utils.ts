import type { ScheduleConfig, ActivityType, RecurringActivity, DaySchedule } from "./schedule-types"

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

export function generateDayScheduleFromRecurring(
  dayOfWeek: number,
  name: string,
  date: string,
  activities: RecurringActivity[]
): DaySchedule {
  const dayActivities = activities
    .filter(a => a.dayOfWeek === dayOfWeek)
    .sort((a, b) => timeToHours(a.timeStart) - timeToHours(b.timeStart))

  console.log(`Generating schedule for ${name} (dayOfWeek: ${dayOfWeek}), found ${dayActivities.length} activities`)

  const blocks: { start: string; end: string; type: ActivityType }[] = []

  let i = 0
  while (i < dayActivities.length) {
    const current = dayActivities[i]

    // Les activités jaunes (#F5C842) consécutives forment un bloc "école"
    if (current.color === "#F5C842") {
      let groupEnd = current.timeEnd
      let j = i + 1

      while (j < dayActivities.length) {
        const next = dayActivities[j]
        // Groupe les activités jaunes si elles sont à moins de 30 min d'écart
        if (next.color === "#F5C842" && timeToHours(next.timeStart) - timeToHours(groupEnd) <= 0.5) {
          groupEnd = next.timeEnd
          j++
        } else {
          break
        }
      }

      blocks.push({
        start: current.timeStart,
        end: groupEnd,
        type: "ecole"
      })

      i = j
    } else {
      // Les autres activités gardent leur type basé sur le titre
      let activityType: ActivityType = "autre"
      if (current.title === "Renforcement") {
        activityType = "renfo"
      } else if (current.title === "Répétiteur") {
        activityType = "repetiteur"
      }
      // Tous les autres titres deviennent type "autre"
      
      blocks.push({
        start: current.timeStart,
        end: current.timeEnd,
        type: activityType
      })
      i++
    }
  }

  return {
    dayOfWeek,
    name,
    date,
    blocks
  }
}
