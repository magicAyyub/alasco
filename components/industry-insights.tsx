"use client"

import { ArrowUpRight, Sparkles } from "lucide-react"

const sources = [
  { name: "Bloomberg", logo: "B", bg: "#1a1a1a", text: "white" },
  { name: "CNBC", logo: "CNBC", bg: "#1a5c1a", text: "white", isIcon: true },
  { name: "MarketWatch", logo: "MW", bg: "#4CAF50", text: "white" },
  { name: "Reuters", logo: "●", bg: "#FF6B00", text: "white", isIcon: true },
  { name: "FT", logo: "FT", bg: "#1a1a1a", text: "#FFD8C2" },
]

export function IndustryInsights() {
  return (
    <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white/60" />
          <h2 className="text-white text-lg font-medium">Industry Insights</h2>
        </div>
        <button className="bg-[#3a3a3a] p-2 rounded-full">
          <ArrowUpRight className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <p className="text-white/70 text-sm leading-relaxed mb-6">
        CNBC data shows <span className="text-white font-semibold">retail spending increased 4.2%</span> in January as
        holiday demand extended into early 2025.
      </p>

      <div className="flex items-center gap-2">
        {/* Bloomberg */}
        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#3a3a3a] flex items-center justify-center">
          <span className="text-white font-bold text-lg">B</span>
        </div>

        {/* CNBC */}
        <div className="w-12 h-12 rounded-full bg-[#0a3d0a] border border-[#1a5c1a] flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 40 40" className="w-8 h-8">
            <circle cx="20" cy="20" r="18" fill="#0a3d0a" />
            <text x="20" y="25" textAnchor="middle" fill="#4CAF50" fontSize="10" fontWeight="bold">
              CNBC
            </text>
          </svg>
        </div>

        {/* MarketWatch */}
        <div className="w-12 h-12 rounded-full bg-[#4CAF50] flex items-center justify-center">
          <span className="text-white font-bold text-sm">MW</span>
        </div>

        {/* Reuters/Other */}
        <div className="w-12 h-12 rounded-full bg-[#FF6B00] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-dotted rounded-full" />
        </div>

        {/* FT */}
        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#3a3a3a] flex items-center justify-center">
          <span className="text-[#FFD8C2] font-bold text-sm">FT</span>
        </div>
      </div>
    </div>
  )
}
