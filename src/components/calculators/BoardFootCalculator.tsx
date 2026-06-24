'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  SPECIES,
  SPECIES_ORDER,
  boardFeet,
  slabWeight,
} from './calculator-data'

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`

export default function BoardFootCalculator() {
  const [species, setSpecies] = useState('White Oak')
  const [thickness, setThickness] = useState('2.5')
  const [width, setWidth] = useState('36')
  const [length, setLength] = useState('96')

  const result = useMemo(() => {
    const t = parseFloat(thickness)
    const w = parseFloat(width)
    const l = parseFloat(length)
    const bf = boardFeet(t, w, l)
    if (bf <= 0) return null

    const info = SPECIES[species]
    const weight = slabWeight(bf, species)
    const totalMin = bf * info.pricePerBFMin
    const totalMax = bf * info.pricePerBFMax

    return {
      bf: Math.round(bf * 10) / 10,
      pricePerBFMin: info.pricePerBFMin,
      pricePerBFMax: info.pricePerBFMax,
      totalMin: Math.round(totalMin),
      totalMax: Math.round(totalMax),
      weight: Math.round(weight),
    }
  }, [species, thickness, width, length])

  return (
    <>
      {/* Species chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 40 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-9)',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--gray)',
          marginRight: 10,
        }}>
          Species
        </span>
        {SPECIES_ORDER.map((s) => {
          const active = species === s
          return (
            <button
              key={s}
              onClick={() => setSpecies(s)}
              style={{
                padding: '5px 12px',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-10)',
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
              {s}
            </button>
          )
        })}
      </div>

      {/* Dimension inputs */}
      <div className="bf-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginBottom: 2 }}>
        <DimensionField label="Thickness" value={thickness} onChange={setThickness} />
        <DimensionField label="Width" value={width} onChange={setWidth} />
        <DimensionField label="Length" value={length} onChange={setLength} />
      </div>

      {/* Result */}
      <div
        className="bf-result"
        style={{
          background: 'var(--black)',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'auto 1px 1fr',
          marginBottom: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN_BG, pointerEvents: 'none' }} />

        <div style={{
          padding: '44px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 260,
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--tan)',
            marginBottom: 12,
          }}>
            Board Feet
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '104px',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 0.9,
            letterSpacing: '-2px',
          }}>
            {result ? result.bf : '—'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-16)',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            marginTop: 10,
          }}>
            Board Feet
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="bf-result-stats" style={{
          padding: '44px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '26px',
          alignContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <ResultStat
            label="Est. Value Range"
            value={result ? `$${result.pricePerBFMin}–${result.pricePerBFMax} / BF` : '—'}
          />
          <ResultStat
            label="Slab Total Est."
            value={result ? `$${result.totalMin.toLocaleString()}–$${result.totalMax.toLocaleString()}` : '—'}
          />
          <ResultStat
            label="Approx. Weight"
            value={result ? `~${result.weight} lbs` : '—'}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="bf-disclaimer"
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-13)',
          fontStyle: 'italic',
          color: 'var(--gray)',
          lineHeight: 1.65,
        }}>
          <strong style={{ fontStyle: 'normal', fontWeight: 600, color: 'var(--gray-dark)' }}>These are estimates only.</strong>{' '}
          $/BF ranges reflect current South Dakota hardwood market rates and vary by piece quality, figure, and availability. Final pricing is set per slab.
        </p>
        <Link
          href={`/shop?species=${encodeURIComponent(species)}`}
          className="bf-shop-cta"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            background: 'var(--black)',
            color: '#fff',
            padding: '14px 28px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
        >
          Shop Matching Slabs →
        </Link>
      </div>

      <style>{`
        .bf-shop-cta:hover { background: var(--green) !important; }
        @media (max-width: 768px) {
          .bf-grid { grid-template-columns: 1fr !important; }
          .bf-result { grid-template-columns: 1fr !important; }
          .bf-result > div:nth-child(2) { display: none; }
          .bf-result-stats { padding: 28px 32px !important; }
          .bf-disclaimer { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </>
  )
}

function DimensionField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      background: 'var(--cream)',
      border: '1px solid var(--border)',
      padding: '20px 24px 16px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-9)',
        fontWeight: 700,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'var(--gray)',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const next = e.target.value.replace(/[^\d.]/g, '')
          onChange(next)
        }}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: '1.5px solid var(--border)',
          padding: '4px 0 8px',
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 800,
          color: 'var(--black)',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--green)')}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--border)')}
      />
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-12)',
        fontStyle: 'italic',
        color: 'var(--gray)',
        marginTop: 6,
      }}>
        Inches
      </div>
    </div>
  )
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-9)',
        fontWeight: 700,
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
        marginBottom: 5,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--tan)',
      }}>
        {value}
      </div>
    </div>
  )
}
