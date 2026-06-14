import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronDown, Play } from 'lucide-react'
import {
  DAYS,
  MUSCLE_LABELS,
  type Exercise,
  type FormPoint,
  type MuscleId,
} from '../data/plan'
import BodyMap, { bestView } from '../components/BodyMap'
import { demoFor, isGif } from '../lib/demos'
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

const SUPERSET_TRANSITION_SEC = 20

function buildSets(store: Store, ex: Exercise): SetLog[] {
  const today = todaySessionOf(store, ex.id)
  const prev = prevSessionOf(store, ex.id)
  const out: SetLog[] = []
  for (let i = 0; i < ex.targetSets; i++) {
    if (today && today.sets[i]) out.push(today.sets[i])
    else if (prev && prev.sets[i])
      out.push({ weight: prev.sets[i].weight, reps: prev.sets[i].reps, done: false })
    else out.push({ weight: null, reps: null, done: false })
  }
  return out
}

function num(v: string): number | null {
  if (v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function restLabel(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`
}

function muscleValues(ex: Exercise): Partial<Record<MuscleId, number>> {
  const values: Partial<Record<MuscleId, number>> = {}
  ex.muscles?.secondary?.forEach((mu) => (values[mu] = 0.5))
  ex.muscles?.primary.forEach((mu) => (values[mu] = 1))
  return values
}

function useExerciseLog(ex: Exercise) {
  const { store, setStore } = useStore()
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

  const markDone = () =>
    setStore((s) => writeSession(s, ex.id, buildSets(s, ex).map((x) => ({ ...x, done: true }))))

  return { sets, prev, complete, update, markDone }
}

// ----- shared bits ----------------------------------------------------------

function PrimaryButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`press rounded-ctl py-3.5 text-sm font-bold uppercase tracking-wide text-bg ${className}`}
      style={{ backgroundImage: 'linear-gradient(180deg, var(--accent-hot), var(--accent))' }}
    >
      {children}
    </button>
  )
}

function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`press rounded-ctl border border-hairline py-3 text-sm font-semibold text-text ${className}`}
    >
      {children}
    </button>
  )
}

function SetGrid({
  ex,
  sets,
  prev,
  update,
}: ReturnType<typeof useExerciseLog> & { ex: Exercise }) {
  return (
    <div className="mt-4">
      <div className="eyebrow grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-3">
        <span>Set</span>
        <span>Weight</span>
        <span>Reps</span>
        <span className="text-right">Done</span>
      </div>
      <div className="mt-1">
        {sets.map((set, i) => {
          const last = prev?.sets[i]
          return (
            <div
              key={i}
              className={`grid grid-cols-[2rem_1fr_1fr_3rem] items-center gap-3 py-1.5 transition-opacity ${
                set.done ? 'opacity-55' : ''
              }`}
            >
              <span className="tnum text-sm text-dim">{i + 1}</span>
              <input
                inputMode="decimal"
                type="number"
                value={set.weight ?? ''}
                onChange={(e) => update(i, { weight: num(e.target.value) })}
                placeholder={last?.weight != null ? String(last.weight) : '—'}
                className="tnum w-full rounded-none border-0 border-b-2 border-hairline bg-transparent py-1.5 text-center text-[20px] text-text placeholder:text-dim focus:border-accent focus:outline-none"
              />
              <input
                inputMode="numeric"
                type="number"
                value={set.reps ?? ''}
                onChange={(e) => update(i, { reps: num(e.target.value) })}
                placeholder={last?.reps != null ? String(last.reps) : '—'}
                className="tnum w-full rounded-none border-0 border-b-2 border-hairline bg-transparent py-1.5 text-center text-[20px] text-text placeholder:text-dim focus:border-accent focus:outline-none"
              />
              <button
                onClick={() => update(i, { done: !set.done })}
                aria-label={`Set ${i + 1} done`}
                className={`press grid h-10 w-10 place-items-center justify-self-end rounded-ctl ${
                  set.done ? 'text-bg' : 'border border-hairline text-dim'
                }`}
                style={set.done ? { background: 'var(--brass)' } : undefined}
              >
                <Check size={18} />
              </button>
            </div>
          )
        })}
      </div>
      <p className="tnum mt-2 text-xs text-dim">
        {prev
          ? `Last (${prev.date}): ` +
            prev.sets
              .slice(0, ex.targetSets)
              .map((s) => (s.weight != null && s.reps != null ? `${s.weight}×${s.reps}` : '—'))
              .join('  ')
          : 'No previous data — set the baseline.'}
      </p>
    </div>
  )
}

function ExerciseDetail({ ex }: { ex: Exercise }) {
  const [showMap, setShowMap] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const log = useExerciseLog(ex)
  const primary = ex.muscles?.primary ?? []
  const secondary = ex.muscles?.secondary ?? []
  const demo = demoFor(ex.id) ?? ex.demoGif

  return (
    <div className="pt-1">
      {ex.equipment && (
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-brass">
          <span aria-hidden>🛠</span>
          <span>{ex.equipment}</span>
        </p>
      )}
      {ex.why && <p className="mb-3 text-sm italic text-ink2">{ex.why}</p>}

      <ul className="space-y-2">
        {ex.form.map((fp: FormPoint, i) => (
          <li
            key={i}
            className={`flex gap-2 text-sm ${fp.care ? 'font-medium text-care' : 'text-text'}`}
          >
            <span className="shrink-0">{fp.care ? '⚠️' : '·'}</span>
            <span>{fp.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap gap-2">
        {demo && (
          <button
            onClick={() => setShowDemo((s) => !s)}
            className="press inline-flex items-center gap-1.5 rounded-ctl border border-hairline px-3 py-1.5 text-xs font-semibold text-text"
          >
            <Play size={13} /> Demo <ChevronDown size={13} className={showDemo ? 'rotate-180' : ''} />
          </button>
        )}
        <button
          onClick={() => setShowMap((s) => !s)}
          className="press inline-flex items-center gap-1.5 rounded-ctl border border-hairline px-3 py-1.5 text-xs font-semibold text-text"
        >
          Muscles <ChevronDown size={13} className={showMap ? 'rotate-180' : ''} />
        </button>
      </div>

      {demo && showDemo && (
        <div className="mt-3 overflow-hidden rounded-card bg-surface-raised/60 p-2">
          {isGif(demo) ? (
            <img src={demo} alt={`${ex.name} demo`} className="mx-auto max-h-64 rounded-ctl" loading="lazy" />
          ) : (
            <video
              src={demo}
              className="mx-auto max-h-64 rounded-ctl"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </div>
      )}

      {showMap && (
        <div className="mt-3 rounded-card bg-surface-raised/60 p-4">
          <BodyMap values={muscleValues(ex)} />
          <div className="mt-3 space-y-1 text-xs">
            <p>
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle"
                style={{ background: 'var(--accent)' }}
              />
              <span className="text-dim">Primary: </span>
              <span className="text-text">{primary.map((mu) => MUSCLE_LABELS[mu]).join(', ')}</span>
            </p>
            {secondary.length > 0 && (
              <p>
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle"
                  style={{ background: 'var(--accent)', opacity: 0.5 }}
                />
                <span className="text-dim">Secondary: </span>
                <span className="text-text">
                  {secondary.map((mu) => MUSCLE_LABELS[mu]).join(', ')}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      <SetGrid ex={ex} {...log} />
    </div>
  )
}

function ExerciseHeader({
  ex,
  number,
  complete,
  open,
  badge,
  onToggle,
}: {
  ex: Exercise
  number: string
  complete: boolean
  open: boolean
  badge?: React.ReactNode
  onToggle: () => void
}) {
  return (
    <button onClick={onToggle} className="press flex w-full items-center gap-3 py-4 text-left">
      <span
        className={`tnum grid h-8 min-w-8 shrink-0 place-items-center rounded-ctl px-1 text-sm ${
          complete ? 'text-bg' : 'bg-surface-raised text-dim'
        }`}
        style={complete ? { background: 'var(--brass)' } : undefined}
      >
        {complete ? <Check size={16} /> : number}
      </span>
      <div className="min-w-0 flex-1">
        <div className="eyebrow truncate">
          {ex.targetSets} × {ex.repRange} · REST {restLabel(ex.restSec)}
        </div>
        <h3 className="display text-[17px] leading-tight text-text">
          {ex.name.replace(/ \(optional finisher\)/, '')}
          {badge}
        </h3>
      </div>
      {ex.muscles && (
        <div className="shrink-0 opacity-90">
          <BodyMap
            values={muscleValues(ex)}
            view={bestView(ex.muscles.primary)}
            size={40}
            showLabels={false}
          />
        </div>
      )}
      <ChevronDown size={18} className={`shrink-0 text-dim ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

function SoloBlock({ ex, number, defaultOpen }: { ex: Exercise; number: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const timer = useTimer()
  const log = useExerciseLog(ex)

  return (
    <div className="px-5">
      <ExerciseHeader
        ex={ex}
        number={number}
        complete={log.complete}
        open={open}
        badge={
          ex.optional ? (
            <span className="ml-2 rounded-full bg-brass/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brass">
              optional
            </span>
          ) : undefined
        }
        onToggle={() => setOpen((o) => !o)}
      />
      {open && (
        <div className="pb-5">
          <ExerciseDetail ex={ex} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <PrimaryButton onClick={() => timer.start(ex.restSec, ex.name)}>
              Rest · {restLabel(ex.restSec)}
            </PrimaryButton>
            <GhostButton onClick={log.markDone}>Exercise done</GhostButton>
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

  return (
    <div className="px-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="press flex w-full items-center gap-3 py-4 text-left"
      >
        <span
          className={`tnum grid h-8 min-w-8 shrink-0 place-items-center rounded-ctl px-1 text-sm ${
            complete ? 'text-bg' : 'bg-surface-raised text-dim'
          }`}
          style={complete ? { background: 'var(--brass)' } : undefined}
        >
          {complete ? <Check size={16} /> : number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="eyebrow">Superset · round rest {restLabel(roundRest)}</div>
          <h3 className="display text-[16px] leading-tight text-text">
            {a.name} <span className="text-accent">⇄</span> {b.name}
          </h3>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-dim ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="pb-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 text-xs font-bold text-accent">
              A
            </span>
            <span className="display text-sm text-text">{a.name}</span>
          </div>
          <ExerciseDetail ex={a} />

          <button
            onClick={() => timer.start(SUPERSET_TRANSITION_SEC, `→ ${b.name}`)}
            className="press my-4 flex w-full items-center justify-center gap-1.5 rounded-ctl border border-dashed border-accent/50 py-2.5 text-xs font-semibold uppercase tracking-wide text-accent"
          >
            ↓ short rest {SUPERSET_TRANSITION_SEC}s · then move B
          </button>

          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent/15 text-xs font-bold text-accent">
              B
            </span>
            <span className="display text-sm text-text">{b.name}</span>
          </div>
          <ExerciseDetail ex={b} />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <PrimaryButton onClick={() => timer.start(roundRest, 'Superset round')}>
              Round rest · {restLabel(roundRest)}
            </PrimaryButton>
            <GhostButton
              onClick={() => {
                logA.markDone()
                logB.markDone()
              }}
            >
              Round done
            </GhostButton>
          </div>
        </div>
      )}
    </div>
  )
}

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
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="press flex w-full items-center gap-3 p-5 text-left">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-ctl bg-surface-raised">🔥</span>
        <div className="min-w-0 flex-1">
          <div className="eyebrow">RAMP · prime, don’t fatigue</div>
          <h3 className="display text-[16px] leading-tight text-text">Warm-up</h3>
        </div>
        <ChevronDown size={18} className={`text-dim ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="press flex w-full items-center gap-3 rounded-ctl p-3 text-left"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${
                  checks[i] ? 'text-bg' : 'border border-hairline text-dim'
                }`}
                style={checks[i] ? { background: 'var(--brass)' } : undefined}
              >
                {checks[i] ? <Check size={14} /> : ''}
              </span>
              <span
                className={`text-sm ${
                  checks[i] ? 'text-dim line-through' : item.includes('⚠️') ? 'text-care' : 'text-text'
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
    <div className="space-y-4">
      <div className="card overflow-hidden p-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
            className="press flex w-full items-center gap-3 rounded-ctl p-3 text-left"
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                checks[i] ? 'text-bg' : 'border border-hairline text-dim'
              }`}
              style={checks[i] ? { background: 'var(--brass)' } : undefined}
            >
              {checks[i] ? <Check size={15} /> : ''}
            </span>
            <span className={checks[i] ? 'text-dim line-through' : 'text-text'}>{item}</span>
          </button>
        ))}
      </div>
      <PrimaryButton
        className="w-full"
        onClick={() => {
          setStore((s) => ({ ...s, dayCompleted: { ...s.dayCompleted, [dayId]: todayISO() } }))
          navigate('/')
        }}
      >
        Mark day complete
      </PrimaryButton>
      {completed && <p className="tnum text-center text-xs text-brass">Last completed {completed}</p>}
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
      <div className="safe-top px-5">
        <p className="text-ink2">Day not found.</p>
        <Link to="/" className="text-accent">
          ← Home
        </Link>
      </div>
    )
  }

  const completed = store.dayCompleted[day.id]
  const groups = day.tracked ? groupExercises(day.exercises ?? []) : []

  return (
    <div className="safe-top px-5">
      <header className="sticky top-0 z-30 -mx-5 mb-4 bg-bg/85 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-ctl border border-hairline text-text"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <div className="eyebrow truncate">{day.focus}</div>
            <h1 className="display truncate text-[20px] leading-tight text-text">
              {day.title.replace(/^Day \d+ · /, '')}
            </h1>
          </div>
        </div>
      </header>

      {day.tracked ? (
        <div className="space-y-4">
          {day.warmup && day.warmup.length > 0 && <WarmUp items={day.warmup} />}
          <div className="card overflow-hidden">
            {groups.map((g, idx) => (
              <div key={g.kind === 'super' ? g.a.id : g.ex.id} className={idx > 0 ? 'border-t border-hairline' : ''}>
                {g.kind === 'super' ? (
                  <SupersetBlock a={g.a} b={g.b} number={g.number} defaultOpen={idx === 0} />
                ) : (
                  <SoloBlock ex={g.ex} number={g.number} defaultOpen={idx === 0} />
                )}
              </div>
            ))}
          </div>
          <PrimaryButton
            className="w-full"
            onClick={() => {
              setStore((s) => ({ ...s, dayCompleted: { ...s.dayCompleted, [day.id]: todayISO() } }))
              navigate('/')
            }}
          >
            Mark day complete
          </PrimaryButton>
          {completed && (
            <p className="tnum text-center text-xs text-brass">Last completed {completed}</p>
          )}
        </div>
      ) : (
        <Freestyle dayId={day.id} items={day.checklist ?? []} />
      )}
    </div>
  )
}
