'use client'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

const STEPS = [
  {
    n: '01',
    title: 'Sourced',
    body: 'Standing dead, fallen, or harvested by hand from the Black Hills and the surrounding region. Every log is logged, photographed, and traced.',
    img: `${SQ}1759355251530-0O1H7JPOLOXE3B0248R6/CB61FB9D-BDB8-42E8-930E-DBB229165D6E.jpeg?format=1000w`,
  },
  {
    n: '02',
    title: 'Sawn',
    body: 'Cut on a Wood-Mizer mill in our yard. Live edges preserved. Slabs are flitch-numbered so book matches stay together.',
    img: `${SQ}44d1cdae-31c0-4553-a9cf-ebce83dc1871/P1034776.jpg?format=1000w`,
  },
  {
    n: '03',
    title: 'Solar Kiln Dried',
    body: 'Custom-built solar kiln on site. Slow, even drying that pulls moisture down to 6–8% without baking out the figure or the color.',
    img: `${SQ}1708316209057-NHWRYM9BBIJRL0VQ12NS/P1034650.jpg?format=1000w`,
  },
  {
    n: '04',
    title: 'Listed',
    body: 'Each slab is measured, photographed in natural light, and listed individually. What you see online is the slab you take home.',
    img: `${SQ}1692104173691-BIEF3Y5F8OFOHBO8DQ0Q/P1034323.jpg?format=1000w`,
  },
]

export default function SolarKilnStory() {
  return (
    <section style={{
      background: 'var(--black)',
      color: '#fff',
      padding: '120px 60px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>
            Log to Listing
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 4.5vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            Four steps. <span style={{ color: 'var(--tan)' }}>One slab at a time.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            We control the chain from the standing tree to the slab on your truck. No middlemen, no mystery moisture, no guessing what arrives.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{
              background: 'var(--black)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                aspectRatio: '4/3',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(0.25) brightness(0.9)',
                  }}
                />
              </div>
              <div style={{ padding: '28px 26px 32px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  color: 'var(--tan)',
                  marginBottom: 10,
                }}>
                  {s.n}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.2px',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  {s.title}
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
