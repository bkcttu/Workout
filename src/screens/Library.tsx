import { useMemo, useState } from 'react'
import { ChevronDown, Play } from 'lucide-react'
import { DAYS, MUSCLE_LABELS, type Exercise, type MuscleId } from '../data/plan'
import BodyMap, { bestView } from '../components/BodyMap'

type Part = 'All' | 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs'

const PART_OF: Record<MuscleId, Exclude<Part, 'All'>> = {
  'upper-chest': 'Chest',
  chest: 'Chest',
  lats: 'Back',
  'mid-back': 'Back',
  traps: 'Back',
  'rear-delts': 'Back',
  'front-delts': 'Shoulders',
  'side-delts': 'Shoulders',
  biceps: 'Arms',
  triceps: 'Arms',
  forearms: 'Arms',
  abs: 'Core',
  obliques: 'Core',
  'lower-back': 'Core',
  quads: 'Legs',
  hamstrings: 'Legs',
  glutes: 'Legs',
  calves: 'Legs',
  adductors: 'Legs',
}

const PARTS: Part[] = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs']

// All tracked exercises, plus which day(s) they live in.
const CATALOG: { ex: Exercise; days: string[]; part: Part }[] = (() => {
  const map = new Map<string, { ex: Exercise; days: string[]; part: Part }>()
  DAYS.forEach((d) =>
    d.exercises?.forEach((ex) => {
      const part = ex.muscles ? PART_OF[ex.muscles.primary[0]] : 'Core'
      const dayShort = d.title.replace(/ · .*/, '')
      const existing = map.get(ex.id)
      if (existing) existing.days.push(dayShort)
      else map.set(ex.id, { ex, days: [dayShort], part })
    }),
  )
  return [...map.values()]
})()

function values(ex: Exercise): Partial<Record<MuscleId, number>> {
  const v: Partial<Record<MuscleId, number>> = {}
  ex.muscles?.secondary?.forEach((mu) => (v[mu] = 0.5))
  ex.muscles?.primary.forEach((mu) => (v[mu] = 1))
  return v
}

function Item({ entry }: { entry: (typeof CATALOG)[number] }) {
  const [open, setOpen] = useState(false)
  const { ex, days } = entry
  const primary = ex.muscles?.primary ?? []
  const secondary = ex.muscles?.secondary ?? []

  return (
    <div className="px-4">
      <button onClick={() => setOpen((o) => !o)} className="press flex w-full items-center gap-3 py-3 text-left">
        {ex.muscles && (
          <div className="shrink-0">
            <BodyMap values={values(ex)} view={bestView(ex.muscles.primary)} size={38} showLabels={false} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="display text-[15px] leading-tight text-text">
            {ex.name.replace(/ \(optional finisher\)/, '')}
          </h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {primary.map((mu) => (
              <span key={mu} className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                {MUSCLE_LABELS[mu]}
              </span>
            ))}
          </div>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-dim ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="pb-4">
          {ex.equipment && (
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-brass">
              <span aria-hidden>🛠</span> {ex.equipment}
            </p>
          )}
          {ex.why && <p className="mb-3 text-sm italic text-ink2">{ex.why}</p>}
          <ul className="space-y-2">
            {ex.form.map((fp, i) => (
              <li key={i} className={`flex gap-2 text-sm ${fp.care ? 'font-medium text-care' : 'text-text'}`}>
                <span className="shrink-0">{fp.care ? '⚠️' : '·'}</span>
                <span>{fp.text}</span>
              </li>
            ))}
          </ul>
          {secondary.length > 0 && (
            <p className="mt-3 text-xs text-dim">
              Secondary: {secondary.map((mu) => MUSCLE_LABELS[mu]).join(', ')}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="eyebrow">In: {days.join(' · ')}</span>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                ex.name.replace(/\(.*?\)/g, '').trim() + ' exercise technique',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center gap-1.5 rounded-ctl border border-hairline px-3 py-1.5 text-xs font-semibold text-text"
            >
              <Play size={13} /> Demo
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Library() {
  const [part, setPart] = useState<Part>('All')
  const list = useMemo(
    () => (part === 'All' ? CATALOG : CATALOG.filter((e) => e.part === part)),
    [part],
  )

  return (
    <div className="safe-top px-5">
      <h1 className="display pt-3 text-[34px] leading-none text-text">Library</h1>
      <p className="eyebrow mt-1">{CATALOG.length} movements in your program</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PARTS.map((p) => (
          <button
            key={p}
            onClick={() => setPart(p)}
            className={`press rounded-full px-3 py-1.5 text-xs font-semibold ${
              part === p ? 'bg-accent text-bg' : 'bg-surface-raised text-ink2'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="card mt-4 overflow-hidden">
        {list.map((entry, i) => (
          <div key={entry.ex.id} className={i > 0 ? 'border-t border-hairline' : ''}>
            <Item entry={entry} />
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-dim">
        Your full movement catalog. Tap any lift for cues, muscles worked, and a demo.
      </p>
    </div>
  )
}
