# Per-week weight pre-fill

FORGE pre-fills each set's **weight** from a weekly plan in
`src/data/forge_progression.json`. Change the week with the **WK ◀ n ▶** control
in the Day header (1–4, persists in localStorage under `forge.v1.programWeek`).

## How it behaves
- **Week 1** = baseline. No pre-fill — fields fall back to carry-last-session.
- **Weeks 2–4** = pre-fill each set's weight from `weeks[week].sets[i]`
  (`null` → blank), reps left blank. Rows stay fully editable.
- Matching is by **day title + exercise name** (case/whitespace-normalized),
  so the JSON keys must match `src/data/plan.ts`.
- No match for an exercise → silent fallback to last-session behavior.
- The `weeks[week].note` shows as a muted hint under the set grid.
- Pre-filled numbers only enter history when you actually log/complete sets.
- Weeks never auto-advance — the planned number is an editable suggestion;
  your rep ranges govern real progression.

## Editing the plan
Replace the numbers in `src/data/forge_progression.json`. Shape:

```jsonc
{
  "version": 1,
  "defaultWeek": 2,
  "exercises": [
    {
      "day": "Day 1 · Upper-Chest Priority",
      "name": "Incline Dumbbell Press (bench 30–45°)",
      "weeks": {
        "2": { "sets": [75, 75, 75, 75], "note": "..." },
        "3": { "sets": [80, 80, 80, 80], "note": "..." },
        "4": { "sets": [85, 85, 82, 82], "note": "..." }
      }
    }
  ]
}
```

`sets[]` length should match the exercise's set count; use `null` for
bodyweight/blank. Commit + push and it auto-deploys.
