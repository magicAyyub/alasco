"use client"

import { useState } from "react"
import { DayTasksCard } from "@/components/day-tasks-card"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskDetail } from "@/components/task-detail"
import { CalendarPicker } from "@/components/calendar-picker"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { formatDateRange } from "@/lib/schedule-utils"

import studentData from "@/data/student.json"
import weeklySchedule from "@/data/weekly-schedule.json"
import weeklyTasks from "@/data/weekly-tasks.json"

import type { Student, WeeklySchedule, WeeklyTasks, Task } from "@/lib/schedule-types"

const student = studentData as Student
const schedule = weeklySchedule as WeeklySchedule
const initialTasks = weeklyTasks as WeeklyTasks

export default function StudentView() {
  const [tasks, setTasks] = useState(initialTasks.tasks)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)

  const handleAddTask = (newTask: any) => {
    const task = {
      ...newTask,
      id: `task_${Date.now()}`
    }
    setTasks([...tasks, task])
  }

  const handleEmptyClick = (date: string) => {
    setSelectedDate(date)
    setShowAddForm(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Ma semaine</h1>
            <p className="text-[#666] text-xs sm:text-sm mt-1">
              {formatDateRange(schedule.weekStart, schedule.weekEnd)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => console.log("Previous week clicked")}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={() => console.log("Next week clicked")}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={() => setShowCalendar(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {schedule.days.map((day) => (
            <DayTasksCard
              key={day.date}
              day={day}
              student={student}
              tasks={tasks}
              onEmptyClick={() => handleEmptyClick(day.date)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </div>

      {showAddForm && (
        <AddTaskForm
          selectedDate={selectedDate}
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddTask}
        />
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {showCalendar && (
        <CalendarPicker onClose={() => setShowCalendar(false)} />
      )}
    </div>
  )
}
