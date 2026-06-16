// ============================================================================
// FORGE — static program data. Tweak the plan here; logged numbers live in
// localStorage (see src/lib/store.ts). Rename the app in ONE place: APP_NAME.
// ============================================================================

export const APP_NAME = 'FORGE'

export type FormPoint = { text: string; care?: boolean } // care=true -> ⚠️ safety cue
export type Exercise = {
  id: string
  name: string
  targetSets: number
  repRange: string // e.g. "6–8"
  restSec: number
  why?: string
  superset?: boolean
  optional?: boolean // optional bodyweight finisher — do it when you've got gas
  equipment?: string // the specific gear/bar/attachment to grab for this lift
  muscles?: { primary: MuscleId[]; secondary?: MuscleId[] } // for the muscle map
  demoGif?: string // local asset path to a bundled demo animation (optional)
  suggested?: { weight?: number; note?: string } // coach calibration start weight
  form: FormPoint[] // 3 points each
}

// Muscle ids the body map can highlight.
export type MuscleId =
  | 'upper-chest'
  | 'chest'
  | 'front-delts'
  | 'side-delts'
  | 'rear-delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'lats'
  | 'traps'
  | 'mid-back'
  | 'lower-back'
  | 'glutes'
  | 'hamstrings'
  | 'quads'
  | 'calves'
  | 'adductors'

export const MUSCLE_LABELS: Record<MuscleId, string> = {
  'upper-chest': 'Upper chest',
  chest: 'Chest',
  'front-delts': 'Front delts',
  'side-delts': 'Side delts',
  'rear-delts': 'Rear delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  lats: 'Lats',
  traps: 'Traps',
  'mid-back': 'Mid back',
  'lower-back': 'Lower back',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
  quads: 'Quads',
  calves: 'Calves',
  adductors: 'Adductors',
}
export type Day = {
  id: string
  title: string
  focus: string
  tracked: boolean
  warmup?: string[] // RAMP warm-up checklist (not logged)
  exercises?: Exercise[]
  checklist?: string[]
}

export const DAYS: Day[] = [
  {
    id: 'day1',
    title: 'Day 1 · Upper-Chest Priority',
    focus: 'The #1 session — fix the upper chest',
    tracked: true,
    warmup: [
      'Raise: 3–5 min easy bike / row / rope to break a light sweat',
      'Band pull-aparts ×20',
      'Band shoulder dislocates / pass-throughs ×10',
      'Shoulder CARs ×5/side',
      'Scap push-ups ×10, then 10 push-ups',
      'Potentiate: 2 ramp-up sets on the first press (light → working weight)',
    ],
    exercises: [
      {
        id: 'd1-incline-db-press',
        suggested: { weight: 75, note: 'per hand' },
        muscles: { primary: ['upper-chest'], secondary: ['front-delts', 'triceps', 'chest'] },
        name: 'Incline Dumbbell Press (bench 30–45°)',
        equipment: 'Dumbbells (5–100 lb) · adjustable bench 30–45°',
        targetSets: 4,
        repRange: '6–8',
        restSec: 150,
        why: 'Primary upper-chest builder; the steep angle is the point.',
        form: [
          { text: 'Set the bench 30–45° — higher turns it into a shoulder press.' },
          { text: 'Pull your shoulder blades back and down into the pad before you press.' },
          {
            text: 'Lower to the upper-chest/collarbone line, elbows ~45° from the torso, then drive up and slightly back over the upper chest.',
          },
        ],
      },
      {
        id: 'd1-low-high-fly',
        suggested: { weight: 25, note: 'per side / stack' },
        muscles: { primary: ['upper-chest'], secondary: ['front-delts', 'chest'] },
        name: 'Low-to-High Cable Fly',
        equipment: 'Sorinex functional trainer · dual low pulleys + ARC handles (alt: Tonal)',
        targetSets: 4,
        repRange: '12–15',
        restSec: 90,
        why: 'Loads the upper-chest fibers through their true line of pull — treat it like a main lift, not a finisher.',
        form: [
          { text: 'Pulleys at the lowest setting; start with your hands by your hips.' },
          { text: 'Hold a soft, fixed elbow bend the whole set.' },
          {
            text: 'Sweep up and in toward your chin and squeeze; control the negative — don’t let it yank past your chest.',
          },
        ],
      },
      {
        id: 'd1-incline-bb-press',
        suggested: { weight: 155, note: 'total bar' },
        muscles: { primary: ['upper-chest'], secondary: ['front-delts', 'triceps', 'chest'] },
        name: 'Incline Barbell Press (or Reverse-Grip Bench)',
        equipment: 'Texas Power Bar · Sorinex rack safeties · bench 30–45° (alt: Kabuki bar)',
        targetSets: 3,
        repRange: '8–10',
        restSec: 90,
        why: 'A fourth upper-chest angle; reverse grip drives load straight to the upper pec.',
        form: [
          { text: 'If using reverse grip, palms face you — use rack safeties or a spotter.', care: true },
          { text: 'Tuck the elbows; the bar travels to the upper-chest line.' },
          { text: 'Keep wrists stacked over elbows; controlled, full lockout.' },
        ],
      },
      {
        id: 'd1-landmine-press',
        suggested: { weight: 45, note: 'plate on bar, per side' },
        muscles: { primary: ['upper-chest', 'front-delts'], secondary: ['side-delts', 'triceps', 'abs'] },
        name: 'Standing Landmine Press',
        equipment: 'Landmine attachment · Darko shorty bar',
        targetSets: 3,
        repRange: '8–10 / side',
        restSec: 90,
        why: 'Shoulder-friendly press that naturally hits the upper-chest line.',
        form: [
          { text: 'Brace your abs so your low back doesn’t arch.', care: true },
          { text: 'Press up AND in toward the midline, following the bar’s arc.' },
          { text: 'Keep the shoulder down (no shrug) at the top; even reps each side.' },
        ],
      },
      {
        id: 'd1-rope-pushdown',
        suggested: { weight: 50, note: 'stack' },
        muscles: { primary: ['triceps'] },
        name: 'Triceps Rope Pushdown',
        equipment: 'Sorinex functional trainer · Spiral Strength rope (alt: Tonal)',
        targetSets: 3,
        repRange: '10–12',
        restSec: 60,
        superset: true,
        form: [
          { text: 'Pin your elbows to your sides — only the forearms move.' },
          { text: 'Spread the rope apart and squeeze at the bottom.' },
          { text: 'Full controlled stretch at the top without the elbows drifting forward.' },
        ],
      },
      {
        id: 'd1-pallof-press',
        suggested: { weight: 20, note: 'stack' },
        muscles: { primary: ['abs', 'obliques'], secondary: ['lower-back'] },
        name: 'Cable Pallof Press',
        equipment: 'Sorinex functional trainer + PureTorque PRO (or D-handle), chest height',
        targetSets: 3,
        repRange: '10 / side',
        restSec: 45,
        why: 'Anti-rotation core that armors the low back and feeds your golf rotation.',
        form: [
          { text: 'Stand side-on to the cable; brace as if about to take a punch.', care: true },
          { text: 'Press straight out and resist the cable trying to rotate you.' },
          { text: 'Move slowly — resisting the rotation is the actual work.' },
        ],
      },
      {
        id: 'd1-feet-elev-pushup',
        suggested: { note: 'bodyweight — log reps' },
        muscles: { primary: ['upper-chest'], secondary: ['chest', 'front-delts', 'triceps'] },
        name: 'Feet-Elevated Push-Up (optional finisher)',
        optional: true,
        equipment: 'Bodyweight · feet on a bench',
        targetSets: 2,
        repRange: 'AMRAP',
        restSec: 60,
        why: 'Optional upper-chest burnout — feet up shifts the load onto the clavicular pecs. Take each set near failure; add a backpack/plate or do myo-rep clusters as you get strong.',
        form: [
          {
            text: 'Feet on a bench, body in one straight line — squeeze glutes and brace, no sagging hips.',
            care: true,
          },
          { text: 'Hands just below shoulders; lower under control to the upper-chest line, elbows ~45°.' },
          { text: 'Press up and slightly together to a full lockout, then straight into the next rep.' },
        ],
      },
    ],
  },
  {
    id: 'day2',
    title: 'Day 2 · Lower + Rotation',
    focus: 'Posterior chain, golf power, protect L5/S1',
    tracked: true,
    warmup: [
      'Raise: 3–5 min easy bike / row to break a light sweat',
      'Cat-cow ×8, then bird-dogs ×8/side — brace, don’t sag ⚠️',
      'Glute bridges ×15 (wake the glutes before you hinge)',
      'Hip CARs ×5/side + 90/90 transitions ×8',
      'Leg swings ×10/side + bodyweight squats ×10',
      'Potentiate: 2–3 light ramp-up sets on the trap-bar RDL — groove the hinge first ⚠️',
    ],
    exercises: [
      {
        id: 'd2-trap-rdl',
        suggested: { weight: 225, note: 'total bar — stop before the back rounds' },
        muscles: { primary: ['hamstrings', 'glutes'], secondary: ['lower-back', 'traps', 'forearms'] },
        name: 'Trap Bar Romanian Deadlift',
        equipment: 'REP Open Trap Bar',
        targetSets: 3,
        repRange: '6–8',
        restSec: 120,
        why: 'Posterior-chain strength in a back-friendlier bar position.',
        form: [
          { text: 'Hinge from the hips — push your butt back with soft knees, NOT a squat.', care: true },
          { text: 'Keep the handles close and the spine long (proud chest, ribs down).' },
          {
            text: 'Feel the hamstring stretch, stop before the back rounds, then drive hips forward and squeeze glutes to stand.',
            care: true,
          },
        ],
      },
      {
        id: 'd2-bulgarian',
        suggested: { weight: 50, note: 'per hand' },
        muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors'] },
        name: 'Dumbbell Bulgarian Split Squat',
        equipment: 'Dumbbells (5–100 lb) · bench',
        targetSets: 3,
        repRange: '8–10 / leg',
        restSec: 90,
        why: 'Big single-leg strength with low spinal load.',
        form: [
          { text: 'Rear foot on the bench, weight through the front heel.' },
          { text: 'Drop straight down, front knee tracking over the toes.' },
          { text: 'Stay tall-ish — a slight forward lean is fine, no rounding.' },
        ],
      },
      {
        id: 'd2-hip-thrust',
        suggested: { weight: 185, note: 'total bar' },
        muscles: { primary: ['glutes'], secondary: ['hamstrings'] },
        name: 'Hip Thrust',
        equipment: 'Texas Power Bar · bench · hip pad (alt: Kabuki bar)',
        targetSets: 3,
        repRange: '8–12',
        restSec: 90,
        why: 'Glute strength is direct armor for the lower back.',
        form: [
          { text: 'Shoulder blades on the bench, chin tucked, ribs down.' },
          { text: 'Drive through your heels and finish with a hard glute squeeze.' },
          { text: 'Stop at a flat torso — don’t hyperextend/arch at the top.', care: true },
        ],
      },
      {
        id: 'd2-woodchopper',
        suggested: { weight: 30, note: 'stack' },
        muscles: { primary: ['obliques', 'abs'], secondary: ['side-delts'] },
        name: 'Cable Woodchopper',
        equipment: 'Sorinex functional trainer + PureTorque PRO (golf rotation)',
        targetSets: 3,
        repRange: '10 / side',
        restSec: 60,
        why: 'Trains the golf rotation pattern under load.',
        form: [
          { text: 'Rotate hips and torso together; let the back foot pivot.' },
          { text: 'Keep the arms fairly straight — power comes from the trunk.' },
          { text: 'Control the return, no jerking at the bottom.' },
        ],
      },
      {
        id: 'd2-med-ball-throw',
        suggested: { weight: 12, note: 'med ball — speed over load' },
        muscles: { primary: ['obliques'], secondary: ['abs', 'side-delts'] },
        name: 'Medicine-Ball Rotational Throw',
        equipment: 'Wall / medicine ball · wall (REP slam balls)',
        targetSets: 3,
        repRange: '5 / side',
        restSec: 60,
        why: 'Explosive rotational power for the swing.',
        form: [
          { text: 'Coil into the back hip, then explode through.' },
          { text: 'Hips lead, arms follow — like a golf swing.' },
          { text: 'Reset every rep; speed and quality over grinding fatigue.' },
        ],
      },
      {
        id: 'd2-suitcase-carry',
        suggested: { weight: 70, note: 'one hand' },
        muscles: { primary: ['obliques'], secondary: ['traps', 'forearms', 'abs'] },
        name: 'Suitcase Carry',
        equipment: 'One heavy dumbbell or kettlebell (alt: REP Open Trap Bar)',
        targetSets: 3,
        repRange: '40 yd / side',
        restSec: 60,
        why: 'Anti-lateral-flexion core that bulletproofs the trunk.',
        form: [
          { text: 'One heavy weight at your side; stand tall, don’t lean away from it.' },
          { text: 'Brace the side opposite the weight.' },
          { text: 'Walk smooth with ribs stacked over hips — no side bend.', care: true },
        ],
      },
    ],
  },
  {
    id: 'day3',
    title: 'Day 3 · Back + Chest Pump',
    focus: 'Pull strength + 2nd upper-chest hit',
    tracked: true,
    warmup: [
      'Raise: 3–5 min easy bike / row to break a light sweat',
      'Band pull-aparts ×20 + face-pull pulses ×15',
      'Cat-cow ×8 + thoracic rotations ×8/side',
      'Dead hang ×20s, then scap pull-ups ×8',
      'Potentiate: 2 ramp-up sets before your working pull-ups',
    ],
    exercises: [
      {
        id: 'd3-pullup',
        suggested: { note: 'bodyweight — add a belt once 10 is easy' },
        muscles: { primary: ['lats'], secondary: ['biceps', 'mid-back', 'rear-delts', 'forearms'] },
        name: 'Pull-Up',
        equipment: 'Pull-up bar + Angles90 grips',
        targetSets: 4,
        repRange: '6–10',
        restSec: 120,
        form: [
          { text: 'Start from a dead hang and set the shoulders (pull them down first).' },
          { text: 'Lead with the elbows driving down, chest toward the bar.' },
          { text: 'Control all the way back to straight arms.' },
        ],
      },
      {
        id: 'd3-chest-row',
        suggested: { weight: 60, note: 'per hand / stack' },
        muscles: { primary: ['lats', 'mid-back'], secondary: ['rear-delts', 'biceps'] },
        name: 'Chest-Supported Row',
        equipment: 'Sorinex functional trainer + Mutant ARC / V-grip (or Angles90)',
        targetSets: 3,
        repRange: '8–12',
        restSec: 90,
        form: [
          { text: 'Keep your chest on the pad — no heaving with the torso.' },
          { text: 'Pull the elbows back and squeeze the shoulder blades together.' },
          { text: 'Brief pause, then control the stretch.' },
        ],
      },
      {
        id: 'd3-incline-fly',
        suggested: { weight: 20, note: 'per side / stack' },
        muscles: { primary: ['upper-chest'], secondary: ['chest', 'front-delts'] },
        name: 'Incline Cable Fly (lighter)',
        equipment: 'Sorinex functional trainer · low pulleys + handles (alt: Tonal)',
        targetSets: 3,
        repRange: '12–15',
        restSec: 60,
        why: 'Second upper-chest exposure of the week.',
        form: [
          { text: 'Same low-to-high sweep as Day 1, lighter, chasing the pump.' },
          { text: 'Constant tension — no resting at the top or bottom.' },
          { text: 'Hold the soft elbow bend throughout.' },
        ],
      },
      {
        id: 'd3-lat-pulldown',
        suggested: { weight: 140, note: 'stack' },
        muscles: { primary: ['lats'], secondary: ['biceps', 'mid-back'] },
        name: 'Lat Pulldown',
        equipment: 'Sorinex functional trainer · MostGrip lat bar (alt: Tonal)',
        targetSets: 3,
        repRange: '10–12',
        restSec: 60,
        superset: true,
        form: [
          { text: 'Slight lean back; drive the elbows down to your ribs.' },
          { text: 'Bar to the upper chest, no jerking.' },
          { text: 'Control back up to a full stretch.' },
        ],
      },
      {
        id: 'd3-face-pull',
        suggested: { weight: 40, note: 'stack — light, chase the squeeze' },
        muscles: { primary: ['rear-delts'], secondary: ['traps', 'mid-back'] },
        name: 'Face Pull',
        equipment: 'Sorinex functional trainer · Spiral Strength rope, upper pulley (alt: bands)',
        targetSets: 3,
        repRange: '15–20',
        restSec: 45,
        why: 'Rear delts and upper back for posture and shoulder health.',
        form: [
          { text: 'Pull the rope to your forehead, hands splitting apart.' },
          { text: 'Externally rotate so the knuckles finish facing the ceiling.' },
          { text: 'Light weight, high reps — chase the squeeze, not the load.' },
        ],
      },
      {
        id: 'd3-ab-wheel',
        suggested: { note: 'bodyweight — log reps' },
        muscles: { primary: ['abs'], secondary: ['obliques', 'lats'] },
        name: 'Ab Wheel Rollout',
        equipment: 'Ab roller / ab wheel',
        targetSets: 3,
        repRange: '8–12',
        restSec: 60,
        form: [
          { text: 'Brace hard, tuck the ribs, round nothing in the low back.' },
          { text: 'Roll out only as far as you can keep a neutral spine.' },
          { text: 'Stop short the moment the low back starts to sag.', care: true },
        ],
      },
    ],
  },
  {
    id: 'day4',
    title: 'Day 4 · Freestyle',
    focus: 'Golf / Mobility / Conditioning',
    tracked: false,
    checklist: [
      'Sled push/drag — 6–8 × 20–30 yd',
      'KB halos + goblet-hold marches — 3 sets',
      'T-spine openers, 90/90 transitions, hip CARs — 5–8 min',
      'Loaded carries if gas remains',
      'Sauna + cold plunge',
    ],
  },
  {
    id: 'day5',
    title: 'Day 5 · Chest Volume + Shoulders + Arms',
    focus: '3rd chest exposure',
    tracked: true,
    warmup: [
      'Raise: 3–5 min easy bike / row to break a light sweat',
      'Band pull-aparts ×20',
      'Shoulder CARs ×5/side + cuff external rotations ×15',
      'Scap push-ups ×10, then 10 push-ups',
      'Potentiate: 2 ramp-up sets on the incline press',
    ],
    exercises: [
      {
        id: 'd5-incline-bb-press',
        suggested: { weight: 150, note: 'total bar' },
        muscles: { primary: ['upper-chest'], secondary: ['front-delts', 'triceps', 'chest'] },
        name: 'Incline Barbell Press',
        equipment: 'Texas Power Bar · Sorinex rack safeties · bench 30–45° (alt: Kabuki bar)',
        targetSets: 4,
        repRange: '8–10',
        restSec: 120,
        why: 'Third chest exposure, still upper-biased.',
        form: [
          { text: '30–45° bench; bar to the upper chest, elbows ~45°.' },
          { text: 'Shoulder blades retracted, feet planted, controlled descent.' },
          { text: 'Drive up over the upper chest.' },
        ],
      },
      {
        id: 'd5-flat-db-press',
        suggested: { weight: 75, note: 'per hand' },
        muscles: { primary: ['chest'], secondary: ['front-delts', 'triceps'] },
        name: 'Flat Dumbbell Press',
        equipment: 'Dumbbells (5–100 lb) · flat bench',
        targetSets: 3,
        repRange: '10–12',
        restSec: 90,
        form: [
          { text: 'Lower to mid-chest, elbows ~45° from the body.' },
          { text: 'Full stretch at the bottom, press to nearly touching at the top.' },
          { text: 'Keep the shoulder blades pinned back.' },
        ],
      },
      {
        id: 'd5-cable-fly-mid',
        suggested: { weight: 25, note: 'per side / stack' },
        muscles: { primary: ['chest'], secondary: ['front-delts', 'upper-chest'] },
        name: 'Cable Fly (mid height)',
        equipment: 'Sorinex functional trainer · chest-height pulleys + handles (alt: Tonal)',
        targetSets: 3,
        repRange: '12–15',
        restSec: 60,
        superset: true,
        form: [
          { text: 'Pulleys at chest height; big arc with soft elbows.' },
          { text: 'Squeeze the hands together out front.' },
          { text: 'Control the stretch back, constant tension.' },
        ],
      },
      {
        id: 'd5-db-shoulder-press',
        suggested: { weight: 55, note: 'per hand' },
        muscles: { primary: ['front-delts'], secondary: ['side-delts', 'triceps'] },
        name: 'Dumbbell Shoulder Press',
        equipment: 'Dumbbells (5–100 lb) · upright bench',
        targetSets: 3,
        repRange: '8–12',
        restSec: 90,
        form: [
          { text: 'Brace the core so the low back doesn’t arch.', care: true },
          { text: 'Press up and slightly in; don’t flare the elbows straight out.' },
          { text: 'Lower to ear height under control.' },
        ],
      },
      {
        id: 'd5-lateral-raise',
        suggested: { weight: 20, note: 'per hand — strict, no swing' },
        muscles: { primary: ['side-delts'], secondary: ['front-delts'] },
        name: 'Dumbbell Lateral Raise',
        equipment: 'Dumbbells (alt: Sorinex cable · single handle)',
        targetSets: 3,
        repRange: '15–20',
        restSec: 60,
        superset: true,
        form: [
          { text: 'Lead with the elbows, slight bend, lift to shoulder height.' },
          { text: '“Pour the pitcher” tilt — no swinging or shrugging.' },
          { text: 'Slow on the way down.' },
        ],
      },
      {
        id: 'd5-biceps-curl',
        suggested: { weight: 35, note: 'per hand' },
        muscles: { primary: ['biceps'], secondary: ['forearms'] },
        name: 'Dumbbell Biceps Curl',
        equipment: 'Dumbbells (alt: Rogue curl-bar cable attachment)',
        targetSets: 3,
        repRange: '10–12',
        restSec: 60,
        form: [
          { text: 'Elbows pinned to your sides, no swinging.' },
          { text: 'Curl, squeeze, control down to a full stretch.' },
        ],
      },
      {
        id: 'd5-weighted-dip',
        suggested: { weight: 25, note: 'added load via belt (+25 lb)' },
        muscles: { primary: ['chest'], secondary: ['triceps', 'front-delts'] },
        name: 'Weighted Dip (optional finisher)',
        optional: true,
        equipment: 'RELIFE Rebuild dip station · belt + plate to load',
        targetSets: 2,
        repRange: '8–12',
        restSec: 90,
        why: 'Optional chest/triceps finisher now that the dip station is in. A slight forward lean loads the lower/mid chest and triceps — quality pressing volume to cap the day.',
        form: [
          { text: 'Slight forward lean for chest, more upright for triceps; shoulders down, no shrug.' },
          {
            text: 'Lower until the upper arms reach about parallel — don’t dive past a comfortable shoulder stretch.',
            care: true,
          },
          { text: 'Press to a strong lockout; add load with a dip belt once bodyweight is easy.' },
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Reference screen content (Section 11)
// ---------------------------------------------------------------------------

export const NUTRITION_TARGET = {
  headline: 'Lean-gain / recomp.',
  detail:
    'Maintenance is ~2,700 kcal; to build, eat ~2,900–3,000 kcal/day with 200 g protein. The number is a starting anchor — let the scale steer: aim to gain ~¼–½ lb/week. Flat for 2 weeks and chest not growing → push to 3,000+. Waist softening faster than the chest fills → ease back ~200. Don’t diet down — adding upper-chest size is the lever, not cutting.',
}

export const PROTEIN_TEMPLATE: string[] = [
  'Morning: Core Protein Vanilla RTD (42 g) + eggs/toast — ~50 g',
  'Lunch: burger or steak + salad — ~45 g',
  'Snack: Dymatize Fruity Pebbles shake (30 g) — ~30 g',
  'Dinner: steak / chicken / sandwich + carbs + veg — ~50 g',
  'Flex: Greek yogurt, jerky, or a 2nd shake — ~25 g',
  '(No peas.)',
]

export const SUPPLEMENTS: string[] = [
  'Creatine 5 g',
  'Thorne fish oil',
  'Thorne multivitamin',
  'Thorne CoQ10',
  'RHO Nutrition Berberine',
  'Bayer baby aspirin',
  'TRT injection (per my own schedule)',
]

// Full home-gym inventory, categorized (shown on the Reference screen).
// (incoming) items are wired in as optional alternates only.
export type EquipmentGroup = { category: string; items: string[] }
export const EQUIPMENT_INVENTORY: EquipmentGroup[] = [
  {
    category: 'Rack & cable machines',
    items: [
      'Sorinex rack + functional trainer (dual adjustable cable column)',
      'Tonal (digital cable trainer — eccentric/overload modes)',
      'Voltra I — Beyond Power (portable smart cable) — incoming',
      'Sorinex rack attachments (press/row/jammer variations)',
    ],
  },
  {
    category: 'Barbells & specialty bars',
    items: [
      'Texas Power Bar',
      'Kabuki / Rogue specialty bar (Transformer or Duffalo)',
      'REP Open Trap Bar',
      'Darko shorty bar',
      'Landmine attachment',
    ],
  },
  {
    category: 'Free weights & implements',
    items: [
      'Dumbbells, 5–100 lb',
      'Kettlebells',
      'Wall balls / medicine balls',
      'REP weighted slam balls',
      'Stability balls',
    ],
  },
  {
    category: 'Cable attachments & grips',
    items: [
      'Mutant Metals ARC attachment (swappable handles/angles)',
      'Rogue Rotating V-Grip',
      'Angles90 grips',
      'MostGrip lat pulldown bars',
      'Korikahm adjustable lat handles',
      'Spiral Strength chalky tricep rope',
      'Spud Inc long strap',
      'Rogue curl-bar cable attachment',
    ],
  },
  {
    category: 'Core & rotation',
    items: ['PureTorque PRO Ab Trainer (rotational core)', 'Ab roller / ab wheel'],
  },
  {
    category: 'Conditioning & bodyweight',
    items: [
      'Torque Tank M1 sled',
      'RELIFE Rebuild dip station',
      'Pull-up bar',
      'Resistance bands',
    ],
  },
  {
    category: 'Recovery & other',
    items: [
      'Sunlighten mPulse infrared sauna',
      'ColdLife cold plunge',
      'Golf simulator',
      'Treadmill',
    ],
  },
]

export const MEDICAL_DISCLAIMER =
  'Reminder: this app is a tracker, not medical guidance. Keep your physician in the loop on the L5/S1 hinging and the TRT/berberine/aspirin side.'

// ---------------------------------------------------------------------------
// Hydration defaults (Section 12)
// ---------------------------------------------------------------------------

export const HYDRATION_DEFAULTS = {
  baseGoalOz: 100,
  trainBonusOz: 20,
  saunaBonusOz: 25,
}

// ---------------------------------------------------------------------------
// Protein / Fuel defaults (Section 13)
// ---------------------------------------------------------------------------

export const PROTEIN_GOAL_G = 200

export type Staple = { name: string; protein: number; calories?: number }

export const PROTEIN_STAPLES: Staple[] = [
  { name: 'Core Protein Vanilla RTD', protein: 42 },
  { name: 'Dymatize Fruity Pebbles shake', protein: 30 },
  { name: 'Steak (6 oz)', protein: 42 },
  { name: 'Chicken breast (6 oz)', protein: 50 },
  { name: 'Burger', protein: 30 },
  { name: 'Sandwich', protein: 25 },
  { name: '2 eggs', protein: 12 },
  { name: 'Greek yogurt', protein: 18 },
  { name: 'Beef jerky (1 oz)', protein: 11 },
]

export const CALORIE_NOTE =
  'Protein is what you track. Calories matter for building the chest, but you don’t need to count them — watch the scale instead. If your bodyweight is flat for ~2 weeks and the chest isn’t growing, eat more (bigger portions, an extra shake). Lean is an advantage here: you’ve got room to add food without adding fat.'
