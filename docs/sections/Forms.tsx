import { Button, Dropdown, Field, inputClass, Tooltip } from '../../src'
import { Section } from '../Section'

export function Forms() {
  return (
    <Section
      id="forms"
      title="Forms"
      rule="The focus ring is :focus-visible, never :focus, and it comes from one global rule — a field must not paint its own. Errors sit under the control they belong to, not in a summary at the top."
    >
      <div className="gallery-grid" style={{ marginBottom: 24 }}>
        <Field label="Client name" hint="As it appears on the KYC record">
          <input className={inputClass} placeholder="Priya Mehta" />
        </Field>
        <Field label="PAN" error="This PAN does not match the record on file">
          <input className={inputClass} defaultValue="ABCDE1234F" />
        </Field>
        <Field label="Risk profile">
          <select className={inputClass}>
            <option>Conservative</option>
            <option>Moderate</option>
            <option>Aggressive</option>
          </select>
        </Field>
      </div>

      <p className="gallery-subhead">Dropdown</p>
      <div className="gallery-row" style={{ marginBottom: 24 }}>
        {/* Dropdown renders its own button, so the trigger is a glyph. Passing a
            Button here nests a button inside a button, which is invalid HTML. */}
        <Dropdown trigger={(open) => <span aria-hidden>{open ? '×' : '⋯'}</span>}>
          <div style={{ padding: '8px 16px' }}>Log a note</div>
          <div style={{ padding: '8px 16px' }}>Schedule a review</div>
          <div style={{ padding: '8px 16px', color: 'var(--color-danger-ink)' }}>Remove from book</div>
        </Dropdown>
      </div>

      <p className="gallery-subhead">Tooltip — hover or focus</p>
      <Tooltip label="Reads holdings, reports drift against the model">
        <Button variant="quiet" size="sm">Drift ⓘ</Button>
      </Tooltip>
    </Section>
  )
}
