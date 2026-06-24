'use client'

import { useState } from 'react'
import FaqPro, { type FaqItem } from '@/components/faq/FaqPro'
import PiecePicker from '@/components/inquiry/PiecePicker'
import type { PiecePreview } from '@/lib/squarespace'

// The "shipping" id is the deep-link target for /faq#shipping (linked from the
// services page). FaqPro opens and scrolls to it.
const FAQ_ITEMS: FaqItem[] = [
  { id: 'buying', question: 'How do I buy a slab?', answer: 'Browse the slabs and complete your purchase right here on the site. Once your order is in, we will reach out to coordinate pickup at the yard or shipping to you.' },
  { id: 'exact-slab', question: 'Is the slab I see online the exact one I will get?', answer: 'Yes. Every slab is one of a kind and photographed individually, so the slab you see online is the slab you take home.' },
  { id: 'shipping', question: 'Do you ship slabs?', answer: 'Yes, we ship nationwide. Small pieces go via standard carrier; large, heavy slabs ship via LTL freight, and international orders are quoted with customs included. Shipping a one-of-a-kind slab is custom, so we quote it per order: complete your purchase and we will follow up to coordinate the freight cost, or send us the pieces and your zip with the form below for a quote first.', cta: { href: '/faq#ask', label: 'Request a shipping quote' } },
  { id: 'visit', question: 'Can I visit the slab yard, and where are you?', answer: 'Yes, by appointment. We are 15 miles west of Sioux Falls on Highway 42, near Canistota, South Dakota. Call ahead at (605) 310-4846 to set up a time and we will have someone ready to show you around. Many of our best customers come to pick their own slabs in person.' },
  { id: 'species', question: 'What species do you carry?', answer: 'We carry 24+ species including white oak, black walnut, cherry, maple, elm, ash, cottonwood, bur oak, ponderosa pine, and cedar. Species availability changes with our harvest schedule. Contact us if you are looking for something specific.' },
  { id: 'green-wood', question: 'Do you sell green or air-dried wood too?', answer: 'Most of our stock is solar kiln dried and ready to build. We sometimes have green or still-drying slabs, so ask and we will tell you what is available.' },
  { id: 'drying', question: 'How do I know the wood is properly dried?', answer: 'All slabs at Hillside Timber are dried in our custom solar kiln on-site here in South Dakota. We monitor moisture content throughout the drying process. Each slab is only released once it reaches the target moisture level for its intended use.' },
  { id: 'kiln-vs-air', question: 'What is the difference between solar kiln dried and air dried?', answer: 'Solar kiln drying uses the sun to gently heat a kiln chamber, reducing drying time significantly while maintaining the integrity of the wood. Air drying is the traditional method, which takes years. Both produce excellent results; kiln drying allows us to release slabs faster and with more predictable moisture content.' },
  { id: 'mill-my-logs', question: 'Can you mill logs I bring in?', answer: 'Yes. Bring us your logs and we mill them to order, up to 60 inches in diameter, with live edges preserved and every flitch numbered.', cta: { href: '/services', label: 'See milling pricing' } },
  { id: 'own-slab', question: 'Can I bring my own slab for a custom piece?', answer: 'Yes. Sioux Falls Woodworking can build from a slab you already own, or help you pick the right one from the yard.', cta: { href: '/custom', label: 'Start a custom project' } },
  { id: 'custom', question: 'Do you do custom projects at Sioux Falls Woodworking?', answer: 'Yes. Sioux Falls Woodworking builds custom furniture and pieces to order. Use the custom project form on our site or call to discuss your project. We will follow up with a quote and timeline.' },
  { id: 'timeline', question: 'How long does a custom project take?', answer: 'Timelines vary by project complexity and our current workload. Simple pieces may be completed in 4-6 weeks. Complex dining tables or bed frames may take 8-16 weeks. We will give you a specific timeline when we provide your quote.' },
  { id: 'epoxy', question: 'Do you sell epoxy or finishing supplies?', answer: 'Yes. We stock EcoPoxy resins like UVPOXY and FlowCast at the yard for river tables and pours.' },
  { id: 'returns', question: 'What is your return policy?', answer: 'All sales are final on natural wood products due to their one-of-a-kind nature. If a piece arrives damaged in shipping, contact us immediately with photos and we will work to make it right.' },
]

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-14)',
  border: '1px solid var(--border)', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s', borderRadius: 'var(--radius)',
}

const FIELD_LABEL: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6,
}

export default function FaqClient({ pieces }: { pieces: PiecePreview[] }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [selected, setSelected] = useState<PiecePreview[]>([])
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
        body: JSON.stringify({
          ...form,
          pieces: selected.map((p) => ({
            sku: p.sku, name: p.name, dimensions: p.dimensions,
            price: p.priceLabel, url: p.productUrl, drying: p.drying,
          })),
        }),
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
        <div style={{ textAlign: 'center', maxWidth: 'var(--content-text)', margin: '0 auto 40px' }}>
          <div className="label" style={{ marginBottom: 14 }}>Help</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5vw, 68px)', fontWeight: 800,
            letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)',
            lineHeight: 0.95, marginBottom: 16,
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'var(--gray-dark)', lineHeight: 1.6, fontStyle: 'italic', maxWidth: 540, margin: '0 auto' }}>
            Drying, species, visiting the yard, shipping, and custom work. Search or browse below.
          </p>
        </div>

        <FaqPro items={FAQ_ITEMS} />

        {/* Ask us — the inquiry form (also how shipping quotes are requested) */}
        <div id="ask" style={{ scrollMarginTop: 'calc(var(--switcher-h) + var(--nav-h) + 24px)', marginTop: 64, padding: '44px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 10 }}>
                Message Sent
              </h3>
              <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)' }}>
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
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray-dark)', lineHeight: 1.7, marginBottom: 24 }}>
                  A question about a slab, a custom build, or a shipping quote, send it over and we will get back to you fast.
                </p>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }}>Prefer to talk?</span>
                  <a href="tel:6053104846" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--black)', textDecoration: 'none' }}>(605) 310-4846</a>
                  <a href="mailto:hillsidetimbersd@gmail.com" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--green)', textDecoration: 'none' }}>hillsidetimbersd@gmail.com</a>
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

                {/* Piece picker — attach real Piece No.s to a question or shipping quote */}
                <PiecePicker
                  pieces={pieces}
                  value={selected}
                  onChange={setSelected}
                  size="lg"
                  idPrefix="faq-piece"
                  label={selected.length > 0 ? `Pieces you’re asking about (${selected.length})` : 'Pieces you’re asking about'}
                  hint="optional, for a quote or a question"
                />

                <div>
                  <label htmlFor="faq-message" style={FIELD_LABEL}>Your question or quote request *</label>
                  <textarea id="faq-message" required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Your question, or what you'd like a shipping quote on. Add your zip for a freight quote." {...focusable} style={{ ...INPUT_STYLE, resize: 'vertical' }} />
                </div>
                {error && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: '#9b2c2c', lineHeight: 1.5, margin: 0 }}>{error}</p>
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
