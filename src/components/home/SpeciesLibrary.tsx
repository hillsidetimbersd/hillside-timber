'use client'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

const SPECIES = [
  { name: 'Black Walnut', tag: 'Domestic · Iconic', img: `${SQ}1745095419568-LH71E35DTPQKHL61P6BK/9DF98A45-AB03-4795-9684-813C07F20FA3.jpeg?format=600w`, slug: 'walnut' },
  { name: 'Claro Walnut', tag: 'Figured · Premium', img: `${SQ}1701369870793-FY5EXBGCQFL1FDGB96TN/P1034450.jpg?format=600w`, slug: 'claro-walnut' },
  { name: 'Bastogne Walnut', tag: 'Hybrid · 10ft+', img: `${SQ}1750808621194-JX4ZOUAW9PR4AG1C9LDN/14D9FB14-4F2A-4D81-A063-50D1C1E6D7C3.jpeg?format=600w`, slug: 'bastogne' },
  { name: 'Buckeye Burl', tag: 'Burl · Statement', img: `${SQ}1761697039666-AO6NP43V1TJMFDDBDK9T/880BD484-10A9-499E-98BB-80566B2C2A79.jpeg?format=600w`, slug: 'buckeye' },
  { name: 'Redwood Burl', tag: 'Burl · Coastal', img: `${SQ}1759355687085-7AIZ7D8QCALT0C3GA1D6/9FAF763E-9726-4E27-A5F2-B0E353DFE575.jpeg?format=600w`, slug: 'redwood-burl' },
  { name: 'Spalted Maple', tag: 'Domestic · Spalted', img: `${SQ}1761401660020-VJ5G2D3392H7MRV1C0LZ/A93426BF-DEC6-48AB-91DE-BB03E59DEA5D.jpeg?format=600w`, slug: 'spalted-maple' },
  { name: 'Silver Maple', tag: 'Domestic · Mantel', img: `${SQ}1742855807836-AJ4CGF9Y2TAVS8UJNKRW/28D8A477-B232-454F-A79D-27E031680231.jpeg?format=600w`, slug: 'silver-maple' },
  { name: 'Figured Aspen', tag: 'Domestic · Light', img: `${SQ}1697488198174-7SVF03EX4UGLZZ3I34GW/P1034392.jpg?format=600w`, slug: 'aspen' },
]

export default function SpeciesLibrary() {
  return (
    <section style={{
      background: '#fff',
      padding: '132px var(--section-pad-x)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'end',
          marginBottom: 56,
        }}>
          <div>
            <div className="label" style={{ marginBottom: 16 }}>The Species Library</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(38px, 4vw, 64px)',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              color: 'var(--black)',
            }}>
              Twenty-four<br /><span style={{ color: 'var(--green)' }}>species. And counting.</span>
            </h2>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '17px',
            color: 'var(--gray-dark)',
            lineHeight: 1.8,
            fontStyle: 'italic',
            maxWidth: 580,
          }}>
            From iconic Black Walnut to rare Bastogne and figured burls. Every species is logged, scaled, photographed, and listed by the slab. Browse by what your project needs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 18,
        }}>
          {SPECIES.map((s) => (
            <a
              key={s.slug}
              href={`/shop?species=${s.slug}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                aspectRatio: '4/5',
                background: '#e8e4dc',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) img.style.transform = 'scale(1.06)'
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) img.style.transform = 'scale(1)'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute',
                left: 18, right: 18, bottom: 18,
                color: '#fff',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 6,
                }}>
                  {s.tag}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.3px',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}>
                  {s.name}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/shop" className="btn-ghost">See All 24+ Species</a>
        </div>
      </div>
    </section>
  )
}
