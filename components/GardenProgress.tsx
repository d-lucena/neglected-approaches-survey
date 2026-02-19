'use client'

import { useEffect, useState } from 'react'

interface GardenProgressProps {
  count: number
}

const stages = [
  {
    message: "Plant your first seed of insight",
    subtext: "Every great idea starts somewhere",
  },
  {
    message: "Your first seed is planted!",
    subtext: "Watch it grow...",
  },
  {
    message: "A sprout emerges!",
    subtext: "Your ideas are taking root",
  },
  {
    message: "Growing strong!",
    subtext: "Keep the ideas flowing",
  },
  {
    message: "First bloom!",
    subtext: "Your garden is coming alive",
  },
  {
    message: "Flowers everywhere!",
    subtext: "A beautiful collection forming",
  },
  {
    message: "Butterflies have arrived!",
    subtext: "Your ideas are attracting attention",
  },
  {
    message: "A tree takes shape!",
    subtext: "Deep roots, strong ideas",
  },
  {
    message: "Birds are nesting!",
    subtext: "Your ecosystem thrives",
  },
  {
    message: "A forest emerges!",
    subtext: "Incredible contribution",
  },
  {
    message: "A thriving ecosystem!",
    subtext: "You're a force of nature",
  },
]

export default function GardenProgress({ count }: GardenProgressProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const stageIndex = Math.min(count, stages.length - 1)
  const stage = stages[stageIndex]

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
  }, [count])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-100 p-6 transition-all duration-500 ${
        isAnimating ? 'scale-[1.02]' : 'scale-100'
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {count >= 6 && (
          <>
            <div className="absolute top-4 right-8 animate-float-slow">
              <Butterfly className="w-6 h-6 text-pink-400" />
            </div>
            <div className="absolute top-12 right-20 animate-float-slower">
              <Butterfly className="w-4 h-4 text-purple-400" style={{ animationDelay: '1s' }} />
            </div>
          </>
        )}
        {count >= 8 && (
          <div className="absolute top-6 left-12 animate-float-slow">
            <Bird className="w-5 h-5 text-sky-500" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        {/* Garden illustration */}
        <div className={`relative flex-shrink-0 transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          <GardenScene count={count} />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-emerald-800 transition-all duration-300 ${
            isAnimating ? 'text-emerald-600' : ''
          }`}>
            {stage.message}
          </p>
          <p className="text-sm text-emerald-600/80 mt-0.5">
            {stage.subtext}
          </p>
        </div>
      </div>
    </div>
  )
}

function GardenScene({ count }: { count: number }) {
  return (
    <div className="w-20 h-20 relative">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Ground */}
        <ellipse cx="40" cy="70" rx="35" ry="8" className="fill-amber-200/60" />
        <ellipse cx="40" cy="68" rx="30" ry="6" className="fill-amber-700/30" />

        {/* Stage 0: Empty soil with hole */}
        {count === 0 && (
          <g className="animate-pulse">
            <ellipse cx="40" cy="65" rx="8" ry="3" className="fill-amber-800/40" />
            <text x="40" y="45" textAnchor="middle" className="fill-amber-600 text-[10px]">?</text>
          </g>
        )}

        {/* Stage 1: Seed planted */}
        {count === 1 && (
          <g>
            <ellipse cx="40" cy="62" rx="5" ry="3" className="fill-amber-800/50" />
            <ellipse cx="40" cy="60" rx="4" ry="5" className="fill-amber-600 animate-bounce-slow" />
          </g>
        )}

        {/* Stage 2: Sprout */}
        {count === 2 && (
          <g className="animate-grow">
            <path d="M40 65 L40 50" className="stroke-emerald-500 stroke-2" strokeLinecap="round" />
            <path d="M40 55 Q35 50 38 45" className="fill-emerald-400" />
            <path d="M40 55 Q45 50 42 45" className="fill-emerald-500" />
          </g>
        )}

        {/* Stage 3: Small plant */}
        {count === 3 && (
          <g className="animate-grow">
            <path d="M40 65 L40 40" className="stroke-emerald-600 stroke-2" strokeLinecap="round" />
            <Leaf x={32} y={45} size={12} flip />
            <Leaf x={42} y={50} size={10} />
            <Leaf x={35} y={38} size={14} flip />
          </g>
        )}

        {/* Stage 4: First flower */}
        {count === 4 && (
          <g className="animate-grow">
            <path d="M40 65 L40 35" className="stroke-emerald-600 stroke-[2.5]" strokeLinecap="round" />
            <Leaf x={30} y={50} size={14} flip />
            <Leaf x={44} y={55} size={12} />
            <Leaf x={32} y={42} size={14} flip />
            <Flower x={40} y={28} size={16} color="pink" />
          </g>
        )}

        {/* Stage 5: Multiple flowers */}
        {count === 5 && (
          <g className="animate-grow">
            <path d="M30 65 L30 40" className="stroke-emerald-600 stroke-2" strokeLinecap="round" />
            <path d="M50 65 L50 45" className="stroke-emerald-600 stroke-2" strokeLinecap="round" />
            <path d="M40 65 L40 30" className="stroke-emerald-600 stroke-[2.5]" strokeLinecap="round" />
            <Leaf x={22} y={50} size={12} flip />
            <Leaf x={52} y={52} size={10} />
            <Leaf x={34} y={45} size={12} flip />
            <Flower x={30} y={33} size={14} color="purple" />
            <Flower x={50} y={38} size={12} color="yellow" />
            <Flower x={40} y={22} size={18} color="pink" />
          </g>
        )}

        {/* Stage 6: Butterflies */}
        {count === 6 && (
          <g className="animate-grow">
            <path d="M25 65 L25 45" className="stroke-emerald-600 stroke-2" strokeLinecap="round" />
            <path d="M55 65 L55 42" className="stroke-emerald-600 stroke-2" strokeLinecap="round" />
            <path d="M40 65 L40 28" className="stroke-emerald-700 stroke-[2.5]" strokeLinecap="round" />
            <Leaf x={18} y={52} size={12} flip />
            <Leaf x={56} y={50} size={11} />
            <Leaf x={33} y={42} size={14} flip />
            <Flower x={25} y={38} size={14} color="purple" />
            <Flower x={55} y={35} size={13} color="yellow" />
            <Flower x={40} y={20} size={18} color="pink" />
          </g>
        )}

        {/* Stage 7: Tree forming */}
        {count === 7 && (
          <g className="animate-grow">
            <path d="M40 65 L40 25" className="stroke-amber-700 stroke-[4]" strokeLinecap="round" />
            <circle cx="40" cy="22" r="18" className="fill-emerald-500" />
            <circle cx="32" cy="18" r="10" className="fill-emerald-400" />
            <circle cx="50" cy="20" r="12" className="fill-emerald-600" />
            <circle cx="40" cy="12" r="8" className="fill-emerald-400" />
            <Flower x={20} y={55} size={10} color="pink" />
            <Flower x={58} y={52} size={10} color="purple" />
          </g>
        )}

        {/* Stage 8: Birds nesting */}
        {count === 8 && (
          <g className="animate-grow">
            <path d="M40 65 L40 22" className="stroke-amber-700 stroke-[5]" strokeLinecap="round" />
            <path d="M40 45 L25 55" className="stroke-amber-600 stroke-2" strokeLinecap="round" />
            <path d="M40 45 L55 52" className="stroke-amber-600 stroke-2" strokeLinecap="round" />
            <circle cx="40" cy="18" r="20" className="fill-emerald-500" />
            <circle cx="28" cy="15" r="12" className="fill-emerald-400" />
            <circle cx="54" cy="17" r="14" className="fill-emerald-600" />
            <circle cx="40" cy="8" r="10" className="fill-emerald-400" />
            <Flower x={18} y={58} size={10} color="pink" />
            <Flower x={60} y={55} size={10} color="yellow" />
          </g>
        )}

        {/* Stage 9: Forest */}
        {count === 9 && (
          <g className="animate-grow">
            {/* Back trees */}
            <path d="M20 65 L20 35" className="stroke-amber-600 stroke-[3]" strokeLinecap="round" />
            <circle cx="20" cy="30" r="14" className="fill-emerald-400/80" />
            <path d="M60 65 L60 38" className="stroke-amber-600 stroke-[3]" strokeLinecap="round" />
            <circle cx="60" cy="33" r="12" className="fill-emerald-500/80" />
            {/* Main tree */}
            <path d="M40 65 L40 20" className="stroke-amber-700 stroke-[5]" strokeLinecap="round" />
            <circle cx="40" cy="16" r="22" className="fill-emerald-600" />
            <circle cx="28" cy="12" r="14" className="fill-emerald-500" />
            <circle cx="54" cy="14" r="16" className="fill-emerald-700" />
            <circle cx="40" cy="5" r="12" className="fill-emerald-500" />
          </g>
        )}

        {/* Stage 10+: Thriving ecosystem */}
        {count >= 10 && (
          <g className="animate-grow">
            {/* Background trees */}
            <circle cx="12" cy="40" r="12" className="fill-emerald-300/70" />
            <circle cx="68" cy="42" r="10" className="fill-emerald-300/70" />
            {/* Mid trees */}
            <path d="M22 65 L22 32" className="stroke-amber-600 stroke-[3]" strokeLinecap="round" />
            <circle cx="22" cy="26" r="16" className="fill-emerald-400" />
            <path d="M58 65 L58 35" className="stroke-amber-600 stroke-[3]" strokeLinecap="round" />
            <circle cx="58" cy="30" r="14" className="fill-emerald-500" />
            {/* Main majestic tree */}
            <path d="M40 65 L40 15" className="stroke-amber-800 stroke-[6]" strokeLinecap="round" />
            <circle cx="40" cy="12" r="24" className="fill-emerald-600" />
            <circle cx="24" cy="8" r="16" className="fill-emerald-500" />
            <circle cx="58" cy="10" r="18" className="fill-emerald-700" />
            <circle cx="40" cy="0" r="14" className="fill-emerald-500" />
            {/* Sparkles for magic */}
            <circle cx="30" cy="20" r="1.5" className="fill-yellow-300 animate-twinkle" />
            <circle cx="50" cy="15" r="1" className="fill-yellow-300 animate-twinkle" style={{ animationDelay: '0.5s' }} />
            <circle cx="45" cy="5" r="1.5" className="fill-yellow-300 animate-twinkle" style={{ animationDelay: '1s' }} />
          </g>
        )}
      </svg>
    </div>
  )
}

function Leaf({ x, y, size, flip }: { x: number; y: number; size: number; flip?: boolean }) {
  return (
    <ellipse
      cx={x + size / 2}
      cy={y}
      rx={size / 2}
      ry={size / 4}
      className="fill-emerald-500"
      transform={flip ? `rotate(-30 ${x + size / 2} ${y})` : `rotate(30 ${x + size / 2} ${y})`}
    />
  )
}

function Flower({ x, y, size, color }: { x: number; y: number; size: number; color: 'pink' | 'purple' | 'yellow' }) {
  const colors = {
    pink: { petals: 'fill-pink-300', center: 'fill-yellow-400' },
    purple: { petals: 'fill-purple-300', center: 'fill-yellow-300' },
    yellow: { petals: 'fill-yellow-300', center: 'fill-amber-500' },
  }
  const { petals, center } = colors[color]
  const petalSize = size / 3

  return (
    <g className="animate-bloom">
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={x}
          cy={y - petalSize}
          rx={petalSize / 1.5}
          ry={petalSize}
          className={petals}
          transform={`rotate(${angle} ${x} ${y})`}
        />
      ))}
      <circle cx={x} cy={y} r={petalSize / 1.5} className={center} />
    </g>
  )
}

function Butterfly({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style}>
      <path d="M12 12 Q6 6 4 10 Q2 14 8 14 Q10 14 12 12" className="fill-current opacity-80" />
      <path d="M12 12 Q18 6 20 10 Q22 14 16 14 Q14 14 12 12" className="fill-current opacity-80" />
      <path d="M12 12 Q8 16 6 20 Q10 18 12 14" className="fill-current opacity-60" />
      <path d="M12 12 Q16 16 18 20 Q14 18 12 14" className="fill-current opacity-60" />
      <ellipse cx="12" cy="13" rx="1" ry="4" className="fill-gray-700" />
    </svg>
  )
}

function Bird({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M4 12 Q8 8 12 10 Q14 10 16 8 L14 10 L18 9 L14 11 Q12 14 8 14 Q4 14 4 12" className="fill-current" />
      <circle cx="7" cy="11" r="1" className="fill-white" />
    </svg>
  )
}
