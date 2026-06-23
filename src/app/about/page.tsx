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
        <div style={{ position: 'relative', zIndex: 1, padding: '0 var(--section-pad-x) 60px' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 12,
          }}>
            Our Story
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase',
            color: '#fff', lineHeight: 0.92,
          }}>
            About {brand.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '80px var(--section-pad-x)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)',
            lineHeight: 1.05, marginBottom: 24,
          }}>
            Preserving history,<br />one slab at a time.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 20 }}>
            Hillside Timber was born out of a deep respect for the land and the trees that have shaped South Dakota for generations. Slavic started with a simple idea: source local timber responsibly, dry it right, and offer it to the people who can transform it into something lasting. Sustainability guides the work, so we only harvest trees that are already coming down, never standing healthy timber.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--gray-dark)', lineHeight: 1.8, marginBottom: 20 }}>
            Today, we run a custom solar kiln on-site, 15 miles west of Sioux Falls on Highway 42. Every slab in our yard is harvested locally and dried in-house. We carry 24+ species including white oak, black walnut, elm, cherry, cottonwood, and ponderosa pine, and we also bring in rare and exotic species from around the country and the world.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--gray-dark)', lineHeight: 1.8 }}>
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

      {/* Services */}
      <div style={{ background: 'var(--cream)', padding: '90px var(--section-pad-x)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="label" style={{ marginBottom: 14 }}>What We Do</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95, marginBottom: 14 }}>
              Our Services
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--gray)', fontStyle: 'italic', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
              Beyond the slab yard, we mill and flatten wood to order. Bring us your logs or your rough slabs.
            </p>
          </div>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <ServiceCard
              title="Custom Milling"
              body="We mill your logs into slabs, handling anything up to 60 inches in diameter. Live edges preserved, every flitch numbered so book matches stay together."
              price="From $20 per cut"
              note="Pricing scales with diameter and species. Reach out for a current quote."
            />
            <ServiceCard
              title="Slab Flattening & Leveling"
              body="Got a slab that needs leveling? Our flattening table takes single slabs up to 6 feet wide and 16 feet long, finished flat and ready to build."
              price="$120 / hour"
              note="30-minute minimum. Call ahead to schedule a time."
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <a href="/contact" className="btn-primary">Bring Us Your Logs</a>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{ background: '#0f0f0d', padding: '80px var(--section-pad-x)', textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 16 }}>Come Visit</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: 12 }}>
          Visits by<br />appointment.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontStyle: 'italic' }}>
          We are 15 miles west of Sioux Falls on Highway 42. Reach out to set up a time, we would love to show you the yard in person.
        </p>
        <a href={`tel:${brand.contact.phone.replace(/\D/g,'')}`} className="btn-primary">
          {brand.contact.phone}
        </a>
      </div>
    </div>
  )
}

function ServiceCard({ title, body, price, note }: { title: string; body: string; price: string; note: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--black)', marginBottom: 12 }}>
        {title}
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.75, marginBottom: 20, flex: 1 }}>
        {body}
      </p>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--green)', letterSpacing: '-0.5px' }}>
        {price}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray)', fontStyle: 'italic', marginTop: 4 }}>
        {note}
      </div>
    </div>
  )
}
