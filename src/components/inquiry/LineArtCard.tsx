'use client'

import React from 'react'

interface Props {
  selected: boolean
  onClick: () => void
  label: string
  sublabel?: string
  svg: React.ReactNode
  size?: 'sm' | 'md'
}

export default function LineArtCard({ selected, onClick, label, sublabel, svg, size = 'md' }: Props) {
  const padding = size === 'sm' ? '14px 8px 12px' : '16px 8px 12px'

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected ? 'rgba(74,124,89,0.06)' : '#fff',
        border: selected ? '2px solid var(--green)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding,
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div style={{ color: selected ? 'var(--green)' : 'var(--gray)', lineHeight: 0 }}>
        {svg}
      </div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-9)',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase' as const,
          color: selected ? 'var(--green)' : 'var(--black)',
          marginBottom: sublabel ? 2 : 0,
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-10)',
            color: 'var(--gray)',
            fontStyle: 'italic',
          }}>
            {sublabel}
          </div>
        )}
      </div>
    </button>
  )
}
