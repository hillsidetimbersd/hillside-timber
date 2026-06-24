import { cookies } from 'next/headers'
import { getBrand } from '@/lib/brand'
import { CUSTOM_MILLING, SLAB_FLATTENING } from '@/lib/services'
import { getServicePhotos, sizeServiceImage } from '@/lib/services-photos'

export const metadata = {
  title: 'Our Services',
  description:
    'Beyond the slab yard, Hillside Timber mills logs into slabs and flattens slabs to order. See custom milling pricing by diameter and slab flattening rates.',
}

export default async function ServicesPage() {
  const cookieStore = await cookies()
  const brand = getBrand(cookieStore.get('ww-brand')?.value ?? 'ht')
  const phoneDigits = brand.contact.phone.replace(/\D/g, '')
  const photos = await getServicePhotos()

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Hero — matches the About/FAQ page heads for site cohesion */}
      <section style={{ background: 'var(--cream)', padding: '76px var(--section-pad-x) 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: 'var(--content-text)', margin: '0 auto' }}>
          <div className="label" style={{ marginBottom: 14 }}>What We Do</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5.4vw, 76px)', fontWeight: 800,
            letterSpacing: '-1.5px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.92, marginBottom: 18,
          }}>
            Our Services
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--gray-dark)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic' }}>
            Beyond the slab yard, we mill and flatten wood to order. Bring us your logs or your rough slabs.
          </p>
        </div>
      </section>

      {/* Custom Milling — photo + the full price-per-cut matrix */}
      <section style={{ background: '#fff', padding: '72px var(--section-pad-x)' }}>
        <div className="svc-row" style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <figure className="svc-photo" style={{ position: 'relative', margin: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'linear-gradient(135deg, #3a3a35 0%, #1a1a18 100%)', aspectRatio: '4 / 5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sizeServiceImage(photos.milling, 1100)}
              alt="Stacks of live-edge slabs freshly milled at the Hillside Timber yard"
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,15,13,0) 60%, rgba(15,15,13,0.4) 100%)' }} />
            <figcaption style={{
              position: 'absolute', left: 16, bottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 13px', borderRadius: 'var(--radius-sm)', background: 'rgba(15,15,13,0.82)', backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
            }}>
              Custom milling <span style={{ color: 'var(--tan)' }}>·</span> at the yard
            </figcaption>
          </figure>

          <div className="svc-copy">
            <div className="label" style={{ marginBottom: 12 }}>{CUSTOM_MILLING.eyebrow}</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.4vw, 46px)', fontWeight: 800, letterSpacing: '-0.8px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.96, marginBottom: 14 }}>
              {CUSTOM_MILLING.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'var(--gray-dark)', lineHeight: 1.75, marginBottom: 18, maxWidth: 540 }}>
              {CUSTOM_MILLING.lead}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '7px 14px', borderRadius: 999, background: '#eef2ec', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
              {CUSTOM_MILLING.maxDiameter}
            </div>

            {/* Price matrix — the signature element */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', maxWidth: 540 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--black)' }}>{CUSTOM_MILLING.priceCaption}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', fontStyle: 'italic', color: 'var(--gray)' }}>by log diameter</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th scope="col" style={TH_STYLE}>Dia. in.</th>
                    <th scope="col" style={{ ...TH_STYLE, textAlign: 'right' }}>Softwood</th>
                    <th scope="col" style={{ ...TH_STYLE, textAlign: 'right' }}>Hardwood</th>
                  </tr>
                </thead>
                <tbody>
                  {CUSTOM_MILLING.tiers.map((t, i) => (
                    <tr key={t.dia} style={{ background: i % 2 === 1 ? 'var(--cream)' : '#fff' }}>
                      <td style={TD_STYLE}>{t.dia}</td>
                      <td style={{ ...TD_STYLE, textAlign: 'right' }}>${t.soft}</td>
                      <td style={{ ...TD_STYLE, textAlign: 'right', color: 'var(--green)' }}>${t.hard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', lineHeight: 1.6, marginTop: 14, maxWidth: 540 }}>
              {CUSTOM_MILLING.bladeNote}
            </p>
          </div>
        </div>
      </section>

      {/* Slab Flattening — alternating side, specs + photo */}
      <section style={{ background: 'var(--cream)', padding: '72px var(--section-pad-x)' }}>
        <div className="svc-row svc-row--rev" style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <figure className="svc-photo" style={{ position: 'relative', margin: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'linear-gradient(135deg, #3a3a35 0%, #1a1a18 100%)', aspectRatio: '4 / 5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sizeServiceImage(photos.flattening, 1100)}
              alt="A live-edge slab being flattened on the Hillside Timber flattening table"
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,15,13,0) 60%, rgba(15,15,13,0.4) 100%)' }} />
            <figcaption style={{
              position: 'absolute', left: 16, bottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 13px', borderRadius: 'var(--radius-sm)', background: 'rgba(15,15,13,0.82)', backdropFilter: 'blur(4px)',
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff',
            }}>
              Flattening table <span style={{ color: 'var(--tan)' }}>·</span> single slabs
            </figcaption>
          </figure>

          <div className="svc-copy">
            <div className="label" style={{ marginBottom: 12 }}>{SLAB_FLATTENING.eyebrow}</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.4vw, 46px)', fontWeight: 800, letterSpacing: '-0.8px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.96, marginBottom: 14 }}>
              {SLAB_FLATTENING.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'var(--gray-dark)', lineHeight: 1.75, marginBottom: 24, maxWidth: 540 }}>
              {SLAB_FLATTENING.lead}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', maxWidth: 540 }}>
              <div style={{ flex: '1 1 180px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 800, color: 'var(--green)', letterSpacing: '-1px', lineHeight: 1 }}>
                  {SLAB_FLATTENING.rate}<span style={{ fontSize: 'var(--fs-15)', color: 'var(--gray)', fontWeight: 700, letterSpacing: 0 }}> {SLAB_FLATTENING.rateUnit}</span>
                </div>
                <div className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', marginTop: 4 }}>{SLAB_FLATTENING.minimum}</div>
              </div>
              <div style={{ flex: '1 1 180px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 800, color: 'var(--black)', letterSpacing: '-1px', lineHeight: 1 }}>
                  {SLAB_FLATTENING.maxSize}
                </div>
                <div className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', marginTop: 4 }}>{SLAB_FLATTENING.maxSizeLabel}</div>
              </div>
            </div>
            <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', marginTop: 16, maxWidth: 540 }}>
              {SLAB_FLATTENING.note}
            </p>
          </div>
        </div>
      </section>

      {/* Shipping note — the answer lives in the FAQ, deep-linked */}
      <section style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '34px var(--section-pad-x)' }}>
        <p style={{ maxWidth: 'var(--content-text)', margin: '0 auto', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray-dark)', lineHeight: 1.7 }}>
          Need it delivered? We ship nationwide.{' '}
          <a href="/faq#shipping" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>Request a freight quote.</a>
        </p>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--black)', padding: '78px var(--section-pad-x)', textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>Drop it off</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: '#fff', lineHeight: 0.95, marginBottom: 14 }}>
          Bring us your logs.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', maxWidth: 540, margin: '0 auto 30px', lineHeight: 1.7 }}>
          We are 15 miles west of Sioux Falls on Highway 42. Call ahead and we will line up your cut.
        </p>
        <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/contact" className="btn-primary" style={{ background: 'var(--tan)', color: 'var(--black)' }}>Get a Quote</a>
          <a href={`tel:${phoneDigits}`} className="btn-ghost-white">{brand.contact.phone}</a>
        </div>
      </section>

      <style>{`
        .svc-row {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 56px;
          align-items: center;
        }
        .svc-row--rev .svc-photo { order: 2; }
        @media (max-width: 860px) {
          .svc-row { grid-template-columns: 1fr !important; gap: 32px !important; }
          .svc-row--rev .svc-photo { order: 0; }
          .svc-photo { aspect-ratio: 16 / 11 !important; }
        }
      `}</style>
    </div>
  )
}

const TH_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--fs-11)',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--green)',
  textAlign: 'left',
  padding: '11px 18px',
  borderBottom: '1.5px solid var(--green)',
}

const TD_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--fs-15)',
  fontWeight: 600,
  color: 'var(--gray-dark)',
  padding: '9px 18px',
  borderBottom: '1px solid var(--border)',
}
