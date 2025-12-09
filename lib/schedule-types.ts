export type ActivityType = "ecole" | "renfo" | "repetiteur"

export interface TimeBlock {
  start: string
  end: string
  type: ActivityType
}

export interface DaySchedule {
  dayOfWeek: number
  name: string
  date: string
  blocks: TimeBlock[]
}

export interface WeeklySchedule {
  weekStart: string
  weekEnd: string
  days: DaySchedule[]
}

export interface ActivityConfig {
  label: string
  color: string
  textColor: string
}

export interface ScheduleConfig {
  lunchBreak: {
    start: string
    duration: number
  }
  activityTypes: Record<ActivityType, ActivityConfig>
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  class: string
  school: string
  dayStart: string
  dayEnd: string
}

export type TaskType = "evaluation" | "devoir" | "autre"

export interface Task {
  id: string
  date: string
  type: TaskType
  title: string
  timeStart: string
  timeEnd: string
  color: string
}

export interface WeeklyTasks {
  weekStart: string
  weekEnd: string
  tasks: Task[]
}
