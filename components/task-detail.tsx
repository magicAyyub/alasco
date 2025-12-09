"use client"

import { X } from "lucide-react"
import type { Task } from "@/lib/schedule-types"

interface TaskDetailProps {
  task: Task
  onClose: () => void
}

const typeLabels: Record<string, string> = {
  evaluation: "Évaluation",
  devoir: "Devoir",
  autre: "Autre"
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md overflow-hidden relative rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(135deg, ${task.color}15 0%, ${task.color}08 100%)`,
        }}
      >
        <div 
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30"
          style={{
            background: task.color,
            transform: "translate(30%, -30%)"
          }}
        />
        
        <div 
          className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{
            background: task.color,
            transform: "translate(-30%, 30%)"
          }}
        />

        <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#333] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: task.color }}
              />
              <h2 className="text-white text-xl font-semibold">Détails</h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#666] hover:text-white transition-colors p-1 hover:bg-[#252525] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="text-[#666] text-xs uppercase tracking-wide block mb-2">Type</label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-1 h-8"
                    style={{ 
                      backgroundColor: task.color,
                      borderRadius: '4px'
                    }}
                  />
                  <p className="text-white text-lg font-medium">{typeLabels[task.type]}</p>
                </div>
              </div>
              
              <div className="text-right">
                <label className="text-[#666] text-xs uppercase tracking-wide block mb-2">Durée</label>
                <p className="text-white text-lg font-medium">{task.timeStart} - {task.timeEnd}</p>
              </div>
            </div>

            <div>
              <label className="text-[#666] text-xs uppercase tracking-wide block mb-3">Titre</label>
              <div 
                className="bg-[#0a0a0a]/50 border-l-4 rounded-r-xl p-4"
                style={{ borderColor: task.color }}
              >
                <p className="text-white text-lg leading-relaxed">{task.title}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: task.color,
                color: '#fff'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
