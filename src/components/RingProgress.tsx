import { useId } from 'react'
import type { ReactNode } from 'react'

type Props = {
  /** 0..1 fill fraction */
  progress: number
  size?: number
  stroke?: number
  /** solid arc color override; when omitted, uses the molten gradient */
  color?: string
  /** track (unfilled) color */
  track?: string
  children?: ReactNode
  className?: string
}

export default function RingProgress({
  progress,
  size = 220,
  stroke = 14,
  color,
  track = 'var(--surface-raised)',
  children,
  className,
}: Props) {
  const id = useId().replace(/:/g, '')
  const clamped = Math.max(0, Math.min(1, progress))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - clamped)
  const arc = color ?? `url(#grad-${id})`

  return (
    <div className={`relative inline-grid place-items-center ${className ?? ''}`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-hot)" />
            <stop offset="70%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--brass)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={arc}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.45s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
