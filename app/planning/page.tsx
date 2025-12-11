"use client"

import { useState, useMemo } from "react"
import { GraduationCap, Plus, Trash2 } from "lucide-react"
import schoolScheduleData from "@/data/school-schedule.json"

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

const COULEURS_REVISION = [
  "#F5C842", "#E84C3D", "#3498DB", "#9B59B6", 
  "#E67E22", "#2ECC71", "#1ABC9C", "#F39C12"
]

interface SchoolActivity {
  id: string
  dayOfWeek: number
  title: string
  timeStart: string
  timeEnd: string
  color: string
  revisionColor: string
}

export default function EmploiDuTempsPage() {
  const [activities, setActivities] = useState<SchoolActivity[]>(schoolScheduleData.activities)
  const [selectedDay, setSelectedDay] = useState(1)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    timeStart: "",
    timeEnd: "",
    revisionColor: "#F5C842"
  })

  const dayActivities = activities
    .filter(a => a.dayOfWeek === selectedDay)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart))

  // Liste des matières existantes pour autocomplétion
  const existingSubjects = useMemo(() => {
    const subjects = new Map<string, string>()
    activities.forEach(act => {
      if (!subjects.has(act.title)) {
        subjects.set(act.title, act.revisionColor)
      }
    })
    return subjects
  }, [activities])

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }))
    const existingColor = existingSubjects.get(value)
    if (existingColor) {
      setFormData(prev => ({ ...prev, revisionColor: existingColor }))
    }
  }

  const handleAdd = () => {
    if (!formData.title || !formData.timeStart || !formData.timeEnd) return

    const newActivity: SchoolActivity = {
      id: `sch_${Date.now()}`,
      dayOfWeek: selectedDay,
      title: formData.title,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      color: "#F5C842",
      revisionColor: formData.revisionColor
    }

    setActivities([...activities, newActivity])
    setFormData({ title: "", timeStart: "", timeEnd: "", revisionColor: "#F5C842" })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setActivities(activities.filter(a => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#F5C842]" />
            <h1 className="text-white text-xl sm:text-2xl font-medium">Emploi du temps scolaire</h1>
          </div>
          <p className="text-[#666] text-xs sm:text-sm">Saisissez les cours de votre enfant</p>
        </div>

        {/* Sélecteur de jour */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-6 sm:mb-8">
          {JOURS.map((jour, index) => {
            const count = activities.filter(a => a.dayOfWeek === index + 1).length
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDay(index + 1)
                  setShowForm(false)
                }}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all ${
                  selectedDay === index + 1
                    ? 'bg-[#F5C842] text-black scale-105'
                    : 'bg-[#1a1a1a] text-white hover:bg-[#252525]'
                }`}
              >
                <div className="text-sm sm:text-base font-semibold mb-1">{jour.slice(0, 3)}</div>
                <div className="text-xs sm:text-sm opacity-70">{count}</div>
              </button>
            )
          })}
        </div>

        {/* Contenu du jour */}
        <div className="bg-[#1a1a1a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-white text-base sm:text-lg font-medium">{JOURS[selectedDay - 1]}</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#F5C842] hover:bg-[#E5B832] text-black rounded-xl transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter un cours</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            )}
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#0a0a0a] rounded-xl sm:rounded-2xl border border-[#333]">
              <div className="grid gap-3 sm:gap-4">
                <input
                  type="text"
                  list="subjects"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nom de la matière (ex: Mathématiques)"
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm sm:text-base placeholder-[#666] focus:outline-none focus:border-[#F5C842]"
                  autoFocus
                />
                <datalist id="subjects">
                  {Array.from(existingSubjects.keys()).map(subject => (
                    <option key={subject} value={subject} />
                  ))}
                </datalist>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <input
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-[#F5C842]"
                  />
                  <input
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white text-sm sm:text-base focus:outline-none focus:border-[#F5C842]"
                  />
                </div>

                <div>
                  <p className="text-[#888] text-xs mb-2">Couleur pour les révisions</p>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {COULEURS_REVISION.map(couleur => (
                      <button
                        key={couleur}
                        onClick={() => setFormData({ ...formData, revisionColor: couleur })}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all ${
                          formData.revisionColor === couleur ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110' : ''
                        }`}
                        style={{ backgroundColor: couleur }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-[#1a1a1a] border border-[#333] text-white text-sm sm:text-base rounded-xl hover:bg-[#252525] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAdd}
                    className="flex-1 px-3 sm:px-4 py-2 bg-[#F5C842] hover:bg-[#E5B832] text-black text-sm sm:text-base font-medium rounded-xl transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid des cours */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {dayActivities.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-[#666] text-base">Aucun cours ce jour</p>
              </div>
            ) : (
              dayActivities.map(activity => (
                <div
                  key={activity.id}
                  className="relative aspect-square p-4 bg-[#0a0a0a] rounded-2xl border border-[#333] hover:border-[#444] transition-colors group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-2">
                    <div 
                      className="w-4 h-4 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: activity.revisionColor }}
                    />
                    <p className="text-white font-semibold text-sm sm:text-base flex-1 leading-tight">{activity.title}</p>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-[#666] hover:text-red-500 transition-all absolute top-3 right-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[#888] text-xs sm:text-sm font-medium">{activity.timeStart} - {activity.timeEnd}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
