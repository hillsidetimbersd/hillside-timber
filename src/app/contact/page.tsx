'use client'

import { useState } from 'react'
import { Phone, Envelope, MapPin } from '@phosphor-icons/react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        {/* Left */}
        <div>
          <div className="label" style={{ marginBottom: 16 }}>Get in Touch</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 60px)',
            fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)',
            lineHeight: 0.95, marginBottom: 32,
          }}>
            Let&apos;s talk wood.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 48, fontStyle: 'italic' }}>
            Have a question about a slab? Want to come visit the yard? Looking to start a custom project? Reach out and we will get back to you fast.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ContactDetail icon={<Phone size={20} />} label="Phone" value="(605) 310-4846" href="tel:6053104846" />
            <ContactDetail icon={<Envelope size={20} />} label="Email" value="hillsidetimbersd@gmail.com" href="mailto:hillsidetimbersd@gmail.com" />
            <ContactDetail icon={<MapPin size={20} />} label="Location" value="26473 453rd Ave, Canistota SD 57012" />
          </div>
        </div>

        {/* Right */}
        <div>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)' }}>
                Message Sent
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--gray)', textAlign: 'center', fontStyle: 'italic' }}>
                Thanks for reaching out. We will reply within 1-2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>Name *</label>
                <input required type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px', border: '1px solid var(--border)', outline: 'none', background: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>Email *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px', border: '1px solid var(--border)', outline: 'none', background: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>Message *</label>
                <textarea required rows={6} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="What can we help you with?" style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: '14px', border: '1px solid var(--border)', outline: 'none', background: '#fff', resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Send Message</button>
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
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--black)' }}>{value}</div>
      </div>
    </div>
  )
  if (href) return <a href={href} style={{ textDecoration: 'none', display: 'block', transition: 'opacity 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>{inner}</a>
  return <div>{inner}</div>
}
