import { cookies } from 'next/headers'
import { getBrand } from '@/lib/brand'

export default async function AboutPage() {
  const cookieStore = await cookies()
  const brand = getBrand(cookieStore.get('ww-brand')?.value ?? 'ht')

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        height: '60vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1472552944129-b035e9ea3744?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,13,0.9), rgba(15,15,13,0.2))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '0 60px 60px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 12,
          }}>
            Our Story
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase',
            color: '#fff', lineHeight: 0.92,
          }}>
            About {brand.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)',
            lineHeight: 1.05, marginBottom: 24,
          }}>
            Preserving history,<br />one slab at a time.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 20 }}>
            Hillside Timber was born out of a deep respect for the land and the trees that have shaped South Dakota&apos;s Black Hills for centuries. Slavic Volktrube started with a simple idea: source local timber responsibly, dry it right, and offer it to the people who can transform it into something lasting.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 20 }}>
            Today, we operate a custom solar kiln on-site in Canistota, SD. Every slab in our yard has been harvested from within the region and dried in-house. We carry 24+ species including white oak, black walnut, elm, cherry, cottonwood, and ponderosa pine.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.8 }}>
            Sioux Falls Woodworking is the sister company, where Slavic and his team turn those raw slabs into heirloom-quality furniture and custom pieces built to order.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80"
            alt="Workshop"
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { num: '24+', label: 'Wood Species' },
              { num: '100%', label: 'Locally Harvested' },
              { num: '10+', label: 'Years Experience' },
              { num: '1', label: 'Solar Kiln On-Site' },
            ].map((stat) => (
              <div key={stat.label} style={{ padding: '20px', background: 'var(--cream)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--green)', letterSpacing: '-1px' }}>
                  {stat.num}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{ background: '#0f0f0d', padding: '80px 60px', textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 16 }}>Come Visit</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: 12 }}>
          26473 453rd Ave,<br />Canistota SD 57012
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontStyle: 'italic' }}>
          Call ahead and come see the slab yard in person. We love showing people around.
        </p>
        <a href={`tel:${brand.contact.phone.replace(/\D/g,'')}`} className="btn-primary">
          {brand.contact.phone}
        </a>
      </div>
    </div>
  )
}
