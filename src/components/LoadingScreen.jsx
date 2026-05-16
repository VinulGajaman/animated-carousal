import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const R    = 44
const CIRC = 2 * Math.PI * R

// Sharp, small sparkles — silver surfer: precise, not fluffy
const SPARKLES = [
  { angle: 42,  dist: 72, size: 1.8, delay: 0.65 },
  { angle: 118, dist: 68, size: 1.2, delay: 1.05 },
  { angle: 195, dist: 74, size: 2.2, delay: 0.80 },
  { angle: 265, dist: 70, size: 1.5, delay: 1.25 },
  { angle: 330, dist: 76, size: 1.0, delay: 0.55 },
  { angle: 15,  dist: 73, size: 1.6, delay: 1.40 },
]

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2900)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at 50% 60%, #0a0a14 0%, #050508 45%, #000 100%)',
            overflow: 'hidden',
          }}
        >
          {/* ── Single subtle nebula — dark steel, not cloudy ────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.10, 0.06, 0.10] }}
            transition={{ duration: 5, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(110,120,155,0.75) 0%, rgba(70,78,105,0.3) 40%, transparent 70%)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Sharp sparkle particles ───────────────────────────────────── */}
          {SPARKLES.map((sp, i) => {
            const rad = (sp.angle * Math.PI) / 180
            const x   = Math.cos(rad) * sp.dist
            const y   = Math.sin(rad) * sp.dist
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1, 0], scale: [0, 1, 0.6, 1, 0] }}
                transition={{ duration: 2.0, delay: sp.delay, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top:  `calc(50% + ${y}px)`,
                  width:  sp.size,
                  height: sp.size,
                  borderRadius: '50%',
                  background: '#e8edf8',
                  /* Tight glow — sharp pinpoint, not bloomy */
                  boxShadow: `0 0 ${sp.size * 2.5}px ${sp.size}px rgba(200,210,235,0.85)`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
            )
          })}

          {/* ── Core widget ───────────────────────────────────────────────── */}
          <div style={{ position: 'relative', width: 120, height: 120 }}>

            {/* Tight inner glow — chrome light source, not a bloom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.55, 0.28, 0.55] }}
              transition={{ duration: 2.4, delay: 0.55, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 28,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(185,195,225,0.9) 0%, rgba(100,112,148,0.4) 50%, transparent 70%)',
                filter: 'blur(10px)',
              }}
            />

            {/* Progress ring — dark tail → sharp bright head */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ls-chrome-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#080810" />
                  <stop offset="15%"  stopColor="#141425" />
                  <stop offset="35%"  stopColor="#323250" />
                  <stop offset="58%"  stopColor="#687090" />
                  <stop offset="78%"  stopColor="#a8b2cc" />
                  <stop offset="92%"  stopColor="#d8e0f0" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              {/* Ghost track */}
              <circle
                cx="60" cy="60" r={R}
                fill="none"
                stroke="rgba(140,148,180,0.06)"
                strokeWidth="1.5"
              />
              {/* Chrome fill */}
              <motion.circle
                cx="60" cy="60" r={R}
                fill="none"
                stroke="url(#ls-chrome-ring)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.2, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </svg>

            {/* Comet head — sharp white spike sweeping the ring */}
            <motion.div
              initial={{ rotate: -2 }}
              animate={{ rotate: 358 }}
              transition={{ duration: 2.2, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: [
                  '0 0 3px 1px rgba(255,255,255,1)',
                  '0 0 8px 3px rgba(220,230,250,0.95)',
                  '0 0 18px 5px rgba(170,188,228,0.55)',
                  '0 0 32px 8px rgba(120,142,195,0.22)',
                ].join(', '),
                transform: `translate(-50%, -50%) translateY(-${R}px)`,
              }} />
            </motion.div>

            {/* Silver Surfer logo — dark chrome with sharp highlight */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.35, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <defs>
                  {/* Chrome gradient: deep dark → bright specular edge */}
                  <linearGradient id="ls-chrome-logo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#d8e0f2" />
                    <stop offset="22%"  stopColor="#687090" />
                    <stop offset="50%"  stopColor="#303248" />
                    <stop offset="78%"  stopColor="#8890a8" />
                    <stop offset="100%" stopColor="#c0c8dc" />
                  </linearGradient>
                  <linearGradient id="ls-chrome-logo-bright" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#1a1a2c" />
                    <stop offset="40%"  stopColor="#585e78" />
                    <stop offset="100%" stopColor="#eef0f8" />
                  </linearGradient>
                  {/* Tight focused glow — not diffuse */}
                  <filter id="ls-chrome-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Top blade — brightest */}
                <path d="M24 2 L28.5 19.5 L24 24 L19.5 19.5 Z"
                  fill="url(#ls-chrome-logo-bright)" filter="url(#ls-chrome-glow)" />
                {/* Bottom blade — darker */}
                <path d="M24 46 L19.5 28.5 L24 24 L28.5 28.5 Z"
                  fill="url(#ls-chrome-logo)" filter="url(#ls-chrome-glow)" opacity="0.58" />
                {/* Left blade — dark gunmetal */}
                <path d="M2 24 L19.5 19.5 L24 24 L19.5 28.5 Z"
                  fill="url(#ls-chrome-logo)" filter="url(#ls-chrome-glow)" opacity="0.42" />
                {/* Right blade — mid chrome */}
                <path d="M46 24 L28.5 28.5 L24 24 L28.5 19.5 Z"
                  fill="url(#ls-chrome-logo)" filter="url(#ls-chrome-glow)" opacity="0.75" />
              </motion.svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
