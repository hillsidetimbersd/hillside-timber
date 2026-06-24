'use client'

import { useReducer, useState } from 'react'
import ProgressBar from './ProgressBar'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import SuccessScreen from './SuccessScreen'
import { INITIAL_FORM, validateStep } from './inquiry.types'
import type { InquiryFormData, Step, SubmitStatus } from './inquiry.types'
import type { PiecePreview } from '@/lib/squarespace'

type Action = { key: keyof InquiryFormData; value: unknown }

function reducer(state: InquiryFormData, action: Action): InquiryFormData {
  return { ...state, [action.key]: action.value }
}

interface Props {
  pieces: PiecePreview[]
  initialForm?: Partial<InquiryFormData>
  startStep?: Step
}

export default function CustomProjectForm({ pieces, initialForm, startStep = 1 }: Props) {
  const [form, dispatch] = useReducer(reducer, { ...INITIAL_FORM, ...(initialForm ?? {}) })
  const [step, setStep] = useState<Step>(startStep)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof InquiryFormData, value: unknown) {
    dispatch({ key, value })
  }

  function handleNext() {
    const err = validateStep(step, form)
    if (err) { setError(err); return }
    setError(null)
    setStep(s => Math.min(s + 1, 3) as Step)
  }

  function handleBack() {
    setError(null)
    setStep(s => Math.max(s - 1, 1) as Step)
  }

  function handleReset() {
    Object.keys(INITIAL_FORM).forEach(k => {
      dispatch({ key: k as keyof InquiryFormData, value: INITIAL_FORM[k as keyof InquiryFormData] })
    })
    setStep(1)
    setStatus('idle')
    setError(null)
  }

  async function handleSubmit() {
    const err = validateStep(3, form)
    if (err) { setError(err); return }

    setStatus('sending')
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
    if (form.referencedPieces.length > 0) {
      fd.append('referencedPieces', JSON.stringify(
        form.referencedPieces.map(p => ({
          sku: p.sku, name: p.name, dimensions: p.dimensions,
          price: p.priceLabel, url: p.productUrl, drying: p.drying,
        })),
      ))
    }
    form.photos.forEach((f, i) => fd.append(`photo_${i}`, f))

    try {
      const res = await fetch('/api/inquiry', { method: 'POST', body: fd })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again.')
    }
  }

  const isBusy = status === 'sending'

  return (
    <div className="custom-project-form" style={{
      background: '#fff',
      border: '1px solid var(--border)',
      maxWidth: 640,
      margin: '0 auto',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ padding: '36px 40px 24px', borderBottom: '1px solid var(--border)' }}>
        <div className="label" style={{ marginBottom: 8 }}>Sioux Falls Woodworking</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800,
          letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)',
          lineHeight: 1.05,
        }}>
          Start a Custom Project
        </h2>
        {status !== 'sent' && <ProgressBar step={step} />}
      </div>

      <div style={{ padding: '32px 40px', minHeight: 360 }}>
        {status === 'sent' ? (
          <SuccessScreen onClose={handleReset} />
        ) : (
          <>
            {step === 1 && <StepOne form={form} set={set} />}
            {step === 2 && <StepTwo form={form} set={set} pieces={pieces} />}
            {step === 3 && <StepThree form={form} set={set} />}
          </>
        )}
      </div>

      {status !== 'sent' && (
        <div style={{
          padding: '20px 40px 28px',
          borderTop: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {error && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', color: '#c0392b' }}>
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

      <style>{`
        .custom-project-form input,
        .custom-project-form textarea,
        .custom-project-form select {
          width: 100%;
          padding: 10px 12px;
          font-family: var(--font-body);
          font-size: 13px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--black);
          outline: none;
          transition: border-color 0.15s;
          border-radius: var(--radius);
          appearance: none;
          box-sizing: border-box;
        }
        .custom-project-form input:focus,
        .custom-project-form textarea:focus,
        .custom-project-form select:focus {
          border-color: var(--green);
        }
        .custom-project-form textarea { resize: vertical; }
        .custom-project-form input[type="number"]::-webkit-outer-spin-button,
        .custom-project-form input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  )
}
