import { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import RingProgress from '../components/RingProgress'
import { CALORIE_NOTE } from '../data/plan'
import { useStore } from '../lib/StoreContext'
import { proteinTotal, todayISO, type FoodEntry } from '../lib/store'

export default function Fuel() {
  const { store, setStore } = useStore()
  const n = store.nutrition
  const goal = n.proteinGoalG
  const eaten = proteinTotal(n)
  const met = eaten >= goal
  const remaining = Math.max(0, goal - eaten)
  const today = todayISO()

  const [showCustom, setShowCustom] = useState(false)
  const [cName, setCName] = useState('')
  const [cProtein, setCProtein] = useState('')
  const [cCalories, setCCalories] = useState('')
  const [showCals, setShowCals] = useState(false)
  const [editGoal, setEditGoal] = useState(false)

  const addEntry = (entry: Omit<FoodEntry, 'ts'>) =>
    setStore((s) => ({
      ...s,
      nutrition: {
        ...s.nutrition,
        today: {
          ...s.nutrition.today,
          entries: [...s.nutrition.today.entries, { ...entry, ts: Date.now() }],
        },
      },
    }))

  const removeEntry = (ts: number) =>
    setStore((s) => ({
      ...s,
      nutrition: {
        ...s.nutrition,
        today: {
          ...s.nutrition.today,
          entries: s.nutrition.today.entries.filter((e) => e.ts !== ts),
        },
      },
    }))

  const setGoal = (g: number) =>
    setStore((s) => ({ ...s, nutrition: { ...s.nutrition, proteinGoalG: g } }))

  const submitCustom = () => {
    const grams = Number(cProtein)
    if (!cName.trim() || !Number.isFinite(grams) || grams <= 0) return
    const cal = Number(cCalories)
    addEntry({
      name: cName.trim(),
      protein: grams,
      calories: showCals && Number.isFinite(cal) && cal > 0 ? cal : undefined,
    })
    setCName('')
    setCProtein('')
    setCCalories('')
    setShowCustom(false)
  }

  const maxHist = Math.max(goal, ...n.history.map((d) => d.proteinG), 1)
  const entries = [...n.today.entries].reverse()

  return (
    <div className="safe-top px-5">
      <header className="flex items-center justify-between pt-3">
        <h1 className="display text-[34px] leading-none text-text">Fuel</h1>
        <button
          onClick={() => setEditGoal((e) => !e)}
          className="press inline-flex items-center gap-1.5 rounded-ctl border border-hairline px-3 py-2 text-xs font-semibold text-ink2"
        >
          <Pencil size={13} /> {editGoal ? 'Done' : 'Goal'}
        </button>
      </header>

      {editGoal && (
        <div className="card mt-4 p-5">
          <label className="eyebrow">Daily protein goal (g)</label>
          <input
            inputMode="numeric"
            type="number"
            value={goal}
            onChange={(e) => setGoal(Math.max(0, Number(e.target.value) || 0))}
            className="tnum mt-2 w-full rounded-none border-0 border-b-2 border-hairline bg-transparent py-1.5 text-2xl text-text focus:border-accent focus:outline-none"
          />
        </div>
      )}

      <div className="mt-6 grid place-items-center">
        <RingProgress progress={goal ? eaten / goal : 0} size={232} stroke={15} color={met ? 'var(--brass)' : undefined}>
          <div>
            <div className="tnum text-[52px] leading-none text-text">{eaten}</div>
            <div className="tnum mt-1 text-sm text-dim">/ {goal} g</div>
          </div>
        </RingProgress>
      </div>

      <p className="mt-3 text-center text-sm text-ink2">
        {eaten === 0
          ? '0 of 200 g. First hit: a shake is 42 right there.'
          : met
            ? '200 g down. Chest fuel handled.'
            : `${remaining} g to go.`}
      </p>

      <h2 className="eyebrow mt-7">Quick add</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {n.staples.map((s) => (
          <button
            key={s.name}
            onClick={() => addEntry({ name: s.name, protein: s.protein, calories: s.calories })}
            className="press flex items-center justify-between gap-2 rounded-card bg-surface-raised p-3 text-left"
          >
            <span className="min-w-0 flex-1 truncate text-sm text-text">{s.name}</span>
            <span className="tnum shrink-0 text-sm font-bold text-accent">+{s.protein}</span>
          </button>
        ))}
      </div>

      {!showCustom ? (
        <button
          onClick={() => setShowCustom(true)}
          className="press mt-2 flex w-full items-center justify-center gap-1.5 rounded-ctl border border-dashed border-hairline py-3 text-sm font-semibold text-dim"
        >
          <Plus size={15} /> Custom entry
        </button>
      ) : (
        <div className="card mt-2 p-4">
          <input
            value={cName}
            onChange={(e) => setCName(e.target.value)}
            placeholder="Food name"
            className="w-full rounded-ctl bg-surface-raised px-3 py-3 text-text placeholder:text-dim focus:outline-none"
          />
          <div className="mt-2 flex gap-2">
            <input
              inputMode="decimal"
              type="number"
              value={cProtein}
              onChange={(e) => setCProtein(e.target.value)}
              placeholder="protein g"
              className="tnum w-full rounded-ctl bg-surface-raised px-3 py-3 text-text placeholder:text-dim focus:outline-none"
            />
            {showCals && (
              <input
                inputMode="numeric"
                type="number"
                value={cCalories}
                onChange={(e) => setCCalories(e.target.value)}
                placeholder="kcal (opt)"
                className="tnum w-full rounded-ctl bg-surface-raised px-3 py-3 text-text placeholder:text-dim focus:outline-none"
              />
            )}
          </div>
          {!showCals && (
            <button onClick={() => setShowCals(true)} className="mt-2 text-xs text-dim underline">
              + add calories (optional)
            </button>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={submitCustom}
              className="press rounded-ctl py-3 text-sm font-bold uppercase tracking-wide text-bg"
              style={{ backgroundImage: 'linear-gradient(180deg, var(--accent-hot), var(--accent))' }}
            >
              Add
            </button>
            <button
              onClick={() => setShowCustom(false)}
              className="press rounded-ctl border border-hairline py-3 text-sm font-semibold text-dim"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <>
          <h2 className="eyebrow mt-7">
            Today · {eaten} g eaten · {remaining} g left
          </h2>
          <div className="card mt-2 overflow-hidden">
            {entries.map((e, i) => (
              <div
                key={e.ts}
                className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-hairline' : ''}`}
              >
                <span className="min-w-0 flex-1 truncate text-sm text-text">{e.name}</span>
                <span className="tnum text-sm font-bold text-text">{e.protein} g</span>
                {e.calories != null && <span className="tnum text-xs text-dim">{e.calories} kcal</span>}
                <button
                  onClick={() => removeEntry(e.ts)}
                  aria-label={`Delete ${e.name}`}
                  className="press grid h-8 w-8 shrink-0 place-items-center rounded-ctl text-dim"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="card mt-5 p-5">
        <p className="text-sm italic text-ink2">{CALORIE_NOTE}</p>
      </div>

      <h2 className="eyebrow mt-7">Last 14 days</h2>
      <div className="card mt-2 flex h-24 items-end gap-1 p-3">
        {[{ date: today, proteinG: eaten }, ...n.history]
          .slice(0, 14)
          .reverse()
          .map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end">
              <div
                className="w-full rounded-sm"
                style={{
                  height: `${Math.max(4, (d.proteinG / maxHist) * 100)}%`,
                  background: d.proteinG >= goal ? 'var(--brass)' : 'var(--accent)',
                }}
                title={`${d.date}: ${d.proteinG} g`}
              />
            </div>
          ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-dim">
        Rough protein values are estimates you can edit. Habit tracker, not a clinical plan.
      </p>
    </div>
  )
}
