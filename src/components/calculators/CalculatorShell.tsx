'use client'

import type { ReactNode } from 'react'

export type ToolKey = 'board-foot' | 'table-planner' | 'quote-builder'

interface Tool {
  key: ToolKey
  num: string
  name: string
  desc: string
}

const TOOLS: Tool[] = [
  {
    key: 'board-foot',
    num: '01',
    name: 'Board Foot',
    desc: "Calculate board feet and $/BF value from any slab's dimensions.",
  },
  {
    key: 'table-planner',
    num: '02',
    name: 'Table Planner',
    desc: 'Room size and seating count — get the right slab dimensions.',
  },
  {
    key: 'quote-builder',
    num: '03',
    name: 'Quote Builder',
    desc: 'Configure a custom piece and get an instant price range estimate.',
  },
]

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`

interface Props {
  activeTool: ToolKey
  onChange: (tool: ToolKey) => void
  children: ReactNode
}

export default function CalculatorShell({ activeTool, onChange, children }: Props) {
  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{
        padding: '80px 60px 56px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="label" style={{ marginBottom: 14 }}>Free Tools</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 7vw, 88px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          color: 'var(--black)',
          lineHeight: 0.92,
          marginBottom: 20,
        }}>
          Calculators
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          fontStyle: 'italic',
          color: 'var(--gray)',
          lineHeight: 1.7,
          maxWidth: 440,
        }}>
          Plan your project before you buy. Every tool is free. No signup required.
        </p>
      </div>

      {/* Tool selector */}
      <div
        className="calc-tool-selector"
        style={{
          padding: '48px 60px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
        }}
      >
        {TOOLS.map((t) => {
          const active = t.key === activeTool
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={active ? 'calc-tool-card calc-tool-card-active' : 'calc-tool-card'}
              style={{
                padding: '28px 32px',
                background: active ? 'var(--black)' : '#f0ede8',
                cursor: active ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                border: 'none',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--tan)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                {t.num}
                {active && (
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    flexShrink: 0,
                  }} />
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: active ? '#fff' : 'var(--gray)',
              }}>
                {t.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontStyle: 'italic',
                color: active ? 'rgba(255,255,255,0.45)' : 'var(--gray)',
                lineHeight: 1.5,
              }}>
                {t.desc}
              </div>
            </button>
          )
        })}
      </div>

      {/* Active panel */}
      <div
        style={{
          margin: '0 60px 80px',
          background: '#fff',
          border: '1px solid var(--border)',
          borderTop: 'none',
          padding: 52,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(0,0,0,0.05)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: GRAIN_BG,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>

      <style>{`
        .calc-tool-card:not(.calc-tool-card-active):hover {
          background: #e8e4dc !important;
        }
        @media (max-width: 768px) {
          .calc-tool-selector {
            grid-template-columns: 1fr !important;
            padding: 32px 24px 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
