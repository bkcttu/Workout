import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

type TimerCtx = {
  running: boolean
  remaining: number // seconds left
  total: number // seconds the timer was started with
  label: string // exercise name driving the timer
  start: (seconds: number, label?: string) => void
  pause: () => void
  resume: () => void
  reset: () => void
  addTime: (seconds: number) => void
  stop: () => void
}

const Ctx = createContext<TimerCtx | null>(null)

// A short two-tone beep using the Web Audio API.
function beep() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const tones = [880, 1320]
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      const t0 = now + i * 0.18
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + 0.18)
    })
    setTimeout(() => ctx.close().catch(() => {}), 600)
  } catch {
    /* audio not available — silently ignore */
  }
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [total, setTotal] = useState(0)
  const [label, setLabel] = useState('')

  // Track an absolute end time so the countdown stays accurate even if the
  // tab is backgrounded and the interval is throttled.
  const endAtRef = useRef<number | null>(null)
  const firedRef = useRef(false)

  const fire = useCallback(() => {
    if (firedRef.current) return
    firedRef.current = true
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200])
      } catch {
        /* ignore */
      }
    }
    beep()
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      if (endAtRef.current == null) return
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        fire()
        setRunning(false)
        endAtRef.current = null
      }
    }, 250)
    return () => clearInterval(id)
  }, [running, fire])

  const start = useCallback((seconds: number, lbl = '') => {
    firedRef.current = false
    setTotal(seconds)
    setRemaining(seconds)
    setLabel(lbl)
    endAtRef.current = Date.now() + seconds * 1000
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    setRunning(false)
    if (endAtRef.current != null) {
      setRemaining(Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000)))
    }
    endAtRef.current = null
  }, [])

  const resume = useCallback(() => {
    if (remaining <= 0) return
    firedRef.current = false
    endAtRef.current = Date.now() + remaining * 1000
    setRunning(true)
  }, [remaining])

  const reset = useCallback(() => {
    firedRef.current = false
    setRemaining(total)
    if (running) {
      endAtRef.current = Date.now() + total * 1000
    } else {
      endAtRef.current = null
    }
  }, [total, running])

  const addTime = useCallback(
    (seconds: number) => {
      firedRef.current = false
      setRemaining((r) => {
        const next = Math.max(0, r + seconds)
        const delta = next - r
        if (running && endAtRef.current != null) {
          endAtRef.current = endAtRef.current + delta * 1000
        }
        return next
      })
      setTotal((t) => Math.max(t, remaining + seconds))
    },
    [running, remaining],
  )

  const stop = useCallback(() => {
    setRunning(false)
    setRemaining(0)
    setTotal(0)
    setLabel('')
    endAtRef.current = null
    firedRef.current = false
  }, [])

  const value = useMemo(
    () => ({ running, remaining, total, label, start, pause, resume, reset, addTime, stop }),
    [running, remaining, total, label, start, pause, resume, reset, addTime, stop],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTimer(): TimerCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider')
  return ctx
}
