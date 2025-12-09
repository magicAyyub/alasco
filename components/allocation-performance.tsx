"use client"

import { ChevronDown, BarChart3 } from "lucide-react"

const assets = [
  { name: "Bonds", value: 45, color: "#E84C3D" },
  { name: "Stocks", value: 85, color: "#F5C842" },
  { name: "ETFs", value: 48, color: "#FFFFFF" },
  { name: "Crypto", value: 0, color: "transparent" },
]

function StripedPattern({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#3a3a3a" strokeWidth="4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stripes)" />
    </svg>
  )
}

export function AllocationPerformance() {
  const maxHeight = 200

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white text-lg font-medium">Allocation Performance</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#2a2a2a] text-white/80 px-4 py-2 rounded-full text-sm">
            Asset class
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="bg-[#2a2a2a] p-3 rounded-xl">
            <BarChart3 className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        {assets.map((asset) => {
          const barHeight = (asset.value / 100) * maxHeight
          const emptyHeight = maxHeight - barHeight

          return (
            <div key={asset.name} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-xl overflow-hidden relative" style={{ height: maxHeight }}>
                {/* Empty/striped portion */}
                <div className="w-full overflow-hidden rounded-t-xl" style={{ height: emptyHeight }}>
                  <StripedPattern className="w-full h-full" />
                </div>

                {/* Filled portion */}
                {asset.value > 0 && (
                  <div
                    className="w-full rounded-xl relative"
                    style={{
                      height: barHeight,
                      backgroundColor: asset.color,
                    }}
                  >
                    <span
                      className={`absolute top-3 left-3 text-sm font-semibold ${
                        asset.color === "#FFFFFF" ? "text-black" : "text-black"
                      }`}
                    >
                      {asset.value}%
                    </span>
                  </div>
                )}

                {/* Full striped for Crypto */}
                {asset.value === 0 && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <StripedPattern className="w-full h-full" />
                  </div>
                )}
              </div>
              <span className="text-white/60 text-sm mt-3">{asset.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
