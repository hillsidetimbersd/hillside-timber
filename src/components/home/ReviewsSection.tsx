import { homeReviews } from '@/lib/reviews'
import { RatingMark, SourceBadge } from '@/components/reviews/marks'

export default function ReviewsSection() {
  return (
    <section style={{ background: '#0f0f0d', padding: '120px var(--section-pad-x)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 60,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-9)',
                fontWeight: 700,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: 'var(--tan)',
                marginBottom: 14,
              }}
            >
              What Customers Say
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 4vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 0.95,
              }}
            >
              Built on trust.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>Proven by results.</span>
            </h2>
          </div>
          <a
            href="/reviews"
            className="btn-ghost-white"
            style={{ flexShrink: 0 }}
          >
            Read all reviews
          </a>
        </div>

        {/* Reviews grid */}
        <div
          className="reviews-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
        >
          {homeReviews.map((r) => (
            <div
              key={r.id}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                padding: '32px 28px',
                borderRadius: 'var(--radius)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <RatingMark review={r} starColor="var(--tan)" recommendColor="var(--tan)" emptyColor="rgba(255,255,255,0.16)" />
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-16)',
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.75,
                  margin: '16px 0 22px',
                  fontStyle: 'italic',
                  flex: 1,
                }}
              >
                &ldquo;{r.text}&rdquo;
              </p>
              {r.context && (
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-10)',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: 'var(--tan)',
                    marginBottom: 18,
                  }}
                >
                  {r.context}
                </div>
              )}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--fs-12)',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#fff',
                    }}
                  >
                    {r.author}
                  </div>
                  {r.standing && (
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--fs-11)',
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: 1,
                      }}
                    >
                      {r.standing}
                    </div>
                  )}
                </div>
                <SourceBadge source={r.source} color="rgba(255,255,255,0.45)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
