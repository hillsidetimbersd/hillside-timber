'use client'

import React from 'react'
import DropZone from './DropZone'
import ChipSelector from './ChipSelector'
import { BUDGET_OPTIONS, TIMELINE_OPTIONS } from './inquiry.types'
import type { InquiryFormData } from './inquiry.types'

interface Props {
  form: InquiryFormData
  set: (key: keyof InquiryFormData, value: unknown) => void
}

export default function StepThree({ form, set }: Props) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', color: 'var(--gray)', marginBottom: 28, fontStyle: 'italic' }}>
        Almost done. Help us understand your budget, timing, and vision.
      </p>

      <FormRow label="Budget Range *">
        <ChipSelector
          options={BUDGET_OPTIONS}
          value={form.budget}
          onChange={v => set('budget', v)}
          mode="single"
        />
      </FormRow>

      <FormRow label="Timeline *">
        <ChipSelector
          options={TIMELINE_OPTIONS}
          value={form.timeline}
          onChange={v => set('timeline', v)}
          mode="single"
        />
      </FormRow>

      <FormRow label="Inspiration Photos">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-11)', color: 'var(--gray)', fontStyle: 'italic', marginBottom: 10, marginTop: -4 }}>
          Drop photos of your space, inspiration pieces, or style references.
        </p>
        <DropZone
          files={form.photos}
          onChange={files => set('photos', files)}
        />
      </FormRow>

      <FormRow label="Your Vision, Your Way *">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-11)', color: 'var(--gray)', fontStyle: 'italic', marginBottom: 10, marginTop: -4 }}>
          Share anything. A sketch, a vibe, a Pinterest board description, how the piece will be used, what matters most to you. We read every word and love to collaborate to make this exactly right.
        </p>
        <textarea
          required
          rows={6}
          value={form.vision}
          onChange={e => set('vision', e.target.value)}
          placeholder="Tell us everything..."
        />
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
