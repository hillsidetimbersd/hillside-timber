// Shared, presentational review marks: star rows, the Google/Facebook source badges,
// and the rating mark that shows stars for Google or a "Recommends" tag for Facebook.
// Colors are passed in so the same components work on light cards and dark bands.
// No hooks here, so this stays usable from server components.

import type { Review, ReviewSource } from '@/lib/reviews'

export function Stars({
  count,
  color,
  size,
  // Empty-star fill. Defaults to a low-opacity dark for light surfaces; pass a
  // light value (e.g. rgba(255,255,255,0.16)) when the stars sit on a dark band.
  emptyColor = 'rgba(0,0,0,0.12)',
}: {
  count: number
  color: string
  size: number
  emptyColor?: string
}) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={i < count ? color : emptyColor}
        >
          <path d="M12 2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.02 6.09 20.13l1.13-6.57L2.45 8.94l6.6-.96L12 2z" />
        </svg>
      ))}
    </span>
  )
}

export function Check({ size, color }: { size: number; color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function GoogleMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

export function FacebookMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  )
}

/** Stars for a Google rating, or a "Recommends" tag for a Facebook recommendation. */
export function RatingMark({
  review,
  starColor,
  recommendColor,
  emptyColor,
}: {
  review: Review
  starColor: string
  recommendColor: string
  /** Forwarded to `Stars` for partial ratings on dark surfaces; omit on light. */
  emptyColor?: string
}) {
  if (review.source === 'google' && review.rating) {
    return (
      <span
        role="img"
        aria-label={`Rated ${review.rating} out of 5 stars`}
        style={{ display: 'inline-flex' }}
      >
        <Stars count={review.rating} color={starColor} size={17} emptyColor={emptyColor} />
      </span>
    )
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-11)',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: recommendColor,
      }}
    >
      <Check size={15} color={recommendColor} />
      Recommends
    </span>
  )
}

/** "via Google" / "via Facebook" with the platform mark. */
export function SourceBadge({ source, color }: { source: ReviewSource; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-11)',
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {source === 'google' ? <GoogleMark size={16} /> : <FacebookMark size={16} />}
      via {source === 'google' ? 'Google' : 'Facebook'}
    </span>
  )
}
