import type { DaySchedule, Student, Task, RecurringActivity } from "@/lib/schedule-types"
import { calculateBlockPosition, calculatePercentage, formatShortDate } from "@/lib/schedule-utils"

interface DayScheduleCardProps {
  day: DaySchedule
  student: Student
  tasks?: Task[]
  recurringActivities?: RecurringActivity[]
  onEmptyClick?: () => void
}

export function DayScheduleCard({ day, student, tasks = [], recurringActivities = [], onEmptyClick }: DayScheduleCardProps) {
  const totalPercentage = day.blocks.reduce(
    (sum, b) => sum + calculatePercentage(b.start, b.end, student.dayStart, student.dayEnd),
    0,
  )

  const otherTasks = tasks.filter(task => task.date === day.date && task.type === "autre")

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-white font-medium text-sm sm:text-base">{day.name}</h3>
          <p className="text-[#666] text-xs sm:text-sm">{formatShortDate(day.date)}</p>
        </div>
        <span className="text-white text-base sm:text-lg font-semibold">{totalPercentage}%</span>
      </div>

      {/* Timeline avec heures à gauche */}
      <div className="flex gap-1.5 sm:gap-2 h-48 sm:h-64">
        {/* Colonne des heures */}
        <div className="relative w-8 sm:w-10 h-full text-[#444] text-[10px] sm:text-xs">
          {day.blocks.map((block, idx) => {
            const { topPercent, heightPercent } = calculateBlockPosition(
              block.start,
              block.end,
              student.dayStart,
              student.dayEnd,
            )
            return (
              <div key={idx} className="absolute w-full" style={{ top: `${topPercent}%`, height: `${heightPercent}%` }}>
                <span className="absolute -top-2">{block.start}</span>
                <span className="absolute -bottom-2">{block.end}</span>
              </div>
            )
          })}
          <div className="absolute bottom-0 w-full flex justify-center text-[#4A90E2] text-xs">
            zzz
          </div>
        </div>

        {/* Colonne des blocs */}
        <div
          className="relative flex-1 rounded-lg overflow-hidden cursor-pointer"
          onClick={onEmptyClick}
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 3px, #333 3px, #333 4px)",
            backgroundColor: "#1a1a1a",
          }}
        >
          {day.blocks.map((block, idx) => {
            const { topPercent, heightPercent } = calculateBlockPosition(
              block.start,
              block.end,
              student.dayStart,
              student.dayEnd,
            )
            const percentage = calculatePercentage(block.start, block.end, student.dayStart, student.dayEnd)

            // Styles par défaut
            const blockStyles: Record<string, { bg: string; label: string; textColor: string }> = {
              ecole: { bg: "#F5C842", label: "École", textColor: "#000" },
              renfo: { bg: "#E84C3D", label: "Renforcement", textColor: "#fff" },
              repetiteur: { bg: "#ffffff", label: "Répétiteur", textColor: "#000" },
              autre: { bg: "#666", label: "Autre", textColor: "#fff" }
            }

            let style = blockStyles[block.type]

            // Pour les blocs "autre", trouver l'activité correspondante pour obtenir la vraie couleur et le titre
            if (block.type === "autre") {
              const activity = recurringActivities.find(
                a => a.dayOfWeek === day.dayOfWeek && 
                     a.timeStart === block.start && 
                     a.timeEnd === block.end
              )
              
              if (activity) {
                style = {
                  bg: activity.color,
                  label: activity.title,
                  textColor: "#fff"
                }
              }
            }

            return (
              <div
                key={idx}
                className="absolute left-0 right-0 flex items-center justify-center rounded-lg"
                style={{
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: style.bg,
                }}
              >
                <span className="text-sm sm:text-lg font-bold" style={{ color: style.textColor }}>
                  {percentage}%
                </span>
              </div>
            )
          })}
          {otherTasks.map((task) => {
            const { topPercent, heightPercent } = calculateBlockPosition(
              task.timeStart,
              task.timeEnd,
              student.dayStart,
              student.dayEnd,
            )

            return (
              <div
                key={task.id}
                className="absolute left-0 right-0 flex items-center justify-center px-2 rounded-lg"
                style={{
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: task.color,
                }}
              >
                <p className="text-xs sm:text-sm font-medium text-white text-center line-clamp-1 overflow-hidden text-ellipsis">
                  {task.title}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
