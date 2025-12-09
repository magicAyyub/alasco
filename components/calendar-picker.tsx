"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarPickerProps {
  onClose: () => void
  onSelectDate?: (date: string) => void
}

export function CalendarPicker({ onClose, onSelectDate }: CalendarPickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]
  
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  let startingDayOfWeek = firstDay.getDay()
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1
  
  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    console.log("Previous month clicked")
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    console.log("Next month clicked")
  }

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day)
    const dateString = selectedDate.toISOString().split('T')[0]
    console.log("Date selected:", dateString)
    onSelectDate?.(dateString)
    onClose()
  }

  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] border border-[#333] rounded-3xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-2xl font-semibold">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePreviousMonth}
              className="w-10 h-10 flex items-center justify-center bg-[#0a0a0a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextMonth}
              className="w-10 h-10 flex items-center justify-center bg-[#0a0a0a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[#666] text-sm font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {days.map((day, index) => (
            <button
              key={index}
              disabled={day === null}
              onClick={() => day && handleDayClick(day)}
              className={`
                h-12 flex items-center justify-center rounded-xl text-base font-semibold transition-all
                ${day === null ? 'invisible' : ''}
                ${isToday(day!) 
                  ? 'bg-white text-black shadow-lg scale-105' 
                  : 'bg-[#0a0a0a] border border-[#333] text-white hover:bg-[#252525] hover:border-[#666] hover:scale-105'
                }
              `}
            >
              {day}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 px-4 rounded-xl bg-white text-black font-semibold hover:bg-[#e5e5e5] transition-colors text-base"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
