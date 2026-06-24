'use client'

import { useBrand } from './BrandContext'
import BrandEmblem from './BrandEmblem'

const BRANDS = [
  { key: 'ht', label: 'Hillside Timber', short: 'HT' },
  { key: 'sfw', label: 'Sioux Falls Woodworking', short: 'SFW' },
]

export default function BrandSwitcher() {
  const brand = useBrand()

  function handleSwitch(targetKey: string) {
    if (targetKey === brand.key) return
    // Set cookie directly so the server component reads it on next request. These are
    // genuine event-handler side effects, not render-time mutations; the compiler-oriented
    // react-hooks/immutability rule false-positives on assigning to these globals here.
    /* eslint-disable react-hooks/immutability */
    document.cookie = `ww-brand=${targetKey}; path=/; max-age=31536000; samesite=lax`
    window.location.href = '/'
    /* eslint-enable react-hooks/immutability */
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        // 1px taller than the token so it overlaps the nav's top edge, sealing the seam.
        height: 'calc(var(--switcher-h) + 1px)',
        zIndex: 60,
        display: 'flex',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {BRANDS.map((b, i) => {
        const isActive = brand.key === b.key
        const innerSide = i === 0 ? { paddingRight: 'calc(var(--emblem-size) * 0.7)' } : { paddingLeft: 'calc(var(--emblem-size) * 0.7)' }
        return (
          <button
            key={b.key}
            onClick={() => handleSwitch(b.key)}
            aria-pressed={isActive}
            style={{
              flex: 1,
              height: '100%',
              background: isActive ? 'var(--green)' : '#f0ede8',
              color: isActive ? '#fff' : '#888',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-14)',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              border: 'none',
              cursor: isActive ? 'default' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              ...innerSide,
            }}
          >
            {isActive && (
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#fff',
                flexShrink: 0,
              }} />
            )}
            <span className="switcher-label-full">{b.label}</span>
            <span className="switcher-label-short" style={{ display: 'none' }}>{b.short}</span>
          </button>
        )
      })}

      {/* Center maker's seal — overhangs downward, straddling the switcher into the nav */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 5,
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}
      >
        <BrandEmblem />
      </div>
    </div>
  )
}
