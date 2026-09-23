import { useState } from 'react'
import { CELL_PAD, SkeletonRows, Table, useDensity } from '../../src'
import { Section } from '../Section'

type Density = 'comfortable' | 'compact' | 'dense'
const DENSITIES: Density[] = ['comfortable', 'compact', 'dense']

const ROWS = [
  { name: 'Karan Malhotra', aum: '₹4,13,00,000', drift: '+2.4%' },
  { name: 'Vikram Anand', aum: '₹3,40,00,000', drift: '+3.1%' },
  { name: 'Priya R. Mehta', aum: '₹1,55,00,000', drift: '-0.3%' },
]

function DemoRow({ row }: { row: (typeof ROWS)[number] }) {
  const density = useDensity()
  return (
    <tr className="border-b border-hair last:border-0">
      <td className={`${CELL_PAD[density]} text-ink`}>{row.name}</td>
      <td className={`${CELL_PAD[density]} figure-demo text-ink`}>{row.aum}</td>
      <td className={`${CELL_PAD[density]} figure-demo text-ink`}>{row.drift}</td>
    </tr>
  )
}

function DemoTable({ density }: { density: Density }) {
  return (
    <Table
      density={density}
      head={
        <>
          <th className="px-4 text-left">Client</th>
          <th className="px-4 text-right">AUM</th>
          <th className="px-4 text-right">Drift</th>
        </>
      }
    >
      {ROWS.map((r) => (
        <DemoRow key={r.name} row={r} />
      ))}
    </Table>
  )
}

export function TableSection() {
  const [loading, setLoading] = useState(false)

  return (
    <Section
      id="table"
      title="Table at all three densities"
      rule="Density is a table-level decision, never per-row, at most two levels per screen. Figures stay mono, right-aligned and tabular at every level — a dash is not a zero, and every dash carries its reason."
    >
      {DENSITIES.map((d) => (
        <div key={d} style={{ marginBottom: 20 }}>
          <p className="gallery-subhead">{d} — {CELL_PAD[d]}</p>
          <DemoTable density={d} />
        </div>
      ))}

      <button
        type="button"
        className="mb-3 text-caption underline"
        onClick={() => setLoading((v) => !v)}
        style={{ color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Show rows' : 'Show loading state'}
      </button>
      {loading && <SkeletonRows rows={3} />}
    </Section>
  )
}
