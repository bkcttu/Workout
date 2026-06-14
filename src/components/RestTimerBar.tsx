import { Pause, Play, Plus, RotateCcw, X } from 'lucide-react'
import RingProgress from './RingProgress'
import { useTimer } from '../lib/TimerContext'

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function RestTimerBar() {
  const t = useTimer()
  if (t.total === 0) return null

  const progress = t.total > 0 ? t.remaining / t.total : 0
  const done = t.remaining <= 0

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[68px] z-40 flex justify-center px-3">
      <div className="card pointer-events-auto flex w-full max-w-md items-center gap-3 p-3">
        <RingProgress progress={progress} size={56} stroke={5} color={done ? 'var(--brass)' : undefined}>
          <span
            className="tnum text-[13px]"
            style={{ color: done ? 'var(--brass)' : 'var(--accent-hot)' }}
          >
            {fmt(t.remaining)}
          </span>
        </RingProgress>

        <div className="min-w-0 flex-1">
          <div className="eyebrow">{done ? 'Rest complete' : t.running ? 'Resting' : 'Paused'}</div>
          <div className="truncate text-sm text-text">{t.label || 'Rest timer'}</div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => t.addTime(15)}
            className="press tnum flex h-11 items-center gap-0.5 rounded-ctl px-2.5 text-sm text-text"
            aria-label="Add 15 seconds"
          >
            <Plus size={14} />
            15
          </button>
          <button
            onClick={() => t.reset()}
            className="press grid h-11 w-11 place-items-center rounded-ctl text-ink2"
            aria-label="Reset timer"
          >
            <RotateCcw size={18} />
          </button>
          {t.running ? (
            <button
              onClick={() => t.pause()}
              className="press grid h-11 w-11 place-items-center rounded-ctl bg-accent text-bg"
              style={{ backgroundImage: 'linear-gradient(180deg, var(--accent-hot), var(--accent))' }}
              aria-label="Pause timer"
            >
              <Pause size={18} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={() => (done ? t.stop() : t.resume())}
              className="press grid h-11 w-11 place-items-center rounded-ctl bg-accent text-bg"
              style={{ backgroundImage: 'linear-gradient(180deg, var(--accent-hot), var(--accent))' }}
              aria-label={done ? 'Dismiss timer' : 'Resume timer'}
            >
              {done ? <X size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
