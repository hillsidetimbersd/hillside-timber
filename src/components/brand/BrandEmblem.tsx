'use client'

import Link from 'next/link'
import { useBrand } from './BrandContext'

/**
 * Center maker's mark that sits between the two brand names in the switcher.
 * Hillside Timber shows its real saw-blade logo. Sioux Falls Woodworking has no
 * mark of its own, so it gets a sibling saw blade drawn here with an "SFW"
 * monogram. Both float on their own (no medallion ring) with a soft drop-shadow.
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'transform 0.25s ease',
        filter: 'drop-shadow(0 6px 14px rgba(15,15,13,0.34))',
      }}
    >
      {isHt ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/assets/logos/ht-emblem.png"
          alt="Hillside Timber"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <SfwSeal />
      )}
      <style>{`
        .brand-emblem:hover { transform: translateY(-1.5px); }
        .brand-emblem:focus-visible { outline: 3px solid var(--green); outline-offset: 4px; border-radius: 50%; }
      `}</style>
    </Link>
  )
}

/** Sioux Falls Woodworking mark: a saw blade in the Hillside family, with an SFW monogram. */
function SfwSeal() {
  const blade = '#1c3d2a'
  const ink = '#f4f0e8'
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      role="img"
      aria-label="Sioux Falls Woodworking"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* saw teeth: dark ticks protruding past the disc edge */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={blade} strokeWidth="8" strokeDasharray="3.4 5.1" />
      {/* blade body */}
      <circle cx="50" cy="50" r="44" fill={blade} />
      {/* SFW monogram */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fill={ink}
        style={{
          fontFamily: "var(--font-display), 'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: '29px',
          letterSpacing: '0.5px',
        }}
      >
        SFW
      </text>
    </svg>
  )
}
