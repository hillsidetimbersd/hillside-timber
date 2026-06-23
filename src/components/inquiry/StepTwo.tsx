'use client'

import React from 'react'
import LineArtCard from './LineArtCard'
import ChipSelector from './ChipSelector'
import { SPECIES_OPTIONS, FINISH_OPTIONS } from './inquiry.types'
import type { InquiryFormData } from './inquiry.types'

interface Props {
  form: InquiryFormData
  set: (key: keyof InquiryFormData, value: unknown) => void
}

const DiningTableSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="8" x2="32" y2="8" />
    <line x1="7" y1="8" x2="5" y2="26" />
    <line x1="29" y1="8" x2="31" y2="26" />
    <line x1="13" y1="8" x2="12" y2="26" />
    <line x1="23" y1="8" x2="24" y2="26" />
  </svg>
)

const CoffeeTableSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="14" x2="32" y2="14" />
    <line x1="8" y1="14" x2="6" y2="24" />
    <line x1="28" y1="14" x2="30" y2="24" />
    <line x1="14" y1="14" x2="13" y2="24" />
    <line x1="22" y1="14" x2="23" y2="24" />
  </svg>
)

const BenchSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="12" x2="32" y2="12" />
    <line x1="9" y1="12" x2="7" y2="24" />
    <line x1="27" y1="12" x2="29" y2="24" />
  </svg>
)

const ShelfSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="6" x2="32" y2="6" />
    <line x1="4" y1="14" x2="32" y2="14" />
    <line x1="4" y1="22" x2="32" y2="22" />
    <line x1="4" y1="6" x2="4" y2="22" />
    <line x1="32" y1="6" x2="32" y2="22" />
  </svg>
)

const MantelSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="8" x2="33" y2="8" />
    <line x1="3" y1="8" x2="3" y2="26" />
    <line x1="33" y1="8" x2="33" y2="26" />
    <line x1="8" y1="8" x2="8" y2="26" />
    <line x1="28" y1="8" x2="28" y2="26" />
    <line x1="8" y1="26" x2="28" y2="26" />
  </svg>
)

const DeskSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="4" y1="10" x2="32" y2="10" />
    <line x1="7" y1="10" x2="5" y2="26" />
    <line x1="25" y1="10" x2="26" y2="26" />
    <line x1="26" y1="10" x2="32" y2="10" />
    <line x1="32" y1="10" x2="32" y2="26" />
  </svg>
)

const BedFrameSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="14" width="28" height="11" rx="1" />
    <line x1="4" y1="4" x2="4" y2="14" />
    <line x1="32" y1="4" x2="32" y2="14" />
    <line x1="4" y1="4" x2="32" y2="4" />
  </svg>
)

const OtherSvg = () => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="4" x2="18" y2="24" />
    <line x1="8" y1="14" x2="28" y2="14" />
    <line x1="11" y1="7" x2="25" y2="21" />
    <line x1="25" y1="7" x2="11" y2="21" />
  </svg>
)

const PROJECT_TYPES: { value: string; Svg: React.ComponentType }[] = [
  { value: 'Dining Table', Svg: DiningTableSvg },
  { value: 'Coffee Table', Svg: CoffeeTableSvg },
  { value: 'Bench', Svg: BenchSvg },
  { value: 'Shelf', Svg: ShelfSvg },
  { value: 'Mantel', Svg: MantelSvg },
  { value: 'Desk', Svg: DeskSvg },
  { value: 'Bed Frame', Svg: BedFrameSvg },
  { value: 'Other', Svg: OtherSvg },
]

export default function StepTwo({ form, set }: Props) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray)', marginBottom: 28, fontStyle: 'italic' }}>
        Tell us about the piece you have in mind.
      </p>

      <FormRow label="What are you building? *">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 4 }}>
          {PROJECT_TYPES.map(({ value, Svg }) => (
            <LineArtCard
              key={value}
              selected={form.projectType === value}
              onClick={() => set('projectType', value)}
              label={value}
              svg={<Svg />}
            />
          ))}
        </div>
        {form.projectType === 'Other' && (
          <input
            required
            value={form.projectTypeOther}
            onChange={e => set('projectTypeOther', e.target.value)}
            placeholder="What are you building?"
            style={{ marginTop: 12 }}
          />
        )}
      </FormRow>

      <FormRow label="Wood Species * (pick at least one)">
        <ChipSelector
          options={SPECIES_OPTIONS}
          value={form.species}
          onChange={v => set('species', v)}
          mode="multi"
          exclusiveOption="Not Sure"
        />
      </FormRow>

      <FormRow label="Finish Preference *">
        <ChipSelector
          options={FINISH_OPTIONS}
          value={form.finish}
          onChange={v => set('finish', v)}
          mode="single"
        />
      </FormRow>

      <FormRow label="Dimensions (optional, best estimate is fine)">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {(['L', 'W', 'H'] as const).map(dim => {
            const key = `dimensions${dim}` as 'dimensionsL' | 'dimensionsW' | 'dimensionsH'
            return (
              <div key={dim} style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '8px', fontWeight: 700, letterSpacing: '1px', color: 'var(--gray)', marginBottom: 4 }}>{dim}</div>
                <input
                  type="number"
                  min="0"
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder="0"
                />
              </div>
            )
          })}
          <div style={{
            display: 'flex', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: 38,
          }}>
            {(['in', 'cm'] as const).map(unit => {
              const active = form.dimensionsUnit === unit
              return (
                <button
                  key={unit}
                  type="button"
                  onClick={() => set('dimensionsUnit', unit)}
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
                    letterSpacing: '1.5px', textTransform: 'uppercase' as const,
                    padding: '0 12px', border: 'none',
                    background: active ? 'var(--black)' : '#fff',
                    color: active ? '#fff' : 'var(--gray)',
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {unit}
                </button>
              )
            })}
          </div>
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
        fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase' as const, color: 'var(--gray)', marginBottom: 10,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
