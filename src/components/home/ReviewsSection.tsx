const REVIEWS = [
  {
    name: 'Marcus T.',
    location: 'Sioux Falls, SD',
    rating: 5,
    text: "I've worked with a lot of wood suppliers over the years. Hillside Timber is in a different league. The slabs arrived perfectly dried, and the grain on the walnut piece I ordered was absolutely stunning.",
    product: 'Black Walnut Live Edge Slab',
  },
  {
    name: 'Sarah K.',
    location: 'Rapid City, SD',
    rating: 5,
    text: "Slavic built us a custom dining table for our cabin. The craftsmanship is something else entirely. Five years in and it still looks brand new. We get compliments every single time someone visits.",
    product: 'Custom White Oak Dining Table',
  },
  {
    name: 'Derek J.',
    location: 'Minneapolis, MN',
    rating: 5,
    text: "Drove six hours to pick up slabs in person. Completely worth it. The solar kiln operation alone is impressive to see. These folks take wood seriously in a way that most suppliers just don't.",
    product: 'White Oak Slab Bundle',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: '#2a5c3f', fontSize: '14px' }}>&#9733;</span>
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  return (
    <section style={{
      background: '#0f0f0d',
      padding: '120px var(--section-pad-x)',
    }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: 14,
          }}>
            What Customers Say
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 4vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 0.95,
          }}>
            Built on trust.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Proven by results.</span>
          </h2>
        </div>

        {/* Reviews grid */}
        <div className="reviews-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '32px 28px',
              }}
            >
              <Stars count={r.rating} />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.75,
                marginBottom: 24,
                fontStyle: 'italic',
              }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: 2,
                }}>
                  {r.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  {r.location}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '10px',
                  letterSpacing: '1px',
                  color: 'var(--green)',
                  marginTop: 8,
                  textTransform: 'uppercase',
                }}>
                  {r.product}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
