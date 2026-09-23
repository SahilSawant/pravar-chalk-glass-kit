import { Chip, FilterChip, Tabs } from '../../src'
import { chipFor, HOUSE_VIEW_STATUS, PLANNING_PRIORITY, RELATIONSHIP_STATUS, RISK_VERDICT, TONE } from '../../src/lib/semantics'
import { Section } from '../Section'
import { useState } from 'react'

function MeaningRow<T extends string>({ label, map }: { label: string; map: Record<T, { label: string; tone: keyof typeof TONE }> }) {
  return (
    <div className="gallery-row">
      <span className="gallery-subhead" style={{ width: 140, margin: 0 }}>{label}</span>
      {(Object.keys(map) as T[]).map((k) => (
        <span key={k} className={chipFor(map[k])} style={{ borderRadius: 'var(--radius-chip)' }}>
          {map[k].label}
        </span>
      ))}
    </div>
  )
}

export function ChipsStatus() {
  const [filter, setFilter] = useState<'all' | 'mine'>('all')
  const [tab, setTab] = useState('overview')

  return (
    <Section
      id="chips-status"
      title="Chips and status"
      rule="Status means state. It never occupies a chart series slot, and it never re-uses a data colour — a fact about a record and a slice of a donut cannot share a hue or one reads as the other."
    >
      <p className="gallery-subhead">Meaning maps — one vocabulary, several screens</p>
      <MeaningRow label="Relationship" map={RELATIONSHIP_STATUS} />
      <MeaningRow label="Planning priority" map={PLANNING_PRIORITY} />
      <MeaningRow label="Risk verdict" map={RISK_VERDICT} />
      <MeaningRow label="House view" map={HOUSE_VIEW_STATUS} />

      <p className="gallery-subhead" style={{ marginTop: 24 }}>Chip — a label, one height, one radius</p>
      <div className="gallery-row">
        {(Object.keys(TONE) as (keyof typeof TONE)[]).map((tone) => (
          <Chip key={tone} className={TONE[tone].chip}>
            {tone}
          </Chip>
        ))}
      </div>

      <p className="gallery-subhead" style={{ marginTop: 24 }}>FilterChip — a control, not a label</p>
      <div className="gallery-row">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          All relationships
        </FilterChip>
        <FilterChip active={filter === 'mine'} onClick={() => setFilter('mine')}>
          Mine only
        </FilterChip>
      </div>

      <p className="gallery-subhead" style={{ marginTop: 24 }}>Tabs — one tab stop, arrow keys move it</p>
      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'planning', label: 'Planning', count: 3 },
          { key: 'meetings', label: 'Meetings' },
          { key: 'outreach', label: 'Outreach' },
          { key: 'record', label: 'Record' },
        ]}
        active={tab}
        onChange={setTab}
      />
    </Section>
  )
}
