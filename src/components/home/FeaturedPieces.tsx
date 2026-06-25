'use client'

import { useEffect, useRef } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import type { FeaturedPiece, FeaturedSlot } from '@/lib/featured-pieces'

const SLOT_CLASS: Record<FeaturedSlot, string> = {
  hero: 'fp-card--hero',
  portrait: 'fp-card--portrait',
  tile: 'fp-card--tile',
}

// Per-position layout roles: the last two tiles collapse on mobile to keep the
// teaser tight, and the final tile widens to a band on tablet so the grid stays
// hole-free at every breakpoint.
const EXTRA = ['', '', '', '', 'fp-hide-mobile', 'fp-band fp-hide-mobile']

export default function FeaturedPieces({ pieces }: { pieces: FeaturedPiece[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  // Scroll-reveal driven by the DOM (not React state) so it degrades to visible
  // without JS and never blocks paint: the hidden initial state only applies once
  // `fp-js` is added here, and `is-in` plays the staggered reveal on intersect.
  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('fp-js')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="grain" style={{ position: 'relative', background: 'var(--cream)', padding: '132px var(--section-pad-x)' }}>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div className="fp-head">
          <div>
            <div className="label" style={{ marginBottom: 16 }}>Recent Work</div>
            <h2 className="fp-title">
              Built once.<br /><span style={{ color: 'var(--green)' }}>Built right.</span>
            </h2>
          </div>
          <p className="fp-intro">
            Every commission starts with the slab and ends with a finished piece you can stand on top of.
            No flat-pack, no veneer, no hardware-store screws. Solid wood, joinery, and a finish that lasts.
          </p>
        </div>

        <div ref={gridRef} className="fp-grid">
          {pieces.map((p, i) => (
            <div
              key={p.slug}
              className={`fp-anim ${SLOT_CLASS[p.slot]} ${EXTRA[i] ?? ''}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <a href={p.href} className="fp-card" aria-label={`${p.title}. View in the portfolio.`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="fp-card__img"
                  src={p.cover}
                  alt={`${p.title}, handcrafted by Sioux Falls Woodworking`}
                  loading={i === 0 ? undefined : 'lazy'}
                />
                <span className="fp-card__scrim" aria-hidden="true" />
                <span className="fp-card__cta" aria-hidden="true">
                  <ArrowUpRight size={p.slot === 'hero' ? 20 : 17} weight="bold" />
                </span>
                <span className="fp-card__meta">
                  <span className="fp-card__eyebrow">{p.eyebrow}</span>
                  <span className="fp-card__title">{p.title}</span>
                </span>
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <a href="/gallery" className="btn-ghost">See the Full Portfolio</a>
        </div>
      </div>
      <style>{STYLES}</style>
    </section>
  )
}

const STYLES = `
.fp-head { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: end; margin-bottom: 56px; }
.fp-title { font-family: var(--font-display); font-size: clamp(38px, 4vw, 64px); font-weight: 800; letter-spacing: -1.5px; line-height: 0.95; text-transform: uppercase; color: var(--black); }
.fp-intro { font-family: var(--font-body); font-size: var(--fs-17); color: var(--gray-dark); line-height: 1.8; font-style: italic; max-width: 580px; }
@media (max-width: 900px) {
  .fp-head { grid-template-columns: 1fr; gap: 18px; align-items: start; margin-bottom: 34px; }
  .fp-intro { max-width: none; }
}

.fp-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: clamp(214px, 20.5vw, 316px); gap: 18px; }
.fp-card--hero { grid-column: span 3; grid-row: span 2; }
.fp-card--portrait { grid-column: span 1; grid-row: span 2; }
.fp-card--tile { grid-column: span 1; grid-row: span 1; }
@media (max-width: 1100px) {
  .fp-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: clamp(196px, 30vw, 250px); gap: 16px; }
  .fp-card--hero { grid-column: span 2; grid-row: span 1; }
  .fp-card--portrait { grid-column: span 1; grid-row: span 1; }
  .fp-band { grid-column: span 2; }
}
@media (max-width: 680px) {
  .fp-grid { grid-template-columns: 1fr; grid-auto-rows: clamp(230px, 64vw, 300px); gap: 14px; }
  .fp-card--hero, .fp-card--portrait, .fp-band { grid-column: span 1; grid-row: span 1; }
  .fp-hide-mobile { display: none; }
}

.fp-anim { min-height: 0; }
.fp-grid.fp-js .fp-anim { opacity: 0; transform: translateY(26px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
.fp-grid.fp-js.is-in .fp-anim { opacity: 1; transform: none; }

.fp-card { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; border-radius: var(--radius-lg); background: #1a1a18; box-shadow: var(--shadow); text-decoration: none; cursor: pointer; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease; }
.fp-card:focus-visible { outline: 3px solid var(--green); outline-offset: 4px; }
.fp-card__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
.fp-card__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,15,13,0.86) 0%, rgba(15,15,13,0.2) 46%, rgba(15,15,13,0) 70%); pointer-events: none; }
.fp-card__cta { position: absolute; top: 15px; right: 15px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--green); color: #fff; opacity: 0; transform: scale(0.8); transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1); }
.fp-card__meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 24px; display: flex; flex-direction: column; gap: 6px; }
.fp-card__eyebrow { font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--tan); }
.fp-card__title { font-family: var(--font-display); font-weight: 800; letter-spacing: -0.2px; text-transform: uppercase; color: #fff; line-height: 1.02; font-size: clamp(19px, 1.7vw, 24px); }
.fp-card--hero .fp-card__title { font-size: clamp(26px, 2.8vw, 40px); }
.fp-card--hero .fp-card__meta { padding: 30px 32px; }

@media (prefers-reduced-motion: no-preference) {
  .fp-card:hover, .fp-card:focus-visible { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
  .fp-card:hover .fp-card__img, .fp-card:focus-visible .fp-card__img { transform: scale(1.06); }
  .fp-card:hover .fp-card__cta, .fp-card:focus-visible .fp-card__cta { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .fp-card:hover .fp-card__cta, .fp-card:focus-visible .fp-card__cta { opacity: 1; transform: scale(1); }
}
`
