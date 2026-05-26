'use client'

import { useBrand } from './BrandContext'

const BRANDS = [
  { key: 'ht', label: 'Hillside Timber', short: 'HT' },
  { key: 'sfw', label: 'Sioux Falls Woodworking', short: 'SFW' },
]

export default function BrandSwitcher() {
  const brand = useBrand()

  function handleSwitch(targetKey: string) {
    if (targetKey === brand.key) return
    // Set cookie directly so the server component reads it on next request
    document.cookie = `ww-brand=${targetKey}; path=/; max-age=31536000; samesite=lax`
    window.location.href = '/'
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--switcher-h)',
        zIndex: 60,
        display: 'flex',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      {BRANDS.map((b) => {
        const isActive = brand.key === b.key
        return (
          <button
            key={b.key}
            onClick={() => handleSwitch(b.key)}
            style={{
              flex: 1,
              height: '100%',
              background: isActive ? 'var(--green)' : '#f0ede8',
              color: isActive ? '#fff' : '#888',
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              border: 'none',
              cursor: isActive ? 'default' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isActive && (
              <span style={{
                width: 5,
                height: 5,
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
    </div>
  )
}
