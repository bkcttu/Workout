// Auto-wires bundled exercise demo clips. Drop a file named after the exercise
// id into src/demos/ (e.g. `d1-incline-db-press.mp4`) and it appears in-app —
// no per-exercise wiring needed. Supports .mp4 / .webm / .gif. Fully offline.
const modules = import.meta.glob('../demos/*.{mp4,webm,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const DEMOS: Record<string, string> = {}
for (const path in modules) {
  const file = path.split('/').pop() ?? ''
  const id = file.replace(/\.(mp4|webm|gif)$/i, '')
  DEMOS[id] = modules[path]
}

export function demoFor(exerciseId: string): string | undefined {
  return DEMOS[exerciseId]
}

export function isGif(url: string): boolean {
  return /\.gif($|\?)/i.test(url)
}
