import type { DaySchedule, ScheduleConfig, Student } from "@/lib/schedule-types"
import { calculateBlockPosition, calculatePercentage, formatShortDate } from "@/lib/schedule-utils"

interface DayScheduleCardProps {
  day: DaySchedule
  config: ScheduleConfig
  student: Student
}

export function DayScheduleCard({ day, config, student }: DayScheduleCardProps) {
  const totalPercentage = day.blocks.reduce(
    (sum, b) => sum + calculatePercentage(b.start, b.end, student.dayStart, student.dayEnd),
    0,
  )

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
        </div>

        {/* Colonne des blocs */}
        <div
          className="relative flex-1 rounded-lg overflow-hidden"
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
            const style = config.activityTypes[block.type]

            return (
              <div
                key={idx}
                className="absolute left-0 right-0 flex items-center justify-center rounded-lg"
                style={{
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: style.color,
                }}
              >
                <span className="text-sm sm:text-lg font-bold" style={{ color: style.textColor }}>
                  {percentage}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
