import { NavLink } from 'react-router-dom'
import { Dumbbell, LayoutGrid, Beef, Droplets, ClipboardList } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Today', icon: Dumbbell },
  { to: '/library', label: 'Library', icon: LayoutGrid },
  { to: '/fuel', label: 'Fuel', icon: Beef },
  { to: '/water', label: 'Water', icon: Droplets },
  { to: '/reference', label: 'Ref', icon: ClipboardList },
]

export default function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 bg-bg/85 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-hairline" />
      <div className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `flex h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-dim'
                }`
              }
            >
              <Icon size={22} strokeWidth={2} />
              <span className="tracking-wide">{t.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
