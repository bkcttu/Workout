import { Link } from 'react-router-dom'
import { APP_NAME, DAYS } from '../data/plan'
import { useStore } from '../lib/StoreContext'
import { hydrationGoal, prettyDate, proteinTotal, todayISO } from '../lib/store'
import RingProgress from '../components/RingProgress'

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
    <div className="safe-top px-4">
      <header className="flex items-end justify-between pt-2">
        <div>
          <h1 className="display text-4xl text-text">
            {APP_NAME}
            <span className="text-accent">.</span>
          </h1>
          <p className="text-sm text-muted">
            {today.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </header>

      {/* compact rings */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/water"
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 active:bg-surface-raised"
        >
          <RingProgress
            progress={waterGoal ? waterIntake / waterGoal : 0}
            size={56}
            stroke={6}
            color={waterIntake >= waterGoal ? 'var(--brass)' : 'var(--accent)'}
          >
            <span className="text-base leading-none">💧</span>
          </RingProgress>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted">
              Water
            </div>
            <div className="tnum text-sm text-text">
              {waterIntake}
              <span className="text-muted">/{waterGoal} oz</span>
            </div>
          </div>
        </Link>

        <Link
          to="/fuel"
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 active:bg-surface-raised"
        >
          <RingProgress
            progress={proteinGoal ? protein / proteinGoal : 0}
            size={56}
            stroke={6}
            color={protein >= proteinGoal ? 'var(--brass)' : 'var(--accent)'}
          >
            <span className="text-base leading-none">🍖</span>
          </RingProgress>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted">
              Protein
            </div>
            <div className="tnum text-sm text-text">
              {protein}
              <span className="text-muted">/{proteinGoal} g</span>
            </div>
          </div>
        </Link>
      </div>

      {/* day cards */}
      <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
        Training week
      </h2>
      <div className="mt-2 space-y-3">
        {DAYS.map((day) => {
          const completed = daysAgoLabel(store.dayCompleted[day.id])
          return (
            <Link
              key={day.id}
              to={`/day/${day.id}`}
              className="block rounded-2xl border border-border bg-surface p-4 active:bg-surface-raised"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="display text-lg leading-tight text-text">{day.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">{day.focus}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {!day.tracked && (
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Freestyle
                    </span>
                  )}
                  {completed && (
                    <span className="tnum rounded-full bg-brass/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brass">
                      ✓ {completed}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">
                {day.tracked
                  ? `${day.exercises?.length ?? 0} exercises`
                  : `${day.checklist?.length ?? 0} items`}
              </p>
            </Link>
          )
        })}
      </div>

      <Link
        to="/reference"
        className="mt-4 block rounded-2xl border border-border bg-surface p-3 text-center text-sm font-semibold text-muted active:bg-surface-raised"
      >
        Reference · Nutrition & Supplements →
      </Link>

      <p className="mt-6 text-center text-[11px] text-muted">
        Tracker, not medical guidance.
      </p>
    </div>
  )
}
