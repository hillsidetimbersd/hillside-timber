# Custom Project Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-scroll inquiry drawer with a premium 3-step wizard that collects structured project data, supports drag-and-drop photo upload, and gives clients a collaborative, craft-quality experience.

**Architecture:** The existing `CustomProjectDrawer` becomes a step controller using `useReducer` for form state. Each step is a separate component. Shared UI atoms (LineArtCard, ChipSelector, DropZone, ProgressBar) are self-contained with no external dependencies. Photos are uploaded server-side via the existing `/api/inquiry` route, which is changed to accept `multipart/form-data`.

**Tech Stack:** Next.js 16 App Router, TypeScript, React 19, @supabase/supabase-js v2, @phosphor-icons/react, inline styles with CSS custom properties.

---

## File Map

**Create:**
- `src/components/inquiry/inquiry.types.ts` — shared types and constants
- `src/components/inquiry/ProgressBar.tsx` — 3-segment step indicator
- `src/components/inquiry/LineArtCard.tsx` — selectable SVG card atom
- `src/components/inquiry/ChipSelector.tsx` — square chip group (single/multi)
- `src/components/inquiry/DropZone.tsx` — drag-and-drop upload with thumbnail grid
- `src/components/inquiry/SuccessScreen.tsx` — post-submit confirmation panel
- `src/components/inquiry/StepOne.tsx` — About You (contact + delivery)
- `src/components/inquiry/StepTwo.tsx` — Your Project (type, species, finish, dimensions)
- `src/components/inquiry/StepThree.tsx` — Details (budget, timeline, photos, vision)

**Modify:**
- `src/components/inquiry/CustomProjectDrawer.tsx` — rewritten as step controller
- `src/app/api/inquiry/route.ts` — extended for new fields + photo upload

---

## Task 1: Supabase Schema Migration

**Files:**
- Run in: Supabase SQL editor for the woodworking project

- [ ] **Step 1: Add new columns to `inquiries` table**

Open the Supabase SQL editor and run:

```sql
-- Add new columns
alter table inquiries
  add column if not exists zip_code text,
  add column if not exists delivery_method text,
  add column if not exists finish_preference text,
  add column if not exists photo_urls text[],
  add column if not exists dimensions jsonb;

-- Widen species_preference from text to text[]
-- (skip if column is already text[])
alter table inquiries
  alter column species_preference type text[]
  using case
    when species_preference is null then null
    else array[species_preference]
  end;
```

- [ ] **Step 2: Create the `inquiry-photos` storage bucket**

In the Supabase dashboard: Storage → New bucket → name it `inquiry-photos` → toggle Public on → Save.

Or run via SQL editor (uses the storage schema):

```sql
insert into storage.buckets (id, name, public)
values ('inquiry-photos', 'inquiry-photos', true)
on conflict (id) do nothing;
```

- [ ] **Step 3: Verify**

In Table Editor, confirm `inquiries` has the new columns. In Storage, confirm `inquiry-photos` bucket exists.

---

## Task 2: Shared Types

**Files:**
- Create: `src/components/inquiry/inquiry.types.ts`

- [ ] **Step 1: Create the types file**

```typescript
export type DeliveryMethod = '' | 'pickup' | 'local' | 'nationwide'
export type DimensionsUnit = 'in' | 'cm'
export type SubmitStatus = 'idle' | 'uploading' | 'sending' | 'sent' | 'error'
export type Step = 1 | 2 | 3

export interface InquiryFormData {
  // Step 1
  name: string
  email: string
  phone: string
  zip: string
  deliveryMethod: DeliveryMethod

  // Step 2
  projectType: string
  projectTypeOther: string
  species: string[]
  finish: string
  dimensionsL: string
  dimensionsW: string
  dimensionsH: string
  dimensionsUnit: DimensionsUnit

  // Step 3
  budget: string
  timeline: string
  vision: string
  photos: File[]
}

export const INITIAL_FORM: InquiryFormData = {
  name: '', email: '', phone: '', zip: '', deliveryMethod: '',
  projectType: '', projectTypeOther: '', species: [], finish: '',
  dimensionsL: '', dimensionsW: '', dimensionsH: '', dimensionsUnit: 'in',
  budget: '', timeline: '', vision: '', photos: [],
}

export const SPECIES_OPTIONS = ['Walnut', 'White Oak', 'Cherry', 'Maple', 'Ash', 'Pine', 'Cedar', 'Not Sure']
export const FINISH_OPTIONS = ['Natural / Raw', 'Matte Oil', 'Satin Lacquer', 'Semi-Gloss', 'Painted', 'Not Sure']
export const BUDGET_OPTIONS = ['Under $1,000', '$1,000–$3,000', '$3,000–$6,000', '$6,000–$12,000', '$12,000+']
export const TIMELINE_OPTIONS = ['As Soon As Possible', 'Within 3 Months', '3–6 Months', '6+ Months', 'No Rush']

export function validateStep(step: Step, form: InquiryFormData): string | null {
  if (step === 1) {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits.'
    if (!/^\d{5}$/.test(form.zip)) return 'Zip code must be 5 digits.'
    if (!form.deliveryMethod) return 'Please select a delivery option.'
    return null
  }
  if (step === 2) {
    if (!form.projectType) return 'Please select a project type.'
    if (form.projectType === 'Other' && !form.projectTypeOther.trim()) return 'Please tell us what you\'re building.'
    if (form.species.length === 0) return 'Please select at least one wood species.'
    if (!form.finish) return 'Please select a finish preference.'
    return null
  }
  if (step === 3) {
    if (!form.budget) return 'Please select a budget range.'
    if (!form.timeline) return 'Please select a timeline.'
    if (form.vision.trim().length < 20) return 'Tell us a bit more — at least a sentence or two.'
    return null
  }
  return null
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/johanannunez/workspace/woodworking
npx tsc --noEmit
```

Expected: no errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/inquiry/inquiry.types.ts .gitignore
git commit -m "feat: add inquiry form types and constants"
```

---

## Task 3: ProgressBar Component

**Files:**
- Create: `src/components/inquiry/ProgressBar.tsx`

- [ ] **Step 1: Create the component**

```typescript
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
              textTransform: 'uppercase',
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/ProgressBar.tsx
git commit -m "feat: add ProgressBar step indicator"
```

---

## Task 4: LineArtCard Component

**Files:**
- Create: `src/components/inquiry/LineArtCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

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
        borderRadius: 3,
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
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: selected ? 'var(--green)' : 'var(--black)',
          marginBottom: sublabel ? 2 : 0,
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/LineArtCard.tsx
git commit -m "feat: add LineArtCard selectable SVG card atom"
```

---

## Task 5: ChipSelector Component

**Files:**
- Create: `src/components/inquiry/ChipSelector.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

interface Props {
  options: string[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  mode: 'single' | 'multi'
  exclusiveOption?: string
}

export default function ChipSelector({ options, value, onChange, mode, exclusiveOption }: Props) {
  function isSelected(opt: string): boolean {
    if (mode === 'single') return value === opt
    return Array.isArray(value) && value.includes(opt)
  }

  function handleClick(opt: string) {
    if (mode === 'single') {
      onChange(opt)
      return
    }
    const current = Array.isArray(value) ? value : []
    if (opt === exclusiveOption) {
      onChange([opt])
      return
    }
    const withoutExclusive = current.filter(v => v !== exclusiveOption)
    if (withoutExclusive.includes(opt)) {
      onChange(withoutExclusive.filter(v => v !== opt))
    } else {
      onChange([...withoutExclusive, opt])
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => handleClick(opt)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '8px 14px',
            borderRadius: 2,
            border: isSelected(opt) ? '2px solid var(--green)' : '1px solid var(--border)',
            background: isSelected(opt) ? 'rgba(74,124,89,0.06)' : '#fff',
            color: isSelected(opt) ? 'var(--green)' : 'var(--gray)',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s, color 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/ChipSelector.tsx
git commit -m "feat: add ChipSelector single/multi chip atom"
```

---

## Task 6: DropZone Component

**Files:**
- Create: `src/components/inquiry/DropZone.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

import { useRef, useState } from 'react'
import { X, UploadSimple, Image } from '@phosphor-icons/react'

interface Props {
  files: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

export default function DropZone({ files, onChange, maxFiles = 5, maxSizeMB = 10 }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(incoming: File[]) {
    const valid = incoming.filter(f =>
      ['image/jpeg', 'image/png'].includes(f.type) &&
      f.size <= maxSizeMB * 1024 * 1024
    )
    onChange([...files, ...valid].slice(0, maxFiles))
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  const hasFiles = files.length > 0
  const canAddMore = files.length < maxFiles

  return (
    <div>
      {/* Drop zone — shown always if can add more, collapsed after first upload */}
      {canAddMore && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            addFiles(Array.from(e.dataTransfer.files))
          }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? 'var(--green)' : hasFiles ? 'var(--border)' : 'var(--border)'}`,
            borderRadius: 4,
            padding: hasFiles ? '14px 16px' : '32px 16px',
            textAlign: 'center',
            background: dragging ? 'rgba(74,124,89,0.04)' : '#fff',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            marginBottom: hasFiles ? 12 : 0,
          }}
        >
          {hasFiles ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <UploadSimple size={16} color="var(--green)" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green)' }}>
                Add More
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gray)' }}>
                ({files.length}/{maxFiles})
              </span>
            </div>
          ) : (
            <>
              <Image size={32} color="var(--gray)" weight="light" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--black)', marginBottom: 6 }}>
                Drop photos here
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--gray)' }}>
                or{' '}
                <span style={{ color: 'var(--green)', textDecoration: 'underline' }}>browse files</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--border)', marginTop: 8 }}>
                JPG or PNG · Up to {maxFiles} photos · {maxSizeMB}MB each
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        style={{ display: 'none' }}
        onChange={e => {
          if (e.target.files) addFiles(Array.from(e.target.files))
          e.target.value = ''
        }}
      />

      {/* Thumbnail grid */}
      {hasFiles && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {files.map((file, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 3, overflow: 'hidden', background: 'var(--border)' }}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(15,15,13,0.7)',
                  border: 'none', borderRadius: '50%',
                  width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={10} color="#fff" weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/DropZone.tsx
git commit -m "feat: add DropZone drag-and-drop photo upload atom"
```

---

## Task 7: SuccessScreen Component

**Files:**
- Create: `src/components/inquiry/SuccessScreen.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

import { CheckCircle } from '@phosphor-icons/react'

interface Props {
  onClose: () => void
}

export default function SuccessScreen({ onClose }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 16, padding: '40px 32px',
      textAlign: 'center',
    }}>
      <CheckCircle size={64} color="var(--green)" weight="light" />
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px', fontWeight: 800,
        textTransform: 'uppercase', color: 'var(--black)',
        letterSpacing: '-0.5px', lineHeight: 1.1,
      }}>
        We've got<br />your project.
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px', color: 'var(--gray)',
        maxWidth: 300, fontStyle: 'italic', lineHeight: 1.7,
      }}>
        Slavic reviews every request personally and will be in touch within 1–2 business days. We love what we do — let's build something great together.
      </p>
      <button onClick={onClose} className="btn-ghost" style={{ marginTop: 8 }}>
        Close
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/SuccessScreen.tsx
git commit -m "feat: add SuccessScreen post-submit panel"
```

---

## Task 8: StepOne — About You

**Files:**
- Create: `src/components/inquiry/StepOne.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

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
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray)', marginBottom: 28, fontStyle: 'italic' }}>
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
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-display)',
        fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/StepOne.tsx
git commit -m "feat: add StepOne (About You) with delivery method cards"
```

---

## Task 9: StepTwo — Your Project

**Files:**
- Create: `src/components/inquiry/StepTwo.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

import LineArtCard from './LineArtCard'
import ChipSelector from './ChipSelector'
import { SPECIES_OPTIONS, FINISH_OPTIONS } from './inquiry.types'
import type { InquiryFormData } from './inquiry.types'

interface Props {
  form: InquiryFormData
  set: (key: keyof InquiryFormData, value: unknown) => void
}

// SVG components for each project type
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

      {/* Project type grid */}
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

      {/* Species */}
      <FormRow label="Wood Species * (pick at least one)">
        <ChipSelector
          options={SPECIES_OPTIONS}
          value={form.species}
          onChange={v => set('species', v)}
          mode="multi"
          exclusiveOption="Not Sure"
        />
      </FormRow>

      {/* Finish */}
      <FormRow label="Finish Preference *">
        <ChipSelector
          options={FINISH_OPTIONS}
          value={form.finish}
          onChange={v => set('finish', v)}
          mode="single"
        />
      </FormRow>

      {/* Dimensions */}
      <FormRow label="Dimensions (optional — your best estimate)">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {(['L', 'W', 'H'] as const).map(dim => (
            <div key={dim} style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '8px', fontWeight: 700, letterSpacing: '1px', color: 'var(--gray)', marginBottom: 4 }}>{dim}</div>
              <input
                type="number"
                min="0"
                value={form[`dimensions${dim}` as 'dimensionsL' | 'dimensionsW' | 'dimensionsH']}
                onChange={e => set(`dimensions${dim}` as keyof InquiryFormData, e.target.value)}
                placeholder="0"
              />
            </div>
          ))}
          <div style={{ paddingTop: 18 }}>
            <button
              type="button"
              onClick={() => set('dimensionsUnit', form.dimensionsUnit === 'in' ? 'cm' : 'in')}
              style={{
                fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
                letterSpacing: '1px', textTransform: 'uppercase',
                padding: '10px 10px', border: '1px solid var(--border)',
                background: '#fff', color: 'var(--gray)', cursor: 'pointer',
                borderRadius: 2, whiteSpace: 'nowrap',
              }}
            >
              {form.dimensionsUnit}
            </button>
          </div>
        </div>
      </FormRow>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-display)',
        fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 10,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/StepTwo.tsx
git commit -m "feat: add StepTwo (Your Project) with line art cards and chip selectors"
```

---

## Task 10: StepThree — Details

**Files:**
- Create: `src/components/inquiry/StepThree.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client'

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
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray)', marginBottom: 28, fontStyle: 'italic' }}>
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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gray)', fontStyle: 'italic', marginBottom: 10 }}>
          Drop photos of your space, inspiration pieces, or style references.
        </p>
        <DropZone
          files={form.photos}
          onChange={files => set('photos', files)}
        />
      </FormRow>

      <FormRow label="Your Vision, Your Way *">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gray)', fontStyle: 'italic', marginBottom: 10 }}>
          Share anything — a sketch, a vibe, a Pinterest board description, how the piece will be used, what matters most to you. We read every word and love to collaborate to make this exactly right.
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
    <div style={{ marginBottom: 24 }}>
      <label style={{
        display: 'block', fontFamily: 'var(--font-display)',
        fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/inquiry/StepThree.tsx
git commit -m "feat: add StepThree (Details) with budget, timeline, upload, and vision"
```

---

## Task 11: Refactor CustomProjectDrawer

**Files:**
- Modify: `src/components/inquiry/CustomProjectDrawer.tsx` (full rewrite)

- [ ] **Step 1: Rewrite the drawer as a step controller**

```typescript
'use client'

import { useReducer, useState } from 'react'
import { X } from '@phosphor-icons/react'
import ProgressBar from './ProgressBar'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import SuccessScreen from './SuccessScreen'
import { INITIAL_FORM, validateStep } from './inquiry.types'
import type { InquiryFormData, Step, SubmitStatus } from './inquiry.types'

interface Props {
  open: boolean
  onClose: () => void
}

type Action = { key: keyof InquiryFormData; value: unknown }

function reducer(state: InquiryFormData, action: Action): InquiryFormData {
  return { ...state, [action.key]: action.value }
}

export default function CustomProjectDrawer({ open, onClose }: Props) {
  const [form, dispatch] = useReducer(reducer, INITIAL_FORM)
  const [step, setStep] = useState<Step>(1)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof InquiryFormData, value: unknown) {
    dispatch({ key, value })
  }

  function handleClose() {
    onClose()
    // Reset after slide-out animation
    setTimeout(() => {
      dispatch({ key: 'name', value: '' })
      // Re-initialize all fields
      Object.keys(INITIAL_FORM).forEach(k => {
        dispatch({ key: k as keyof InquiryFormData, value: INITIAL_FORM[k as keyof InquiryFormData] })
      })
      setStep(1)
      setStatus('idle')
      setError(null)
    }, 400)
  }

  function handleNext() {
    const err = validateStep(step, form)
    if (err) { setError(err); return }
    setError(null)
    setStep((s) => Math.min(s + 1, 3) as Step)
  }

  function handleBack() {
    setError(null)
    setStep((s) => Math.max(s - 1, 1) as Step)
  }

  async function handleSubmit() {
    const err = validateStep(3, form)
    if (err) { setError(err); return }

    setStatus('uploading')
    setError(null)

    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('email', form.email)
    fd.append('phone', form.phone)
    fd.append('zip', form.zip)
    fd.append('deliveryMethod', form.deliveryMethod)
    fd.append('projectType', form.projectType === 'Other' ? form.projectTypeOther : form.projectType)
    form.species.forEach(s => fd.append('species', s))
    fd.append('finish', form.finish)
    fd.append('dimensions', JSON.stringify({
      l: form.dimensionsL, w: form.dimensionsW,
      h: form.dimensionsH, unit: form.dimensionsUnit,
    }))
    fd.append('budget', form.budget)
    fd.append('timeline', form.timeline)
    fd.append('vision', form.vision)
    form.photos.forEach((f, i) => fd.append(`photo_${i}`, f))

    try {
      setStatus('sending')
      const res = await fetch('/api/inquiry', { method: 'POST', body: fd })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setError('Something went wrong — please try again.')
      }
    } catch {
      setStatus('error')
      setError('Something went wrong — please try again.')
    }
  }

  const isBusy = status === 'uploading' || status === 'sending'

  return (
    <>
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,15,13,0.5)',
            zIndex: 80, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480, background: '#fff', zIndex: 90,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div className="label" style={{ marginBottom: 6 }}>Sioux Falls Woodworking</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800,
                letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)',
              }}>
                Start a Custom Project
              </h2>
              {status !== 'sent' && <ProgressBar step={step} />}
            </div>
            <button
              onClick={handleClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', marginLeft: 16 }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {status === 'sent' ? (
            <SuccessScreen onClose={handleClose} />
          ) : (
            <>
              {step === 1 && <StepOne form={form} set={set} />}
              {step === 2 && <StepTwo form={form} set={set} />}
              {step === 3 && <StepThree form={form} set={set} />}
            </>
          )}
        </div>

        {/* Footer */}
        {status !== 'sent' && (
          <div style={{
            padding: '16px 32px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {error && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#c0392b', marginBottom: 4 }}>
                {error}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isBusy}
                  className="btn-ghost"
                  style={{ flex: '0 0 auto' }}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isBusy}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {isBusy ? 'Sending...' : 'Send Project Request'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        input, textarea, select {
          width: 100%;
          padding: 10px 12px;
          font-family: var(--font-body);
          font-size: 13px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--black);
          outline: none;
          transition: border-color 0.15s;
          border-radius: 0;
          appearance: none;
        }
        input:focus, textarea:focus, select:focus {
          border-color: var(--green);
        }
        textarea { resize: vertical; }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </>
  )
}
```

- [ ] **Step 2: Start dev server and open the form**

```bash
cd /Users/johanannunez/workspace/woodworking
pnpm dev
```

Open `http://localhost:3000/custom` and click "Start Your Project." Verify:
- Drawer slides in
- Progress bar shows step 1 of 3
- All Step 1 fields render
- Delivery method cards are selectable
- Clicking Next without filling fields shows the correct validation error
- Filling all fields and clicking Next advances to Step 2
- Step 2 project type cards are selectable, species and finish chips work
- Step 3 budget/timeline chips, drop zone, and vision textarea all work
- Back navigation works on steps 2 and 3

- [ ] **Step 3: Commit**

```bash
git add src/components/inquiry/CustomProjectDrawer.tsx
git commit -m "feat: refactor CustomProjectDrawer as 3-step wizard"
```

---

## Task 12: Update API Route

**Files:**
- Modify: `src/app/api/inquiry/route.ts` (full rewrite)

- [ ] **Step 1: Rewrite the route to accept FormData and handle photo uploads**

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null
    const phone = formData.get('phone') as string | null
    const zip = formData.get('zip') as string | null
    const deliveryMethod = formData.get('deliveryMethod') as string | null
    const projectType = formData.get('projectType') as string | null
    const species = formData.getAll('species') as string[]
    const finish = formData.get('finish') as string | null
    const dimensionsRaw = formData.get('dimensions') as string | null
    const budget = formData.get('budget') as string | null
    const timeline = formData.get('timeline') as string | null
    const vision = formData.get('vision') as string | null

    if (!name || !email || !projectType || !budget || !vision) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const dimensions = dimensionsRaw ? JSON.parse(dimensionsRaw) : null

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Upload photos to Supabase Storage
    const photoUrls: string[] = []
    let i = 0
    while (formData.get(`photo_${i}`)) {
      const file = formData.get(`photo_${i}`) as File
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('inquiry-photos')
        .upload(path, file, { contentType: file.type })
      if (!uploadError) {
        const { data } = supabase.storage.from('inquiry-photos').getPublicUrl(path)
        photoUrls.push(data.publicUrl)
      }
      i++
    }

    const { error } = await supabase.from('inquiries').insert({
      name,
      email,
      phone: phone || null,
      zip_code: zip || null,
      delivery_method: deliveryMethod || null,
      project_type: projectType,
      species_preference: species.length > 0 ? species : null,
      finish_preference: finish || null,
      dimensions: dimensions,
      budget_range: budget,
      timeline: timeline || null,
      description: vision,
      photo_urls: photoUrls.length > 0 ? photoUrls : null,
      status: 'new',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Test the full form submission**

With the dev server running, fill out all 3 steps of the form and submit. Verify:
- No console errors during submission
- The success screen appears with the correct message
- In the Supabase Table Editor, `inquiries` has a new row with all fields populated
- If photos were attached, `photo_urls` is populated and the URLs are reachable in a browser
- In Supabase Storage, `inquiry-photos` contains the uploaded files

- [ ] **Step 3: Run the build to verify no TypeScript errors**

```bash
cd /Users/johanannunez/workspace/woodworking
pnpm build
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/inquiry/route.ts
git commit -m "feat: update inquiry API to accept FormData and upload photos to Supabase Storage"
```

---

## Out of Scope

- Email notification to Slavic on submission
- Admin view of submitted inquiries
- Client-side image compression
- Freight cost estimation in the form
- The business contact email in the error message — confirm the address and hardcode it before shipping
