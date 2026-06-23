'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'

const FAQS = [
  { q: 'How do I know the wood is properly dried?', a: 'All slabs at Hillside Timber are dried in our custom solar kiln on-site here in South Dakota. We monitor moisture content throughout the drying process. Each slab is only released once it reaches the target moisture level for its intended use.' },
  { q: 'Do you ship slabs?', a: 'Yes, we ship nationwide. Small pieces go via standard carrier; large, heavy slabs ship via LTL freight, and international orders are quoted with customs included. Shipping a one-of-a-kind slab is custom, so we quote it per order: send us the pieces and your zip with the form below and we will get the freight cost back to you quickly.' },
  { q: 'Can I visit the slab yard?', a: 'Yes, by appointment. We are 15 miles west of Sioux Falls on Highway 42. Call ahead at (605) 310-4846 to set up a time, and we will make sure someone is around to show you everything. Many of our best customers have come to pick their own slabs in person.' },
  { q: 'What species do you carry?', a: 'We carry 24+ species including white oak, black walnut, cherry, maple, elm, ash, cottonwood, bur oak, ponderosa pine, and cedar. Species availability changes with our harvest schedule. Contact us if you are looking for something specific.' },
  { q: 'What is the difference between solar kiln dried and air dried?', a: 'Solar kiln drying uses the sun to gently heat a kiln chamber, reducing drying time significantly while maintaining the integrity of the wood. Air drying is the traditional method, which takes years. Both produce excellent results; kiln drying allows us to release slabs faster and with more predictable moisture content.' },
  { q: 'Do you do custom projects at Sioux Falls Woodworking?', a: 'Yes. Sioux Falls Woodworking builds custom furniture and pieces to order. Use the custom project form on our site or call to discuss your project. We will follow up with a quote and timeline.' },
  { q: 'What is your return policy?', a: 'All sales are final on natural wood products due to their one-of-a-kind nature. If a piece arrives damaged in shipping, contact us immediately with photos and we will work to make it right.' },
  { q: 'How long does a custom project take?', a: 'Timelines vary by project complexity and our current workload. Simple pieces may be completed in 4-6 weeks. Complex dining tables or bed frames may take 8-16 weeks. We will give you a specific timeline when we provide your quote.' },
]

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px',
  border: '1px solid var(--border)', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s', borderRadius: 'var(--radius)',
}

const FIELD_LABEL: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6,
}

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--green)' },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--border)' },
  }

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px var(--section-pad-x)' }}>
        <div className="label" style={{ marginBottom: 16 }}>Help</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5vw, 68px)', fontWeight: 800,
          letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)',
          lineHeight: 0.95, marginBottom: 48,
        }}>
          Frequently Asked<br />Questions
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{ borderTop: '1px solid var(--border)', ...(i === FAQS.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}) }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '20px 0', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 16, textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700,
                  letterSpacing: '0.2px', color: 'var(--black)',
                }}>
                  {faq.q}
                </span>
                <span style={{ color: 'var(--green)', flexShrink: 0 }}>
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--gray-dark)', lineHeight: 1.8 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ask us — the inquiry form (also how shipping quotes are requested) */}
        <div id="ask" style={{ marginTop: 64, padding: '44px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 10 }}>
                Message Sent
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--gray)', fontStyle: 'italic' }}>
                Thanks for reaching out. We will reply within 1-2 business days, often sooner.
              </p>
            </div>
          ) : (
            <div className="faq-ask-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 44, alignItems: 'start' }}>
              {/* Left: invitation + direct contact */}
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Still stuck?</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.98, marginBottom: 14 }}>
                  Ask us<br />anything.
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.7, marginBottom: 24 }}>
                  A question about a slab, a custom build, or a shipping quote, send it over and we will get back to you fast.
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }}>Prefer to talk?</span>
                  <a href="tel:6053104846" style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--black)', textDecoration: 'none' }}>(605) 310-4846</a>
                  <a href="mailto:hillsidetimbersd@gmail.com" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--green)', textDecoration: 'none' }}>hillsidetimbersd@gmail.com</a>
                </div>
              </div>

              {/* Right: form */}
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Honeypot: hidden from people, catches bots. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} /></label>
                </div>
                <div className="faq-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label htmlFor="faq-name" style={FIELD_LABEL}>Name *</label>
                    <input id="faq-name" required type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" {...focusable} style={INPUT_STYLE} />
                  </div>
                  <div>
                    <label htmlFor="faq-email" style={FIELD_LABEL}>Email *</label>
                    <input id="faq-email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" {...focusable} style={INPUT_STYLE} />
                  </div>
                </div>
                <div>
                  <label htmlFor="faq-message" style={FIELD_LABEL}>Your question or quote request *</label>
                  <textarea id="faq-message" required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Pieces you'd like a shipping quote on (with your zip), a question about a slab, or a custom project…" {...focusable} style={{ ...INPUT_STYLE, resize: 'vertical' }} />
                </div>
                {error && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: '#9b2c2c', lineHeight: 1.5, margin: 0 }}>{error}</p>
                )}
                <button type="submit" disabled={sending} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: sending ? 0.65 : 1, cursor: sending ? 'wait' : 'pointer' }}>
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .faq-ask-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 460px) {
          .faq-name-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
