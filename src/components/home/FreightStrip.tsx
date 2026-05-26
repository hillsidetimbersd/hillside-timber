'use client'

import { useState } from 'react'
import { estimateFreight, type FreightEstimate } from '@/lib/freight'

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`

export default function FreightStrip() {
  const [zip, setZip] = useState('')
  const [result, setResult] = useState<FreightEstimate | null>(null)
  const [loading, setLoading] = useState(false)

  function calculate() {
    if (zip.length < 5) return
    setLoading(true)
    setTimeout(() => {
      setResult(estimateFreight(zip))
      setLoading(false)
    }, 400)
  }

  function reset() {
    setResult(null)
    setZip('')
  }

  return (
    <section
      style={{
        background: 'var(--green)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN_BG,
          pointerEvents: 'none',
        }}
      />

      {!result ? (
        <InputState
          zip={zip}
          setZip={setZip}
          loading={loading}
          calculate={calculate}
        />
      ) : (
        <ResultState zip={zip} result={result} reset={reset} />
      )}

      <style>{`
        .freight-strip-inner {
          padding: 32px 60px;
          display: flex;
          align-items: center;
          gap: 48px;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .freight-strip-inner input::placeholder { color: rgba(255,255,255,0.4); }
        @keyframes freight-slide-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .freight-result-animate { animation: freight-slide-in 0.4s ease-out; }
        @media (max-width: 900px) {
          .freight-strip-inner {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 20px !important;
            padding: 28px 24px !important;
          }
          .freight-result-main {
            text-align: left !important;
          }
          .freight-result-divider {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}

function InputState({
  zip,
  setZip,
  loading,
  calculate,
}: {
  zip: string
  setZip: (v: string) => void
  loading: boolean
  calculate: () => void
}) {
  const enabled = zip.length >= 5 && !loading
  return (
    <div className="freight-strip-inner">
      <div style={{ flex: 1, minWidth: 200 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 6,
          }}
        >
          We Ship Nationwide
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.2vw, 26px)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#fff',
            lineHeight: 1.1,
          }}
        >
          How much does freight cost to your door?
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && enabled) calculate()
          }}
          maxLength={5}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRight: 'none',
            padding: '14px 22px',
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            width: 148,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={calculate}
          disabled={!enabled}
          style={{
            background: '#fff',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--green)',
            cursor: enabled ? 'pointer' : 'not-allowed',
            opacity: enabled ? 1 : 0.55,
            whiteSpace: 'nowrap',
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Estimating…' : 'Estimate'}
        </button>
      </div>
    </div>
  )
}

function ResultState({
  zip,
  result,
  reset,
}: {
  zip: string
  result: FreightEstimate
  reset: () => void
}) {
  return (
    <div className="freight-strip-inner freight-result-animate">
      <div style={{ flex: 1, minWidth: 200 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 6,
          }}
        >
          Shipping to {zip}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.2vw, 26px)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#fff',
            lineHeight: 1.1,
          }}
        >
          {result.tier.label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.55)',
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          Approximately {result.miles.toLocaleString()} miles from our yard in Canistota, SD.
        </div>
      </div>

      <div
        className="freight-result-divider"
        aria-hidden="true"
        style={{ width: 1, background: 'rgba(255,255,255,0.22)', alignSelf: 'stretch' }}
      />

      <div
        className="freight-result-main"
        style={{
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--tan)',
          }}
        >
          Estimated Freight
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 4.5vw, 56px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-1px',
          }}
        >
          ${result.tier.min.toLocaleString()}–${result.tier.max.toLocaleString()}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.55)',
            marginTop: 2,
          }}
        >
          Final quote confirmed at checkout.
        </div>

        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 8,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '10px 18px',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.borderColor = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
          }}
        >
          ← Try another zip
        </button>
      </div>
    </div>
  )
}
