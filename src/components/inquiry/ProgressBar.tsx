'use client'

import type { Step } from './inquiry.types'

interface Props {
  step: Step
}

const LABELS = ['You', 'Project', 'Details']

export default function ProgressBar({ step }: Props) {
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
      {LABELS.map((label, i) => {
        const segStep = (i + 1) as Step
        const done = step > segStep
        const active = step === segStep
        return (
          <div key={label} style={{ flex: 1 }}>
            <div style={{
              height: 3,
              background: done || active ? 'var(--green)' : 'var(--border)',
              opacity: active ? 0.6 : 1,
              borderRadius: 2,
              marginBottom: 6,
            }} />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
              color: active ? 'var(--green)' : done ? 'var(--black)' : 'var(--gray)',
            }}>
              {label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
