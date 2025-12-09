import type { Task, DaySchedule, Student } from "@/lib/schedule-types"
import { calculateBlockPosition } from "@/lib/schedule-utils"

interface DayTasksCardProps {
  day: DaySchedule
  student: Student
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onEmptyClick?: () => void
}

export function DayTasksCard({ day, student, tasks, onTaskClick, onEmptyClick }: DayTasksCardProps) {
  const dayTasks = tasks.filter(task => task.date === day.date)
  
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-white font-medium text-sm sm:text-base">{day.name}</h3>
          <p className="text-[#666] text-xs sm:text-sm">
            {new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 h-48 sm:h-64">
        <div className="relative w-8 sm:w-10 h-full text-[#444] text-[10px] sm:text-xs">
          {dayTasks.map((task, idx) => {
            const { topPercent, heightPercent } = calculateBlockPosition(
              task.timeStart,
              task.timeEnd,
              student.dayStart,
              student.dayEnd,
            )
            return (
              <div key={idx} className="absolute w-full" style={{ top: `${topPercent}%`, height: `${heightPercent}%` }}>
                <span className="absolute -top-2">{task.timeStart}</span>
                <span className="absolute -bottom-2">{task.timeEnd}</span>
              </div>
            )
          })}
          <div className="absolute bottom-0 w-full flex justify-center text-[#4A90E2] text-xs">
            zzz
          </div>
        </div>

        <div
          className="relative flex-1 rounded-lg overflow-hidden cursor-pointer"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 3px, #2a2a2a 3px, #2a2a2a 4px)",
            backgroundColor: "#1a1a1a",
          }}
          onClick={onEmptyClick}
        >
          {dayTasks.map((task) => {
            const { topPercent, heightPercent } = calculateBlockPosition(
              task.timeStart,
              task.timeEnd,
              student.dayStart,
              student.dayEnd,
            )

            return (
              <div
                key={task.id}
                className="absolute left-0 right-0 flex items-center justify-center px-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: task.color,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onTaskClick?.(task)
                }}
              >
                <p className="text-xs sm:text-sm font-medium text-white text-center line-clamp-2 overflow-hidden text-ellipsis">
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
