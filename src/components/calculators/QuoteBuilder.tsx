'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PieceTypeIcon from './PieceTypeIcon'
import {
  PIECE_TYPES,
  SPECIES,
  SPECIES_ORDER,
  BASE_STYLES,
  FINISHES,
  priceRange,
  quoteProgress,
  type QuoteState,
} from './calculator-data'

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`

type StepNum = 1 | 2 | 3 | 4

const STEPS: { num: StepNum; label: string }[] = [
  { num: 1, label: 'Piece Type' },
  { num: 2, label: 'Species' },
  { num: 3, label: 'Dimensions' },
  { num: 4, label: 'Base & Finish' },
]

export default function QuoteBuilder() {
  const router = useRouter()
  const [step, setStep] = useState<StepNum>(1)
  const [state, setState] = useState<QuoteState>({
    pieceType: null,
    species: null,
    dimensionsL: '',
    dimensionsW: '',
    dimensionsH: '',
    baseStyle: null,
    finish: null,
  })

  const price = useMemo(() => priceRange(state), [state])
  const progress = useMemo(() => quoteProgress(state), [state])

  function update<K extends keyof QuoteState>(key: K, value: QuoteState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }

  function stepComplete(n: StepNum): boolean {
    if (n === 1) return !!state.pieceType
    if (n === 2) return !!state.species
    if (n === 3) return !!(state.dimensionsL && state.dimensionsW && state.dimensionsH)
    if (n === 4) return !!(state.baseStyle && state.finish)
    return false
  }

  function canAdvance(): boolean {
    return stepComplete(step)
  }

  function handleNext() {
    if (step < 4) setStep((step + 1) as StepNum)
    else handleSubmit()
  }

  function handleBack() {
    if (step > 1) setStep((step - 1) as StepNum)
  }

  function handleSubmit() {
    const pieceLabel = PIECE_TYPES.find((p) => p.key === state.pieceType)?.label ?? ''
    const baseLabel = BASE_STYLES.find((b) => b.key === state.baseStyle)?.label ?? ''
    const finishLabel = FINISHES.find((f) => f.key === state.finish)?.label ?? ''

    const vision = `Configured via Quote Builder.

Piece: ${pieceLabel}
Species: ${state.species}
Dimensions: ${state.dimensionsL}" × ${state.dimensionsW}" × ${state.dimensionsH}"
Base: ${baseLabel}
Finish: ${finishLabel}
Estimated range: $${price?.min.toLocaleString()}–$${price?.max.toLocaleString()}`

    const params = new URLSearchParams({
      projectType: pieceLabel,
      species: state.species ?? '',
      finish: finishLabel,
      dimensionsL: state.dimensionsL,
      dimensionsW: state.dimensionsW,
      dimensionsH: state.dimensionsH,
      vision,
    })

    router.push(`/custom?${params.toString()}`)
  }

  return (
    <div style={{ margin: '-52px', position: 'relative' }}>
      {/* Step progress bar */}
      <div className="qb-step-bar" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2,
        borderBottom: '1px solid var(--border)',
      }}>
        {STEPS.map((s) => {
          const done = stepComplete(s.num) && step !== s.num
          const active = step === s.num
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              disabled={!done && !active && s.num > step}
              style={{
                padding: '18px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: active ? '#fff' : done ? '#f0ede8' : 'var(--cream)',
                border: 'none',
                borderBottom: active ? '2px solid var(--black)' : 'none',
                marginBottom: active ? -1 : 0,
                cursor: (done || active || s.num <= step) ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 700,
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: done ? 'var(--green)' : active ? 'var(--black)' : 'var(--border)',
                color: done || active ? '#fff' : 'var(--gray)',
                flexShrink: 0,
              }}>
                {done ? '✓' : s.num}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: active ? 'var(--black)' : done ? 'var(--gray-dark)' : 'var(--gray)',
                }}>
                  {s.label}
                </div>
                {done && (
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontStyle: 'italic',
                    color: 'var(--green)',
                    marginTop: 2,
                  }}>
                    {summaryForStep(s.num, state)}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Step body */}
      <div className="qb-body" style={{
        padding: 52,
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 56,
      }}>
        {/* Left: current step input */}
        <div>
          {step === 1 && (
            <StepHeader step={1} title="Pick a Piece">
              Each piece has its own base build time and materials. Don&apos;t worry about being exact: you can adjust in the final form.
            </StepHeader>
          )}
          {step === 2 && (
            <StepHeader step={2} title="Choose a Species">
              Each species has its own character, hardness, and price point. Black walnut commands a premium. White oak is timeless and versatile.
            </StepHeader>
          )}
          {step === 3 && (
            <StepHeader step={3} title="Your Dimensions">
              Measurements in inches. Standard dining table is 96 × 42 × 30. Coffee table is 54 × 24 × 18. When in doubt, we&apos;ll confirm with you.
            </StepHeader>
          )}
          {step === 4 && (
            <StepHeader step={4} title="Base & Finish">
              The base sets the look. The finish sets how it ages. Matte oil brings out the grain, satin lacquer stays protected, natural wax keeps it raw.
            </StepHeader>
          )}

          {step === 1 && <StepPieceType state={state} update={update} />}
          {step === 2 && <StepSpecies state={state} update={update} />}
          {step === 3 && <StepDimensions state={state} update={update} />}
          {step === 4 && <StepBaseFinish state={state} update={update} />}
        </div>

        {/* Right: running summary */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--gray)',
            marginBottom: 20,
          }}>
            Your Build
          </div>

          <div style={{
            border: '1px solid var(--border)',
            marginBottom: 2,
          }}>
            <SummaryRow
              label="Piece Type"
              value={PIECE_TYPES.find((p) => p.key === state.pieceType)?.label}
            />
            <SummaryRow label="Species" value={state.species ?? undefined} />
            <SummaryRow
              label="Dimensions"
              value={
                state.dimensionsL && state.dimensionsW && state.dimensionsH
                  ? `${state.dimensionsL}" × ${state.dimensionsW}" × ${state.dimensionsH}"`
                  : undefined
              }
            />
            <SummaryRow
              label="Base & Finish"
              value={
                state.baseStyle && state.finish
                  ? `${BASE_STYLES.find((b) => b.key === state.baseStyle)?.label} · ${FINISHES.find((f) => f.key === state.finish)?.label}`
                  : undefined
              }
            />
          </div>

          {/* Estimate block */}
          <div style={{
            background: 'var(--black)',
            padding: '28px 24px',
            marginBottom: 12,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, backgroundImage: GRAIN_BG, pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--tan)',
                marginBottom: 8,
              }}>
                Running Estimate
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '30px',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1,
              }}>
                {price
                  ? `$${price.min.toLocaleString()}–$${price.max.toLocaleString()}`
                  : 'Pick a piece to start'
                }
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.4)',
                marginTop: 8,
                lineHeight: 1.5,
              }}>
                Refines as you complete each step. Final quote from Slavic within 1–2 days.
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 16 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    style={{
                      height: 2,
                      flex: 1,
                      background: n <= progress ? 'var(--tan)' : 'rgba(255,255,255,0.15)',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {step > 1 && (
              <button
                onClick={handleBack}
                style={{
                  flex: '0 0 auto',
                  background: 'transparent',
                  color: 'var(--black)',
                  border: '1.5px solid var(--black)',
                  padding: '15px 20px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="qb-next"
              style={{
                flex: 1,
                background: canAdvance() ? 'var(--black)' : '#ddd6c5',
                color: '#fff',
                border: 'none',
                padding: 16,
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: canAdvance() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
              }}
            >
              {step < 4 ? `Continue to ${STEPS[step].label} →` : 'Send to Custom Form →'}
            </button>
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--gray)',
            marginTop: 10,
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            No commitment. The final button pre-fills the custom project form with your selections.
          </div>
        </div>
      </div>

      <style>{`
        .qb-next:hover:not(:disabled) { background: var(--green) !important; }
        @media (max-width: 900px) {
          .qb-body { grid-template-columns: 1fr !important; padding: 32px !important; }
        }
        @media (max-width: 768px) {
          .qb-step-bar { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

function summaryForStep(stepNum: StepNum, state: QuoteState): string {
  if (stepNum === 1) return PIECE_TYPES.find((p) => p.key === state.pieceType)?.label ?? ''
  if (stepNum === 2) return state.species ?? ''
  if (stepNum === 3) return `${state.dimensionsL} × ${state.dimensionsW} × ${state.dimensionsH}"`
  if (stepNum === 4) {
    const b = BASE_STYLES.find((b) => b.key === state.baseStyle)?.label ?? ''
    const f = FINISHES.find((f) => f.key === state.finish)?.label ?? ''
    return `${b} · ${f}`
  }
  return ''
}

function StepHeader({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="label" style={{ marginBottom: 10 }}>Step {step} of 4</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '-0.5px',
        marginBottom: 10,
        color: 'var(--black)',
        lineHeight: 1.05,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        fontStyle: 'italic',
        color: 'var(--gray)',
        lineHeight: 1.6,
        maxWidth: 480,
      }}>
        {children}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string | undefined }) {
  const pending = !value
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      opacity: pending ? 0.4 : 1,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--gray-dark)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: pending ? 'var(--font-body)' : 'var(--font-display)',
        fontSize: pending ? '12px' : '14px',
        fontStyle: pending ? 'italic' : 'normal',
        fontWeight: pending ? 400 : 700,
        color: pending ? 'var(--gray)' : 'var(--black)',
      }}>
        {value ?? 'Next step'}
      </span>
    </div>
  )
}

function StepPieceType({ state, update }: { state: QuoteState; update: <K extends keyof QuoteState>(k: K, v: QuoteState[K]) => void }) {
  return (
    <div className="qb-piece-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {PIECE_TYPES.map((p) => {
        const active = state.pieceType === p.key
        return (
          <button
            key={p.key}
            onClick={() => update('pieceType', p.key)}
            style={{
              border: `1px solid ${active ? 'var(--black)' : 'var(--border)'}`,
              background: active ? 'var(--black)' : '#fff',
              padding: '20px 18px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ marginBottom: 12, color: active ? '#fff' : 'var(--black)', opacity: 0.75 }}>
              <PieceTypeIcon type={p.key as never} size={32} color="currentColor" />
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: active ? '#fff' : 'var(--black)',
            }}>
              {p.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontStyle: 'italic',
              color: active ? 'rgba(255,255,255,0.45)' : 'var(--gray)',
              marginTop: 3,
            }}>
              {p.sub}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function StepSpecies({ state, update }: { state: QuoteState; update: <K extends keyof QuoteState>(k: K, v: QuoteState[K]) => void }) {
  return (
    <div className="qb-species-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {SPECIES_ORDER.map((name) => {
        const info = SPECIES[name]
        const active = state.species === name
        return (
          <button
            key={name}
            onClick={() => update('species', name)}
            style={{
              border: `1px solid ${active ? 'var(--black)' : 'var(--border)'}`,
              background: '#fff',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 56, background: info.gradient }} />
            <div style={{ padding: '14px 16px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--black)',
              }}>
                {info.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontStyle: 'italic',
                color: 'var(--gray)',
                marginTop: 3,
              }}>
                {info.blurb}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function StepDimensions({ state, update }: { state: QuoteState; update: <K extends keyof QuoteState>(k: K, v: QuoteState[K]) => void }) {
  return (
    <div className="qb-dim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
      <DimField label="Length" value={state.dimensionsL} onChange={(v) => update('dimensionsL', v)} />
      <DimField label="Width" value={state.dimensionsW} onChange={(v) => update('dimensionsW', v)} />
      <DimField label="Thickness" value={state.dimensionsH} onChange={(v) => update('dimensionsH', v)} />
    </div>
  )
}

function DimField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      background: 'var(--cream)',
      border: '1px solid var(--border)',
      padding: '20px 24px 16px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
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
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: '1.5px solid var(--border)',
          padding: '4px 0 8px',
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
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
        fontSize: '12px',
        fontStyle: 'italic',
        color: 'var(--gray)',
        marginTop: 6,
      }}>
        Inches
      </div>
    </div>
  )
}

function StepBaseFinish({ state, update }: { state: QuoteState; update: <K extends keyof QuoteState>(k: K, v: QuoteState[K]) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--green)',
          marginBottom: 12,
        }}>
          Base style
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 6 }}>
          {BASE_STYLES.map((b) => {
            const active = state.baseStyle === b.key
            return (
              <button
                key={b.key}
                onClick={() => update('baseStyle', b.key)}
                style={{
                  padding: '14px 16px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: `1px solid ${active ? 'var(--black)' : 'var(--border)'}`,
                  background: active ? 'var(--black)' : '#fff',
                  color: active ? '#fff' : 'var(--gray-dark)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {b.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--green)',
          marginBottom: 12,
        }}>
          Finish
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 6 }}>
          {FINISHES.map((f) => {
            const active = state.finish === f.key
            return (
              <button
                key={f.key}
                onClick={() => update('finish', f.key)}
                style={{
                  padding: '14px 16px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: `1px solid ${active ? 'var(--black)' : 'var(--border)'}`,
                  background: active ? 'var(--black)' : '#fff',
                  color: active ? '#fff' : 'var(--gray-dark)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
