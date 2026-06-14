import { useState } from 'react'
import RingProgress from '../components/RingProgress'
import { useStore } from '../lib/StoreContext'
import { hydrationGoal, todayISO } from '../lib/store'

const CREATINE = 'Creatine 5 g'

export default function Water() {
  const { store, setStore } = useStore()
  const h = store.hydration
  const goal = hydrationGoal(h)
  const intake = h.today.intakeOz
  const met = intake >= goal
  const today = todayISO()
  const [editing, setEditing] = useState(false)

  const addOz = (oz: number) =>
    setStore((s) => ({
      ...s,
      hydration: {
        ...s.hydration,
        today: { ...s.hydration.today, intakeOz: Math.max(0, s.hydration.today.intakeOz + oz) },
      },
    }))

  const toggle = (key: 'trained' | 'sauna') =>
    setStore((s) => ({
      ...s,
      hydration: {
        ...s.hydration,
        today: { ...s.hydration.today, [key]: !s.hydration.today[key] },
      },
    }))

  const setBaseGoal = (oz: number) =>
    setStore((s) => ({ ...s, hydration: { ...s.hydration, baseGoalOz: oz } }))

  const sweating = h.today.trained || h.today.sauna
  const creatineDone =
    h.creatineDoneDate === today || (store.supplementsDone[today]?.includes(CREATINE) ?? false)

  const markCreatine = () =>
    setStore((s) => {
      const done = new Set(s.supplementsDone[today] ?? [])
      done.add(CREATINE)
      return {
        ...s,
        hydration: { ...s.hydration, creatineDoneDate: today },
        supplementsDone: { ...s.supplementsDone, [today]: [...done] },
      }
    })

  const maxHist = Math.max(goal, ...h.history.map((d) => d.goalOz), 1)

  return (
    <div className="safe-top px-4">
      <header className="flex items-center justify-between pt-2">
        <h1 className="display text-3xl text-text">Water</h1>
        <button
          onClick={() => setEditing((e) => !e)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted active:bg-surface"
        >
          {editing ? 'Done' : 'Edit goal'}
        </button>
      </header>

      {editing && (
        <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted">
            Base daily goal (oz)
          </label>
          <input
            inputMode="numeric"
            type="number"
            value={h.baseGoalOz}
            onChange={(e) => setBaseGoal(Math.max(0, Number(e.target.value) || 0))}
            className="tnum mt-2 h-12 w-full rounded-lg border border-border bg-bg px-3 text-lg text-text"
          />
          <p className="mt-2 text-xs text-muted">
            Training adds +{h.trainBonusOz} oz, sauna adds +{h.saunaBonusOz} oz. If your doctor
            gives you a number, put it here.
          </p>
        </div>
      )}

      {/* Ring */}
      <div className="mt-4 grid place-items-center">
        <RingProgress
          progress={goal ? intake / goal : 0}
          size={240}
          stroke={16}
          color={met ? 'var(--brass)' : 'var(--accent)'}
        >
          <div>
            <div className="tnum text-5xl font-bold text-text">{intake}</div>
            <div className="tnum text-sm text-muted">/ {goal} oz</div>
          </div>
        </RingProgress>
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        {intake === 0
          ? `Goal: ${goal} oz. First glass starts now.`
          : met
            ? 'Goal hit. Keep sipping.'
            : `${goal - intake} oz to go.`}
      </p>

      {/* Add buttons */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => addOz(8)}
          className="flex h-20 flex-col items-center justify-center rounded-2xl bg-accent text-bg active:bg-accent-bright"
        >
          <span className="tnum text-2xl font-bold">+8</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide">cup</span>
        </button>
        <button
          onClick={() => addOz(16)}
          className="flex h-20 flex-col items-center justify-center rounded-2xl bg-accent text-bg active:bg-accent-bright"
        >
          <span className="tnum text-2xl font-bold">+16</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide">bottle</span>
        </button>
        <button
          onClick={() => addOz(24)}
          className="flex h-20 flex-col items-center justify-center rounded-2xl bg-accent text-bg active:bg-accent-bright"
        >
          <span className="tnum text-2xl font-bold">+24</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide">big bottle</span>
        </button>
      </div>
      <button
        onClick={() => addOz(-8)}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-surface text-sm font-semibold text-muted active:bg-surface-raised"
      >
        − 8 oz (undo)
      </button>

      {/* Toggles */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => toggle('trained')}
          className={`h-14 rounded-xl border text-sm font-bold uppercase tracking-wide ${
            h.today.trained
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border bg-surface text-muted'
          }`}
        >
          Trained today {h.today.trained ? `+${h.trainBonusOz}` : ''}
        </button>
        <button
          onClick={() => toggle('sauna')}
          className={`h-14 rounded-xl border text-sm font-bold uppercase tracking-wide ${
            h.today.sauna
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border bg-surface text-muted'
          }`}
        >
          Sauna today {h.today.sauna ? `+${h.saunaBonusOz}` : ''}
        </button>
      </div>

      {/* Reminders */}
      {sweating && (
        <div className="mt-3 rounded-xl border border-care/40 bg-care/10 p-3 text-sm text-care">
          Sweating today — add electrolytes or a pinch of salt so the water actually sticks.
        </div>
      )}

      {!creatineDone ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-brass/40 bg-brass/10 p-3">
          <span className="flex-1 text-sm text-brass">
            Take your 5 g creatine with a full glass of water.
          </span>
          <button
            onClick={markCreatine}
            className="rounded-lg bg-brass/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-brass active:bg-brass/30"
          >
            Done
          </button>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-muted">✓ Creatine taken with water today.</p>
      )}

      {/* History strip */}
      <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
        Last 14 days
      </h2>
      <div className="mt-2 flex h-24 items-end gap-1 rounded-2xl border border-border bg-surface p-3">
        {/* today first */}
        {[{ date: today, intakeOz: intake, goalOz: goal }, ...h.history].slice(0, 14).reverse().map(
          (d, i) => {
            const hit = d.intakeOz >= d.goalOz
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${Math.max(4, (d.intakeOz / maxHist) * 100)}%`,
                    background: hit ? 'var(--brass)' : 'var(--accent)',
                  }}
                  title={`${d.date}: ${d.intakeOz}/${d.goalOz} oz`}
                />
              </div>
            )
          },
        )}
      </div>

      <p className="mt-4 text-center text-[11px] text-muted">
        Hydration habit tool, not medical advice. Your iron count & phlebotomy stay with your
        doctor.
      </p>
    </div>
  )
}
