/** The `risk` shape `BandScale` needs — a slice of a larger insights payload. */
export interface BandScaleRisk {
  declared: string | null
  target: number | null
  equityPct: number
}

/* Equity-share scale with the three temperament bands shaded underneath.

   The band tints are NEUTRAL on purpose. An earlier version coloured them
   conservative-to-aggressive on a green/amber/red ramp, which meant a client
   who was correctly aggressive had their marker sitting in a "red" zone — the
   chart said danger when the verdict said aligned. Neutral tints let the
   marker's POSITION carry the reading, and the verdict chip carry the judgement.

   They ride --band-*, a dedicated neutral ramp, rather than an alpha tint of
   the brand green. A tint of the brand still carries the brand's hue, and this
   is ground: it should recede in both themes without being tied to either the
   primary or the data colours.

   Two marks, deliberately different shapes so they survive greyscale:
     - a 2px muted tick   = the model target
     - a 3px ink marker   = where the client actually is                       */

/** Equity-share position against Conservative/Moderate/Aggressive bands. */
export function BandScale({ risk }: { risk: BandScaleRisk }) {
  return (
    <>
      <div className="relative mt-2 h-3 overflow-hidden rounded-sm">
        <div className="absolute inset-0 flex">
          <div className={risk.declared === 'Conservative' ? 'bg-band-on' : 'bg-band-1'} style={{ width: '35%' }} />
          <div className={risk.declared === 'Moderate' ? 'bg-band-on' : 'bg-band-2'} style={{ width: '25%' }} />
          <div className={risk.declared === 'Aggressive' ? 'bg-band-on' : 'bg-band-3'} style={{ width: '40%' }} />
        </div>
        {risk.target != null && (
          <div className="absolute top-1/2 h-4 w-[2px] -translate-y-1/2 bg-ink-light" style={{ left: `calc(${Math.min(risk.target, 100)}% - 1px)` }} title={`Model target ${risk.target}%`} />
        )}
        <div className="absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-ink" style={{ left: `calc(${Math.min(risk.equityPct, 100)}% - 1.5px)` }} title={`Current ${risk.equityPct.toFixed(0)}%`} />
      </div>
      <div className="mt-1 flex justify-between text-micro font-medium uppercase tracking-wide text-ink-light">
        <span className={risk.declared === 'Conservative' ? 'font-semibold text-ink' : ''}>Conservative</span>
        <span className={risk.declared === 'Moderate' ? 'font-semibold text-ink' : ''}>Moderate</span>
        <span className={risk.declared === 'Aggressive' ? 'font-semibold text-ink' : ''}>Aggressive</span>
      </div>
      {risk.target != null && (
        <div className="mt-1.5 flex items-center gap-3 text-micro text-ink-light">
          <span className="flex items-center gap-1"><span className="h-2.5 w-[3px] rounded-full bg-ink" /> Current {risk.equityPct.toFixed(0)}%</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-[2px] bg-ink-light" /> Target {risk.target}%</span>
        </div>
      )}
    </>
  )
}
