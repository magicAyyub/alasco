"use client"

import { ArrowUpRight } from "lucide-react"

export function RiskScore() {
  const score = 72
  const maxScore = 100
  const percentage = score / maxScore

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-medium">Risk Score</h2>
        <button className="bg-[#2a2a2a] p-2 rounded-full">
          <ArrowUpRight className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <div className="mb-6">
        <span className="text-white text-5xl font-bold">{score}</span>
        <span className="text-white/40 text-2xl ml-1">/{maxScore}</span>
      </div>

      <div className="relative w-full h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc with tick marks */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="30%" stopColor="#2D8B7A" />
              <stop offset="70%" stopColor="#4ECCA3" />
              <stop offset="100%" stopColor="#4ECCA3" />
            </linearGradient>
          </defs>

          {/* Tick marks background */}
          {Array.from({ length: 40 }).map((_, i) => {
            const angle = 180 + (i * 180) / 39
            const rad = (angle * Math.PI) / 180
            const x1 = 100 + 70 * Math.cos(rad)
            const y1 = 95 + 70 * Math.sin(rad)
            const x2 = 100 + 80 * Math.cos(rad)
            const y2 = 95 + 80 * Math.sin(rad)
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" />
            )
          })}

          {/* Colored arc */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 251.2} 251.2`}
          />

          {/* Indicator dot */}
          {(() => {
            const angle = 180 + percentage * 180
            const rad = (angle * Math.PI) / 180
            const cx = 100 + 75 * Math.cos(rad)
            const cy = 95 + 75 * Math.sin(rad)
            return (
              <>
                <circle cx={cx} cy={cy} r="8" fill="#4ECCA3" />
                <circle cx={cx} cy={cy} r="4" fill="white" />
              </>
            )
          })()}
        </svg>
      </div>

      <p className="text-white/60 text-sm text-center">
        Stability improved by <span className="text-[#4ECCA3]">+4%</span>
      </p>
    </div>
  )
}
