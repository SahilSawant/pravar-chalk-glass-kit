import { Section } from '../Section'

const STEPS: { token: string; label: string }[] = [
  ['--text-display', 'Display'], ['--text-h1', 'H1'], ['--text-h2', 'H2'], ['--text-h3', 'H3'],
  ['--text-h4', 'H4 / Title'], ['--text-lead', 'Lead'], ['--text-body-lg', 'Body large'],
  ['--text-body', 'Body — the default'], ['--text-caption', 'Caption'], ['--text-label', 'Label'],
  ['--text-micro', 'Micro'],
].map(([token, label]) => ({ token, label }))

export function Type() {
  return (
    <Section
      id="type"
      title="Type"
      rule="Archivo for prose, sentence case everywhere, body is 13. Mono is a semantic, not a style: every figure is mono, right-aligned and tabular, and a number set in Archivo is a bug."
    >
      <div style={{ marginBottom: 24 }}>
        {STEPS.map((s) => (
          <div key={s.token} className="type-row">
            <span className="label">{s.label}</span>
            <span style={{ fontSize: `var(${s.token})` }}>The book, at a glance</span>
          </div>
        ))}
      </div>

      <p className="gallery-subhead">A figure, rendered correctly and rendered as the bug</p>
      <div className="gallery-row" style={{ alignItems: 'stretch' }}>
        <div className="swatch" style={{ padding: 16, minWidth: 200 }}>
          <p className="swatch-name" style={{ marginBottom: 6 }}>Correct — JetBrains Mono, tabular</p>
          <p className="figure-demo" style={{ fontSize: 'var(--text-h3)', margin: 0, color: 'var(--color-ink)' }}>
            ₹41,32,900.00
          </p>
        </div>
        <div className="swatch" style={{ padding: 16, minWidth: 200 }}>
          <p className="wrong-label" style={{ marginBottom: 6 }}>Bug — set in Archivo</p>
          <p className="figure-demo-wrong" style={{ fontSize: 'var(--text-h3)', margin: 0, color: 'var(--color-ink)' }}>
            ₹41,32,900.00
          </p>
        </div>
      </div>
    </Section>
  )
}
