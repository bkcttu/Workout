// ============================================================================
// FORGE persistence — single versioned localStorage key, defensive reads.
// ============================================================================

import {
  HYDRATION_DEFAULTS,
  PROTEIN_GOAL_G,
  PROTEIN_STAPLES,
  type Staple,
} from '../data/plan'
import { PROGRESSION_DEFAULT_WEEK } from './progression'

const KEY = 'forge.v1'

export type SetLog = { weight: number | null; reps: number | null; done: boolean }
export type Session = { date: string; sets: SetLog[] }

export type HydrationDay = {
  date: string
  intakeOz: number
  trained: boolean
  sauna: boolean
}
export type Hydration = {
  baseGoalOz: number
  trainBonusOz: number
  saunaBonusOz: number
  today: HydrationDay
  history: { date: string; intakeOz: number; goalOz: number }[] // last ~14
  creatineDoneDate?: string // ISO date the creatine nudge was satisfied
}

export type FoodEntry = { name: string; protein: number; calories?: number; ts: number }
export type Nutrition = {
  proteinGoalG: number
  staples: Staple[]
  today: { date: string; entries: FoodEntry[] }
  history: { date: string; proteinG: number }[] // last ~14
}

export type Store = {
  version: 1
  history: Record<string /*exerciseId*/, Session[]> // newest first, cap ~10
  dayCompleted: Record<string /*dayId*/, string /*ISO date*/>
  bodyweight: { date: string; lbs: number }[]
  supplementsDone: Record<string /*ISO date*/, string[]> // checked supplement names per day
  programWeek: number // current plan week (1–4) driving weight pre-fill
  hydration: Hydration
  nutrition: Nutrition
}

// --- date helpers (local time) ---------------------------------------------

export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function prettyDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

// --- defaults ---------------------------------------------------------------

function defaultHydration(): Hydration {
  return {
    baseGoalOz: HYDRATION_DEFAULTS.baseGoalOz,
    trainBonusOz: HYDRATION_DEFAULTS.trainBonusOz,
    saunaBonusOz: HYDRATION_DEFAULTS.saunaBonusOz,
    today: { date: todayISO(), intakeOz: 0, trained: false, sauna: false },
    history: [],
  }
}

function defaultNutrition(): Nutrition {
  return {
    proteinGoalG: PROTEIN_GOAL_G,
    staples: PROTEIN_STAPLES.map((s) => ({ ...s })),
    today: { date: todayISO(), entries: [] },
    history: [],
  }
}

export function defaultStore(): Store {
  return {
    version: 1,
    history: {},
    dayCompleted: {},
    bodyweight: [],
    supplementsDone: {},
    programWeek: PROGRESSION_DEFAULT_WEEK,
    hydration: defaultHydration(),
    nutrition: defaultNutrition(),
  }
}

// --- load / save ------------------------------------------------------------

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw) as Partial<Store>
    // Merge over defaults so newly added fields never crash older saves.
    const base = defaultStore()
    return {
      ...base,
      ...parsed,
      history: parsed.history ?? base.history,
      dayCompleted: parsed.dayCompleted ?? base.dayCompleted,
      bodyweight: parsed.bodyweight ?? base.bodyweight,
      supplementsDone: parsed.supplementsDone ?? base.supplementsDone,
      programWeek:
        typeof parsed.programWeek === 'number' ? parsed.programWeek : base.programWeek,
      hydration: { ...base.hydration, ...(parsed.hydration ?? {}) },
      nutrition: {
        ...base.nutrition,
        ...(parsed.nutrition ?? {}),
        staples: parsed.nutrition?.staples?.length
          ? parsed.nutrition.staples
          : base.nutrition.staples,
      },
    }
  } catch (err) {
    console.warn('FORGE: failed to load store, using defaults.', err)
    return defaultStore()
  }
}

let writeTimer: ReturnType<typeof setTimeout> | null = null
export function saveStore(store: Store): void {
  if (writeTimer) clearTimeout(writeTimer)
  writeTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(store))
    } catch (err) {
      console.warn('FORGE: failed to save store.', err)
    }
  }, 300)
}

// --- daily rollover ---------------------------------------------------------

// Returns a store with hydration/nutrition rolled to today if the date changed.
// Pushes the finished day into history (capped at 14) before resetting.
export function rollDaily(store: Store): Store {
  const today = todayISO()
  let changed = false
  const next: Store = { ...store }

  if (store.hydration.today.date !== today) {
    const h = store.hydration
    const goalOz =
      h.baseGoalOz + (h.today.trained ? h.trainBonusOz : 0) + (h.today.sauna ? h.saunaBonusOz : 0)
    const history = [
      { date: h.today.date, intakeOz: h.today.intakeOz, goalOz },
      ...h.history.filter((x) => x.date !== h.today.date),
    ].slice(0, 14)
    next.hydration = {
      ...h,
      today: { date: today, intakeOz: 0, trained: false, sauna: false },
      history,
    }
    changed = true
  }

  if (store.nutrition.today.date !== today) {
    const n = store.nutrition
    const proteinG = n.today.entries.reduce((s, e) => s + e.protein, 0)
    const history = [
      { date: n.today.date, proteinG },
      ...n.history.filter((x) => x.date !== n.today.date),
    ].slice(0, 14)
    next.nutrition = { ...n, today: { date: today, entries: [] }, history }
    changed = true
  }

  return changed ? next : store
}

// --- derived helpers --------------------------------------------------------

export function hydrationGoal(h: Hydration): number {
  return (
    h.baseGoalOz + (h.today.trained ? h.trainBonusOz : 0) + (h.today.sauna ? h.saunaBonusOz : 0)
  )
}

export function proteinTotal(n: Nutrition): number {
  return n.today.entries.reduce((s, e) => s + e.protein, 0)
}

// Most recent session for an exercise, or null.
export function lastSession(store: Store, exerciseId: string): Session | null {
  const list = store.history[exerciseId]
  return list && list.length ? list[0] : null
}

// Today's in-progress session for an exercise, if one exists.
export function todaySessionOf(store: Store, exerciseId: string): Session | null {
  const s = lastSession(store, exerciseId)
  return s && s.date === todayISO() ? s : null
}

// The most recent *previous* (not-today) session — drives the "last time" hint.
export function prevSessionOf(store: Store, exerciseId: string): Session | null {
  const list = store.history[exerciseId] ?? []
  const today = todayISO()
  return list.find((s) => s.date !== today) ?? null
}

// Upsert today's session for an exercise, keeping newest-first, capped at 10.
export function writeSession(store: Store, exerciseId: string, sets: SetLog[]): Store {
  const today = todayISO()
  const list = store.history[exerciseId] ?? []
  const withoutToday = list.filter((s) => s.date !== today)
  const next = [{ date: today, sets }, ...withoutToday].slice(0, 10)
  return { ...store, history: { ...store.history, [exerciseId]: next } }
}
