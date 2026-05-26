'use client'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

const PIECES = [
  {
    title: 'Buckeye Burl Coffee Table',
    materials: 'Buckeye Burl · Steel base',
    dims: '52" × 34" × 18"',
    img: `${SQ}1764093395121-0WQ7WW0YAVSHZPO6D52D/9B46D0B9-5BD4-42C9-8428-3BEB7F129B63.jpeg?format=1400w`,
    span: 2,
  },
  {
    title: 'Bastogne Walnut Dining Table',
    materials: 'Bastogne Walnut · Live edge',
    dims: '120" × 44" × 30"',
    img: `${SQ}1750808621194-JX4ZOUAW9PR4AG1C9LDN/14D9FB14-4F2A-4D81-A063-50D1C1E6D7C3.jpeg?format=1400w`,
    span: 1,
  },
  {
    title: 'Silver Maple Mantel',
    materials: 'Silver Maple · Hand rubbed oil finish',
    dims: '78" × 9" × 5"',
    img: `${SQ}1742855807836-AJ4CGF9Y2TAVS8UJNKRW/28D8A477-B232-454F-A79D-27E031680231.jpeg?format=1400w`,
    span: 1,
  },
]

export default function FeaturedPieces() {
  return (
    <section style={{
      background: 'var(--cream)',
      padding: '120px 60px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'end',
          marginBottom: 56,
        }}>
          <div>
            <div className="label" style={{ marginBottom: 16 }}>Recent Work</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 4vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              color: 'var(--black)',
            }}>
              Built once.<br /><span style={{ color: 'var(--green)' }}>Built right.</span>
            </h2>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--gray-dark)',
            lineHeight: 1.8,
            fontStyle: 'italic',
            maxWidth: 460,
          }}>
            Every commission starts with the slab and ends with a finished piece you can stand on top of. No flat-pack, no veneer, no hardware-store screws. Solid wood, joinery, and a finish that lasts.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 'minmax(420px, auto)',
          gap: 18,
        }}>
          {PIECES.map((p) => (
            <a
              key={p.title}
              href="/gallery"
              style={{
                gridColumn: `span ${p.span}`,
                position: 'relative',
                overflow: 'hidden',
                background: '#1a1a18',
                color: '#fff',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) img.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) img.style.transform = 'scale(1)'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.7s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute',
                left: 28, right: 28, bottom: 26,
                color: '#fff',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 16,
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: 'var(--tan)',
                    marginBottom: 8,
                  }}>
                    {p.materials}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 700,
                    letterSpacing: '-0.3px',
                    textTransform: 'uppercase',
                    lineHeight: 1.05,
                    marginBottom: 6,
                  }}>
                    {p.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.65)',
                    fontStyle: 'italic',
                  }}>
                    {p.dims}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  color: 'var(--tan)',
                  fontWeight: 700,
                  lineHeight: 1,
                }}>
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/gallery" className="btn-ghost">See the Full Portfolio</a>
        </div>
      </div>
    </section>
  )
}
