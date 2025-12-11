"use client"

import { useState, useMemo } from "react"
import { DayScheduleCard } from "@/components/day-schedule-card"
import { CalendarPicker } from "@/components/calendar-picker"
import { AddRecurringActivityForm } from "@/components/add-recurring-activity-form"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { formatDateRange, generateDayScheduleFromRecurring } from "@/lib/schedule-utils"

import studentData from "@/data/student.json"
import schoolSchedule from "@/data/school-schedule.json"
import recurringSchedule from "@/data/recurring-schedule.json"
import weeklyTasks from "@/data/weekly-tasks.json"

import type { Student, WeeklyTasks, RecurringActivity } from "@/lib/schedule-types"

const student = studentData as Student
const tasks = weeklyTasks as WeeklyTasks

const dayNames = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [selectedDay, setSelectedDay] = useState<{ dayOfWeek: number; name: string } | null>(null)
  const [parentActivities, setParentActivities] = useState<RecurringActivity[]>(recurringSchedule.activities)

  // Combiner emploi du temps scolaire + activités ajoutées par le parent
  const allActivities = useMemo(() => {
    return [...schoolSchedule.activities, ...parentActivities]
  }, [parentActivities])

  const schedule = useMemo(() => {
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
    
    return {
      weekStart: startOfWeek.toISOString().split('T')[0],
      weekEnd: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days: dayNames.map((name, index) => {
        const date = new Date(startOfWeek)
        date.setDate(date.getDate() + index)
        return generateDayScheduleFromRecurring(
          index + 1,
          name,
          date.toISOString().split('T')[0],
          allActivities
        )
      })
    }
  }, [allActivities])

  const legend = useMemo(() => {
    const items: Array<{ label: string; color: string }> = [
      { label: "École", color: "#F5C842" }
    ]
    
    // Ajouter les activités uniques ajoutées par le parent
    const uniqueActivities = new Map<string, string>()
    parentActivities.forEach(activity => {
      if (!uniqueActivities.has(activity.title)) {
        uniqueActivities.set(activity.title, activity.color)
      }
    })
    
    uniqueActivities.forEach((color, title) => {
      items.push({ label: title, color })
    })
    
    return items
  }, [parentActivities])

  const handleDayClick = (dayOfWeek: number, dayName: string) => {
    setSelectedDay({ dayOfWeek, name: dayName })
    setShowAddActivity(true)
  }

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
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[#888] text-xs sm:text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Grid responsive - 1 col mobile, 2 cols tablette, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {schedule.days.map((day) => (
            <DayScheduleCard 
              key={day.date} 
              day={day} 
              student={student} 
              tasks={tasks.tasks}
              recurringActivities={allActivities}
              onEmptyClick={() => handleDayClick(day.dayOfWeek, day.name)}
            />
          ))}
        </div>
      </div>

      {showCalendar && (
        <CalendarPicker onClose={() => setShowCalendar(false)} />
      )}

      {showAddActivity && selectedDay && (
        <AddRecurringActivityForm 
          selectedDay={selectedDay}
          onClose={() => {
            setShowAddActivity(false)
            setSelectedDay(null)
          }}
          onAdd={(activity) => {
            const newActivity = {
              id: `rec_${Date.now()}`,
              ...activity
            }
            setParentActivities([...parentActivities, newActivity])
          }}
        />
      )}
    </div>
  )
}
