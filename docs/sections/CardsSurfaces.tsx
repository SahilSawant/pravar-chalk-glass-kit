import { Avatar, Badge, Button, Card, PageHeader, Stat } from '../../src'
import { Section } from '../Section'

export function CardsSurfaces() {
  return (
    <Section
      id="cards-surfaces"
      title="Cards and surfaces"
      rule="A number never sits on a translucent surface. Glass is for chrome and prose only — anything with a figure sits on --raised, solid."
    >
      <PageHeader
        eyebrow="Relationships · Karan Malhotra"
        title="Karan Malhotra"
        subtitle="Active client · mapped 14 Feb 2024"
        actions={
          <>
            <Button variant="secondary" size="sm">Log a note</Button>
            <Button variant="primary" size="sm">Schedule a review</Button>
          </>
        }
      />

      <div className="gallery-row" style={{ marginBottom: 24 }}>
        <Avatar name="Karan Malhotra" />
        <Avatar name="Priya R. Mehta" size="lg" tone="solid" />
        <Avatar name="Ananya Rao" tone="ink" size="sm" />
        <Badge className="bg-accent-quiet text-accent">source: model</Badge>
        <Badge className="bg-sunken text-ink-muted">source: template</Badge>
      </div>

      <div className="gallery-grid" style={{ marginBottom: 24 }}>
        <Stat label="Total AUM" value="₹4,13,00,000" hint="As of 12 Sept 2026" />
        <Stat label="Book drift" value="+2.4pp" hint="Beyond the target band" accent="text-warning-ink" />
        <Stat label="Open nudges" value="3" hint="Across the book" />
      </div>

      <Card className="max-w-[420px] p-5">
        <p style={{ margin: 0, fontWeight: 600 }}>A card is the workhorse surface</p>
        <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>
          Opaque, --raised, a hairline and one shadow tier. Every figure in this system lives on one of these.
        </p>
      </Card>
    </Section>
  )
}
