import type { CSSProperties } from 'react'

type Partner = {
  name: string
  src: string
  /* Optical height in px, tuned by eye: stacked marks (Rubio, the General
     Finishes crest) need more height to carry the same visual weight as the
     single-line wordmarks. Equal height alone reads unbalanced. */
  h: number
}

const PARTNERS: Partner[] = [
  { name: 'EcoPoxy',          src: '/assets/logos/partners/ecopoxy.png',          h: 26 },
  { name: 'Rubio Monocoat',   src: '/assets/logos/partners/rubio-monocoat.png',   h: 42 },
  { name: 'Wood-Mizer',       src: '/assets/logos/partners/wood-mizer.svg',       h: 30 },
  { name: 'General Finishes', src: '/assets/logos/partners/general-finishes.png', h: 46 },
  { name: 'Festool',          src: '/assets/logos/partners/festool.svg',          h: 25 },
  { name: 'Osmo',             src: '/assets/logos/partners/osmo.svg',             h: 30 },
  { name: 'TotalBoat',        src: '/assets/logos/partners/totalboat.png',        h: 30 },
  { name: 'TimberKing',       src: '/assets/logos/partners/timberking.svg',       h: 25 },
]

export default function VendorTicker() {
  // Three identical sets in one flat track. Each logo carries its own spacing
  // as horizontal padding (not a flex gap), so the seam between the last and
  // first logo matches every other gap and translateX(-33.3333%) loops cleanly.
  const track = [...PARTNERS, ...PARTNERS, ...PARTNERS]

  return (
    <section className="partner-strip" aria-labelledby="partner-strip-label">
      <p id="partner-strip-label" className="partner-strip__label">Trusted Partners &amp; Suppliers</p>
      <div className="partner-strip__viewport">
        <div className="partner-track">
          {track.map((p, i) => {
            const original = i < PARTNERS.length
            return (
              <span
                key={`${p.name}-${i}`}
                className="partner-logo"
                style={{ '--logo-h': `${p.h}px` } as CSSProperties}
                aria-hidden={!original}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={original ? p.name : ''}
                  loading="lazy"
                  draggable={false}
                />
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
