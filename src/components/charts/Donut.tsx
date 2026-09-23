import { formatMoney } from '../../lib/format'

/** One slice of a `Donut` — only the fields the ring itself needs to draw. */
export interface AssetSlice {
  value: number
  color: string
}

/* Allocation rings. Arc maths is stroke-dasharray on a circle, accumulated
   clockwise from 12 o'clock — moved here verbatim from InsightsView.

   The legend is deliberately NOT part of this component. It belongs BELOW the
   ring, full width: laying it out beside the ring collapsed the class-name
   column to zero width and overlapped the percentage with the value. That was
   a real bug, fixed once; keeping the legend outside makes it hard to undo. */

/** An allocation ring with a centred total; the legend is a separate component. */
export function Donut({ slices, total, size = 168, thickness = 22 }: { slices: AssetSlice[]; total: number; size?: number; thickness?: number }) {
  const r = size / 2 - thickness / 2 - 2
  const cx = size / 2
  const cy = size / 2
  const C = 2 * Math.PI * r
  let acc = 0
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-hair-strong)" strokeWidth={thickness} opacity={0.55} />
      {slices
        .filter((s) => s.value > 0)
        .map((s, i) => {
          const len = total ? (s.value / total) * C : 0
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-acc}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          )
          acc += len
          return el
        })}
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fill: 'var(--color-ink)', fontSize: 17, fontWeight: 700 }}>
        {formatMoney(total, { compact: true })}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" style={{ fill: 'var(--color-ink-light)', fontSize: 9, letterSpacing: 0.5 }}>
        TOTAL VALUE
      </text>
    </svg>
  )
}

/** A small labelled donut, for a compact secondary breakdown. */
export function MiniDonut({ title, slices }: { title: string; slices: AssetSlice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  const r = 40
  const C = 2 * Math.PI * r
  let acc = 0
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-label font-semibold uppercase tracking-wide text-ink-light">{title}</div>
      <svg viewBox="0 0 100 100" width={108} height={108}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="var(--color-hair-strong)" strokeWidth={16} opacity={0.55} />
        {slices
          .filter((s) => s.value > 0)
          .map((s, i) => {
            const len = total ? (s.value / total) * C : 0
            const el = (
              <circle key={i} cx={50} cy={50} r={r} fill="none" stroke={s.color} strokeWidth={16} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} transform="rotate(-90 50 50)" />
            )
            acc += len
            return el
          })}
      </svg>
    </div>
  )
}
