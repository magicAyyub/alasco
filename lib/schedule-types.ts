export type ActivityType = "ecole" | "renfo" | "repetiteur" | "autre"

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

export interface RecurringActivity {
  id: string
  dayOfWeek: number
  title: string
  timeStart: string
  timeEnd: string
  color: string
  revisionColor?: string
}

export interface RecurringSchedule {
  activities: RecurringActivity[]
}

export interface SubjectPhoto {
  id: string
  url: string
  timestamp: string
}

export interface SubjectRevision {
  id: string
  date: string
  subjectTitle: string
  activityId: string
  audioUrl?: string
  audioDuration?: number
  photos: SubjectPhoto[]
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface DailyRevisions {
  date: string
  revisions: SubjectRevision[]
}
