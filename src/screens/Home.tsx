import { Link } from 'react-router-dom'
import { ChevronRight, Check } from 'lucide-react'
import { APP_NAME, DAYS, MUSCLE_LABELS, type MuscleId } from '../data/plan'
import { useStore } from '../lib/StoreContext'
import { hydrationGoal, prettyDate, proteinTotal, todayISO } from '../lib/store'
import RingProgress from '../components/RingProgress'
import BodyMap from '../components/BodyMap'

// Weekly muscle emphasis across the whole tracked program (primary=2, secondary=1).
const WEEK_COUNTS: Partial<Record<MuscleId, number>> = (() => {
  const counts: Partial<Record<MuscleId, number>> = {}
  DAYS.forEach((d) =>
    d.exercises?.forEach((ex) => {
      if (!ex.muscles) return
      ex.muscles.primary.forEach((mu) => (counts[mu] = (counts[mu] ?? 0) + 2))
      ex.muscles.secondary?.forEach((mu) => (counts[mu] = (counts[mu] ?? 0) + 1))
    }),
  )
  return counts
})()
const WEEK_MAX = Math.max(1, ...Object.values(WEEK_COUNTS))
const WEEK_VALUES: Partial<Record<MuscleId, number>> = Object.fromEntries(
  Object.entries(WEEK_COUNTS).map(([k, v]) => [k, v / WEEK_MAX]),
)
const WEEK_TOP = (Object.entries(WEEK_COUNTS) as [MuscleId, number][])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4)

function daysAgoLabel(iso?: string): string | null {
  if (!iso) return null
  const today = new Date(todayISO())
  const then = new Date(iso)
  const diff = Math.round((today.getTime() - then.getTime()) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return prettyDate(iso)
}

export default function Home() {
  const { store } = useStore()
  const today = new Date()

  const waterGoal = hydrationGoal(store.hydration)
  const waterIntake = store.hydration.today.intakeOz
  const protein = proteinTotal(store.nutrition)
  const proteinGoal = store.nutrition.proteinGoalG

  return (
    <div className="safe-top px-5">
      <header className="pt-3">
        <h1 className="display text-[34px] leading-none text-text">
          {APP_NAME}
          <span className="text-accent">.</span>
        </h1>
        <p className="tnum mt-1 text-xs text-dim">
          {today
            .toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
            .toUpperCase()}
        </p>
      </header>

      {/* Hero gauge rings */}
      <section className="mt-6 grid grid-cols-2 gap-4">
        <Link to="/water" className="press flex flex-col items-center">
          <RingProgress
            progress={waterGoal ? waterIntake / waterGoal : 0}
            size={132}
            stroke={11}
            color={waterIntake >= waterGoal ? 'var(--brass)' : undefined}
          >
            <div>
              <div className="tnum text-[26px] leading-none text-text">{waterIntake}</div>
              <div className="tnum mt-0.5 text-[11px] text-dim">/ {waterGoal} oz</div>
            </div>
          </RingProgress>
          <span className="eyebrow mt-2">Water</span>
        </Link>

        <Link to="/fuel" className="press flex flex-col items-center">
          <RingProgress
            progress={proteinGoal ? protein / proteinGoal : 0}
            size={132}
            stroke={11}
            color={protein >= proteinGoal ? 'var(--brass)' : undefined}
          >
            <div>
              <div className="tnum text-[26px] leading-none text-text">{protein}</div>
              <div className="tnum mt-0.5 text-[11px] text-dim">/ {proteinGoal} g</div>
            </div>
          </RingProgress>
          <span className="eyebrow mt-2">Protein</span>
        </Link>
      </section>

      {/* Day list */}
      <h2 className="eyebrow mt-8">Training week</h2>
      <div className="card mt-3 overflow-hidden">
        {DAYS.map((day, i) => {
          const completed = daysAgoLabel(store.dayCompleted[day.id])
          return (
            <Link
              key={day.id}
              to={`/day/${day.id}`}
              className={`press relative flex items-center gap-3 py-4 pl-5 pr-4 ${
                i > 0 ? 'border-t border-hairline' : ''
              }`}
            >
              <span
                className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                style={{ background: day.tracked ? 'var(--accent)' : 'var(--text-dim)' }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="display text-[17px] leading-tight text-text">
                  {day.title.replace(/^Day \d+ · /, '')}
                </h3>
                <p className="mt-0.5 truncate text-sm text-ink2">{day.focus}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {completed ? (
                  <span className="tnum flex items-center gap-1 text-[11px] text-brass">
                    <Check size={12} /> {completed}
                  </span>
                ) : (
                  <span className="eyebrow">
                    {day.tracked ? `${day.exercises?.length ?? 0} lifts` : 'Freestyle'}
                  </span>
                )}
                <ChevronRight size={18} className="text-dim" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Weekly muscle focus */}
      <h2 className="eyebrow mt-8">This week’s muscle focus</h2>
      <div className="card mt-3 p-5">
        <BodyMap values={WEEK_VALUES} />
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {WEEK_TOP.map(([mu]) => (
            <span
              key={mu}
              className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent"
            >
              {MUSCLE_LABELS[mu]}
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-dim">
          Brighter = more weekly volume. Upper chest leads, by design.
        </p>
      </div>

      <p className="mt-8 text-center text-[11px] text-dim">Tracker, not medical guidance.</p>
    </div>
  )
}
