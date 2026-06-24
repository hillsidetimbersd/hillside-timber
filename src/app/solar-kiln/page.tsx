import { cookies } from 'next/headers'
import { getBrand } from '@/lib/brand'
import { SOLAR_KILN, KILN_PHOTOS, sizeKilnImage } from '@/lib/solar-kiln'
import FaqPro from '@/components/faq/FaqPro'

export const metadata = {
  title: 'Solar Kiln Drying',
  description:
    'Every slab at Hillside Timber is dried in our own solar kiln, using the sun instead of fossil fuels. How solar kiln drying works, the process, and common questions.',
}

export default async function SolarKilnPage() {
  const cookieStore = await cookies()
  const brand = getBrand(cookieStore.get('ww-brand')?.value ?? 'ht')
  const phoneDigits = brand.contact.phone.replace(/\D/g, '')

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Hero */}
      <section style={{ background: 'var(--cream)', padding: '76px var(--section-pad-x) 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: 'var(--content-text)', margin: '0 auto' }}>
          <div className="label" style={{ marginBottom: 14 }}>{SOLAR_KILN.eyebrow}</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5.4vw, 76px)', fontWeight: 800,
            letterSpacing: '-1.5px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.92, marginBottom: 18,
          }}>
            {SOLAR_KILN.heading[0]}<br />
            <span style={{ color: 'var(--green)' }}>{SOLAR_KILN.heading[1]}</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--gray-dark)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic' }}>
            {SOLAR_KILN.sub}
          </p>
        </div>
      </section>

      {/* What is a Solar Kiln — explainer + the building */}
      <section style={{ background: '#fff', padding: '72px var(--section-pad-x)' }}>
        <div className="kiln-row" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div className="label" style={{ marginBottom: 12 }}>What it is</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.4vw, 46px)', fontWeight: 800, letterSpacing: '-0.8px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.96, marginBottom: 18 }}>
              What is a Solar Kiln?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'var(--gray-dark)', lineHeight: 1.8, maxWidth: 560, marginBottom: 26 }}>
              {SOLAR_KILN.intro}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 12, padding: '16px 22px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, color: 'var(--green)', letterSpacing: '-1.5px', lineHeight: 1 }}>{SOLAR_KILN.dryTime}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }}>{SOLAR_KILN.dryTimeLabel}</span>
            </div>
          </div>

          <figure style={{ position: 'relative', margin: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'linear-gradient(135deg, #3a3a35 0%, #1a1a18 100%)', aspectRatio: '4 / 3' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sizeKilnImage(KILN_PHOTOS.building, 1100)}
              alt="The Hillside Timber solar kiln, a maroon timber building on the property at dusk"
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,15,13,0) 60%, rgba(15,15,13,0.4) 100%)' }} />
            <figcaption style={{
              position: 'absolute', left: 16, bottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 13px', borderRadius: 'var(--radius-sm)', background: 'rgba(15,15,13,0.82)', backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
            }}>
              Our solar kiln <span style={{ color: 'var(--tan)' }}>·</span> on the property
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The drying process — a real sequence, numbered */}
      <section style={{ background: 'var(--cream)', padding: '72px var(--section-pad-x)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div className="label" style={{ marginBottom: 12 }}>Inside the kiln</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.6vw, 50px)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.96 }}>
              The drying process
            </h2>
          </div>
          <div className="kiln-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SOLAR_KILN.steps.map((s) => (
              <div key={s.n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 26px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)', fontWeight: 700, letterSpacing: '2px', color: 'var(--tan)', marginBottom: 10 }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--black)', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray-dark)', lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — faq-pro style */}
      <section style={{ background: '#fff', padding: '72px var(--section-pad-x)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="label" style={{ marginBottom: 12 }}>Good to know</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.4vw, 46px)', fontWeight: 800, letterSpacing: '-0.8px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.96 }}>
              Common questions
            </h2>
          </div>
          <FaqPro items={SOLAR_KILN.faqs.map((f, i) => ({ id: `kiln-${i + 1}`, question: f.q, answer: f.a }))} />
        </div>
      </section>

      {/* CTA over a finished, figured slab */}
      <section style={{
        padding: '92px var(--section-pad-x)', textAlign: 'center',
        background: `linear-gradient(rgba(15,15,13,0.74), rgba(15,15,13,0.82)), url('${sizeKilnImage(KILN_PHOTOS.result, 1600)}') center/cover no-repeat`,
      }}>
        <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>The payoff</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: '#fff', lineHeight: 0.95, marginBottom: 14 }}>
          Every slab, solar dried.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', maxWidth: 560, margin: '0 auto 30px', lineHeight: 1.7 }}>
          Stable, ready to build, and dried the way wood should be. Come find yours.
        </p>
        <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/shop" className="btn-primary" style={{ background: 'var(--tan)', color: 'var(--black)' }}>Browse the Yard</a>
          <a href={`tel:${phoneDigits}`} className="btn-ghost-white">{brand.contact.phone}</a>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .kiln-row { grid-template-columns: 1fr !important; gap: 32px !important; }
          .kiln-steps { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
