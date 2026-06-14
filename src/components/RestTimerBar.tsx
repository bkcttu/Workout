import RingProgress from './RingProgress'
import { useTimer } from '../lib/TimerContext'

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function RestTimerBar() {
  const t = useTimer()
  if (t.total === 0) return null // inactive

  const progress = t.total > 0 ? t.remaining / t.total : 0
  const done = t.remaining <= 0
  const color = done ? 'var(--brass)' : 'var(--accent)'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[64px] z-40 flex justify-center px-3">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-surface-raised/95 p-3 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3">
          <RingProgress progress={progress} size={64} stroke={6} color={color}>
            <span className="tnum text-sm font-bold" style={{ color }}>
              {fmt(t.remaining)}
            </span>
          </RingProgress>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted">
              {done ? 'Rest complete' : t.running ? 'Resting' : 'Paused'}
            </div>
            <div className="truncate text-sm text-text">{t.label || 'Rest timer'}</div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => t.addTime(15)}
              className="tnum h-11 rounded-lg border border-border bg-surface px-2.5 text-sm font-bold text-text active:bg-bg"
              aria-label="Add 15 seconds"
            >
              +15
            </button>
            <button
              onClick={() => t.reset()}
              className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-surface text-text active:bg-bg"
              aria-label="Reset timer"
            >
              ↺
            </button>
            {t.running ? (
              <button
                onClick={() => t.pause()}
                className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-bg active:bg-accent-bright"
                aria-label="Pause timer"
              >
                ❚❚
              </button>
            ) : (
              <button
                onClick={() => (done ? t.stop() : t.resume())}
                className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-bg active:bg-accent-bright"
                aria-label={done ? 'Dismiss timer' : 'Resume timer'}
              >
                {done ? '✕' : '▶'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
