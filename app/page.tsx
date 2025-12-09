"use client"

import { useState } from "react"
import { DayScheduleCard } from "@/components/day-schedule-card"
import { CalendarPicker } from "@/components/calendar-picker"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { formatDateRange } from "@/lib/schedule-utils"

import studentData from "@/data/student.json"
import scheduleConfig from "@/data/schedule-config.json"
import weeklySchedule from "@/data/weekly-schedule.json"
import weeklyTasks from "@/data/weekly-tasks.json"

import type { Student, ScheduleConfig, WeeklySchedule, WeeklyTasks } from "@/lib/schedule-types"

const student = studentData as Student
const config = scheduleConfig as ScheduleConfig
const schedule = weeklySchedule as WeeklySchedule
const tasks = weeklyTasks as WeeklyTasks

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-semibold">Charge de la semaine</h1>
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

        {/* Légende */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
          {Object.entries(config.activityTypes).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: value.color }} />
              <span className="text-[#888] text-xs sm:text-sm">{value.label}</span>
            </div>
          ))}
        </div>

        {/* Grid responsive - 1 col mobile, 2 cols tablette, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {schedule.days.map((day) => (
            <DayScheduleCard key={day.date} day={day} config={config} student={student} tasks={tasks.tasks} />
          ))}
        </div>
      </div>

      {showCalendar && (
        <CalendarPicker onClose={() => setShowCalendar(false)} />
      )}
    </div>
  )
}
