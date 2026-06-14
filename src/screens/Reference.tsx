import { useRef, useState } from 'react'
import { Check, Download, Upload } from 'lucide-react'
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
      bodyweight: [{ date: today, lbs }, ...s.bodyweight.filter((b) => b.date !== today)].slice(0, 60),
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
    <div className="safe-top px-5">
      <h1 className="display pt-3 text-[34px] leading-none text-text">Reference</h1>

      <section className="card mt-6 p-5">
        <h2 className="eyebrow text-accent">Nutrition target</h2>
        <p className="mt-2 text-base font-semibold text-text">{NUTRITION_TARGET.headline}</p>
        <p className="mt-1 text-sm text-ink2">{NUTRITION_TARGET.detail}</p>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="eyebrow text-accent">Easy 200 g protein template</h2>
        <ul className="mt-3 space-y-2">
          {PROTEIN_TEMPLATE.map((line, i) => (
            <li key={i} className="text-sm text-text">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="eyebrow text-accent">Bodyweight (calorie gauge)</h2>
        <div className="mt-3 flex items-end gap-3">
          <input
            inputMode="decimal"
            type="number"
            value={bw}
            onChange={(e) => setBw(e.target.value)}
            placeholder="lbs"
            className="tnum w-full rounded-none border-0 border-b-2 border-hairline bg-transparent py-1.5 text-2xl text-text placeholder:text-dim focus:border-accent focus:outline-none"
          />
          <button
            onClick={logBw}
            className="press shrink-0 rounded-ctl px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-bg"
            style={{ backgroundImage: 'linear-gradient(180deg, var(--accent-hot), var(--accent))' }}
          >
            Log
          </button>
        </div>
        {recentBw.length > 0 && (
          <div className="tnum mt-3 space-y-1 text-sm">
            {recentBw.map((b) => (
              <div key={b.date} className="flex justify-between text-dim">
                <span>{b.date}</span>
                <span className="text-text">{b.lbs} lbs</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card mt-4 p-5">
        <h2 className="eyebrow text-accent">Daily supplement checklist</h2>
        <div className="mt-2 -mx-2">
          {SUPPLEMENTS.map((name) => {
            const done = doneToday.includes(name)
            return (
              <button
                key={name}
                onClick={() => toggleSupp(name)}
                className="press flex w-full items-center gap-3 rounded-ctl px-2 py-2.5 text-left"
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                    done ? 'text-bg' : 'border border-hairline text-dim'
                  }`}
                  style={done ? { background: 'var(--brass)' } : undefined}
                >
                  {done ? <Check size={15} /> : ''}
                </span>
                <span className={done ? 'text-dim line-through' : 'text-text'}>{name}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[11px] text-dim">Check-off only — no dosing advice.</p>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="eyebrow text-accent">Gym equipment</h2>
        <div className="mt-3 space-y-4">
          {EQUIPMENT_INVENTORY.map((group) => (
            <div key={group.category}>
              <h3 className="eyebrow">{group.category}</h3>
              <ul className="mt-1.5 space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text">
                    <span className="shrink-0 text-brass">🛠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-4 p-5">
        <h2 className="eyebrow text-accent">Backup & restore</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={exportData}
            className="press flex items-center justify-center gap-1.5 rounded-ctl border border-hairline py-3 text-sm font-semibold text-text"
          >
            <Download size={15} /> Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="press flex items-center justify-center gap-1.5 rounded-ctl border border-hairline py-3 text-sm font-semibold text-text"
          >
            <Upload size={15} /> Import
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

      <p className="mt-6 text-center text-[11px] text-dim">{MEDICAL_DISCLAIMER}</p>
      <p className="tnum mt-2 text-center text-[10px] text-dim">FORGE · build {__BUILD_ID__}</p>
    </div>
  )
}
