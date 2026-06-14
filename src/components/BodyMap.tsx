import type { MuscleId } from '../data/plan'

type View = 'both' | 'front' | 'back'

type Props = {
  /** muscle id -> activation intensity 0..1 */
  values: Partial<Record<MuscleId, number>>
  /** width of each figure in px */
  size?: number
  view?: View
  showLabels?: boolean
}

const BASE = '#2b241d'
const STROKE = '#362e26'

const BACK_MUSCLES: MuscleId[] = [
  'traps',
  'rear-delts',
  'triceps',
  'lats',
  'mid-back',
  'lower-back',
  'glutes',
  'hamstrings',
  'calves',
]

/** Pick the most relevant single view for a thumbnail. */
export function bestView(primary: MuscleId[]): View {
  const back = primary.filter((m) => BACK_MUSCLES.includes(m)).length
  return back > primary.length - back ? 'back' : 'front'
}

export default function BodyMap({ values, size = 112, view = 'both', showLabels = true }: Props) {
  const op = (id: MuscleId) => {
    const v = values[id] ?? 0
    if (v <= 0) return 0
    return Math.min(1, 0.32 + 0.63 * v)
  }
  const m = (id: MuscleId) => ({ fill: 'var(--accent)', fillOpacity: op(id) })

  const Base = () => (
    <g fill={BASE} stroke={STROKE} strokeWidth={0.8} strokeLinejoin="round">
      <circle cx="60" cy="15" r="9" />
      <path d="M55 23 q5 3 10 0 l2 8 q-7 4 -14 0 z" />
      <path d="M42 35 q18 -4 36 0 l8 12 q3 14 -4 28 q-4 12 -8 20 l-1 18 h-26 l-1 -18 q-4 -8 -8 -20 q-7 -14 -4 -28 z" />
      <circle cx="33" cy="42" r="9" />
      <circle cx="87" cy="42" r="9" />
      <ellipse cx="28" cy="58" rx="6" ry="15" />
      <ellipse cx="92" cy="58" rx="6" ry="15" />
      <ellipse cx="25" cy="90" rx="5" ry="15" />
      <ellipse cx="95" cy="90" rx="5" ry="15" />
      <path d="M47 112 h26 l-2 16 q-11 4 -22 0 z" />
      <ellipse cx="52" cy="150" rx="9" ry="27" />
      <ellipse cx="68" cy="150" rx="9" ry="27" />
      <ellipse cx="52" cy="192" rx="6" ry="18" />
      <ellipse cx="68" cy="192" rx="6" ry="18" />
    </g>
  )

  const Front = () => (
    <figure className="m-0 flex flex-col items-center gap-1">
      <svg width={size} viewBox="0 0 120 214" role="img" aria-label="Front view muscles">
        <Base />
        <g stroke="none">
          <circle cx="33" cy="42" r="7.5" {...m('front-delts')} />
          <circle cx="87" cy="42" r="7.5" {...m('front-delts')} />
          <circle cx="25" cy="48" r="4.5" {...m('side-delts')} />
          <circle cx="95" cy="48" r="4.5" {...m('side-delts')} />
          <ellipse cx="52" cy="46" rx="9" ry="5.5" transform="rotate(-12 52 46)" {...m('upper-chest')} />
          <ellipse cx="68" cy="46" rx="9" ry="5.5" transform="rotate(12 68 46)" {...m('upper-chest')} />
          <ellipse cx="51" cy="57" rx="9" ry="6" {...m('chest')} />
          <ellipse cx="69" cy="57" rx="9" ry="6" {...m('chest')} />
          <ellipse cx="28" cy="56" rx="5" ry="11" {...m('biceps')} />
          <ellipse cx="92" cy="56" rx="5" ry="11" {...m('biceps')} />
          <ellipse cx="25" cy="88" rx="4.5" ry="13" {...m('forearms')} />
          <ellipse cx="95" cy="88" rx="4.5" ry="13" {...m('forearms')} />
          <rect x="53" y="60" width="14" height="30" rx="4" {...m('abs')} />
          <ellipse cx="48" cy="76" rx="3.5" ry="11" transform="rotate(12 48 76)" {...m('obliques')} />
          <ellipse cx="72" cy="76" rx="3.5" ry="11" transform="rotate(-12 72 76)" {...m('obliques')} />
          <ellipse cx="52" cy="150" rx="7" ry="22" {...m('quads')} />
          <ellipse cx="68" cy="150" rx="7" ry="22" {...m('quads')} />
          <ellipse cx="57" cy="146" rx="3" ry="15" {...m('adductors')} />
          <ellipse cx="63" cy="146" rx="3" ry="15" {...m('adductors')} />
        </g>
        <g stroke={STROKE} strokeWidth={0.6} fill="none" opacity={0.8}>
          <line x1="60" y1="62" x2="60" y2="90" />
          <line x1="53" y1="70" x2="67" y2="70" />
          <line x1="53" y1="79" x2="67" y2="79" />
        </g>
      </svg>
      {showLabels && <figcaption className="eyebrow">Front</figcaption>}
    </figure>
  )

  const Back = () => (
    <figure className="m-0 flex flex-col items-center gap-1">
      <svg width={size} viewBox="0 0 120 214" role="img" aria-label="Back view muscles">
        <Base />
        <g stroke="none">
          <polygon points="50,34 70,34 60,50" {...m('traps')} />
          <circle cx="33" cy="42" r="7.5" {...m('rear-delts')} />
          <circle cx="87" cy="42" r="7.5" {...m('rear-delts')} />
          <ellipse cx="28" cy="56" rx="5" ry="11" {...m('triceps')} />
          <ellipse cx="92" cy="56" rx="5" ry="11" {...m('triceps')} />
          <rect x="53" y="46" width="14" height="12" rx="3" {...m('mid-back')} />
          <path d="M45 50 q-9 14 -3 30 q6 6 11 2 l1 -30 q-4 -6 -9 -2 z" {...m('lats')} />
          <path d="M75 50 q9 14 3 30 q-6 6 -11 2 l-1 -30 q4 -6 9 -2 z" {...m('lats')} />
          <rect x="52" y="82" width="16" height="14" rx="4" {...m('lower-back')} />
          <ellipse cx="53" cy="114" rx="8" ry="7" {...m('glutes')} />
          <ellipse cx="67" cy="114" rx="8" ry="7" {...m('glutes')} />
          <ellipse cx="52" cy="150" rx="7" ry="20" {...m('hamstrings')} />
          <ellipse cx="68" cy="150" rx="7" ry="20" {...m('hamstrings')} />
          <ellipse cx="52" cy="190" rx="6" ry="15" {...m('calves')} />
          <ellipse cx="68" cy="190" rx="6" ry="15" {...m('calves')} />
        </g>
      </svg>
      {showLabels && <figcaption className="eyebrow">Back</figcaption>}
    </figure>
  )

  return (
    <div className="flex items-end justify-center gap-3">
      {view !== 'back' && <Front />}
      {view !== 'front' && <Back />}
    </div>
  )
}
