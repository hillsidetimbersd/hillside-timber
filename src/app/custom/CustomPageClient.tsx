'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import CustomProjectForm from '@/components/inquiry/CustomProjectForm'
import type { InquiryFormData, Step } from '@/components/inquiry/inquiry.types'
import type { PiecePreview } from '@/lib/squarespace'

function CustomPageInner({ pieces }: { pieces: PiecePreview[] }) {
  const search = useSearchParams()

  const initialForm: Partial<InquiryFormData> = {}
  const projectType = search.get('projectType')
  if (projectType) initialForm.projectType = projectType
  const species = search.get('species')
  if (species) initialForm.species = species.split(',').filter(Boolean)
  const finish = search.get('finish')
  if (finish) initialForm.finish = finish
  const dimensionsL = search.get('dimensionsL')
  if (dimensionsL) initialForm.dimensionsL = dimensionsL
  const dimensionsW = search.get('dimensionsW')
  if (dimensionsW) initialForm.dimensionsW = dimensionsW
  const dimensionsH = search.get('dimensionsH')
  if (dimensionsH) initialForm.dimensionsH = dimensionsH
  const vision = search.get('vision')
  if (vision) initialForm.vision = vision
  const budget = search.get('budget')
  if (budget) initialForm.budget = budget

  const hasPrefill = Object.keys(initialForm).length > 0
  const startStep: Step = hasPrefill ? 1 : 1

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div style={{
        position: 'relative', height: '46vh', minHeight: 380, overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1920&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,13,0.92), rgba(15,15,13,0.1))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '0 var(--section-pad-x) 56px', maxWidth: 'var(--content-max)', width: '100%', margin: '0 auto' }}>
          <div className="label" style={{ marginBottom: 12, color: 'var(--green-light)' }}>Sioux Falls Woodworking</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(46px, 6vw, 90px)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: '#fff', lineHeight: 0.92, marginBottom: 18 }}>
            Custom<br />Projects
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'rgba(255,255,255,0.82)', maxWidth: 650, lineHeight: 1.6, fontStyle: 'italic' }}>
            {hasPrefill
              ? "We've pre-filled your Quote Builder selections. Add a few contact details to finish your request."
              : 'Tell us about the piece you have in mind. We review every request personally.'
            }
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '80px var(--section-pad-x) 40px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)', letterSpacing: '-0.5px', marginBottom: 40, textAlign: 'center' }}>
          How it works
        </h2>
        <div className="how-it-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { num: '01', title: 'Submit a Request', body: 'Fill out the project form with your dimensions, species preferences, and budget.' },
            { num: '02', title: 'Get a Quote', body: 'We review your request and send a detailed quote and timeline within 1 to 2 business days.' },
            { num: '03', title: 'We Build It', body: 'Your piece is handcrafted in our Sioux Falls workshop using locally harvested timber.' },
            { num: '04', title: 'Delivered', body: 'We deliver locally or ship nationwide via freight. White-glove delivery available.' },
          ].map((step) => (
            <div key={step.num}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, color: 'var(--green)', lineHeight: 1, marginBottom: 10, opacity: 0.3 }}>
                {step.num}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-14)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 8, letterSpacing: '0.5px' }}>
                {step.title}
              </h3>
              <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', lineHeight: 1.7 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '40px 24px 100px' }}>
        <CustomProjectForm initialForm={initialForm} startStep={startStep} pieces={pieces} />
      </div>
    </div>
  )
}

export default function CustomPageClient({ pieces }: { pieces: PiecePreview[] }) {
  return (
    <Suspense fallback={null}>
      <CustomPageInner pieces={pieces} />
    </Suspense>
  )
}
