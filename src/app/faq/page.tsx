'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'

const FAQS = [
  { q: 'How do I know the wood is properly dried?', a: 'All slabs at Hillside Timber are dried in our custom solar kiln on-site in Canistota, SD. We monitor moisture content throughout the drying process. Each slab is only released once it reaches the target moisture level for its intended use.' },
  { q: 'Do you ship slabs?', a: 'Yes. Smaller pieces can ship standard carrier. Large and heavy slabs ship via LTL freight. Use the freight estimator on our shop page to get a rough quote for your area. Final shipping cost is calculated at checkout.' },
  { q: 'Can I visit the slab yard?', a: 'Absolutely. We welcome visitors to the yard in Canistota. Call ahead at (605) 310-4846 so we can make sure someone is around to show you everything. Many of our best customers have come to pick their own slabs in person.' },
  { q: 'What species do you carry?', a: 'We carry 24+ species including white oak, black walnut, cherry, maple, elm, ash, cottonwood, bur oak, ponderosa pine, and cedar. Species availability changes with our harvest schedule. Contact us if you are looking for something specific.' },
  { q: 'What is the difference between solar kiln dried and air dried?', a: 'Solar kiln drying uses the sun to gently heat a kiln chamber, reducing drying time significantly while maintaining the integrity of the wood. Air drying is the traditional method, which takes years. Both produce excellent results; kiln drying allows us to release slabs faster and with more predictable moisture content.' },
  { q: 'Do you do custom projects at Sioux Falls Woodworking?', a: 'Yes. Sioux Falls Woodworking builds custom furniture and pieces to order. Use the custom project form on our site or call to discuss your project. We will follow up with a quote and timeline.' },
  { q: 'What is your return policy?', a: 'All sales are final on natural wood products due to their one-of-a-kind nature. If a piece arrives damaged in shipping, contact us immediately with photos and we will work to make it right.' },
  { q: 'How long does a custom project take?', a: 'Timelines vary by project complexity and our current workload. Simple pieces may be completed in 4-6 weeks. Complex dining tables or bed frames may take 8-16 weeks. We will give you a specific timeline when we provide your quote.' },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 60px' }}>
        <div className="label" style={{ marginBottom: 16 }}>Help</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 800,
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
                  fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
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
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--gray-dark)', lineHeight: 1.8 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: '32px', background: 'var(--cream)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 8 }}>
            Still have questions?
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray)', marginBottom: 20, fontStyle: 'italic' }}>
            Call or email Slavic directly. We are a small operation and we love talking wood.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="tel:6053104846" className="btn-primary">(605) 310-4846</a>
            <a href="mailto:hillsidetimbersd@gmail.com" className="btn-ghost">Email Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
