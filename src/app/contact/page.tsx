'use client'

import { useState, useEffect } from 'react'
import { Phone, Envelope, MapPin } from '@phosphor-icons/react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prefill the message when arriving from a piece's "Reserve / Inquire" action.
  useEffect(() => {
    const piece = new URLSearchParams(window.location.search).get('piece')
    if (piece) {
      setForm((f) => ({ ...f, message: `I'm interested in ${piece}. Is it still available to buy or reserve?` }))
    }
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setSending(false)
        return
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
      setSending(false)
    }
  }

  const focusable = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'var(--green)'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'var(--border)'
    },
  }

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div className="contact-grid" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '80px var(--section-pad-x)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        {/* Left */}
        <div>
          <div className="label" style={{ marginBottom: 16 }}>Get in Touch</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5vw, 68px)',
            fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)',
            lineHeight: 0.95, marginBottom: 32,
          }}>
            Let&apos;s talk wood.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 48, fontStyle: 'italic' }}>
            Have a question about a slab? Want to come visit the yard? Looking to start a custom project? Reach out and we will get back to you fast.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ContactDetail icon={<Phone size={20} />} label="Phone" value="(605) 310-4846" href="tel:6053104846" />
            <ContactDetail icon={<Envelope size={20} />} label="Email" value="hillsidetimbersd@gmail.com" href="mailto:hillsidetimbersd@gmail.com" />
            <ContactDetail icon={<MapPin size={20} />} label="Yard Visits" value="By appointment only. 15 miles west of Sioux Falls on Hwy 42." />
          </div>
        </div>

        {/* Right */}
        <div>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)' }}>
                Message Sent
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--gray)', textAlign: 'center', fontStyle: 'italic' }}>
                Thanks for reaching out. We will reply within 1-2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Honeypot: hidden from people, catches bots. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  />
                </label>
              </div>
              <div>
                <label htmlFor="contact-name" style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>Name *</label>
                <input id="contact-name" required type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" {...focusable} style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px', border: '1px solid var(--border)', outline: 'none', background: '#fff', transition: 'border-color 0.15s', borderRadius: 'var(--radius)' }} />
              </div>
              <div>
                <label htmlFor="contact-email" style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>Email *</label>
                <input id="contact-email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" {...focusable} style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px', border: '1px solid var(--border)', outline: 'none', background: '#fff', transition: 'border-color 0.15s', borderRadius: 'var(--radius)' }} />
              </div>
              <div>
                <label htmlFor="contact-message" style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>Message *</label>
                <textarea id="contact-message" required rows={6} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="What can we help you with?" {...focusable} style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px', border: '1px solid var(--border)', outline: 'none', background: '#fff', resize: 'vertical', transition: 'border-color 0.15s', borderRadius: 'var(--radius)' }} />
              </div>
              {error && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#9b2c2c', lineHeight: 1.5, margin: 0 }}>
                  {error}
                </p>
              )}
              <button type="submit" disabled={sending} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: sending ? 0.65 : 1, cursor: sending ? 'wait' : 'pointer' }}>
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactDetail({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--green)', marginTop: 3, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--black)' }}>{value}</div>
      </div>
    </div>
  )
  if (href) return <a href={href} style={{ textDecoration: 'none', display: 'block', transition: 'opacity 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>{inner}</a>
  return <div>{inner}</div>
}
