import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DAYS, type Exercise, type FormPoint } from '../data/plan'
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

// Short rest taken *between* the two moves of a superset (A -> B).
const SUPERSET_TRANSITION_SEC = 20

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

// Per-exercise logging state + mutators, backed by the store.
function useExerciseLog(ex: Exercise) {
  const { store, setStore } = useStore()
  const sets = buildSets(store, ex)
  const prev = prevSessionOf(store, ex.id)
  const today = todaySessionOf(store, ex.id)
  const complete =
    !!today && today.sets.length >= ex.targetSets && today.sets.every((s) => s.done)

  const update = (i: number, patch: Partial<SetLog>) =>
    setStore((s) => {
      const cur = buildSets(s, ex)
      cur[i] = { ...cur[i], ...patch }
      return writeSession(s, ex.id, cur)
    })

  const markDone = () =>
    setStore((s) => writeSession(s, ex.id, buildSets(s, ex).map((x) => ({ ...x, done: true }))))

  return { sets, prev, complete, update, markDone }
}

function FormToggle({ form }: { form: FormPoint[] }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button
        onClick={() => setShow((f) => !f)}
        className="mb-3 inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-text active:bg-surface-raised"
      >
        Form {show ? '▾' : '▸'}
      </button>
      {show && (
        <ul className="mb-4 space-y-2">
          {form.map((fp, i) => (
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
    </>
  )
}

function SetGrid({
  ex,
  sets,
  prev,
  update,
}: ReturnType<typeof useExerciseLog> & { ex: Exercise }) {
  return (
    <>
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
            <div key={i} className="grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2">
              <span className="tnum text-sm text-muted">{i + 1}</span>
              <input
                inputMode="decimal"
                type="number"
                value={set.weight ?? ''}
                onChange={(e) => update(i, { weight: num(e.target.value) })}
                placeholder={last?.weight != null ? String(last.weight) : 'lbs'}
                className="tnum h-12 w-full rounded-lg border border-border bg-bg px-2 text-center text-lg text-text"
              />
              <input
                inputMode="numeric"
                type="number"
                value={set.reps ?? ''}
                onChange={(e) => update(i, { reps: num(e.target.value) })}
                placeholder={last?.reps != null ? String(last.reps) : 'reps'}
                className="tnum h-12 w-full rounded-lg border border-border bg-bg px-2 text-center text-lg text-text"
              />
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
      <p className="tnum mt-2 text-xs text-muted">
        {prev
          ? `Last (${prev.date}): ` +
            prev.sets
              .slice(0, ex.targetSets)
              .map((s) => (s.weight != null && s.reps != null ? `${s.weight}×${s.reps}` : '—'))
              .join('  ')
          : 'No previous data — set the baseline.'}
      </p>
    </>
  )
}

// The inner logging content for a single exercise (no outer card/header).
function ExerciseContent({ ex }: { ex: Exercise }) {
  const log = useExerciseLog(ex)
  return (
    <div>
      {ex.equipment && (
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-brass">
          <span aria-hidden>🛠</span>
          <span>{ex.equipment}</span>
        </p>
      )}
      {ex.why && <p className="mb-3 text-sm italic text-muted">{ex.why}</p>}
      <FormToggle form={ex.form} />
      <SetGrid ex={ex} {...log} />
    </div>
  )
}

function CardHeader({
  number,
  title,
  subtitle,
  complete,
  open,
  badge,
  onToggle,
}: {
  number: string
  title: React.ReactNode
  subtitle: string
  complete: boolean
  open: boolean
  badge?: React.ReactNode
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-3 p-4 text-left active:bg-surface-raised"
    >
      <span
        className={`tnum grid h-8 min-w-8 shrink-0 place-items-center rounded-lg px-1 text-sm font-bold ${
          complete ? 'bg-brass/20 text-brass' : 'bg-surface-raised text-muted'
        }`}
      >
        {complete ? '✓' : number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold leading-tight text-text">
          {title}
          {badge}
        </h3>
        <p className="tnum mt-0.5 text-xs text-muted">{subtitle}</p>
      </div>
      <span className="text-muted">{open ? '▾' : '▸'}</span>
    </button>
  )
}

function SoloBlock({ ex, number, defaultOpen }: { ex: Exercise; number: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const timer = useTimer()
  const log = useExerciseLog(ex)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <CardHeader
        number={number}
        title={ex.name}
        subtitle={`${ex.targetSets} × ${ex.repRange} · rest ${ex.restSec}s`}
        complete={log.complete}
        open={open}
        badge={
          ex.optional ? (
            <span className="ml-2 rounded bg-brass/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brass">
              optional
            </span>
          ) : undefined
        }
        onToggle={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="border-t border-border p-4 pt-3">
          <ExerciseContent ex={ex} />
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => timer.start(ex.restSec, ex.name)}
              className="h-12 flex-1 rounded-xl bg-accent text-sm font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
            >
              Start rest · {ex.restSec}s
            </button>
            <button
              onClick={log.markDone}
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

function SupersetBlock({
  a,
  b,
  number,
  defaultOpen,
}: {
  a: Exercise
  b: Exercise
  number: string
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const timer = useTimer()
  const logA = useExerciseLog(a)
  const logB = useExerciseLog(b)
  const complete = logA.complete && logB.complete
  const roundRest = Math.max(a.restSec, b.restSec)

  const markRoundDone = () => {
    logA.markDone()
    logB.markDone()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/40 bg-surface">
      <CardHeader
        number={number}
        title={`${a.name}  ⇄  ${b.name}`}
        subtitle={`Superset · round rest ${roundRest}s`}
        complete={complete}
        open={open}
        badge={
          <span className="ml-2 rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            superset
          </span>
        }
        onToggle={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="border-t border-border p-4 pt-3">
          {/* Move A */}
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 text-xs font-bold text-accent">
              A
            </span>
            <span className="text-sm font-bold text-text">{a.name}</span>
            <span className="tnum ml-auto text-xs text-muted">
              {a.targetSets} × {a.repRange}
            </span>
          </div>
          <ExerciseContent ex={a} />

          {/* Transition: short rest, then go to B */}
          <button
            onClick={() => timer.start(SUPERSET_TRANSITION_SEC, `→ ${b.name}`)}
            className="my-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/50 py-2.5 text-xs font-semibold uppercase tracking-wide text-accent active:bg-surface-raised"
          >
            ↓ short rest {SUPERSET_TRANSITION_SEC}s · then move B
          </button>

          {/* Move B */}
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 text-xs font-bold text-accent">
              B
            </span>
            <span className="text-sm font-bold text-text">{b.name}</span>
            <span className="tnum ml-auto text-xs text-muted">
              {b.targetSets} × {b.repRange}
            </span>
          </div>
          <ExerciseContent ex={b} />

          {/* Round actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => timer.start(roundRest, `Superset round`)}
              className="h-12 flex-1 rounded-xl bg-accent text-sm font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
            >
              Round rest · {roundRest}s
            </button>
            <button
              onClick={markRoundDone}
              className="h-12 flex-1 rounded-xl border border-border bg-surface-raised text-sm font-bold uppercase tracking-wide text-text active:bg-bg"
            >
              Round done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Group consecutive exercises into solo blocks and superset pairs. A
// superset-flagged exercise pairs with the exercise immediately after it.
type Group =
  | { kind: 'solo'; ex: Exercise; number: string }
  | { kind: 'super'; a: Exercise; b: Exercise; number: string }

function groupExercises(exs: Exercise[]): Group[] {
  const groups: Group[] = []
  let i = 0
  let n = 1
  while (i < exs.length) {
    const ex = exs[i]
    if (ex.superset && i + 1 < exs.length) {
      groups.push({ kind: 'super', a: ex, b: exs[i + 1], number: `${n}+${n + 1}` })
      n += 2
      i += 2
    } else {
      groups.push({ kind: 'solo', ex, number: String(n) })
      n += 1
      i += 1
    }
  }
  return groups
}

function WarmUp({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false)
  const [checks, setChecks] = useState<boolean[]>(() => items.map(() => false))
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left active:bg-surface-raised"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-raised text-base">
          🔥
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-tight text-text">Warm-up</h3>
          <p className="text-xs text-muted">RAMP · prime the lifts, don’t fatigue them</p>
        </div>
        <span className="text-muted">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="border-t border-border p-2">
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
              <span
                className={`text-sm ${
                  checks[i]
                    ? 'text-muted line-through'
                    : item.includes('⚠️')
                      ? 'text-care'
                      : 'text-text'
                }`}
              >
                {item}
              </span>
            </button>
          ))}
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
  const groups = day.tracked ? groupExercises(day.exercises ?? []) : []

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
            {day.warmup && day.warmup.length > 0 && <WarmUp items={day.warmup} />}
            {groups.map((g, idx) =>
              g.kind === 'super' ? (
                <SupersetBlock
                  key={g.a.id}
                  a={g.a}
                  b={g.b}
                  number={g.number}
                  defaultOpen={idx === 0}
                />
              ) : (
                <SoloBlock key={g.ex.id} ex={g.ex} number={g.number} defaultOpen={idx === 0} />
              ),
            )}
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
