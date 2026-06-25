'use client'

import { useBrand } from './BrandContext'
import BrandEmblem from './BrandEmblem'

const BRANDS = [
  { key: 'ht', label: 'Hillside Timber', short: 'HT' },
  { key: 'sfw', label: 'Sioux Falls Woodworking', short: 'SFW' },
] as const

export default function BrandSwitcher() {
  const brand = useBrand()

  function handleSwitch(targetKey: string) {
    if (targetKey === brand.key) return
    // Set the cookie so the server re-reads the brand on the next request, then reload.
    // The reload is intentional: the active brand is read in the root layout, which
    // client navigation preserves — only a full load re-brands the chrome.
    /* eslint-disable react-hooks/immutability */
    document.cookie = `ww-brand=${targetKey}; path=/; max-age=31536000; samesite=lax`
    window.location.href = '/'
    /* eslint-enable react-hooks/immutability */
  }

  // The tan wake follows the cursor across the hovered half.
  function handleWake(e: React.MouseEvent<HTMLButtonElement>) {
    const el = e.currentTarget
    const wake = el.querySelector<HTMLElement>('.ww-wake')
    if (!wake) return
    const r = el.getBoundingClientRect()
    wake.style.setProperty('--wx', `${((e.clientX - r.left) / r.width) * 100}%`)
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
        const activeBg = b.key === 'sfw' ? 'var(--sfw-active)' : 'var(--green)'
        const activeFg = b.key === 'sfw' ? 'var(--sfw-active-text)' : '#fff'
        const innerSide =
          i === 0
            ? { paddingRight: 'calc(var(--emblem-size) * 0.7)' }
            : { paddingLeft: 'calc(var(--emblem-size) * 0.7)' }
        return (
          <button
            key={b.key}
            type="button"
            onClick={() => handleSwitch(b.key)}
            onMouseMove={handleWake}
            aria-pressed={isActive}
            className={`ww-half${isActive ? ' is-active' : ''}`}
            style={{
              flex: 1,
              height: '100%',
              background: isActive ? activeBg : 'var(--switch-inactive)',
              color: isActive ? activeFg : 'var(--switch-inactive-text)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-14)',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              border: 'none',
              cursor: isActive ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              ...innerSide,
            }}
          >
            <span className="ww-wake" aria-hidden="true" />
            {isActive && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'currentColor',
                  flexShrink: 0,
                }}
              />
            )}
            <span className="switcher-label-full">{b.label}</span>
            <span className="switcher-label-short" style={{ display: 'none' }}>
              {b.short}
            </span>
          </button>
        )
      })}

      {/* Kerf: the fine saw-cut line where the two boards meet */}
      <span className="ww-seam" aria-hidden="true" />

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
