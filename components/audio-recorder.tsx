"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Play, Pause, Trash2, Check } from "lucide-react"

interface AudioRecorderProps {
  subjectName: string
  subjectColor: string
  existingAudioUrl?: string | null
  existingDuration?: number
  onSave?: (audioBlob: Blob, duration: number) => void
  onDelete?: () => void
}

export function AudioRecorder({ 
  subjectName, 
  subjectColor, 
  existingAudioUrl, 
  existingDuration = 0,
  onSave,
  onDelete 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(40).fill(0))
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioUrl && !existingAudioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl, existingAudioUrl])

  const visualize = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const draw = () => {
      if (!isRecording || isPaused) return

      analyser.getByteFrequencyData(dataArray)

      const bars: number[] = []
      const sliceWidth = Math.floor(dataArray.length / 40)
      for (let i = 0; i < 40; i++) {
        const start = i * sliceWidth
        let sum = 0
        for (let j = start; j < start + sliceWidth; j++) {
          sum += dataArray[j] || 0
        }
        const average = sum / sliceWidth
        bars.push((average / 255) * 100)
      }
      setWaveformBars(bars)

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setWaveformBars(Array(40).fill(0))

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)

      visualize(analyser)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.")
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        timerRef.current = setInterval(() => {
          setRecordingTime(t => t + 1)
        }, 1000)
        if (analyserRef.current) visualize(analyserRef.current)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        if (timerRef.current) clearInterval(timerRef.current)
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }

  const deleteVoiceNote = () => {
    if (audioUrl && !existingAudioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setAudioBlob(null)
    setRecordingTime(0)
    setWaveformBars(Array(40).fill(0))
    onDelete?.()
  }

  const togglePlayback = () => {
    if (!audioUrl) return

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const saveRecording = () => {
    if (audioBlob && onSave) {
      onSave(audioBlob, recordingTime)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
  const timeStr = today.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  })

  if (audioUrl && !isRecording) {
    const duration = existingDuration || recordingTime
    return (
      <div className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: `${subjectColor}20` }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-white font-medium text-sm">{subjectName}</h4>
            <p className="text-[#888] text-xs mt-0.5">
              {dateStr} · {timeStr}
            </p>
          </div>
          <button
            onClick={deleteVoiceNote}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#333] hover:bg-red-500/20 text-[#888] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-0.5 h-16 mb-4">
          {Array(40)
            .fill(0)
            .map((_, i) => {
              const height = Math.sin(i * 0.3) * 30 + 40 + Math.random() * 20
              return (
                <div
                  key={i}
                  className="w-[3px] sm:w-1 rounded-full transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: i < 20 ? subjectColor : `${subjectColor}40`,
                  }}
                />
              )
            })}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white font-mono text-2xl sm:text-3xl font-light">{formatTime(duration)}</span>
          <button
            onClick={togglePlayback}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
            style={{ backgroundColor: subjectColor }}
          >
            {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
          </button>
        </div>
      </div>
    )
  }

  if (isRecording) {
    return (
      <div className="rounded-2xl p-4 sm:p-5" style={{ backgroundColor: `${subjectColor}20` }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              {!isPaused && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              {isPaused && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
              <h4 className="text-white font-medium text-sm">{isPaused ? "En pause" : "Enregistrement..."}</h4>
            </div>
            <p className="text-[#888] text-xs mt-0.5">{subjectName}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-0.5 h-16 mb-4">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className="w-[3px] sm:w-1 rounded-full transition-all duration-100"
              style={{
                height: `${Math.max(8, height)}%`,
                backgroundColor: height > 5 ? subjectColor : `${subjectColor}30`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white font-mono text-2xl sm:text-3xl font-light">{formatTime(recordingTime)}</span>

          <div className="flex items-center gap-3">
            <button
              onClick={pauseRecording}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#333] hover:bg-[#444] transition-colors"
            >
              {isPaused ? <Mic className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-white" />}
            </button>
            <button
              onClick={() => {
                stopRecording()
                saveRecording()
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            >
              <Check className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={startRecording}
      className="w-full flex items-center justify-center gap-3 py-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-2xl transition-colors group"
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: `${subjectColor}30` }}
      >
        <Mic className="w-5 h-5" style={{ color: subjectColor }} />
      </div>
      <span className="text-[#888] group-hover:text-white text-sm transition-colors">Enregistrer une note vocale</span>
    </button>
  )
}
