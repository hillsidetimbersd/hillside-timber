'use client'

import Link from 'next/link'
import { useBrand } from './BrandContext'

/**
 * Center "maker's seal" that sits between the two brand names in the switcher.
 * Hillside Timber shows its real saw-blade mark (the existing wordmark cropped to
 * a round clip so the side lettering is masked off). Sioux Falls Woodworking has no
 * mark of its own, so it gets a sibling seal drawn here as an SVG: same circular
 * saw-blade family, a cream medallion, and an "SFW" monogram.
 */
export default function BrandEmblem() {
  const brand = useBrand()
  const isHt = brand.key === 'ht'

  return (
    <Link
      href="/"
      aria-label={`${brand.name} — home`}
      className="brand-emblem"
      style={{
        position: 'relative',
        width: 'var(--emblem-size)',
        height: 'var(--emblem-size)',
        borderRadius: '50%',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textDecoration: 'none',
        boxShadow:
          '0 12px 30px rgba(15,15,13,0.24), 0 3px 8px rgba(15,15,13,0.14), inset 0 0 0 1.5px rgba(42,92,63,0.32)',
        flexShrink: 0,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {isHt ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/assets/logos/ht-emblem.png"
          alt="Hillside Timber"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <SfwSeal />
      )}
      <style>{`
        .brand-emblem:hover { transform: translateY(-1px); box-shadow: 0 16px 36px rgba(15,15,13,0.28), 0 4px 10px rgba(15,15,13,0.16), inset 0 0 0 1.5px rgba(42,92,63,0.4); }
        .brand-emblem:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
      `}</style>
    </Link>
  )
}

/** Sioux Falls Woodworking seal — drawn to live as a sibling of the Hillside saw-blade mark. */
function SfwSeal() {
  const blade = '#21472f'
  const cream = '#f4f0e8'
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      role="img"
      aria-label="Sioux Falls Woodworking"
      style={{ display: 'block' }}
    >
      {/* saw teeth: dark ticks protruding past the disc edge */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={blade}
        strokeWidth="8"
        strokeDasharray="3.4 5.1"
      />
      {/* blade body */}
      <circle cx="50" cy="50" r="44" fill={blade} />
      {/* cream medallion */}
      <circle cx="50" cy="50" r="34" fill={cream} />
      <circle cx="50" cy="50" r="34" fill="none" stroke={blade} strokeWidth="1.4" opacity="0.5" />
      {/* monogram */}
      <text
        x="50"
        y="49"
        textAnchor="middle"
        dominantBaseline="central"
        fill={blade}
        style={{
          fontFamily: "var(--font-display), 'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: '23px',
          letterSpacing: '0.5px',
        }}
      >
        SFW
      </text>
      {/* underline + locale tag */}
      <rect x="38" y="60" width="24" height="1.4" fill={blade} opacity="0.55" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        dominantBaseline="central"
        fill={blade}
        style={{
          fontFamily: "var(--font-display), 'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '7px',
          letterSpacing: '1.5px',
        }}
      >
        SOUTH DAKOTA
      </text>
    </svg>
  )
}
