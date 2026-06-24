import type { Metadata } from 'next'
import {
  featuredReview,
  wallReviews,
  REVIEW_STATS,
  REVIEW_LINKS,
  type Review,
} from '@/lib/reviews'
import { Stars, Check, RatingMark, SourceBadge } from '@/components/reviews/marks'

export const metadata: Metadata = {
  title: 'Reviews · Hillside Timber',
  description:
    'Real, verified reviews from Hillside Timber customers on Google and Facebook. A family-run slab yard 15 miles west of Sioux Falls.',
}

const STATS = [
  { num: REVIEW_STATS.rating, label: 'Average rating', star: true },
  { num: REVIEW_STATS.recommendPct, label: 'Would recommend' },
  { num: REVIEW_STATS.generations, label: 'Generations at the bench' },
]

export default function ReviewsPage() {
  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* ── HEADER ───────────────────────────────────────────── */}
      <section
        className="rv-rise"
        style={{
          maxWidth: 'var(--content-text)',
          margin: '0 auto',
          padding: '76px var(--section-pad-x) 8px',
          textAlign: 'center',
        }}
      >
        <div className="label" style={{ marginBottom: 18 }}>
          Reviews
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 6vw, 78px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            textTransform: 'uppercase',
            color: 'var(--black)',
            lineHeight: 0.92,
            marginBottom: 22,
          }}
        >
          Five stars,
          <br />
          <span style={{ color: 'var(--tan)' }}>board by board.</span>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-17)',
            color: 'var(--gray-dark)',
            lineHeight: 1.8,
            maxWidth: 600,
            margin: '0 auto 28px',
          }}
        >
          Every word below is a real, verified review from Google and Facebook. We
          don&rsquo;t write our own.
        </p>

        {/* Trust pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 32,
          }}
        >
          <span className="rv-pill">
            <Stars count={5} color="var(--green)" size={15} />
            <span>5.0 on Google</span>
          </span>
          <span className="rv-pill">
            <Check size={14} color="var(--green)" />
            <span>Recommended on Facebook</span>
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={REVIEW_LINKS.google}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Read on Google
          </a>
          <a
            href={REVIEW_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            See on Facebook
          </a>
        </div>
      </section>

      {/* ── STAT BAR ─────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--cream)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          marginTop: 64,
        }}
      >
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div className="rv-stats">
            {STATS.map((s) => (
              <div key={s.label} className="rv-stat">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(40px, 4.4vw, 56px)',
                      fontWeight: 800,
                      color: 'var(--green)',
                      letterSpacing: '-1.5px',
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </span>
                  {s.star && <Stars count={5} color="var(--tan)" size={16} />}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-11)',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--gray)',
                    marginTop: 12,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <p
            className="muted-text"
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-13)',
              padding: '0 24px 26px',
              margin: 0,
            }}
          >
            Five-star on Google and Facebook since {REVIEW_STATS.sinceYear}. Family-run, two
            generations at the bench.
          </p>
        </div>
      </section>

      {/* ── FEATURED QUOTE ───────────────────────────────────── */}
      <section
        className="grain"
        style={{
          background: 'var(--black)',
          padding: '100px var(--section-pad-x)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
          }}
        >
          <div className="label" style={{ color: 'var(--tan)', marginBottom: 6 }}>
            The one to read first
          </div>
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 96,
              lineHeight: 0.6,
              color: 'var(--tan)',
              opacity: 0.5,
              height: 52,
            }}
          >
            &ldquo;
          </span>
          <blockquote
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(23px, 2.7vw, 34px)',
              fontStyle: 'italic',
              color: '#fff',
              lineHeight: 1.5,
              letterSpacing: '-0.2px',
              margin: '0 0 28px',
            }}
          >
            {featuredReview.text}
          </blockquote>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <Stars count={5} color="var(--tan)" size={16} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-13)',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              {featuredReview.author}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-13)',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {featuredReview.standing
                ? `${featuredReview.standing} on Google`
                : 'on Google'}
            </span>
          </div>

          {featuredReview.ownerReply && (
            <div
              style={{
                marginTop: 28,
                display: 'inline-block',
                textAlign: 'left',
                borderLeft: '2px solid var(--tan)',
                padding: '6px 0 6px 16px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-10)',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: 'var(--tan)',
                  marginBottom: 3,
                }}
              >
                Hillside Timber replied
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-14)',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                &ldquo;{featuredReview.ownerReply}&rdquo;
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── THE WALL ─────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '96px var(--section-pad-x)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="label" style={{ marginBottom: 14 }}>
              From Google &amp; Facebook
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(34px, 4vw, 56px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                textTransform: 'uppercase',
                color: 'var(--black)',
                lineHeight: 0.95,
              }}
            >
              Real people, real projects.
            </h2>
          </div>

          <div className="rv-wall">
            {wallReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--black)',
          padding: '88px var(--section-pad-x)',
          textAlign: 'center',
        }}
      >
        <div className="label" style={{ color: 'var(--tan)', marginBottom: 16 }}>
          Your turn
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            color: '#fff',
            lineHeight: 0.96,
            marginBottom: 16,
          }}
        >
          Add your name
          <br />
          to the list.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-16)',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 540,
            margin: '0 auto 32px',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          Bought a slab or commissioned a piece? We&rsquo;d be honored if you shared how it
          turned out. Or come walk the yard and see for yourself.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={REVIEW_LINKS.googleWrite}
            target="_blank"
            rel="noopener noreferrer"
            className="rv-cta-primary"
          >
            Review us on Google
          </a>
          <a href="/contact" className="btn-ghost-white">
            Visit the yard
          </a>
        </div>
      </section>

      <style>{`
        .rv-rise { animation: rvRise 0.6s cubic-bezier(0.32, 0.72, 0, 1) both; }
        @keyframes rvRise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Accent CTA for the dark closing band, where the black btn-primary would
           disappear into the near-black background. Tan is the site's accent. */
        .rv-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--tan);
          color: var(--black);
          font-family: var(--font-display);
          font-size: var(--fs-13);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 16px 42px;
          border: none;
          border-radius: var(--radius-sm);
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .rv-cta-primary:hover { background: #d8bd9b; transform: translateY(-1px); }
        @media (prefers-reduced-motion: reduce) {
          .rv-cta-primary:hover { transform: none; }
        }

        .rv-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--cream);
          font-family: var(--font-display);
          font-size: var(--fs-12);
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--gray-dark);
        }

        .rv-stats { display: grid; grid-template-columns: repeat(3, 1fr); }
        .rv-stat { padding: 46px 28px; text-align: center; }
        .rv-stat + .rv-stat { border-left: 1px solid var(--border); }

        .rv-wall { columns: 3; column-gap: 24px; }
        .rv-card {
          break-inside: avoid;
          margin-bottom: 24px;
          display: block;
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 30px 28px;
          text-decoration: none;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s ease, border-color 0.2s ease;
        }
        @media (hover: hover) {
          .rv-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow);
            border-color: var(--tan);
          }
        }

        @media (max-width: 980px) { .rv-wall { columns: 2; } }
        @media (max-width: 680px) {
          .rv-wall { columns: 1; }
          .rv-stats { grid-template-columns: 1fr; }
          .rv-stat + .rv-stat { border-left: none; border-top: 1px solid var(--border); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rv-rise { animation: none; }
        }
      `}</style>
    </div>
  )
}

/* ── CARD ──────────────────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  const href = REVIEW_LINKS[review.source]
  const sourceLabel = review.source === 'google' ? 'Google' : 'Facebook'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rv-card"
      aria-label={`Read ${review.author}'s review on ${sourceLabel}`}
    >
      <RatingMark review={review} starColor="var(--green)" recommendColor="var(--green)" />

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-16)',
          color: 'var(--gray-dark)',
          lineHeight: 1.75,
          margin: '16px 0 18px',
        }}
      >
        {review.text}
      </p>

      {review.context && (
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: 18,
          }}
        >
          {review.context}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div
          style={{
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
                fontSize: 'var(--fs-13)',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--black)',
              }}
            >
              {review.author}
            </div>
            {review.standing && (
              <div
                className="muted-text"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--fs-11)',
                  marginTop: 1,
                }}
              >
                {review.standing}
              </div>
            )}
          </div>
          <SourceBadge source={review.source} color="var(--gray)" />
        </div>

        {review.ownerReply && (
          <div
            style={{
              marginTop: 16,
              borderLeft: '2px solid var(--tan)',
              padding: '2px 0 2px 12px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-9)',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
                marginBottom: 2,
              }}
            >
              Hillside Timber replied
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-13)',
                fontStyle: 'italic',
                color: 'var(--gray-dark)',
              }}
            >
              &ldquo;{review.ownerReply}&rdquo;
            </div>
          </div>
        )}
      </div>
    </a>
  )
}
