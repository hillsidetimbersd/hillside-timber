'use client'

import { useState, useEffect, useMemo } from 'react'
import { Phone, Envelope, MapPin, MagnifyingGlass, X, Tag } from '@phosphor-icons/react'
import type { PiecePreview } from '@/lib/squarespace'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-14)',
  border: '1px solid var(--border)', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s', borderRadius: 'var(--radius)',
}

const FIELD_LABEL: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6,
}

export default function ContactClient({ pieces }: { pieces: PiecePreview[] }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' })
  const [selected, setSelected] = useState<PiecePreview[]>([])
  // Once the visitor edits the message, stop auto-filling it from their selection.
  const [messageTouched, setMessageTouched] = useState(false)
  const [query, setQuery] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Arriving from a piece's "Inquire" action (?piece=<sku>): pre-select it. Everything on
  // the site is available, so we never ask "is this available?".
  useEffect(() => {
    const sku = new URLSearchParams(window.location.search).get('piece')
    if (!sku) return
    const match = pieces.find((p) => p.sku.toLowerCase() === sku.toLowerCase())
    // One-time URL read on mount. A lazy initializer would read window during render and
    // risk a hydration mismatch, so syncing once via an effect is the SSR-safe pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setSelected([match])
  }, [pieces])

  // Keep the message in step with what they picked, until they make it their own.
  useEffect(() => {
    if (messageTouched) return
    // Intentional sync: mirror the selection into the message until the visitor edits it.
    // The guard above keeps this from clobbering their own words.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => ({ ...f, message: seedMessage(selected) }))
  }, [selected, messageTouched])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return pieces
      .filter((p) => !selected.some((s) => s.sku === p.sku))
      .filter((p) => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query, pieces, selected])

  function addPiece(p: PiecePreview) {
    setSelected((s) => (s.some((x) => x.sku === p.sku) ? s : [...s, p]))
    setQuery('')
  }
  function removePiece(sku: string) {
    setSelected((s) => s.filter((x) => x.sku !== sku))
  }

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
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 48, fontStyle: 'italic' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)' }}>
                Message Sent
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'var(--gray)', fontStyle: 'italic' }}>
                Thanks for reaching out. We will reply within 1-2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Honeypot */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} /></label>
              </div>

              <div>
                <label htmlFor="c-name" style={FIELD_LABEL}>Name *</label>
                <input id="c-name" required type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" {...focusable} style={INPUT_STYLE} />
              </div>
              <div>
                <label htmlFor="c-email" style={FIELD_LABEL}>Email *</label>
                <input id="c-email" required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" {...focusable} style={INPUT_STYLE} />
              </div>

              {/* Piece picker (add one or more) */}
              <PiecePicker
                query={query}
                setQuery={setQuery}
                results={results}
                selected={selected}
                onAdd={addPiece}
                onRemove={removePiece}
                focusable={focusable}
              />

              <div>
                <label htmlFor="c-message" style={FIELD_LABEL}>Message *</label>
                <textarea
                  id="c-message" required rows={5} value={form.message}
                  onChange={(e) => { setMessageTouched(true); setForm((f) => ({ ...f, message: e.target.value })) }}
                  placeholder="What can we help you with?" {...focusable} style={{ ...INPUT_STYLE, resize: 'vertical' }}
                />
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: '#9b2c2c', lineHeight: 1.5, margin: 0 }}>{error}</p>
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

/** Auto-filled message that mirrors the current selection until the visitor edits it. */
function seedMessage(sel: PiecePreview[]): string {
  if (sel.length === 0) return ''
  if (sel.length === 1) {
    return sel[0].drying
      ? "I'm interested in this piece. I see it's still drying, so I'd like to purchase it now or reserve it for when it's ready."
      : "I'd like to buy this piece."
  }
  return sel.some((p) => p.drying)
    ? "I'm interested in these pieces. A few are still drying, so I'd like to purchase now or reserve them for when they're ready."
    : "I'd like to buy these pieces."
}

function PiecePicker({
  query, setQuery, results, selected, onAdd, onRemove, focusable,
}: {
  query: string
  setQuery: (v: string) => void
  results: PiecePreview[]
  selected: PiecePreview[]
  onAdd: (p: PiecePreview) => void
  onRemove: (sku: string) => void
  focusable: { onFocus: (e: React.FocusEvent<HTMLInputElement>) => void; onBlur: (e: React.FocusEvent<HTMLInputElement>) => void }
}) {
  const has = selected.length > 0
  return (
    <div>
      <label htmlFor="c-piece" style={{ ...FIELD_LABEL, display: 'flex', gap: 8, alignItems: 'baseline' }}>
        {has ? `Your pieces (${selected.length})` : 'Which pieces?'}
        <span style={{ letterSpacing: '0.3px', textTransform: 'none', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', fontWeight: 400, fontStyle: 'italic', color: 'var(--gray)' }}>
          optional, add as many as you like
        </span>
      </label>

      {has && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {selected.map((p) => (
            <PieceCard key={p.sku} piece={p} onRemove={() => onRemove(p.sku)} />
          ))}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <MagnifyingGlass size={16} weight="bold" style={{ position: 'absolute', left: 13, top: 14, color: 'var(--green)', pointerEvents: 'none' }} />
        <input
          id="c-piece"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={has ? 'Add another piece…' : 'Search by Piece No., name, or species…'}
          autoComplete="off"
          {...focusable}
          style={{ ...INPUT_STYLE, paddingLeft: 38 }}
        />
        {results.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20,
            background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)', overflow: 'hidden', maxHeight: 320, overflowY: 'auto',
          }}>
            {results.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onAdd(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                  padding: '10px 12px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cream)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, background: '#e0dbd0' }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}{p.drying ? <span style={{ color: 'var(--green)' }}> · Still Drying</span> : ''}
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--gray)' }}>Piece No. {p.sku}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 800, color: 'var(--green)', flexShrink: 0 }}>{p.priceLabel}</span>
              </button>
            ))}
          </div>
        )}
        {query.trim().length >= 2 && results.length === 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', color: 'var(--gray)', fontStyle: 'italic', marginTop: 8 }}>
            No pieces match that. Try a species or a Piece No., or just describe it in your message.
          </p>
        )}
      </div>
    </div>
  )
}

/** An elevated, shop-card-style summary of one chosen piece. */
function PieceCard({ piece, onRemove }: { piece: PiecePreview; onRemove: () => void }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: 12,
        background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--green)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={piece.image} alt={piece.name} style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, background: '#e0dbd0', display: 'block' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green)' }}>{piece.section}</span>
          {piece.drying && (
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1px',
              textTransform: 'uppercase', color: 'var(--green)', background: 'rgba(42,92,63,0.1)', padding: '2px 7px', borderRadius: 999,
            }}>
              Still Drying
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-16)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--black)', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 7 }}>
          {piece.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {piece.dimensions && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', color: 'var(--gray)', fontStyle: 'italic' }}>{piece.dimensions}</span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <Tag size={11} weight="fill" style={{ color: 'var(--green)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray)' }}>No.</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 800, color: 'var(--black)' }}>{piece.sku}</span>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 800, color: 'var(--green)' }}>{piece.priceLabel}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${piece.name}`}
        style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-dark)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--gray-dark)' }}
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  )
}

function ContactDetail({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const inner = (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--green)', marginTop: 3, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--black)' }}>{value}</div>
      </div>
    </div>
  )
  if (href) return <a href={href} style={{ textDecoration: 'none', display: 'block', transition: 'opacity 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>{inner}</a>
  return <div>{inner}</div>
}
