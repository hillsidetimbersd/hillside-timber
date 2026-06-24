import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getBrand } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Hillside Timber and Sioux Falls Woodworking. Locally harvested, solar kiln dried, and milled in South Dakota.',
}

const STEPS = ['Sourced', 'Milled', 'Kiln-Dried', 'Inspected']

const STATS = [
  { num: '24+', label: 'Wood Species' },
  { num: '100%', label: 'Locally Harvested' },
  { num: '10+', label: 'Years Milling' },
  { num: '1', label: 'Solar Kiln On-Site' },
]

export default async function AboutPage() {
  const cookieStore = await cookies()
  const brand = getBrand(cookieStore.get('ww-brand')?.value ?? 'ht')
  const phoneDigits = brand.contact.phone.replace(/\D/g, '')

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Intro — the real story, beside the real yard */}
      <section style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '64px var(--section-pad-x) 76px' }}>
        <div className="about-intro" style={{ display: 'grid', gridTemplateColumns: '1fr 1.04fr', gap: 64, alignItems: 'center' }}>
          {/* Left: story */}
          <div>
            <div className="label" style={{ marginBottom: 16 }}>About Hillside Timber</div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 66px)', fontWeight: 800,
              letterSpacing: '-1.5px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.93, marginBottom: 24,
            }}>
              Heirloom starts<br />with the slab.
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 18 }}>
              Hillside Timber is a premium supplier of live edge and distinctive wood, 15 miles west of Sioux Falls on Highway 42. Every slab is one of a kind, harvested locally and dried slowly in our own solar kiln. Before a piece earns its number, we grade it by hand for figure, soundness, and moisture, so the wood you build on is the wood we would build on ourselves.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 30 }}>
              Nothing we sell is meant to be replaced. Our sister company, Sioux Falls Woodworking, turns those slabs into heirloom furniture and custom pieces, made to order and built to be handed down.
            </p>

            {/* The journey each slab takes, ending in inspection, as it earns its Piece No. */}
            <div style={{ marginBottom: 32 }}>
              <div className="label" style={{ marginBottom: 12 }}>Every slab earns its number</div>
              <div style={{ display: 'flex', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {STEPS.map((s, i) => (
                  <div key={s} style={{ flex: 1, textAlign: 'center', padding: '14px 4px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '1px', color: 'var(--tan)', marginBottom: 4 }}>0{i + 1}</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--black)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)' }}>Questions about a piece?</span>
              <a href={`tel:${phoneDigits}`} className="btn-primary">{brand.contact.phone}</a>
            </div>
          </div>

          {/* Right: the real yard */}
          <figure style={{ position: 'relative', margin: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/photos/founder.jpg"
              alt="Hillside Timber's founder with live-edge black walnut slabs in the shop"
              style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
            />
            <figcaption style={{
              position: 'absolute', left: 16, bottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 13px', borderRadius: 'var(--radius-sm)', background: 'rgba(15,15,13,0.82)', backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
            }}>
              Inspected &amp; numbered <span style={{ color: 'var(--tan)' }}>·</span> by hand
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Sustainability ethos — the signature statement */}
      <section className="grain" style={{ background: 'var(--green)', padding: '92px var(--section-pad-x)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 'var(--content-text)', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div className="label" style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 22 }}>The way it should be</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 46px)', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#fff', lineHeight: 1.06, marginBottom: 0 }}>
            We only harvest wood from trees that are already coming down. Never standing, healthy timber.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
        <div className="about-stats" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ padding: '46px 28px', textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 4vw, 52px)', fontWeight: 800, color: 'var(--green)', letterSpacing: '-1.5px', lineHeight: 1 }}>{stat.num}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginTop: 10 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Visit — a compact, contained invitation. The footer already carries the
          full address, so this keeps only what the footer lacks: the by-appointment
          framing, the Highway 42 direction, and the warm invite. Moved up out of the
          bottom slot so it no longer reads as a full-width line echoing the footer. */}
      <section style={{ background: 'var(--cream)', padding: '76px var(--section-pad-x)' }}>
        <div className="about-visit" style={{
          maxWidth: 780, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 44,
          background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', padding: '38px 42px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="label" style={{ marginBottom: 14 }}>Come Visit</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(27px, 3vw, 36px)', fontWeight: 800,
              letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 1, marginBottom: 12,
            }}>
              Visits by appointment
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'var(--gray-dark)', lineHeight: 1.6, maxWidth: 430, margin: 0 }}>
              We&apos;re 15 miles west of Sioux Falls on Highway 42. Reach out and we&apos;ll set a time to walk the yard with you in person.
            </p>
          </div>
          <div className="about-visit-cta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 12, flexShrink: 0 }}>
            <a href={`tel:${phoneDigits}`} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
              {brand.contact.phone}
            </a>
            <a href="/contact" className="btn-ghost" style={{ textAlign: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
              Send a Message
            </a>
          </div>
        </div>
      </section>

      {/* Services teaser — the full breakdown and pricing live on /services */}
      <div style={{ background: '#fff', padding: '88px var(--section-pad-x)' }}>
        <div className="about-services-teaser" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="label" style={{ marginBottom: 14 }}>What We Do</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.6vw, 50px)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.96, marginBottom: 14 }}>
              We mill and flatten<br />to order.
            </h2>
            <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', maxWidth: 580, lineHeight: 1.6 }}>
              Bring us your logs or your rough slabs. Custom milling is priced by diameter, and our flattening table levels single slabs up to 6 feet wide. See the full breakdown and pricing.
            </p>
          </div>
          <a href="/services" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>See Our Services</a>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .about-intro { grid-template-columns: 1fr !important; gap: 38px !important; }
          .about-services-teaser { grid-template-columns: 1fr !important; gap: 26px !important; }
        }
        @media (max-width: 700px) {
          .about-visit { flex-direction: column !important; align-items: stretch !important; gap: 24px !important; padding: 30px 26px !important; }
        }
        @media (max-width: 640px) {
          .about-stats { grid-template-columns: 1fr 1fr !important; }
          .about-stats > div:nth-child(3) { border-left: none !important; }
        }
      `}</style>
    </div>
  )
}
