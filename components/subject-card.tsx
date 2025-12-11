"use client"

import { AudioRecorder } from "@/components/audio-recorder"
import { PhotoCapture } from "@/components/photo-capture"
import type { RecurringActivity, SubjectRevision, SubjectPhoto } from "@/lib/schedule-types"

interface SubjectCardProps {
  subject: RecurringActivity
  revision?: SubjectRevision
  onAudioSave: (blob: Blob, duration: number) => void
  onAudioDelete: () => void
  onPhotosChange: (photos: SubjectPhoto[]) => void
}

export function SubjectCard({ 
  subject, 
  revision,
  onAudioSave,
  onAudioDelete,
  onPhotosChange 
}: SubjectCardProps) {
  // Utiliser la couleur de révision si définie, sinon la couleur principale
  const displayColor = subject.revisionColor || subject.color
  
  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-6 border border-[#2a2a2a]">
      {/* Subject Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: displayColor }}
        />
        <h2 className="text-white text-xl font-medium">{subject.title}</h2>
      </div>

      {/* Note vocale Section */}
      <div className="mb-6">
        <h3 className="text-[#888] text-sm font-normal mb-3">Note vocale</h3>
        <AudioRecorder
          subjectName={subject.title}
          subjectColor={displayColor}
          existingAudioUrl={revision?.audioUrl}
          existingDuration={revision?.audioDuration}
          onSave={onAudioSave}
          onDelete={onAudioDelete}
        />
      </div>

      {/* Pages du cahier Section */}
      <div>
        <h3 className="text-[#888] text-sm font-normal mb-3">Pages du cahier</h3>
        <PhotoCapture
          photos={revision?.photos || []}
          onPhotosChange={onPhotosChange}
        />
      </div>
    </div>
  )
}
