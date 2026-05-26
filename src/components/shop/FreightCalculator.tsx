'use client'

import { useState } from 'react'
import { Truck } from '@phosphor-icons/react'
import { estimateFreight, type FreightEstimate } from '@/lib/freight'

export default function FreightCalculator() {
  const [zip, setZip] = useState('')
  const [result, setResult] = useState<FreightEstimate | null>(null)
  const [loading, setLoading] = useState(false)

  function calculate() {
    if (zip.length < 5) return
    setLoading(true)
    setTimeout(() => {
      setResult(estimateFreight(zip))
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      padding: '32px',
      marginTop: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Truck size={20} color="var(--green)" />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: 'var(--black)',
        }}>
          Freight Estimator
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--gray)',
        marginBottom: 20,
        fontStyle: 'italic',
      }}>
        Heavy slabs ship via LTL freight. Enter your zip code for an estimated shipping range.
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Your zip code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          onKeyDown={(e) => e.key === 'Enter' && calculate()}
          maxLength={5}
          style={{
            flex: 1,
            padding: '10px 14px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            border: '1px solid var(--border)',
            outline: 'none',
            color: 'var(--black)',
          }}
        />
        <button
          onClick={calculate}
          disabled={zip.length < 5 || loading}
          style={{
            padding: '10px 20px',
            background: zip.length >= 5 ? 'var(--black)' : '#e0dbd0',
            color: zip.length >= 5 ? '#fff' : 'var(--gray)',
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            border: 'none',
            cursor: zip.length >= 5 ? 'pointer' : 'default',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          {loading ? '...' : 'Estimate'}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: 16,
          padding: '16px',
          background: 'var(--cream)',
          borderLeft: '3px solid var(--green)',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: 4,
          }}>
            {result.tier.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--black)',
            marginBottom: 4,
          }}>
            ${result.tier.min.toLocaleString()} &ndash; ${result.tier.max.toLocaleString()}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--gray)',
            fontStyle: 'italic',
          }}>
            Estimated for your zip code. Final quote provided at checkout. Contact us for multi-piece shipments.
          </div>
        </div>
      )}
    </div>
  )
}
