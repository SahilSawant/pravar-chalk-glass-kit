import { BandScale, Donut, IdealBar, MiniDonut } from '../../src'
import { RISK_BAND } from '../../src/lib/semantics'
import { Section } from '../Section'

const ALLOCATION = [
  { label: 'Equity', value: 64, color: 'var(--color-cat-equity)' },
  { label: 'Fixed income', value: 22, color: 'var(--color-cat-fixed-income)' },
  { label: 'Hybrid', value: 14, color: 'var(--color-cat-hybrid)' },
]

export function Charts() {
  return (
    <Section
      id="charts"
      title="Charts"
      rule="Nothing draws its own colour — series come from viz-1…6 or the category ramp, and order carries meaning. Risk is ordered by lightness, never re-mapped onto red/amber/green, so it survives greyscale and a bad projector."
    >
      <p className="gallery-subhead">Risk ramp — by lightness, not hue</p>
      <div className="gallery-row" style={{ marginBottom: 24 }}>
        {Object.entries(RISK_BAND).map(([label, color]) => (
          <div key={label} className="swatch" style={{ width: 140 }}>
            <div className="swatch-fill" style={{ background: color }} />
            <div className="swatch-meta">
              <span className="swatch-name">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="gallery-subhead">Risk profile — declared vs. current</p>
      <div style={{ maxWidth: 420, marginBottom: 24 }}>
        <BandScale risk={{ declared: 'Moderate', equityPct: 62, target: 60 }} />
      </div>

      <p className="gallery-subhead">Current → ideal</p>
      <div style={{ maxWidth: 480, marginBottom: 24 }}>
        <IdealBar row={{ key: 'Equity', currentPct: 64, idealPct: 60, delta: 4, color: 'var(--color-cat-equity)' }} scale={100} />
        <IdealBar row={{ key: 'Fixed income', currentPct: 22, idealPct: 28, delta: -6, color: 'var(--color-cat-fixed-income)' }} scale={100} />
      </div>

      <div className="gallery-row" style={{ alignItems: 'flex-start' }}>
        <Donut slices={ALLOCATION} total={ALLOCATION.reduce((s, x) => s + x.value, 0)} />
        <MiniDonut title="By asset bucket" slices={ALLOCATION} />
      </div>
    </Section>
  )
}
