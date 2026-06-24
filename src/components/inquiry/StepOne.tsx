'use client'

import React from 'react'
import LineArtCard from './LineArtCard'
import type { InquiryFormData, DeliveryMethod } from './inquiry.types'

interface Props {
  form: InquiryFormData
  set: (key: keyof InquiryFormData, value: unknown) => void
}

const PickupSvg = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="12" width="20" height="16" rx="1" />
    <polyline points="3,14 16,4 29,14" />
    <rect x="13" y="20" width="6" height="8" />
  </svg>
)

const LocalSvg = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="13" width="22" height="12" rx="1" />
    <path d="M24 17h4l2 4v4h-6V17z" />
    <circle cx="8" cy="27" r="2" />
    <circle cx="22" cy="27" r="2" />
  </svg>
)

const FreightSvg = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="8" width="20" height="16" rx="1" />
    <line x1="6" y1="16" x2="26" y2="16" />
    <line x1="16" y1="8" x2="16" y2="24" />
    <line x1="2" y1="20" x2="6" y2="20" />
    <line x1="26" y1="20" x2="30" y2="20" />
  </svg>
)

const DELIVERY: { value: DeliveryMethod; label: string; sublabel: string; Svg: React.ComponentType }[] = [
  { value: 'pickup', label: 'Pickup', sublabel: 'Come to our Sioux Falls shop', Svg: PickupSvg },
  { value: 'local', label: 'Local Delivery', sublabel: 'Sioux Falls area', Svg: LocalSvg },
  { value: 'nationwide', label: 'Nationwide Freight', sublabel: 'We ship anywhere', Svg: FreightSvg },
]

export default function StepOne({ form, set }: Props) {
  return (
    <div>
      <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', marginBottom: 28 }}>
        Tell us a little about yourself so we can reach you with a quote.
      </p>

      <FormRow label="Your Name *">
        <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
      </FormRow>
      <FormRow label="Email *">
        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
      </FormRow>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormRow label="Phone">
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(605) 555-0100" />
        </FormRow>
        <FormRow label="Zip Code *">
          <input
            required
            value={form.zip}
            onChange={e => set('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="57401"
            maxLength={5}
          />
        </FormRow>
      </div>

      <FormRow label="Delivery *">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
          {DELIVERY.map(({ value, label, sublabel, Svg }) => (
            <LineArtCard
              key={value}
              selected={form.deliveryMethod === value}
              onClick={() => set('deliveryMethod', value)}
              label={label}
              sublabel={sublabel}
              svg={<Svg />}
              size="sm"
            />
          ))}
        </div>
      </FormRow>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase' as const, color: 'var(--gray)', marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
