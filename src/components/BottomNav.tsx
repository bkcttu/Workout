import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Train', icon: '🏋' },
  { to: '/water', label: 'Water', icon: '💧' },
  { to: '/fuel', label: 'Fuel', icon: '🍖' },
  { to: '/reference', label: 'Ref', icon: '📋' },
]

export default function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
