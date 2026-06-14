import type { MuscleId } from '../data/plan'

type Props = {
  /** muscle id -> activation intensity 0..1 */
  values: Partial<Record<MuscleId, number>>
  /** width of each (front/back) figure in px */
  size?: number
}

const BASE = '#2b241d'
const STROKE = '#4a4036'

export default function BodyMap({ values, size = 110 }: Props) {
  const op = (id: MuscleId) => {
    const v = values[id] ?? 0
    if (v <= 0) return 0
    return Math.min(1, 0.3 + 0.65 * v)
  }
  const m = (id: MuscleId) => ({ fill: 'var(--accent)', fillOpacity: op(id), stroke: 'none' })

  const Silhouette = () => (
    <g fill={BASE} stroke={STROKE} strokeWidth={0.8}>
      <circle cx="60" cy="16" r="11" />
      <rect x="52" y="25" width="16" height="8" />
      <path d="M38 33 h44 a8 8 0 0 1 8 8 v34 a10 10 0 0 1 -6 9 l-2 16 h-40 l-2 -16 a10 10 0 0 1 -6 -9 v-34 a8 8 0 0 1 8 -8 z" />
      <rect x="22" y="36" width="11" height="42" rx="5" />
      <rect x="20" y="76" width="10" height="40" rx="5" />
      <rect x="87" y="36" width="11" height="42" rx="5" />
      <rect x="90" y="76" width="10" height="40" rx="5" />
      <rect x="42" y="98" width="36" height="16" rx="6" />
      <rect x="44" y="112" width="15" height="52" rx="7" />
      <rect x="45" y="160" width="13" height="42" rx="6" />
      <rect x="61" y="112" width="15" height="52" rx="7" />
      <rect x="62" y="160" width="13" height="42" rx="6" />
    </g>
  )

  return (
    <div className="flex items-end justify-center gap-3">
      <figure className="m-0 flex flex-col items-center gap-1">
        <svg width={size} viewBox="0 0 120 210" role="img" aria-label="Front view muscles">
          <Silhouette />
          <g>
            <ellipse cx="35" cy="40" rx="8" ry="7" {...m('front-delts')} />
            <ellipse cx="85" cy="40" rx="8" ry="7" {...m('front-delts')} />
            <ellipse cx="28" cy="45" rx="5" ry="6" {...m('side-delts')} />
            <ellipse cx="92" cy="45" rx="5" ry="6" {...m('side-delts')} />
            <rect x="42" y="39" width="16" height="8" rx="3" {...m('upper-chest')} />
            <rect x="62" y="39" width="16" height="8" rx="3" {...m('upper-chest')} />
            <rect x="42" y="48" width="16" height="12" rx="3" {...m('chest')} />
            <rect x="62" y="48" width="16" height="12" rx="3" {...m('chest')} />
            <ellipse cx="29" cy="62" rx="5" ry="11" {...m('biceps')} />
            <ellipse cx="91" cy="62" rx="5" ry="11" {...m('biceps')} />
            <ellipse cx="26" cy="96" rx="5" ry="14" {...m('forearms')} />
            <ellipse cx="94" cy="96" rx="5" ry="14" {...m('forearms')} />
            <rect x="52" y="61" width="16" height="34" rx="4" {...m('abs')} />
            <ellipse cx="47" cy="76" rx="4" ry="12" {...m('obliques')} />
            <ellipse cx="73" cy="76" rx="4" ry="12" {...m('obliques')} />
            <ellipse cx="51" cy="138" rx="7" ry="22" {...m('quads')} />
            <ellipse cx="69" cy="138" rx="7" ry="22" {...m('quads')} />
            <ellipse cx="56" cy="134" rx="3" ry="16" {...m('adductors')} />
            <ellipse cx="64" cy="134" rx="3" ry="16" {...m('adductors')} />
          </g>
        </svg>
        <figcaption className="text-[10px] uppercase tracking-widest text-muted">Front</figcaption>
      </figure>

      <figure className="m-0 flex flex-col items-center gap-1">
        <svg width={size} viewBox="0 0 120 210" role="img" aria-label="Back view muscles">
          <Silhouette />
          <g>
            <polygon points="48,34 72,34 60,52" {...m('traps')} />
            <ellipse cx="35" cy="40" rx="8" ry="7" {...m('rear-delts')} />
            <ellipse cx="85" cy="40" rx="8" ry="7" {...m('rear-delts')} />
            <ellipse cx="29" cy="62" rx="5" ry="11" {...m('triceps')} />
            <ellipse cx="91" cy="62" rx="5" ry="11" {...m('triceps')} />
            <rect x="52" y="46" width="16" height="14" rx="3" {...m('mid-back')} />
            <ellipse cx="47" cy="68" rx="8" ry="14" {...m('lats')} />
            <ellipse cx="73" cy="68" rx="8" ry="14" {...m('lats')} />
            <rect x="51" y="82" width="18" height="15" rx="4" {...m('lower-back')} />
            <ellipse cx="52" cy="107" rx="9" ry="8" {...m('glutes')} />
            <ellipse cx="68" cy="107" rx="9" ry="8" {...m('glutes')} />
            <ellipse cx="51" cy="140" rx="7" ry="20" {...m('hamstrings')} />
            <ellipse cx="69" cy="140" rx="7" ry="20" {...m('hamstrings')} />
            <ellipse cx="51" cy="180" rx="6" ry="15" {...m('calves')} />
            <ellipse cx="69" cy="180" rx="6" ry="15" {...m('calves')} />
          </g>
        </svg>
        <figcaption className="text-[10px] uppercase tracking-widest text-muted">Back</figcaption>
      </figure>
    </div>
  )
}
