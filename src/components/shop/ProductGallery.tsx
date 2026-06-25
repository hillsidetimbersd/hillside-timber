'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, CaretLeft, CaretRight, MagnifyingGlassPlus } from '@phosphor-icons/react'

// CDN request widths. The stage stays crisp; thumbs stay light; the lightbox is largest.
const STAGE_W = 1600
const THUMB_W = 240
const LB_W = 2000

/** Resize a Squarespace CDN image. Product URLs already carry `?format=1000w`, so
 *  strip any existing query before appending the width we want. */
function sizeImg(url: string, width: number): string {
  if (!url.includes('images.squarespace-cdn.com')) return url
  const base = url.split('?')[0]
  return `${base}?format=${width}w`
}

type Tone = 'sale' | 'drying' | 'sold'
const TONE: Record<Tone, { bg: string; color: string }> = {
  sale: { bg: 'var(--green)', color: '#fff' },
  drying: { bg: 'rgba(15,15,13,0.92)', color: 'var(--tan)' },
  sold: { bg: 'var(--black)', color: '#fff' },
}

export default function ProductGallery({
  images,
  name,
  statusBadge,
}: {
  images: string[]
  name: string
  statusBadge?: { label: string; tone: Tone }
}) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const count = images.length
  const safe = Math.min(active, count - 1)

  if (count === 0) {
    return <div className="pdpg-empty" aria-hidden="true" />
  }

  return (
    <div className="pdpg">
      <style>{STYLES}</style>

      <button
        type="button"
        className="pdpg-stage"
        onClick={() => setOpen(true)}
        aria-label={`${name}. Open full-size gallery.`}
      >
        <img src={sizeImg(images[safe], STAGE_W)} alt={`${name}, photo ${safe + 1} of ${count}`} />
        {statusBadge && (
          <span className="pdpg-badge" style={{ background: TONE[statusBadge.tone].bg, color: TONE[statusBadge.tone].color }}>
            {statusBadge.label}
          </span>
        )}
        <span className="pdpg-zoom" aria-hidden="true">
          <MagnifyingGlassPlus size={17} weight="bold" />
        </span>
        {count > 1 && <span className="pdpg-count">{safe + 1} / {count}</span>}
      </button>

      {count > 1 && (
        <div className="pdpg-rail">
          {images.map((im, idx) => (
            <button
              type="button"
              key={im}
              className={`pdpg-thumb${idx === safe ? ' pdpg-thumb--active' : ''}`}
              onClick={() => setActive(idx)}
              aria-label={`View photo ${idx + 1}`}
              aria-current={idx === safe}
            >
              <img src={sizeImg(im, THUMB_W)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          name={name}
          start={safe}
          onIndex={setActive}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

function Lightbox({
  images,
  name,
  start,
  onIndex,
  onClose,
}: {
  images: string[]
  name: string
  start: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const count = images.length
  const [i, setI] = useState(start)
  const rootRef = useRef<HTMLDivElement>(null)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const touchX = useRef<number | null>(null)

  const go = useCallback((d: number) => setI((p) => (p + d + count) % count), [count])

  // Sync the active stage image back to the inline gallery, so closing keeps your place.
  useEffect(() => { onIndex(i) }, [i, onIndex])

  // Body scroll lock, keyboard nav, focus capture + restore, focus trap.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    rootRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); return }
      if (e.key === 'Tab') {
        const root = rootRef.current
        if (!root) return
        const f = root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        const act = document.activeElement
        if (e.shiftKey && (act === first || act === root)) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [go, onClose])

  // Keep the active thumb in view and preload neighbours for instant nav.
  useEffect(() => {
    thumbRefs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    for (const k of [i + 1, i - 1]) {
      const idx = (k + count) % count
      const img = new Image()
      img.src = sizeImg(images[idx], LB_W)
    }
  }, [i, images, count])

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return createPortal(
    <div
      className="pdplb"
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${name}, photo gallery`}
      onClick={onClose}
    >
      <div className="pdplb__bar" onClick={stop}>
        <span className="pdplb__title">{name}</span>
        <span className="pdplb__count">{i + 1} / {count}</span>
        <button type="button" className="pdplb__close" onClick={onClose} aria-label="Close gallery">
          <X size={20} weight="bold" />
        </button>
      </div>

      <div className="pdplb__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {count > 1 && (
          <button type="button" className="pdplb__nav pdplb__nav--prev" onClick={(e) => { stop(e); go(-1) }} aria-label="Previous photo">
            <CaretLeft size={26} weight="bold" />
          </button>
        )}
        <img className="pdplb__img" onClick={stop} src={sizeImg(images[i], LB_W)} alt={`${name} — photo ${i + 1} of ${count}`} />
        {count > 1 && (
          <button type="button" className="pdplb__nav pdplb__nav--next" onClick={(e) => { stop(e); go(1) }} aria-label="Next photo">
            <CaretRight size={26} weight="bold" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="pdplb__strip" onClick={stop}>
          {images.map((im, idx) => (
            <button
              type="button"
              key={im}
              ref={(el) => { thumbRefs.current[idx] = el }}
              className={`pdplb__thumb${idx === i ? ' pdplb__thumb--active' : ''}`}
              onClick={() => setI(idx)}
              aria-label={`Go to photo ${idx + 1}`}
              aria-current={idx === i}
            >
              <img src={sizeImg(im, THUMB_W)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

    </div>,
    document.body,
  )
}

const STYLES = `
.pdpg { display: flex; flex-direction: column; gap: 12px; }
.pdpg-empty { aspect-ratio: 4 / 3; background: #f0ede8; border-radius: var(--radius-lg); }

.pdpg-stage {
  all: unset; box-sizing: border-box; position: relative; cursor: zoom-in;
  display: block; aspect-ratio: 4 / 3; width: 100%;
  background: #efe9df; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
}
.pdpg-stage > img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdpg-stage:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }

.pdpg-badge {
  position: absolute; top: 14px; left: 14px; padding: 6px 12px; pointer-events: none;
  font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
}
.pdpg-count {
  position: absolute; bottom: 14px; right: 14px;
  font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 1.5px;
  color: var(--black); background: rgba(248,246,241,0.92); padding: 5px 11px; border-radius: 999px;
}
.pdpg-zoom {
  position: absolute; top: 13px; right: 13px; width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center; border-radius: 999px;
  background: rgba(248,246,241,0.92); color: var(--black); opacity: 0;
  transition: opacity 0.3s ease;
}
@media (prefers-reduced-motion: no-preference) {
  .pdpg-stage:hover .pdpg-zoom, .pdpg-stage:focus-visible .pdpg-zoom { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .pdpg-zoom { opacity: 1; } }

.pdpg-rail { display: flex; gap: 10px; overflow-x: auto; padding: 2px 1px 6px; scrollbar-width: thin; }
.pdpg-thumb {
  all: unset; box-sizing: border-box; cursor: pointer; flex: 0 0 auto;
  width: 88px; height: 66px; border-radius: var(--radius-sm); overflow: hidden;
  border: 1px solid var(--border); opacity: 0.7;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}
.pdpg-thumb > img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdpg-thumb:hover { opacity: 1; }
.pdpg-thumb--active { opacity: 1; border-color: var(--green); }
.pdpg-thumb:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }

/* ── Lightbox ── */
.pdplb {
  position: fixed; inset: 0; z-index: 120; background: rgba(12,12,10,0.97);
  display: flex; flex-direction: column; gap: 14px; padding: clamp(14px, 2.4vw, 26px);
  animation: pdplbIn 0.26s ease both;
}
@keyframes pdplbIn { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .pdplb { animation: none; } }

.pdplb__bar { display: flex; align-items: center; gap: 16px; }
.pdplb__title { font-family: var(--font-display); font-size: clamp(17px, 2.2vw, 24px); font-weight: 800; letter-spacing: -0.2px; text-transform: uppercase; color: #fff; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pdplb__count { margin-left: auto; font-family: var(--font-display); font-size: var(--fs-13); font-weight: 700; letter-spacing: 1.5px; color: rgba(255,255,255,0.65); }
.pdplb__close { all: unset; box-sizing: border-box; cursor: pointer; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 999px; color: #fff; background: rgba(255,255,255,0.08); transition: background 0.2s ease; }
.pdplb__close:hover { background: rgba(255,255,255,0.18); }
.pdplb__close:focus-visible { outline: 2px solid var(--tan); outline-offset: 2px; }

.pdplb__stage { position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.pdplb__img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius); box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
.pdplb__nav { all: unset; box-sizing: border-box; cursor: pointer; position: absolute; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 999px; color: #fff; background: rgba(20,20,18,0.55); backdrop-filter: blur(6px); transition: background 0.2s ease; z-index: 2; }
.pdplb__nav:hover { background: var(--green); }
.pdplb__nav:focus-visible { outline: 2px solid var(--tan); outline-offset: 2px; }
.pdplb__nav--prev { left: 6px; }
.pdplb__nav--next { right: 6px; }

.pdplb__strip { display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 6px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
.pdplb__thumb { all: unset; box-sizing: border-box; cursor: pointer; flex: 0 0 auto; width: 84px; height: 60px; border-radius: 6px; overflow: hidden; opacity: 0.45; outline: 2px solid transparent; transition: opacity 0.2s ease, outline-color 0.2s ease; }
.pdplb__thumb > img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdplb__thumb:hover { opacity: 0.85; }
.pdplb__thumb--active { opacity: 1; outline-color: var(--tan); }
.pdplb__thumb:focus-visible { outline-color: #fff; }

.pdplb__foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.pdplb__cta { font-family: var(--font-display); font-size: var(--fs-12); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border-bottom: 1.5px solid var(--tan); padding-bottom: 3px; transition: color 0.2s ease; }
.pdplb__cta:hover { color: var(--tan); }
.pdplb__link { font-family: var(--font-body); font-style: italic; font-size: var(--fs-13); color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s ease; }
.pdplb__link:hover { color: rgba(255,255,255,0.85); }

@media (max-width: 680px) {
  .pdplb__nav { width: 44px; height: 44px; }
  .pdplb__thumb { width: 64px; height: 46px; }
  .pdplb__link { display: none; }
}
`
