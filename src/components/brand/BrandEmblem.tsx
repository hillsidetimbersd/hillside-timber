'use client'

import Link from 'next/link'
import { useBrand } from './BrandContext'

/**
 * Center maker's mark that sits between the two brand names in the switcher.
 * Hillside Timber shows its real saw-blade logo. Sioux Falls Woodworking shows the
 * full photo of one of its finished pieces (a live-edge walnut and epoxy table),
 * floating on its own. Both sit on a soft drop-shadow.
 */
export default function BrandEmblem() {
  const brand = useBrand()
  const isHt = brand.key === 'ht'

  return (
    <Link
      href="/"
      aria-label={`${brand.name} home`}
      className="brand-emblem"
      style={{
        position: 'relative',
        // The Sioux Falls piece is a bit smaller and dropped lower so it clears the top edge.
        height: isHt ? 'var(--emblem-size)' : 'calc(var(--emblem-size) * 0.8)',
        width: isHt ? 'var(--emblem-size)' : 'auto',
        marginTop: isHt ? 0 : 'calc(var(--emblem-size) * 0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'transform 0.25s ease',
        filter: 'drop-shadow(0 7px 16px rgba(15,15,13,0.4))',
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
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/assets/logos/sfw-full.png"
          alt="Sioux Falls Woodworking live-edge walnut and epoxy table"
          style={{ height: '100%', width: 'auto', maxWidth: 'none', objectFit: 'contain', display: 'block' }}
        />
      )}
      <style>{`
        .brand-emblem:hover { transform: translateY(-1.5px); }
        .brand-emblem:focus-visible { outline: 3px solid var(--green); outline-offset: 4px; }
      `}</style>
    </Link>
  )
}
