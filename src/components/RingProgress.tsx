import type { ReactNode } from 'react'

type Props = {
  /** 0..1 fill fraction */
  progress: number
  size?: number
  stroke?: number
  /** color of the progress arc */
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
  color = 'var(--accent)',
  track = 'var(--border)',
  children,
  className,
}: Props) {
  const clamped = Math.max(0, Math.min(1, progress))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - clamped)

  return (
    <div className={`relative inline-grid place-items-center ${className ?? ''}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
