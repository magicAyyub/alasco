"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface AddRecurringActivityFormProps {
  onClose: () => void
  onAdd?: (activity: {
    dayOfWeek: number
    title: string
    timeStart: string
    timeEnd: string
    color: string
  }) => void
  selectedDay: {
    dayOfWeek: number
    name: string
  }
}

const predefinedColors = [
  "#F5C842", "#E84C3D", "#ffffff", "#3B82F6", 
  "#8B5CF6", "#EC4899", "#10B981", "#06B6D4"
]

export function AddRecurringActivityForm({ onClose, onAdd, selectedDay }: AddRecurringActivityFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    timeStart: "",
    timeEnd: "",
    color: predefinedColors[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd?.({
      dayOfWeek: selectedDay.dayOfWeek,
      title: formData.title,
      timeStart: formData.timeStart,
      timeEnd: formData.timeEnd,
      color: formData.color
    })
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-semibold">Ajouter activité</h2>
            <p className="text-[#666] text-sm mt-1">{selectedDay.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[#888] text-sm mb-2 block">Libellé</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Mathématiques, Renforcement, Répétiteur..."
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white placeholder:text-[#666] focus:outline-none focus:border-[#666] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#888] text-sm mb-2 block">Début</label>
              <input
                type="time"
                required
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#666] transition-colors"
              />
            </div>
            <div>
              <label className="text-[#888] text-sm mb-2 block">Fin</label>
              <input
                type="time"
                required
                value={formData.timeEnd}
                onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#666] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[#888] text-sm mb-2 block">Couleur</label>
            <div className="grid grid-cols-8 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-10 h-10 rounded-xl transition-all"
                  style={{
                    backgroundColor: color,
                    transform: formData.color === color ? "scale(1.1)" : "scale(1)",
                    boxShadow: formData.color === color ? `0 0 0 2px #fff` : "none"
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0a0a0a] border border-[#333] text-white hover:bg-[#252525] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-medium hover:bg-[#e5e5e5] transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
