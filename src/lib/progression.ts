// Per-week starting-weight plan, loaded from forge_progression.json and matched
// by day title + exercise name (case/whitespace-normalized). Week 1 = baseline
// (no pre-fill). Drives input pre-fill on the Day screen; never mutates history.
import data from '../data/forge_progression.json'

type WeekPlan = { sets: (number | null)[]; note?: string }
type ExercisePlan = { day: string; name: string; weeks: Record<string, WeekPlan> }

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
const key = (day: string, name: string) => `${norm(day)}|${norm(name)}`

const INDEX = new Map<string, ExercisePlan>()
try {
  ;(data.exercises as ExercisePlan[]).forEach((e) => INDEX.set(key(e.day, e.name), e))
} catch {
  /* malformed data file — fall back to no plan */
}

export const PROGRESSION_DEFAULT_WEEK: number =
  typeof (data as { defaultWeek?: number }).defaultWeek === 'number'
    ? (data as { defaultWeek: number }).defaultWeek
    : 2

export const MIN_WEEK = 1
export const MAX_WEEK = 4

// Returns the planned sets + note for a given exercise & week, or null if there
// is no match or the week has no plan (week 1, missing exercise, etc.).
export function planFor(dayTitle: string, exName: string, week: number): WeekPlan | null {
  if (week <= 1) return null
  const e = INDEX.get(key(dayTitle, exName))
  if (!e) return null
  return e.weeks[String(week)] ?? null
}
