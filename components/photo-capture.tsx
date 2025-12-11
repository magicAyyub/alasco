"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react"
import type { SubjectPhoto } from "@/lib/schedule-types"

interface PhotoCaptureProps {
  photos: SubjectPhoto[]
  onPhotosChange?: (photos: SubjectPhoto[]) => void
}

export function PhotoCapture({ photos, onPhotosChange }: PhotoCaptureProps) {
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Impossible d'accéder à la caméra. Utilise l'upload de fichier.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const newPhoto: SubjectPhoto = {
              id: `photo_${Date.now()}`,
              url,
              timestamp: new Date().toISOString()
            }
            onPhotosChange?.([...photos, newPhoto])
          }
        }, "image/jpeg", 0.9)
      }
      stopCamera()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file)
          const newPhoto: SubjectPhoto = {
            id: `photo_${Date.now()}_${Math.random()}`,
            url,
            timestamp: new Date().toISOString()
          }
          onPhotosChange?.([...photos, newPhoto])
        }
      })
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removePhoto = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId)
    if (photo) {
      URL.revokeObjectURL(photo.url)
    }
    onPhotosChange?.(photos.filter(p => p.id !== photoId))
  }

  return (
    <div className="space-y-4">
      {/* Camera View */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="p-6 flex items-center justify-center gap-4">
            <button
              onClick={stopCamera}
              className="w-14 h-14 rounded-full bg-[#333] hover:bg-[#444] transition-colors flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 transition-colors border-4 border-gray-300"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showCamera && (
        <div>
          <div className="flex gap-3 mb-4">
            <button
              onClick={startCamera}
              className="aspect-3/4 w-[140px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#3a3a3a] rounded-xl hover:border-[#555] hover:bg-[#252525] transition-all"
            >
              <Camera className="w-10 h-10 text-[#666]" />
              <span className="text-[#888] text-sm">Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-3/4 w-[140px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#3a3a3a] rounded-xl hover:border-[#555] hover:bg-[#252525] transition-all"
            >
              <ImageIcon className="w-10 h-10 text-[#666]" />
              <span className="text-[#888] text-sm">Galerie</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Photos Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square">
                  <img
                    src={photo.url}
                    alt="Page de cahier"
                    className="w-full h-full object-cover rounded-xl border border-[#333]"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
