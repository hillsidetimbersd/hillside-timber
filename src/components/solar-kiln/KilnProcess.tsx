'use client'

import { useState } from 'react'
import {
  Sun,
  SolarRoof,
  Fan,
  ArrowsClockwise,
  StackSimple,
  ThermometerSimple,
  Drop,
  SolarPanel,
  Snowflake,
  Truck,
  type Icon,
} from '@phosphor-icons/react'
import type { KilnIconKey, KilnPoint, KilnSpec } from '@/lib/solar-kiln'

const ICONS: Record<KilnIconKey, Icon> = {
  Sun,
  SolarRoof,
  Fan,
  ArrowsClockwise,
  StackSimple,
  ThermometerSimple,
  Drop,
  SolarPanel,
  Snowflake,
  Truck,
}

// Where each numbered pin sits on the cutaway, keyed by the point's `n`. Kept in
// the component (presentation), not in the data file.
const PIN: Record<string, { x: number; y: number }> = {
  '1': { x: 545, y: 150 }, // sunlight in (on a ray)
  '2': { x: 300, y: 278 }, // collector roof (glaze)
  '3': { x: 424, y: 232 }, // solar fans
  '4': { x: 408, y: 290 }, // airflow loop (plenum)
  '5': { x: 320, y: 400 }, // stickered stack
  '6': { x: 300, y: 347 }, // black collector panel
  '7': { x: 470, y: 176 }, // vents
}

type Step = { n: string; title: string; body: string }

interface KilnProcessProps {
  howItWorks: { eyebrow: string; heading: string; sub: string; points: KilnPoint[] }
  built: { eyebrow: string; dims: string; dimsLabel: string; specs: KilnSpec[] }
  steps: Step[]
}

export default function KilnProcess({ howItWorks, built, steps }: KilnProcessProps) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section style={{ background: 'var(--cream)', padding: '72px var(--section-pad-x)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
          <div className="label" style={{ marginBottom: 12 }}>{howItWorks.eyebrow}</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 3.6vw, 50px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              textTransform: 'uppercase',
              color: 'var(--black)',
              lineHeight: 0.96,
            }}
          >
            {howItWorks.heading}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-15)',
              color: 'var(--gray-dark)',
              fontStyle: 'italic',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '14px auto 0',
            }}
          >
            {howItWorks.sub}
          </p>
        </div>

        {/* Diagram + interactive callouts */}
        <div
          className="kiln2-hiw"
          style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'center' }}
        >
          {/* The custom cutaway */}
          <figure
            style={{
              margin: 0,
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '18px 18px 14px',
            }}
          >
            <svg width="100%" viewBox="188 50 492 446" role="img" style={{ display: 'block' }}>
              <title>Cutaway of our solar kiln</title>
              <desc>
                A sectioned cutaway of the solar kiln on timber skids: a steep clear collector roof
                gathers sunlight, solar-powered fans drive a warm-air loop that rises, crosses the
                top, and is forced down through a stickered lumber stack, while roof vents release
                heat and moisture. Numbered points match the list of how it works.
              </desc>
              <defs>
                <marker
                  id="kilnAgreen"
                  viewBox="0 0 10 10"
                  refX="6.5"
                  refY="5"
                  markerWidth="6.2"
                  markerHeight="6.2"
                  orient="auto"
                >
                  <path
                    d="M1.5 1L8.5 5L1.5 9"
                    fill="none"
                    stroke="#2f7d52"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
                <marker
                  id="kilnAmber"
                  viewBox="0 0 10 10"
                  refX="6.5"
                  refY="5"
                  markerWidth="6.4"
                  markerHeight="6.4"
                  orient="auto"
                >
                  <path
                    d="M1.5 1L8.5 5L1.5 9"
                    fill="none"
                    stroke="#cf8a34"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
                <radialGradient id="kilnSunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f3cd88" stopOpacity="0.85" />
                  <stop offset="55%" stopColor="#f0c987" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f0c987" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="kilnGlaze" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#e7f0ea" />
                  <stop offset="100%" stopColor="#cfe0d6" />
                </linearGradient>
                <pattern
                  id="kilnHatch"
                  width="7"
                  height="7"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="7" stroke="#c6b896" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Sun + glow */}
              <circle cx="618" cy="108" r="52" fill="url(#kilnSunGlow)" />
              <circle cx="618" cy="108" r="22" fill="#ecc174" />
              <g stroke="#e6b85f" strokeWidth="2.4" strokeLinecap="round">
                <line x1="618" y1="74" x2="618" y2="66" />
                <line x1="643" y1="83" x2="650" y2="76" />
                <line x1="652" y1="108" x2="661" y2="108" />
                <line x1="643" y1="133" x2="650" y2="140" />
                <line x1="593" y1="83" x2="586" y2="76" />
              </g>
              <line
                x1="596"
                y1="124"
                x2="486"
                y2="196"
                stroke="#d9a955"
                strokeWidth="2.1"
                strokeDasharray="0.1 9"
                strokeLinecap="round"
                markerEnd="url(#kilnAmber)"
              />
              <line
                x1="606"
                y1="146"
                x2="470"
                y2="214"
                stroke="#d9a955"
                strokeWidth="2.1"
                strokeDasharray="0.1 9"
                strokeLinecap="round"
                markerEnd="url(#kilnAmber)"
              />

              {/* Ground: stone bed + skids */}
              <rect x="196" y="470" width="288" height="15" rx="3" fill="#dad4c7" />
              <g fill="#c7c0ae">
                <circle cx="214" cy="478" r="2.6" />
                <circle cx="232" cy="474" r="2" />
                <circle cx="250" cy="480" r="2.4" />
                <circle cx="300" cy="476" r="2.2" />
                <circle cx="340" cy="481" r="2.6" />
                <circle cx="372" cy="475" r="2" />
                <circle cx="410" cy="479" r="2.4" />
                <circle cx="446" cy="476" r="2.2" />
                <circle cx="466" cy="481" r="2.5" />
                <circle cx="282" cy="482" r="2" />
                <circle cx="356" cy="473" r="1.8" />
                <circle cx="428" cy="483" r="2" />
              </g>
              <g fill="#7c6648" stroke="#5b4a33" strokeWidth="1">
                <rect x="250" y="456" width="32" height="17" rx="2" />
                <rect x="398" y="456" width="32" height="17" rx="2" />
              </g>

              {/* Building body: structure, hatch, interior */}
              <polygon points="210,456 210,355 470,155 470,456" fill="#e9e2d4" />
              <polygon points="210,456 210,355 470,155 470,456" fill="url(#kilnHatch)" />
              <polygon points="222,438 222,367 458,170 458,438" fill="#fcfaf6" />
              <polygon
                points="210,456 210,355 470,155 470,456"
                fill="none"
                stroke="#2a5c3f"
                strokeWidth="2.3"
                strokeLinejoin="round"
              />
              <polygon
                points="222,438 222,367 458,170 458,438"
                fill="none"
                stroke="#2a5c3f"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <line x1="222" y1="438" x2="458" y2="438" stroke="#2a5c3f" strokeWidth="1.6" />

              {/* Glazed collector roof */}
              <polygon
                points="210,355 470,155 470,140 210,340"
                fill="url(#kilnGlaze)"
                stroke="#2a5c3f"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <g stroke="#a7c5b3" strokeWidth="1.1">
                <line x1="250" y1="333" x2="260" y2="318" />
                <line x1="300" y1="295" x2="310" y2="280" />
                <line x1="350" y1="256" x2="360" y2="241" />
                <line x1="400" y1="218" x2="410" y2="203" />
                <line x1="448" y1="181" x2="458" y2="166" />
              </g>

              {/* Lumber stack (stickered) */}
              <g stroke="#9c7c52" strokeWidth="0.8">
                <rect x="252" y="425" width="172" height="13" rx="1.5" fill="#c8a882" />
                <rect x="252" y="407" width="172" height="13" rx="1.5" fill="#cfb088" />
                <rect x="252" y="389" width="172" height="13" rx="1.5" fill="#c3a077" />
                <rect x="252" y="371" width="172" height="13" rx="1.5" fill="#cfb088" />
                <rect x="252" y="353" width="172" height="13" rx="1.5" fill="#c8a882" />
              </g>
              <g fill="#86683f">
                <rect x="272" y="420" width="5" height="5" />
                <rect x="272" y="402" width="5" height="5" />
                <rect x="272" y="384" width="5" height="5" />
                <rect x="272" y="366" width="5" height="5" />
                <rect x="399" y="420" width="5" height="5" />
                <rect x="399" y="402" width="5" height="5" />
                <rect x="399" y="384" width="5" height="5" />
                <rect x="399" y="366" width="5" height="5" />
              </g>
              <rect x="256" y="341" width="172" height="12" rx="1.5" fill="#1c1c1a" />

              {/* Airflow (hero) */}
              <g fill="none" strokeLinecap="round">
                <path d="M446,232 C360,245 305,300 282,330" stroke="#dd9b4a" strokeWidth="9" opacity="0.16" />
                <line x1="446" y1="430" x2="446" y2="272" stroke="#dd9b4a" strokeWidth="9" opacity="0.16" />
                <line x1="320" y1="357" x2="320" y2="432" stroke="#2f7d52" strokeWidth="8" opacity="0.15" />
                <line x1="392" y1="357" x2="392" y2="432" stroke="#2f7d52" strokeWidth="8" opacity="0.15" />
                <line x1="238" y1="430" x2="238" y2="356" stroke="#2f7d52" strokeWidth="8" opacity="0.15" />
              </g>
              <line
                x1="446"
                y1="430"
                x2="446"
                y2="272"
                stroke="#d9952f"
                strokeWidth="3.2"
                strokeLinecap="round"
                markerEnd="url(#kilnAmber)"
              />
              <path
                d="M446,232 C360,245 305,300 282,330"
                fill="none"
                stroke="#d9952f"
                strokeWidth="3.2"
                strokeLinecap="round"
                markerEnd="url(#kilnAmber)"
              />
              <line
                x1="320"
                y1="357"
                x2="320"
                y2="432"
                stroke="#2f7d52"
                strokeWidth="3.2"
                strokeLinecap="round"
                markerEnd="url(#kilnAgreen)"
              />
              <line
                x1="392"
                y1="357"
                x2="392"
                y2="432"
                stroke="#2f7d52"
                strokeWidth="3.2"
                strokeLinecap="round"
                markerEnd="url(#kilnAgreen)"
              />
              <line
                x1="238"
                y1="430"
                x2="238"
                y2="356"
                stroke="#2f7d52"
                strokeWidth="3.2"
                strokeLinecap="round"
                markerEnd="url(#kilnAgreen)"
              />

              {/* Fan + baffle */}
              <g transform="translate(445,250)">
                <circle r="15" fill="#fbf9f5" stroke="#2a5c3f" strokeWidth="1.9" />
                <path
                  d="M0,0 C7,-10 12,-4 0,0 C-10,-7 -4,-12 0,0 C7,10 12,4 0,0 C10,7 4,12 0,0 Z"
                  fill="#2a5c3f"
                />
                <circle r="2.2" fill="#fbf9f5" />
              </g>
              <line x1="430" y1="262" x2="398" y2="282" stroke="#2a5c3f" strokeWidth="3.4" strokeLinecap="round" />

              {/* Vent */}
              <rect x="450" y="182" width="16" height="9" rx="1.5" fill="#fbf9f5" stroke="#2a5c3f" strokeWidth="1.6" />
              <line
                x1="468"
                y1="184"
                x2="496"
                y2="164"
                stroke="#7e8d83"
                strokeWidth="2"
                strokeDasharray="0.1 7"
                strokeLinecap="round"
                markerEnd="url(#kilnAmber)"
              />
              <line
                x1="470"
                y1="194"
                x2="498"
                y2="180"
                stroke="#7e8d83"
                strokeWidth="2"
                strokeDasharray="0.1 7"
                strokeLinecap="round"
                markerEnd="url(#kilnAmber)"
              />

              {/* Numbered, interactive pins */}
              {howItWorks.points.map((p) => {
                const pos = PIN[p.n]
                if (!pos) return null
                const on = active === p.n
                return (
                  <g
                    key={p.n}
                    // Pointer-only convenience pins. The keyboard-accessible callout list
                    // below is the real control, and the SVG is role="img" with a title/desc,
                    // so these are hidden from assistive tech rather than half-exposed.
                    aria-hidden="true"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setActive(p.n)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => setActive(on ? null : p.n)}
                  >
                    {on && (
                      <circle cx={pos.x} cy={pos.y} r="16.5" fill="none" stroke="#c8a882" strokeWidth="2.5" />
                    )}
                    <circle cx={pos.x} cy={pos.y} r={on ? 13 : 11.5} fill="#2a5c3f" />
                    <text
                      x={pos.x}
                      y={pos.y + 4.4}
                      fontSize="12.5"
                      fontWeight="700"
                      fill="#ffffff"
                      textAnchor="middle"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {p.n}
                    </text>
                  </g>
                )
              })}
            </svg>
          </figure>

          {/* Callouts */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {howItWorks.points.map((p) => {
              const PointIcon = ICONS[p.icon]
              const on = active === p.n
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(p.n)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(p.n)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(on ? null : p.n)}
                    style={{
                      display: 'flex',
                      gap: 13,
                      alignItems: 'flex-start',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius)',
                      border: `1px solid ${on ? 'var(--green)' : 'var(--border)'}`,
                      background: on ? 'rgba(42, 92, 63, 0.06)' : '#fff',
                      transition: 'border-color 0.18s ease, background 0.18s ease, transform 0.18s ease',
                      transform: on ? 'translateX(2px)' : 'none',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'var(--green)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {p.n}
                    </span>
                    <span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <PointIcon size={17} weight="regular" color="var(--green)" aria-hidden="true" />
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--fs-15)',
                            fontWeight: 800,
                            letterSpacing: '0.3px',
                            textTransform: 'uppercase',
                            color: 'var(--black)',
                          }}
                        >
                          {p.title}
                        </span>
                      </span>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--fs-13)',
                          color: 'var(--gray-dark)',
                          lineHeight: 1.55,
                        }}
                      >
                        {p.body}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* The sequence we follow */}
        <div style={{ marginTop: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="label">The sequence we follow</div>
          </div>
          <div className="kiln2-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {steps.map((s) => (
              <div
                key={s.n}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '28px 26px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-12)',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: 'var(--tan)',
                    marginBottom: 10,
                  }}
                >
                  {s.n}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    color: 'var(--black)',
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--fs-15)',
                    color: 'var(--gray-dark)',
                    lineHeight: 1.7,
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How it's built (brief, buyer-friendly) */}
        <div
          className="kiln2-built"
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 40,
            alignItems: 'center',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div className="label" style={{ marginBottom: 10 }}>{built.eyebrow}</div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 2.6vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: 'var(--green)',
                lineHeight: 1,
              }}
            >
              {built.dims}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-11)',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
                marginTop: 8,
              }}
            >
              {built.dimsLabel}
            </div>
          </div>
          <div className="kiln2-specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px 26px' }}>
            {built.specs.map((s) => {
              const SpecIcon = ICONS[s.icon]
              return (
                <div key={s.title} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--cream)',
                      border: '1px solid var(--border)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <SpecIcon size={18} weight="regular" color="var(--green)" aria-hidden="true" />
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--fs-13)',
                        fontWeight: 800,
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase',
                        color: 'var(--black)',
                        marginBottom: 2,
                      }}
                    >
                      {s.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--fs-13)',
                        color: 'var(--gray-dark)',
                        lineHeight: 1.5,
                      }}
                    >
                      {s.body}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .kiln2-hiw { grid-template-columns: 1fr !important; gap: 28px !important; }
          .kiln2-steps { grid-template-columns: 1fr !important; }
          .kiln2-built { grid-template-columns: 1fr !important; gap: 24px !important; }
          .kiln2-specs { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
