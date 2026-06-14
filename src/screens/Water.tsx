import { useState } from 'react'
import { Pencil } from 'lucide-react'
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
      hydration: { ...s.hydration, today: { ...s.hydration.today, [key]: !s.hydration.today[key] } },
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
  const addBtns: [number, string][] = [
    [8, 'cup'],
    [16, 'bottle'],
    [24, 'big'],
  ]

  return (
    <div className="safe-top px-5">
      <header className="flex items-center justify-between pt-3">
        <h1 className="display text-[34px] leading-none text-text">Water</h1>
        <button
          onClick={() => setEditing((e) => !e)}
          className="press inline-flex items-center gap-1.5 rounded-ctl border border-hairline px-3 py-2 text-xs font-semibold text-ink2"
        >
          <Pencil size={13} /> {editing ? 'Done' : 'Goal'}
        </button>
      </header>

      {editing && (
        <div className="card mt-4 p-5">
          <label className="eyebrow">Base daily goal (oz)</label>
          <input
            inputMode="numeric"
            type="number"
            value={h.baseGoalOz}
            onChange={(e) => setBaseGoal(Math.max(0, Number(e.target.value) || 0))}
            className="tnum mt-2 w-full rounded-none border-0 border-b-2 border-hairline bg-transparent py-1.5 text-2xl text-text focus:border-accent focus:outline-none"
          />
          <p className="mt-2 text-xs text-dim">
            Training adds +{h.trainBonusOz} oz, sauna adds +{h.saunaBonusOz} oz. If your doctor gives
            you a number, put it here.
          </p>
        </div>
      )}

      <div className="mt-6 grid place-items-center">
        <RingProgress progress={goal ? intake / goal : 0} size={232} stroke={15} color={met ? 'var(--brass)' : undefined}>
          <div>
            <div className="tnum text-[52px] leading-none text-text">{intake}</div>
            <div className="tnum mt-1 text-sm text-dim">/ {goal} oz</div>
          </div>
        </RingProgress>
      </div>

      <p className="mt-3 text-center text-sm text-ink2">
        {intake === 0
          ? `Goal: ${goal} oz. First glass starts now.`
          : met
            ? 'Goal hit. Keep sipping.'
            : `${goal - intake} oz to go.`}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {addBtns.map(([oz, label]) => (
          <button
            key={oz}
            onClick={() => addOz(oz)}
            className="press flex flex-col items-center justify-center rounded-card bg-surface-raised py-4 shadow-lift"
          >
            <span className="tnum text-2xl text-accent">+{oz}</span>
            <span className="eyebrow mt-0.5">{label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => addOz(-8)}
        className="press mt-2 w-full rounded-ctl border border-hairline py-2.5 text-sm font-semibold text-dim"
      >
        − 8 oz (undo)
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {(['trained', 'sauna'] as const).map((k) => {
          const on = h.today[k]
          const bonus = k === 'trained' ? h.trainBonusOz : h.saunaBonusOz
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              className={`press rounded-card py-4 text-sm font-bold uppercase tracking-wide ${
                on ? 'bg-accent/15 text-accent' : 'bg-surface-raised text-dim'
              }`}
            >
              {k === 'trained' ? 'Trained' : 'Sauna'} {on ? `+${bonus}` : ''}
            </button>
          )
        })}
      </div>

      {sweating && (
        <div className="mt-3 rounded-card bg-care/10 p-4 text-sm text-care">
          Sweating today — add electrolytes or a pinch of salt so the water actually sticks.
        </div>
      )}

      {!creatineDone ? (
        <div className="mt-3 flex items-center gap-3 rounded-card bg-brass/10 p-4">
          <span className="flex-1 text-sm text-brass">
            Take your 5 g creatine with a full glass of water.
          </span>
          <button
            onClick={markCreatine}
            className="press rounded-ctl bg-brass/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-brass"
          >
            Done
          </button>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-dim">✓ Creatine taken with water today.</p>
      )}

      <h2 className="eyebrow mt-8">Last 14 days</h2>
      <div className="card mt-2 flex h-24 items-end gap-1 p-3">
        {[{ date: today, intakeOz: intake, goalOz: goal }, ...h.history]
          .slice(0, 14)
          .reverse()
          .map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max(4, (d.intakeOz / maxHist) * 100)}%`,
                  background: d.intakeOz >= d.goalOz ? 'var(--brass)' : 'var(--accent)',
                }}
                title={`${d.date}: ${d.intakeOz}/${d.goalOz} oz`}
              />
            </div>
          ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-dim">
        Hydration habit tool, not medical advice. Your iron count & phlebotomy stay with your doctor.
      </p>
    </div>
  )
}
