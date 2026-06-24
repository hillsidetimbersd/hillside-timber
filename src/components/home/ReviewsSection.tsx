import { homeReviews } from '@/lib/reviews'
import { RatingMark, SourceBadge } from '@/components/reviews/marks'

export default function ReviewsSection() {
  return (
    <section style={{
      // The exit of the dark run. Holds the review-card green through the cards,
      // then carries green down through brand green into sage. An overlay below
      // the section bleeds that sage on into the top of the cream Instagram band,
      // so the two share one continuous fade with no seam line. The warm steps
      // live entirely in the card-free lower padding, so cards keep their dark
      // backing. position+z-index let the overlay paint over the band below.
      position: 'relative',
      zIndex: 1,
      background: 'linear-gradient(180deg, var(--tone-reviews) 0%, var(--tone-reviews) 80%, var(--tone-bridge) 91%, var(--tone-sage) 100%)',
      padding: '120px var(--section-pad-x)',
    }}>
      {/* Carries the sage past the section edge into the top of the cream
          Instagram band, dissolving to nothing before its content so the green
          fades fully out with no hard line (and hides the band's 1px top rule). */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, bottom: -150, height: 150,
        background: 'linear-gradient(180deg, var(--tone-sage) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
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
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Proven by results.</span>
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '32px 28px',
                borderRadius: 'var(--radius)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <RatingMark review={r} starColor="var(--tan)" recommendColor="var(--tan)" emptyColor="rgba(255,255,255,0.22)" />
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-16)',
                  color: 'rgba(255,255,255,0.82)',
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
                        color: 'rgba(255,255,255,0.56)',
                        marginTop: 1,
                      }}
                    >
                      {r.standing}
                    </div>
                  )}
                </div>
                <SourceBadge source={r.source} color="rgba(255,255,255,0.62)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
