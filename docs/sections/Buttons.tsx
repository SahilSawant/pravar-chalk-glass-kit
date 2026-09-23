import { Button } from '../../src'
import { Section } from '../Section'

const VARIANTS = ['primary', 'secondary', 'quiet', 'danger'] as const
const SIZES = ['sm', 'md', 'lg'] as const

export function Buttons() {
  return (
    <Section
      id="buttons"
      title="Buttons"
      rule="Four variants, three sizes. No new button variant outside the primitive set — a fifth colour or a fourth size is a call site that needed a composition, not a new primitive."
    >
      {VARIANTS.map((variant) => (
        <div key={variant} className="gallery-row">
          <span className="gallery-subhead" style={{ width: 90, margin: 0 }}>{variant}</span>
          {SIZES.map((size) => (
            <Button key={size} variant={variant} size={size}>
              {size}
            </Button>
          ))}
        </div>
      ))}
      <div className="gallery-row">
        <span className="gallery-subhead" style={{ width: 90, margin: 0 }}>loading</span>
        <Button variant="primary" loading>
          Saving
        </Button>
        <Button variant="danger" loading>
          Removing
        </Button>
      </div>
      <div className="gallery-row" style={{ maxWidth: 320 }}>
        <span className="gallery-subhead" style={{ width: 90, margin: 0 }}>full</span>
        <Button variant="secondary" full>
          Fills its container
        </Button>
      </div>
    </Section>
  )
}
