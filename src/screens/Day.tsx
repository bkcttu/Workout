import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DAYS, type Exercise } from '../data/plan'
import { useStore } from '../lib/StoreContext'
import { useTimer } from '../lib/TimerContext'
import { useWakeLock } from '../lib/useWakeLock'
import {
  prevSessionOf,
  todayISO,
  todaySessionOf,
  writeSession,
  type SetLog,
  type Store,
} from '../lib/store'

// Build the current working set rows for an exercise: today's logged values if
// present, otherwise prefilled from the previous session (not marked done).
function buildSets(store: Store, ex: Exercise): SetLog[] {
  const today = todaySessionOf(store, ex.id)
  const prev = prevSessionOf(store, ex.id)
  const out: SetLog[] = []
  for (let i = 0; i < ex.targetSets; i++) {
    if (today && today.sets[i]) {
      out.push(today.sets[i])
    } else if (prev && prev.sets[i]) {
      out.push({ weight: prev.sets[i].weight, reps: prev.sets[i].reps, done: false })
    } else {
      out.push({ weight: null, reps: null, done: false })
    }
  }
  return out
}

function num(v: string): number | null {
  if (v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function ExerciseBlock({ ex, index }: { ex: Exercise; index: number }) {
  const { store, setStore } = useStore()
  const timer = useTimer()
  const [open, setOpen] = useState(index === 0)
  const [showForm, setShowForm] = useState(false)

  const sets = buildSets(store, ex)
  const prev = prevSessionOf(store, ex.id)
  const today = todaySessionOf(store, ex.id)
  const complete = !!today && today.sets.length >= ex.targetSets && today.sets.every((s) => s.done)

  const update = (i: number, patch: Partial<SetLog>) =>
    setStore((s) => {
      const cur = buildSets(s, ex)
      cur[i] = { ...cur[i], ...patch }
      return writeSession(s, ex.id, cur)
    })

  const markExerciseDone = () =>
    setStore((s) => writeSession(s, ex.id, buildSets(s, ex).map((x) => ({ ...x, done: true }))))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left active:bg-surface-raised"
      >
        <span
          className={`tnum grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${
            complete ? 'bg-brass/20 text-brass' : 'bg-surface-raised text-muted'
          }`}
        >
          {complete ? '✓' : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-tight text-text">
            {ex.name}
            {ex.superset && (
              <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                superset
              </span>
            )}
          </h3>
          <p className="tnum mt-0.5 text-xs text-muted">
            {ex.targetSets} × {ex.repRange} · rest {ex.restSec}s
          </p>
        </div>
        <span className="text-muted">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="border-t border-border p-4 pt-3">
          {ex.why && <p className="mb-3 text-sm italic text-muted">{ex.why}</p>}

          {/* Form toggle */}
          <button
            onClick={() => setShowForm((f) => !f)}
            className="mb-3 inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text active:bg-surface-raised"
          >
            Form {showForm ? '▾' : '▸'}
          </button>
          {showForm && (
            <ul className="mb-4 space-y-2">
              {ex.form.map((fp, i) => (
                <li
                  key={i}
                  className={`flex gap-2 text-sm ${fp.care ? 'font-medium text-care' : 'text-text'}`}
                >
                  <span className="shrink-0">{fp.care ? '⚠️' : '•'}</span>
                  <span>{fp.text}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Set grid */}
          <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
            <span>Set</span>
            <span>Weight</span>
            <span>Reps</span>
            <span className="text-center">✓</span>
          </div>
          <div className="mt-1 space-y-1.5">
            {sets.map((set, i) => {
              const last = prev?.sets[i]
              return (
                <div
                  key={i}
                  className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2"
                >
                  <span className="tnum text-sm text-muted">{i + 1}</span>
                  <div>
                    <input
                      inputMode="decimal"
                      type="number"
                      value={set.weight ?? ''}
                      onChange={(e) => update(i, { weight: num(e.target.value) })}
                      placeholder={last?.weight != null ? String(last.weight) : 'lbs'}
                      className="tnum h-12 w-full rounded-lg border border-border bg-bg px-2 text-center text-lg text-text"
                    />
                  </div>
                  <div>
                    <input
                      inputMode="numeric"
                      type="number"
                      value={set.reps ?? ''}
                      onChange={(e) => update(i, { reps: num(e.target.value) })}
                      placeholder={last?.reps != null ? String(last.reps) : 'reps'}
                      className="tnum h-12 w-full rounded-lg border border-border bg-bg px-2 text-center text-lg text-text"
                    />
                  </div>
                  <button
                    onClick={() => update(i, { done: !set.done })}
                    aria-label={`Set ${i + 1} done`}
                    className={`grid h-12 w-full place-items-center rounded-lg border text-lg ${
                      set.done
                        ? 'border-brass bg-brass/20 text-brass'
                        : 'border-border bg-bg text-muted'
                    }`}
                  >
                    {set.done ? '✓' : ''}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Last-time line */}
          <p className="tnum mt-2 text-xs text-muted">
            {prev
              ? `Last (${prev.date}): ` +
                prev.sets
                  .slice(0, ex.targetSets)
                  .map((s) => (s.weight != null && s.reps != null ? `${s.weight}×${s.reps}` : '—'))
                  .join('  ')
              : 'No previous data — set the baseline.'}
          </p>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => timer.start(ex.restSec, ex.name)}
              className="h-12 flex-1 rounded-xl bg-accent text-sm font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
            >
              Start rest · {ex.restSec}s
            </button>
            <button
              onClick={markExerciseDone}
              className="h-12 flex-1 rounded-xl border border-border bg-surface-raised text-sm font-bold uppercase tracking-wide text-text active:bg-bg"
            >
              Exercise done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Freestyle({ dayId, items }: { dayId: string; items: string[] }) {
  const { store, setStore } = useStore()
  const navigate = useNavigate()
  const [checks, setChecks] = useState<boolean[]>(() => items.map(() => false))
  const completed = store.dayCompleted[dayId]

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-surface p-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-left active:bg-surface-raised"
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border text-sm ${
                checks[i] ? 'border-brass bg-brass/20 text-brass' : 'border-border text-muted'
              }`}
            >
              {checks[i] ? '✓' : ''}
            </span>
            <span className={checks[i] ? 'text-muted line-through' : 'text-text'}>{item}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          setStore((s) => ({
            ...s,
            dayCompleted: { ...s.dayCompleted, [dayId]: todayISO() },
          }))
          navigate('/')
        }}
        className="h-14 w-full rounded-xl bg-accent text-base font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
      >
        Mark day complete
      </button>
      {completed && (
        <p className="tnum text-center text-xs text-brass">Last completed {completed}</p>
      )}
    </div>
  )
}

export default function Day() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const { store, setStore } = useStore()
  const day = DAYS.find((d) => d.id === dayId)
  useWakeLock(!!day?.tracked)

  if (!day) {
    return (
      <div className="safe-top px-4">
        <p className="text-muted">Day not found.</p>
        <Link to="/" className="text-accent">
          ← Home
        </Link>
      </div>
    )
  }

  const completed = store.dayCompleted[day.id]

  return (
    <div className="safe-top px-4">
      <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-text active:bg-surface"
            aria-label="Back"
          >
            ←
          </button>
          <div className="min-w-0">
            <h1 className="display truncate text-lg leading-tight text-text">{day.title}</h1>
            <p className="truncate text-xs text-muted">{day.focus}</p>
          </div>
        </div>
      </header>

      <div className="mt-4">
        {day.tracked ? (
          <div className="space-y-3">
            {day.exercises?.map((ex, i) => (
              <ExerciseBlock key={ex.id} ex={ex} index={i} />
            ))}
            <button
              onClick={() => {
                setStore((s) => ({
                  ...s,
                  dayCompleted: { ...s.dayCompleted, [day.id]: todayISO() },
                }))
                navigate('/')
              }}
              className="h-14 w-full rounded-xl bg-accent text-base font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
            >
              Mark day complete
            </button>
            {completed && (
              <p className="tnum text-center text-xs text-brass">Last completed {completed}</p>
            )}
          </div>
        ) : (
          <Freestyle dayId={day.id} items={day.checklist ?? []} />
        )}
      </div>
    </div>
  )
}
