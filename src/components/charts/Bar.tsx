/** One row of a current-vs-ideal allocation bar. */
export interface IdealRow {
  key: string
  currentPct: number
  idealPct: number
  delta: number
  color: string
}

/* Current-vs-ideal bar.

   `scale` is passed in rather than derived per row, and that is the whole
   point: every row in a group shares ONE scale, so bar lengths are comparable
   across rows. Self-normalising each row to its own maximum made every bar
   full width and the comparison meaningless. Callers must compute the scale
   once over the whole set. */

/** A current-vs-ideal allocation bar with an ideal marker; `scale` is shared across rows. */
export function IdealBar({ row, scale }: { row: IdealRow; scale: number }) {
  const drifted = Math.abs(row.delta) >= 3
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-label font-medium text-ink">{row.key}</div>
      <div className="relative h-4 flex-1 overflow-hidden rounded bg-sunken/50">
        <div className="h-full rounded" style={{ width: `${(row.currentPct / scale) * 100}%`, background: row.color }} />
        <div className="absolute top-0 h-4 w-[3px] bg-copper" style={{ left: `calc(${(row.idealPct / scale) * 100}% - 1.5px)` }} title={`Ideal ${row.idealPct}%`} />
      </div>
      <div className="w-28 shrink-0 text-right text-label tabular-nums text-ink-light">
        {row.currentPct}% <span className="text-ink-light">→</span> {row.idealPct}%
        {drifted && (
          <span className={`ml-1 font-semibold ${row.delta > 0 ? 'text-success-ink' : 'text-ink-light'}`}>
            {row.delta > 0 ? '+' : ''}
            {row.delta}
          </span>
        )}
      </div>
    </div>
  )
}
