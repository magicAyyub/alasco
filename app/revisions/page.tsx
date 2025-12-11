"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { SubjectCard } from "@/components/subject-card"
import type { RecurringActivity, SubjectRevision, SubjectPhoto } from "@/lib/schedule-types"

import schoolSchedule from "@/data/school-schedule.json"
import studentData from "@/data/student.json"

export default function RevisionPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [revisions, setRevisions] = useState<Map<string, SubjectRevision>>(new Map())

  const dateString = currentDate.toISOString().split('T')[0]
  const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()

  // Filtrer les matières du jour
  const todaySubjects = useMemo(() => {
    const filtered = schoolSchedule.activities
      .filter(a => a.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.timeStart.localeCompare(b.timeStart))
    
    return filtered
  }, [dayOfWeek])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const goToPreviousDay = () => {
    setCurrentDate((d) => {
      const newDate = new Date(d)
      newDate.setDate(d.getDate() - 1)
      return newDate
    })
  }

  const goToNextDay = () => {
    setCurrentDate((d) => {
      const newDate = new Date(d)
      newDate.setDate(d.getDate() + 1)
      return newDate
    })
  }

  const updateRevision = (activityId: string, updates: Partial<SubjectRevision>) => {
    setRevisions(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(activityId)
      
      if (existing) {
        newMap.set(activityId, { ...existing, ...updates, updatedAt: new Date().toISOString() })
      } else {
        newMap.set(activityId, {
          id: `rev_${Date.now()}`,
          date: dateString,
          subjectTitle: todaySubjects.find(s => s.id === activityId)?.title || "",
          activityId,
          photos: [],
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...updates
        })
      }
      
      return newMap
    })
  }

  const handleAudioSave = (activityId: string, audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob)
    updateRevision(activityId, { audioUrl, audioDuration: duration })
    console.log(`Audio saved for ${activityId}:`, { duration })
  }

  const handleAudioDelete = (activityId: string) => {
    updateRevision(activityId, { audioUrl: undefined, audioDuration: undefined })
  }

  const handlePhotosChange = (activityId: string, photos: SubjectPhoto[]) => {
    updateRevision(activityId, { photos })
  }

  if (todaySubjects.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-[#444] mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">Pas de cours aujourd'hui</h2>
            <p className="text-[#666]">Profite de ton jour de repos.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-20" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#F5C842]" />
            <h1 className="text-white text-lg sm:text-xl font-semibold">Révisions</h1>
          </div>
          <div className="w-20" />
        </div>

        {/* Navigation date */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={goToPreviousDay}
            className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-[200px]">
            <p className="text-white font-medium capitalize">{formatDate(currentDate)}</p>
            <p className="text-[#666] text-xs mt-1">
              {currentDate.toDateString() === new Date().toDateString() ? "Aujourd'hui" : ""}
            </p>
          </div>

          <button
            onClick={goToNextDay}
            className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#333] rounded-xl text-white hover:bg-[#252525] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Grille des matières */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {todaySubjects.map((subject) => {
            const revision = revisions.get(subject.id)
            
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                revision={revision}
                onAudioSave={(blob, duration) => handleAudioSave(subject.id, blob, duration)}
                onAudioDelete={() => handleAudioDelete(subject.id)}
                onPhotosChange={(photos) => handlePhotosChange(subject.id, photos)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}