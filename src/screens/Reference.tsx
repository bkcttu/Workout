import { useRef, useState } from 'react'
import {
  EQUIPMENT_INVENTORY,
  MEDICAL_DISCLAIMER,
  NUTRITION_TARGET,
  PROTEIN_TEMPLATE,
  SUPPLEMENTS,
} from '../data/plan'
import { useStore } from '../lib/StoreContext'
import { defaultStore, todayISO, type Store } from '../lib/store'

export default function Reference() {
  const { store, setStore } = useStore()
  const today = todayISO()
  const doneToday = store.supplementsDone[today] ?? []
  const [bw, setBw] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const toggleSupp = (name: string) =>
    setStore((s) => {
      const set = new Set(s.supplementsDone[today] ?? [])
      if (set.has(name)) set.delete(name)
      else set.add(name)
      return { ...s, supplementsDone: { ...s.supplementsDone, [today]: [...set] } }
    })

  const logBw = () => {
    const lbs = Number(bw)
    if (!Number.isFinite(lbs) || lbs <= 0) return
    setStore((s) => ({
      ...s,
      bodyweight: [
        { date: today, lbs },
        ...s.bodyweight.filter((b) => b.date !== today),
      ].slice(0, 60),
    }))
    setBw('')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forge-backup-${today}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Backup downloaded.')
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Partial<Store>
        if (data.version !== 1) throw new Error('Unrecognized file version')
        setStore(() => ({ ...defaultStore(), ...(data as Store) }))
        setMsg('Backup restored.')
      } catch {
        setMsg('Import failed — not a valid FORGE backup.')
      }
    }
    reader.readAsText(file)
  }

  const recentBw = store.bodyweight.slice(0, 5)

  return (
    <div className="safe-top px-4">
      <h1 className="display pt-2 text-3xl text-text">Reference</h1>

      {/* Nutrition target */}
      <section className="mt-4 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Nutrition target
        </h2>
        <p className="mt-2 text-base font-bold text-text">{NUTRITION_TARGET.headline}</p>
        <p className="mt-1 text-sm text-muted">{NUTRITION_TARGET.detail}</p>
      </section>

      {/* Protein template */}
      <section className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Easy 200 g protein template
        </h2>
        <ul className="mt-2 space-y-1.5">
          {PROTEIN_TEMPLATE.map((line, i) => (
            <li key={i} className="text-sm text-text">
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* Bodyweight quick-log */}
      <section className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Bodyweight (calorie gauge)
        </h2>
        <div className="mt-2 flex gap-2">
          <input
            inputMode="decimal"
            type="number"
            value={bw}
            onChange={(e) => setBw(e.target.value)}
            placeholder="lbs"
            className="tnum h-12 flex-1 rounded-lg border border-border bg-bg px-3 text-lg text-text"
          />
          <button
            onClick={logBw}
            className="h-12 rounded-xl bg-accent px-5 text-sm font-bold uppercase tracking-wide text-bg active:bg-accent-bright"
          >
            Log
          </button>
        </div>
        {recentBw.length > 0 && (
          <div className="tnum mt-3 space-y-1 text-sm">
            {recentBw.map((b) => (
              <div key={b.date} className="flex justify-between text-muted">
                <span>{b.date}</span>
                <span className="text-text">{b.lbs} lbs</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Supplement checklist */}
      <section className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Daily supplement checklist
        </h2>
        <div className="mt-2 space-y-1">
          {SUPPLEMENTS.map((name) => {
            const done = doneToday.includes(name)
            return (
              <button
                key={name}
                onClick={() => toggleSupp(name)}
                className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left active:bg-surface-raised"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border text-sm ${
                    done ? 'border-brass bg-brass/20 text-brass' : 'border-border text-muted'
                  }`}
                >
                  {done ? '✓' : ''}
                </span>
                <span className={done ? 'text-muted line-through' : 'text-text'}>{name}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted">Check-off only — no dosing advice.</p>
      </section>

      {/* Equipment inventory */}
      <section className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Gym equipment
        </h2>
        <ul className="mt-2 space-y-1.5">
          {EQUIPMENT_INVENTORY.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-text">
              <span className="shrink-0 text-brass">🛠</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-muted">
          The full kit the program draws on. Each exercise lists the exact bar/attachment to grab.
        </p>
      </section>

      {/* Backup */}
      <section className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Backup & restore
        </h2>
        <div className="mt-2 flex gap-2">
          <button
            onClick={exportData}
            className="h-12 flex-1 rounded-xl border border-border bg-surface-raised text-sm font-semibold text-text active:bg-bg"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="h-12 flex-1 rounded-xl border border-border bg-surface-raised text-sm font-semibold text-text active:bg-bg"
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importData(f)
              e.target.value = ''
            }}
          />
        </div>
        {msg && <p className="mt-2 text-xs text-brass">{msg}</p>}
      </section>

      <p className="mt-4 text-center text-[11px] text-muted">{MEDICAL_DISCLAIMER}</p>
    </div>
  )
}
