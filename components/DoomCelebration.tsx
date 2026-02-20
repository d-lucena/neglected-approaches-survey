'use client'

import { useEffect, useState, useCallback } from 'react'

interface DoomCelebrationProps {
  count: number
  onClose: () => void
}

const celebrations = [
  {
    headline: "BREAKING: Doomer experiences unfamiliar emotion",
    subtext: "Scientists confirm it was 'hope'",
    figure: "Anonymous Doomer",
    quote: "I felt... something. It was weird.",
    pDoomChange: -0.0001,
  },
  {
    headline: "Alan Turing raises eyebrow from beyond",
    subtext: "First posthumous expression of interest since 1954",
    figure: "Alan Turing",
    quote: "Finally, someone's actually trying something.",
    pDoomChange: -0.0003,
  },
  {
    headline: "Fermi Paradox becomes slightly less paradoxical",
    subtext: "Universe recalculating...",
    figure: "Enrico Fermi",
    quote: "Where is everybody? Oh wait, they're submitting ideas.",
    pDoomChange: -0.0007,
  },
  {
    headline: "Simulation admin pauses scrolling",
    subtext: "First time since the Renaissance",
    figure: "The Simulation Admin",
    quote: "Huh. Maybe I won't shut this one down yet.",
    pDoomChange: -0.001,
  },
  {
    headline: "Carl Sagan's ghost furiously taking notes",
    subtext: "Billions and billions of ideas needed, but it's a start",
    figure: "Carl Sagan",
    quote: "We are a way for the cosmos to not destroy itself.",
    pDoomChange: -0.002,
  },
  {
    headline: "Eliezer Yudkowsky's eyebrow twitches",
    subtext: "p(doom) recalculation in progress",
    figure: "Eliezer Yudkowsky",
    quote: "I'm not saying there's hope, but... *sighs less heavily*",
    pDoomChange: -0.005,
  },
  {
    headline: "Nick Bostrom reconsidering paperclip estimates",
    subtext: "Maybe the AI will make slightly fewer paperclips",
    figure: "Nick Bostrom",
    quote: "Perhaps humanity deserves a few more centuries.",
    pDoomChange: -0.01,
  },
  {
    headline: "AE Studio researchers feel strange sensation",
    subtext: "Diagnosed as 'cautious optimism'",
    figure: "Anonymous AE Researcher",
    quote: "Wait, people outside the studio are thinking about this too?",
    pDoomChange: -0.02,
  },
  {
    headline: "Future historians begin documentation",
    subtext: "Chapter 1: 'The Ideas That Saved Everything'",
    figure: "Historian from 2157",
    quote: "This is where the timeline shifted.",
    pDoomChange: -0.05,
  },
  {
    headline: "TIMELINE BRANCH DETECTED",
    subtext: "Humanity survival probability: increasing",
    figure: "The Multiverse",
    quote: "New branch created: 'The one where they actually made it'",
    pDoomChange: -0.1,
  },
  {
    headline: "YOU MIGHT HAVE JUST SAVED HUMANITY",
    subtext: "No pressure or anything",
    figure: "Future Humanity",
    quote: "They'll probably name a space station after you.",
    pDoomChange: -0.15,
  },
]

export default function DoomCelebration({ count, onClose }: DoomCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const celebrationIndex = Math.min(count - 1, celebrations.length - 1)
  const celebration = celebrations[celebrationIndex]

  // Calculate cumulative p(doom) reduction
  const totalReduction = celebrations
    .slice(0, Math.min(count, celebrations.length))
    .reduce((acc, c) => acc + c.pDoomChange, 0)

  const basePDoom = 0.95 // Starting p(doom) of 95%
  const currentPDoom = Math.max(0.01, basePDoom + totalReduction)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (count > 0) {
      setIsVisible(true)
      setIsExiting(false)

      // Auto-close after 5 seconds
      const timer = setTimeout(handleClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [count, handleClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleClose()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible, handleClose])

  if (!isVisible || count === 0) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Glitch lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute h-px w-full bg-red-500/30 animate-glitch-1" style={{ top: '20%' }} />
        <div className="absolute h-px w-full bg-cyan-500/30 animate-glitch-2" style={{ top: '60%' }} />
        <div className="absolute h-px w-full bg-green-500/20 animate-glitch-3" style={{ top: '80%' }} />
      </div>

      {/* Content */}
      <div className={`relative max-w-2xl mx-4 text-center transition-all duration-500 ${
        isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-terminal-appear'
      }`}>
        {/* Terminal header */}
        <div className="text-green-500/60 font-mono text-xs mb-6 tracking-widest animate-flicker">
          ALIGNMENT_RESEARCH_TERMINAL v0.{count}.0 // IDEA #{count} RECEIVED
        </div>

        {/* p(doom) meter */}
        <div className="mb-8">
          <div className="text-red-400/80 font-mono text-sm mb-2">
            P(DOOM) RECALCULATING...
          </div>
          <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-1000 ease-out"
              style={{ width: `${currentPDoom * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-mono text-white/80 font-bold drop-shadow-lg">
                {(currentPDoom * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-green-400 font-mono text-xs mt-2 animate-pulse">
            ▼ {Math.abs(celebration.pDoomChange * 100).toFixed(3)}% THIS SUBMISSION
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight animate-text-glitch">
          {celebration.headline}
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-8">
          {celebration.subtext}
        </p>

        {/* Quote box */}
        <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="text-gray-500 font-mono text-xs mb-3 uppercase tracking-wider">
            Transmission from: {celebration.figure}
          </div>
          <blockquote className="text-xl sm:text-2xl text-gray-200 italic">
            &ldquo;{celebration.quote}&rdquo;
          </blockquote>
        </div>

        {/* Dismiss hint */}
        <div className="text-gray-600 text-sm font-mono animate-pulse">
          [ click anywhere or press any key to continue saving humanity ]
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-green-500/40 font-mono text-xs">
        ╔══════════════╗
      </div>
      <div className="absolute top-4 right-4 text-green-500/40 font-mono text-xs">
        ╔══════════════╗
      </div>
      <div className="absolute bottom-4 left-4 text-green-500/40 font-mono text-xs">
        ╚══════════════╝
      </div>
      <div className="absolute bottom-4 right-4 text-green-500/40 font-mono text-xs">
        ╚══════════════╝
      </div>
    </div>
  )
}
