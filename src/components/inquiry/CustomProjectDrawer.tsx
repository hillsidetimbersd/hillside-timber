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
    setTimeout(() => {
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
    setStep(s => Math.min(s + 1, 3) as Step)
  }

  function handleBack() {
    setError(null)
    setStep(s => Math.max(s - 1, 1) as Step)
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
    form.photos.forEach((f, i) => fd.append(`photo_${i}`, f))

    try {
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

  const isBusy = status === 'sending'

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
          box-sizing: border-box;
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
