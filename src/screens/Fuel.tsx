import { useState } from 'react'
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
    <div className="safe-top px-4">
      <header className="flex items-center justify-between pt-2">
        <h1 className="display text-3xl text-text">Fuel</h1>
        <button
          onClick={() => setEditGoal((e) => !e)}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted active:bg-surface"
        >
          {editGoal ? 'Done' : 'Edit goal'}
        </button>
      </header>

      {editGoal && (
        <div className="mt-3 rounded-2xl border border-border bg-surface p-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted">
            Daily protein goal (g)
          </label>
          <input
            inputMode="numeric"
            type="number"
            value={goal}
            onChange={(e) => setGoal(Math.max(0, Number(e.target.value) || 0))}
            className="tnum mt-2 h-12 w-full rounded-lg border border-border bg-bg px-3 text-lg text-text"
          />
        </div>
      )}

      {/* Ring */}
      <div className="mt-4 grid place-items-center">
        <RingProgress
          progress={goal ? eaten / goal : 0}
          size={240}
          stroke={16}
          color={met ? 'var(--brass)' : 'var(--accent)'}
        >
          <div>
            <div className="tnum text-5xl font-bold text-text">{eaten}</div>
            <div className="tnum text-sm text-muted">/ {goal} g</div>
          </div>
        </RingProgress>
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        {eaten === 0
          ? '0 of 200 g. First hit: a shake is 42 right there.'
          : met
            ? '200 g down. Chest fuel handled.'
            : `${remaining} g to go.`}
      </p>

      {/* Quick-add staples */}
      <h2 className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted">Quick add</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {n.staples.map((s) => (
          <button
            key={s.name}
            onClick={() => addEntry({ name: s.name, protein: s.protein, calories: s.calories })}
            className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface p-3 text-left active:bg-surface-raised"
          >
            <span className="min-w-0 flex-1 truncate text-sm text-text">{s.name}</span>
            <span className="tnum shrink-0 text-sm font-bold text-accent">+{s.protein}</span>
          </button>
        ))}
      </div>

      {/* Custom add */}
      {!showCustom ? (
        <button
          onClick={() => setShowCustom(true)}
          className="mt-2 h-12 w-full rounded-xl border border-dashed border-border text-sm font-semibold text-muted active:bg-surface"
        >
          + Custom entry
        </button>
      ) : (
        <div className="mt-2 rounded-2xl border border-border bg-surface p-3">
          <input
            value={cName}
            onChange={(e) => setCName(e.target.value)}
            placeholder="Food name"
            className="h-12 w-full rounded-lg border border-border bg-bg px-3 text-text"
          />
          <div className="mt-2 flex gap-2">
            <input
              inputMode="decimal"
              type="number"
              value={cProtein}
              onChange={(e) => setCProtein(e.target.value)}
              placeholder="protein g"
              className="tnum h-12 flex-1 rounded-lg border border-border bg-bg px-3 text-text"
            />
            {showCals && (
              <input
                inputMode="numeric"
                type="number"
                value={cCalories}
                onChange={(e) => setCCalories(e.target.value)}
                placeholder="kcal (opt)"
                className="tnum h-12 flex-1 rounded-lg border border-border bg-bg px-3 text-text"
              />
            )}
          </div>
          {!showCals && (
            <button
              onClick={() => setShowCals(true)}
              className="mt-2 text-xs text-muted underline"
            >
              + add calories (optional)
            </button>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={submitCustom}
              className="h-12 flex-1 rounded-xl bg-accent text-sm font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
            >
              Add
            </button>
            <button
              onClick={() => setShowCustom(false)}
              className="h-12 flex-1 rounded-xl border border-border bg-surface-raised text-sm font-semibold text-muted active:bg-bg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Today's entries */}
      {entries.length > 0 && (
        <>
          <h2 className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted">
            Today · {eaten} g eaten · {remaining} g left
          </h2>
          <div className="mt-2 space-y-1.5">
            {entries.map((e) => (
              <div
                key={e.ts}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-text">{e.name}</span>
                <span className="tnum text-sm font-bold text-text">{e.protein} g</span>
                {e.calories != null && (
                  <span className="tnum text-xs text-muted">{e.calories} kcal</span>
                )}
                <button
                  onClick={() => removeEntry(e.ts)}
                  aria-label={`Delete ${e.name}`}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-muted active:bg-surface-raised"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Calorie note */}
      <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm italic text-muted">{CALORIE_NOTE}</p>
      </div>

      {/* History strip */}
      <h2 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted">
        Last 14 days
      </h2>
      <div className="mt-2 flex h-24 items-end gap-1 rounded-2xl border border-border bg-surface p-3">
        {[{ date: today, proteinG: eaten }, ...n.history]
          .slice(0, 14)
          .reverse()
          .map((d, i) => {
            const hit = d.proteinG >= goal
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${Math.max(4, (d.proteinG / maxHist) * 100)}%`,
                    background: hit ? 'var(--brass)' : 'var(--accent)',
                  }}
                  title={`${d.date}: ${d.proteinG} g`}
                />
              </div>
            )
          })}
      </div>

      <p className="mt-4 text-center text-[11px] text-muted">
        Rough protein values are estimates you can edit. Habit tracker, not a clinical plan.
      </p>
    </div>
  )
}
