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
  equipment?: string // the specific gear/bar/attachment to grab for this lift
  form: FormPoint[] // 3 points each
}
export type Day = {
  id: string
  title: string
  focus: string
  tracked: boolean
  exercises?: Exercise[]
  checklist?: string[]
}

export const DAYS: Day[] = [
  {
    id: 'day1',
    title: 'Day 1 · Upper-Chest Priority',
    focus: 'The #1 session — fix the upper chest',
    tracked: true,
    exercises: [
      {
        id: 'd1-incline-db-press',
        name: 'Incline Dumbbell Press (bench 30–45°)',
        equipment: 'Adjustable bench (30–45°) · dumbbells',
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
        name: 'Low-to-High Cable Fly',
        equipment: 'Cable · 2 D-handles · low pulleys',
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
        name: 'Incline Barbell Press (or Reverse-Grip Bench)',
        equipment: 'Barbell · rack w/ safeties · bench 30–45°',
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
        name: 'Standing Landmine Press',
        equipment: 'Landmine · barbell',
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
        name: 'Triceps Rope Pushdown',
        equipment: 'Cable · rope · high pulley',
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
        name: 'Cable Pallof Press',
        equipment: 'Cable · D-handle · chest height',
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
    ],
  },
  {
    id: 'day2',
    title: 'Day 2 · Lower + Rotation',
    focus: 'Posterior chain, golf power, protect L5/S1',
    tracked: true,
    exercises: [
      {
        id: 'd2-trap-rdl',
        name: 'Trap Bar Romanian Deadlift',
        equipment: 'Trap (hex) bar',
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
        name: 'Dumbbell Bulgarian Split Squat',
        equipment: 'Dumbbells · bench',
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
        name: 'Hip Thrust',
        equipment: 'Barbell · bench · hip pad',
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
        name: 'Cable Woodchopper',
        equipment: 'Cable · D-handle',
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
        name: 'Medicine-Ball Rotational Throw',
        equipment: 'Medicine ball · wall',
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
        name: 'Suitcase Carry',
        equipment: 'One heavy dumbbell or kettlebell',
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
    exercises: [
      {
        id: 'd3-pullup',
        name: 'Pull-Up',
        equipment: 'Pull-up bar',
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
        name: 'Chest-Supported Row',
        equipment: 'Chest-supported row machine (or incline bench + DBs)',
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
        name: 'Incline Cable Fly (lighter)',
        equipment: 'Cable · 2 D-handles · low pulleys',
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
        name: 'Lat Pulldown',
        equipment: 'Lat pulldown · wide bar',
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
        name: 'Face Pull',
        equipment: 'Cable · rope · upper pulley',
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
        name: 'Ab Wheel Rollout',
        equipment: 'Ab wheel',
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
    exercises: [
      {
        id: 'd5-incline-bb-press',
        name: 'Incline Barbell Press',
        equipment: 'Barbell · rack w/ safeties · bench 30–45°',
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
        name: 'Flat Dumbbell Press',
        equipment: 'Dumbbells · flat bench',
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
        name: 'Cable Fly (mid height)',
        equipment: 'Cable · 2 D-handles · chest-height pulleys',
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
        name: 'Dumbbell Shoulder Press',
        equipment: 'Dumbbells · upright bench',
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
        name: 'Dumbbell Lateral Raise',
        equipment: 'Dumbbells',
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
        name: 'Dumbbell Biceps Curl',
        equipment: 'Dumbbells',
        targetSets: 3,
        repRange: '10–12',
        restSec: 60,
        form: [
          { text: 'Elbows pinned to your sides, no swinging.' },
          { text: 'Curl, squeeze, control down to a full stretch.' },
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

// Full home-gym inventory the program draws on (shown on the Reference screen).
export const EQUIPMENT_INVENTORY: string[] = [
  'Adjustable bench (incline 30–45° + flat)',
  'Barbell + power/squat rack with safety pins',
  'Trap (hex) bar',
  'Dumbbells (full range, light → heavy)',
  'Cable machine / functional trainer (dual adjustable pulleys)',
  'Cable attachments: 2× D-handles, rope, wide lat bar',
  'Pull-up bar',
  'Dip station',
  'Chest-supported row machine (or incline bench + DBs)',
  'Lat pulldown station',
  'Medicine ball',
  'Kettlebell',
  'Ab wheel',
  'Sled',
  'Infrared sauna + cold plunge',
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
