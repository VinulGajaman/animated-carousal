import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from 'framer-motion'
import {
  FaInstagram, FaFacebook, FaSnapchatGhost,
  FaUser, FaShareAlt, FaComment, FaGoogle,
} from 'react-icons/fa'
import { FaXTwitter, FaTiktok } from 'react-icons/fa6'
import { MdPlayArrow } from 'react-icons/md'

const HAND_SRC = '/hand3.png'

const CARDS_DATA = [
  { Icon: FaInstagram,     color: '#E1306C', name: 'Instagram'  },
  { Icon: FaFacebook,      color: '#1877F2', name: 'Facebook'   },
  { Icon: FaXTwitter,      color: '#e8eaf2', name: 'X / Twitter' },
  { Icon: FaGoogle,        color: '#4285F4', name: 'Google'     },
  { Icon: FaSnapchatGhost, color: '#FFFC00', name: 'Snapchat'   },
  { Icon: FaTiktok,        color: '#ee1d52', name: 'TikTok'     },
  { Icon: FaComment,       color: '#9333EA', name: 'Messages'   },
  { Icon: FaUser,          color: '#8B5CF6', name: 'Profile'    },
  { Icon: FaShareAlt,      color: '#7C3AED', name: 'Share'      },
  { Icon: MdPlayArrow,     color: '#FF0000', name: 'YouTube'    },
]

const DESCRIPTIONS = {
  'Instagram':   'Capture and share the moments that matter. Connect with creators, communities, and brands shimmering across the galaxy.',
  'Facebook':    'Build connections that span the cosmos. Share life\'s moments with friends and family across infinite space.',
  'X / Twitter': 'Real-time conversations at the speed of light. Join the global dialogue that shapes the universe in 280 characters.',
  'Google':      'Boundless knowledge at your fingertips. Search, explore, and discover across the infinite expanse of the web.',
  'Snapchat':    'Fleeting moments, lasting memories. Communicate through photos and videos that vanish like stardust.',
  'TikTok':      'Short-form content moving at the speed of culture. Create and discover videos that bend the laws of gravity.',
  'Messages':    'Reach anyone across the digital expanse. Clear, instant signals that bridge the farthest distances in the galaxy.',
  'Profile':     'Your digital signature in the cosmos. Define who you are and how the universe discovers you.',
  'Share':       'Propagate ideas at the speed of light. Send anything, anywhere, instantly across the galaxy.',
  'YouTube':     'Stream from the world\'s largest video galaxy. Watch, create, and explore endless visual universes.',
}

const CARDS = CARDS_DATA.map((c, i, arr) => ({
  ...c,
  id: i,
  baseAngle: (i / arr.length) * 360,
}))

export default function HeroSection() {
  const orbitFrontRef = useRef(null)
  const orbitBackRef  = useRef(null)
  const frontCardRefs = useRef([])
  const backCardRefs  = useRef([])
  const imgRef        = useRef(null)

  const [handVisible,  setHandVisible]  = useState(false)
  const [phase,        setPhase]        = useState('idle')   // 'idle' | 'warp' | 'card' | 'warpBack'
  const [clickedCard,  setClickedCard]  = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => setHandVisible(true), 6000)
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      clearTimeout(timeout)
      setHandVisible(true)
    }
    return () => clearTimeout(timeout)
  }, [])

  // ── Orbit rotation ───────────────────────────────────────────────────────
  const angle      = useMotionValue(0)
  const isDragging = useRef(false)
  const lastX      = useRef(0)
  const startX     = useRef(0)
  const velocity   = useRef(0.12)

  // ── Mouse-tilt spring ────────────────────────────────────────────────────
  const tiltX       = useRef(-12)
  const tiltXVel    = useRef(0)
  const tiltXTarget = useRef(-12)
  const TILT_MAX    = 12
  const SPRING_K    = 0.055
  const DAMPING     = 0.82

  useEffect(() => {
    const onMouseMove = (e) => {
      const relY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      tiltXTarget.current = Math.max(-1, Math.min(1, relY)) * TILT_MAX
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useAnimationFrame(() => {
    if (!isDragging.current) angle.set(angle.get() + velocity.current)
    const a    = angle.get()
    const diff = tiltXTarget.current - tiltX.current
    tiltXVel.current  = tiltXVel.current * DAMPING + diff * SPRING_K
    tiltX.current    += tiltXVel.current
    const tx = tiltX.current.toFixed(3)

    if (orbitFrontRef.current) orbitFrontRef.current.style.transform = `rotateX(${tx}deg) rotateY(${a}deg)`
    if (orbitBackRef.current)  orbitBackRef.current.style.transform  = `rotateX(${tx}deg) rotateY(${a}deg)`

    CARDS.forEach((card, i) => {
      let deg = (card.baseAngle + a) % 360
      if (deg < 0) deg += 360
      const isFront = deg < 90 || deg > 270
      const fc = frontCardRefs.current[i]
      const bc = backCardRefs.current[i]
      if (fc) { fc.style.visibility = isFront ? 'visible' : 'hidden'; fc.style.opacity = isFront ? '1' : '0' }
      if (bc) { bc.style.visibility = isFront ? 'hidden'  : 'visible'; bc.style.opacity = isFront ? '0' : '1' }
    })
  })

  // ── Pointer handlers ─────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    if (phase !== 'idle') return
    isDragging.current = true; lastX.current = e.clientX; startX.current = e.clientX
  }
  const onPointerMove = (e) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastX.current
    angle.set(angle.get() + dx * 0.4)
    lastX.current    = e.clientX
    velocity.current = dx * 0.05
  }
  const onPointerUp = () => {
    isDragging.current = false
    if (Math.abs(velocity.current) < 0.05) velocity.current = 0.12
  }

  const onCardClick = (card, e) => {
    if (phase !== 'idle') return
    if (Math.abs(lastX.current - startX.current) > 5) { e.preventDefault(); return }
    setClickedCard(card)
    setPhase('warp')
    setTimeout(() => setPhase('card'), 1200)
  }

  const handleClose = () => {
    setPhase('warpBack')
    setTimeout(() => {
      setPhase('idle')
      setClickedCard(null)
    }, 1200)
  }

  const sceneVisible = phase === 'idle'

  return (
    <section
      className="hero-section"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ touchAction: 'pan-y' }}
    >
      <StarField warping={phase === 'warp'} warpBack={phase === 'warpBack'} />

      {/* Scene wrapper — fades out during warp, back in on idle */}
      <motion.div
        animate={{ opacity: sceneVisible ? 1 : 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0,
          pointerEvents: sceneVisible ? 'auto' : 'none',
        }}
      >
        <div className="scene">

          {/* BACK ORBIT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', zIndex: 10 }}
          >
            <div className="orbit orbit-back" ref={orbitBackRef}>
              {CARDS.map((card, i) => (
                <div
                  key={`back-${card.id}`}
                  ref={(el) => (backCardRefs.current[i] = el)}
                  className="card-wrapper"
                  style={{ transform: `rotateY(${card.baseAngle}deg) translateZ(var(--orbit-radius)) rotateX(15deg)` }}
                  onClick={(e) => onCardClick(card, e)}
                >
                  <CardFace card={card} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* HAND */}
          <div className="hand-container">
            <motion.img
              ref={imgRef}
              src={HAND_SRC}
              alt="Hand"
              className="hand-image cinematic-hand"
              draggable="false"
              initial={{ opacity: 0 }}
              animate={{ opacity: handVisible ? 1 : 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              onLoad={() => setHandVisible(true)}
              onError={() => setHandVisible(true)}
            />
          </div>

          {/* FRONT ORBIT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', zIndex: 30 }}
          >
            <div className="orbit orbit-front" ref={orbitFrontRef}>
              {CARDS.map((card, i) => (
                <div
                  key={`front-${card.id}`}
                  ref={(el) => (frontCardRefs.current[i] = el)}
                  className="card-wrapper"
                  style={{ transform: `rotateY(${card.baseAngle}deg) translateZ(var(--orbit-radius)) rotateX(15deg)` }}
                  onClick={(e) => onCardClick(card, e)}
                >
                  <CardFace card={card} />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Glass card overlay */}
      <AnimatePresence>
        {phase === 'card' && clickedCard && (
          <GlassCard card={clickedCard} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  )
}

// ── StarField canvas ─────────────────────────────────────────────────────────
function StarField({ warping, warpBack }) {
  const canvasRef        = useRef(null)
  const warpRef          = useRef(false)
  const warpBackRef      = useRef(false)
  const warpP            = useRef(0)
  const warpJustEnded    = useRef(false)  // triggers one-shot scatter after forward warp
  const warpBackInitDone = useRef(false)  // tracks whether reverse-warp scatter is done

  useEffect(() => { warpRef.current     = warping  }, [warping])
  useEffect(() => { warpBackRef.current = warpBack }, [warpBack])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars  = []
    let frame  = 0
    let rafId
    let active = true

    function makeStars(w, h) {
      return Array.from({ length: 320 }, () => {
        const tier = Math.random()
        const r = tier < 0.75 ? Math.random() * 0.8 + 0.2
                : tier < 0.95 ? Math.random() * 1.2 + 0.8
                :               Math.random() * 1.8 + 1.5
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          baseAlpha:    Math.random() * 0.5 + 0.4,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          iridescent:   Math.random() < 0.22,
          hue:          Math.floor(Math.random() * 50) + 205,
          vx: 0,
          vy: 0,
        }
      })
    }

    function bg(w, h) {
      const g = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, Math.max(w, h) * 0.9)
      g.addColorStop(0,   '#0d0d1a')
      g.addColorStop(0.4, '#06060f')
      g.addColorStop(1,   '#000000')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      const n1 = ctx.createRadialGradient(w * 0.22, h * 0.32, 0, w * 0.22, h * 0.32, w * 0.52)
      n1.addColorStop(0,   'rgba(148,156,192,0.048)')
      n1.addColorStop(0.5, 'rgba(118,126,162,0.022)')
      n1.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = n1
      ctx.fillRect(0, 0, w, h)

      const n2 = ctx.createRadialGradient(w * 0.74, h * 0.58, 0, w * 0.74, h * 0.58, w * 0.38)
      n2.addColorStop(0,   'rgba(168,174,208,0.038)')
      n2.addColorStop(0.6, 'rgba(128,136,168,0.016)')
      n2.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = n2
      ctx.fillRect(0, 0, w, h)
    }

    function scatterStars(w, h) {
      for (const s of stars) {
        s.x  = Math.random() * w
        s.y  = Math.random() * h
        s.vx = 0; s.vy = 0
      }
    }

    // Scatter stars to ring positions with inward initial velocity
    function initWarpBack(w, h) {
      const cx = w / 2, cy = h / 2
      const maxDim = Math.max(w, h)
      for (const s of stars) {
        const angle = Math.random() * Math.PI * 2
        const dist  = maxDim * (0.18 + Math.random() * 0.56)
        s.x = cx + Math.cos(angle) * dist
        s.y = cy + Math.sin(angle) * dist
        s.x = Math.max(-15, Math.min(w + 15, s.x))
        s.y = Math.max(-15, Math.min(h + 15, s.y))
        const toCenter = Math.hypot(cx - s.x, cy - s.y)
        const spd = 9 + Math.random() * 13
        s.vx = toCenter > 0.1 ? (cx - s.x) / toCenter * spd : 0
        s.vy = toCenter > 0.1 ? (cy - s.y) / toCenter * spd : 0
      }
    }

    function init() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      stars = makeStars(canvas.width, canvas.height)
      bg(canvas.width, canvas.height)
    }

    // Stars accelerate outward — space travel forward
    function drawWarpOut(w, h) {
      const p  = warpP.current
      const cx = w / 2, cy = h / 2
      const accel = 0.00012 + p * p * 0.006

      for (const s of stars) {
        s.vx += (s.x - cx) * accel
        s.vy += (s.y - cy) * accel
        if (!warpRef.current) { s.vx *= 0.88; s.vy *= 0.88 }

        const px = s.x, py = s.y
        s.x += s.vx; s.y += s.vy

        const speed  = Math.hypot(s.vx, s.vy)
        const bright = Math.min(1, 0.42 + p * 0.58)

        if (speed > 0.35) {
          const tailLen = Math.min(speed * 3, 55)
          const tailX   = s.x - (s.vx / speed) * tailLen
          const tailY   = s.y - (s.vy / speed) * tailLen
          const grad    = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
          grad.addColorStop(0, 'rgba(140,155,205,0)')
          grad.addColorStop(1, `rgba(228,234,252,${bright.toFixed(2)})`)
          ctx.save()
          ctx.lineWidth   = Math.max(0.4, s.r * 0.9)
          ctx.strokeStyle = grad
          ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y); ctx.stroke()
          ctx.restore()
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(0.3, s.r * 0.75), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(235,238,255,${bright.toFixed(2)})`
        ctx.fill()

        // Respawn at center to keep tunnel density
        if (s.x < -130 || s.x > w + 130 || s.y < -130 || s.y > h + 130) {
          s.x = cx + (Math.random() - 0.5) * 90
          s.y = cy + (Math.random() - 0.5) * 90
          s.vx = 0; s.vy = 0
        }
      }
    }

    // Stars decelerate inward — space travel reverse
    function drawWarpIn(w, h) {
      const cx = w / 2, cy = h / 2

      for (const s of stars) {
        s.vx *= 0.964
        s.vy *= 0.964

        s.x += s.vx; s.y += s.vy

        const speed  = Math.hypot(s.vx, s.vy)
        const bright = Math.min(1, 0.45 + Math.min(speed, 16) / 16 * 0.55)

        if (speed > 0.35) {
          const tailLen = Math.min(speed * 3, 55)
          const tailX   = s.x - (s.vx / speed) * tailLen
          const tailY   = s.y - (s.vy / speed) * tailLen
          const grad    = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
          grad.addColorStop(0, 'rgba(140,155,205,0)')
          grad.addColorStop(1, `rgba(228,234,252,${bright.toFixed(2)})`)
          ctx.save()
          ctx.lineWidth   = Math.max(0.4, s.r * 0.9)
          ctx.strokeStyle = grad
          ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y); ctx.stroke()
          ctx.restore()
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(0.3, s.r * 0.75), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(235,238,255,${bright.toFixed(2)})`
        ctx.fill()

        // Stars that converge to center settle at a random screen position
        const dist = Math.hypot(s.x - cx, s.y - cy)
        if (dist < 45 || s.x < -60 || s.x > w + 60 || s.y < -60 || s.y > h + 60) {
          s.x = Math.random() * w; s.y = Math.random() * h
          s.vx = 0; s.vy = 0
        }
      }
    }

    function drawNormal(w, h) {
      for (const s of stars) {
        s.vx = 0; s.vy = 0

        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase)
        const alpha   = s.baseAlpha + twinkle * 0.38
        const radius  = Math.max(0.1, s.r + twinkle * 0.25)
        const a       = Math.max(0, alpha)

        if (s.iridescent) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 5)
          grd.addColorStop(0,   `hsla(${s.hue},60%,90%,${a.toFixed(3)})`)
          grd.addColorStop(0.4, `hsla(${s.hue},50%,80%,${(a * 0.3).toFixed(3)})`)
          grd.addColorStop(1,   `hsla(${s.hue},40%,70%,0)`)
          ctx.beginPath()
          ctx.arc(s.x, s.y, radius * 5, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()

          if (s.r > 1.8) {
            ctx.save()
            ctx.globalAlpha = a * 0.6
            ctx.strokeStyle = `hsla(${s.hue},40%,95%,1)`
            ctx.lineWidth   = 0.5
            const sp = radius * 6
            ctx.beginPath()
            ctx.moveTo(s.x - sp, s.y); ctx.lineTo(s.x + sp, s.y)
            ctx.moveTo(s.x, s.y - sp); ctx.lineTo(s.x, s.y + sp)
            ctx.stroke()
            ctx.restore()
          }
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = s.iridescent
          ? `hsla(${s.hue},25%,96%,${a.toFixed(3)})`
          : `rgba(228,233,250,${a.toFixed(3)})`
        ctx.fill()

        if (!s.iridescent && s.r > 1.4 && a > 0.45) {
          ctx.save()
          ctx.globalAlpha = a * 0.38
          ctx.strokeStyle = 'rgba(232,236,255,1)'
          ctx.lineWidth   = 0.45
          const sp = radius * 7
          ctx.beginPath()
          ctx.moveTo(s.x - sp, s.y); ctx.lineTo(s.x + sp, s.y)
          ctx.moveTo(s.x, s.y - sp); ctx.lineTo(s.x, s.y + sp)
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    function draw() {
      if (!active) return
      const w = canvas.width, h = canvas.height
      bg(w, h)
      frame++

      // Advance / retreat forward-warp progress
      if (warpRef.current) {
        warpP.current = Math.min(warpP.current + 0.014, 1)
        warpJustEnded.current = true
      } else if (warpP.current > 0) {
        warpP.current = Math.max(warpP.current - 0.05, 0)
      }

      if (warpP.current > 0.001) {
        // ── Forward warp: flying into the galaxy ──
        drawWarpOut(w, h)
      } else if (warpBackRef.current) {
        // ── Reverse warp: flying back out ──
        if (!warpBackInitDone.current) {
          initWarpBack(w, h)
          warpBackInitDone.current = true
          warpJustEnded.current    = false
        }
        drawWarpIn(w, h)
      } else {
        // ── Normal twinkle ──
        // One-shot scatters so no star clusters remain after either warp
        if (warpJustEnded.current) {
          scatterStars(w, h)
          warpJustEnded.current = false
        }
        if (warpBackInitDone.current) {
          scatterStars(w, h)
          warpBackInitDone.current = false
        }
        drawNormal(w, h)
      }

      rafId = requestAnimationFrame(draw)
    }

    init()
    window.addEventListener('resize', init)
    draw()

    return () => {
      active = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', display: 'block',
      }}
    />
  )
}

// ── Glass card overlay ────────────────────────────────────────────────────────
function GlassCard({ card, onClose }) {
  const desc = DESCRIPTIONS[card.name] ?? 'Explore the infinite possibilities of the digital universe through this stellar portal.'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
      transition={{ duration: 0.28 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', pointerEvents: 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.78, y: 52 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 28, transition: { duration: 0.32, ease: 'easeIn' } }}
        transition={{ duration: 0.68, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: 'min(560px, 92vw)',
          padding: '52px 48px 44px',
          borderRadius: 28,
          background: 'linear-gradient(145deg, rgba(32,35,55,0.90) 0%, rgba(15,17,28,0.96) 55%, rgba(22,25,44,0.92) 100%)',
          backdropFilter: 'blur(36px)',
          WebkitBackdropFilter: 'blur(36px)',
          border: '1px solid rgba(162,172,212,0.20)',
          boxShadow: [
            'inset 0 1.5px 0 rgba(255,255,255,0.13)',
            'inset 0 -1px 0 rgba(0,0,0,0.32)',
            '0 0 0 1px rgba(255,255,255,0.04)',
            '0 32px 100px rgba(0,0,0,0.85)',
            '0 6px 32px rgba(100,118,185,0.12)',
          ].join(', '),
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Top rim gleam */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(208,222,250,0.72), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Top-left gloss */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '58%', height: '44%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 38%, transparent 62%)',
          borderRadius: '28px 0 0 0', pointerEvents: 'none',
        }} />

        <div className="glass-shimmer" />

        <button onClick={onClose} className="glass-close-btn">×</button>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.26, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: 84, height: 84, borderRadius: 22,
            background: 'linear-gradient(145deg, #eef0f8 0%, #787890 9%, #424258 23%, #606275 37%, #323245 52%, #525265 66%, #9098ac 81%, #404052 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 26px',
            border: '1.5px solid rgba(255,255,255,0.90)',
            borderBottom: '2px solid rgba(8,8,18,0.92)',
            boxShadow: [`0 0 32px ${card.color}60`, '0 10px 38px rgba(0,0,0,0.68)', 'inset 0 1px 0 rgba(255,255,255,0.92)', 'inset 0 -1px 0 rgba(0,0,0,0.50)'].join(', '),
            overflow: 'hidden', position: 'relative',
          }}
        >
          <card.Icon style={{ fontSize: 38, color: card.color, position: 'relative', zIndex: 1 }} />
        </motion.div>

        {/* Name */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.38 }}
          style={{
            fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700,
            letterSpacing: '-0.022em', marginBottom: 14,
            background: 'linear-gradient(135deg, #f2f4fc 0%, #9aa4c8 45%, #d8e2f4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontFamily: 'Figtree, -apple-system, sans-serif',
          }}
        >
          {card.name}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.48 }}
          style={{
            fontSize: 'clamp(14px, 2vw, 15.5px)', lineHeight: 1.78,
            color: 'rgba(165,178,215,0.88)', marginBottom: 36,
            fontFamily: 'Figtree, -apple-system, sans-serif',
          }}
        >
          {desc}
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.58 }}
          className="glass-cta-btn"
        >
          Open {card.name} →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function CardFace({ card }) {
  return (
    <div className="card-content" style={{ color: card.color }}>
      <card.Icon className="card-icon" />
    </div>
  )
}
