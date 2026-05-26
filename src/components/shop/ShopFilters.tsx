'use client'

import { X } from '@phosphor-icons/react'

export interface FilterState {
  species: string
  type: string
  kilnStatus: string
  minPrice: number
  maxPrice: number
  search: string
}

const SPECIES = [
  'Black Walnut', 'Claro Walnut', 'Bastogne Walnut',
  'Spalted Maple', 'Silver Maple',
  'Buckeye Burl', 'Redwood Burl',
  'Aspen', 'White Oak', 'Cherry', 'Elm', 'Cottonwood', 'Ponderosa Pine', 'Cedar',
]
const TYPES = ['Live Edge Slab', 'Round/Cookie', 'Mantel', 'Turning Blank', 'Burl Cap', 'Billet', 'Table', 'Bench']
const KILN = [
  { value: 'solar-kiln', label: 'Solar Kiln Dried' },
  { value: 'air-dried', label: 'Air Dried' },
  { value: 'green', label: 'Green' },
]

export const DEFAULT_FILTERS: FilterState = {
  species: '',
  type: '',
  kilnStatus: '',
  minPrice: 0,
  maxPrice: 1000000,
  search: '',
}

interface Props {
  filters: FilterState
  onChange: (f: FilterState) => void
}

export default function ShopFilters({ filters, onChange }: Props) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value })
  }

  function clear() { onChange(DEFAULT_FILTERS) }

  const hasActive = Object.entries(filters).some(([k, v]) => {
    if (k === 'minPrice') return v !== 0
    if (k === 'maxPrice') return v !== 500000
    return v !== ''
  })

  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      paddingRight: 40,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--black)',
        }}>
          Filters
        </span>
        {hasActive && (
          <button onClick={clear} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '1px',
            color: 'var(--gray)',
          }}>
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Search */}
      <FilterGroup label="Search">
        <input
          type="text"
          placeholder="Species, type..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            border: '1px solid var(--border)',
            background: '#fff',
            color: 'var(--black)',
            outline: 'none',
          }}
        />
      </FilterGroup>

      {/* Species */}
      <FilterGroup label="Species">
        <ChipSelect options={SPECIES} value={filters.species} onChange={(v) => set('species', v)} />
      </FilterGroup>

      {/* Type */}
      <FilterGroup label="Type">
        <ChipSelect options={TYPES.map((t) => t)} value={filters.type} onChange={(v) => set('type', v)} />
      </FilterGroup>

      {/* Kiln status */}
      <FilterGroup label="Kiln Status">
        {KILN.map((k) => (
          <label key={k.value} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="kiln"
              value={k.value}
              checked={filters.kilnStatus === k.value}
              onChange={() => set('kilnStatus', filters.kilnStatus === k.value ? '' : k.value)}
              style={{ accentColor: 'var(--green)' }}
            />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray-dark)' }}>
              {k.label}
            </span>
          </label>
        ))}
      </FilterGroup>

      {/* Price range */}
      <FilterGroup label="Max Price">
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--black)',
          marginBottom: 8,
        }}>
          Up to ${(filters.maxPrice / 100).toLocaleString()}
        </div>
        <input
          type="range"
          min={0}
          max={1000000}
          step={5000}
          value={filters.maxPrice}
          onChange={(e) => set('maxPrice', Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--green)' }}
        />
      </FilterGroup>
    </aside>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--gray)',
        marginBottom: 12,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function ChipSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(active ? '' : opt)}
            style={{
              padding: '5px 10px',
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
              background: active ? 'var(--green)' : '#fff',
              color: active ? '#fff' : 'var(--gray-dark)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
