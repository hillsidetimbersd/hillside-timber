'use client'

import { useRef, useState, useSyncExternalStore } from 'react'

// prefers-reduced-motion as an external store, so we read it without a
// set-state-in-effect (and it reacts if the user flips the setting live).
function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Props {
  src: string
  alt: string
  /** Styles for the root container (e.g. aspectRatio). */
  style?: React.CSSProperties
  /** Styles for the base image (e.g. sold-state opacity/grayscale). */
  imgStyle?: React.CSSProperties
  className?: string
  /** Overlays (badges, captions, buttons) rendered above the image. */
  children?: React.ReactNode
  /** Optional label that rides under the cursor (e.g. "View Piece →"). Use only when the whole image is clickable. */
  hint?: string
}

/**
 * An image tile with overlay children (badges, captions). When `hint` is set, a
 * small label rides just under the cursor on hover to signal the whole image is
 * clickable. Used on the home gallery and the shop product cards.
 *
 * The label is positioned by mutating its transform via a ref on mousemove, so
 * there is no React re-render while tracking. The cursor-following label is
 * disabled for prefers-reduced-motion; without a `hint` the tile carries zero
 * hover overhead (no listeners, no state changes).
 */
export default function HoverImage({
  src, alt, style, imgStyle, className, children, hint,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  const showHint = !!hint && active && !reduced

  function place(x: number, y: number) {
    if (!hintRef.current) return
    // Ride ~22px below the cursor (clearing the visible pointer), but flip above
    // it near the bottom edge so the label never clips off the tile.
    const h = rootRef.current ? rootRef.current.offsetHeight : 0
    const belowY = y + 22
    const labelY = h > 0 && belowY > h - 30 ? y - 44 : belowY
    hintRef.current.style.transform = `translate(${x}px, ${labelY}px) translate(-50%, 0)`
  }

  function coords(e: React.MouseEvent<HTMLDivElement>) {
    const el = rootRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  // The cursor-following label is the only hover behaviour; skip the handlers
  // entirely when there is no label to show (shop cards) or motion is reduced.
  const hoverHandlers = hint && !reduced ? {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { const p = coords(e); if (p) place(p.x, p.y); setActive(true) },
    onMouseLeave: () => setActive(false),
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => { const p = coords(e); if (p) place(p.x, p.y) },
  } : {}

  return (
    <div
      ref={rootRef}
      className={className}
      {...hoverHandlers}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', background: '#e0dbd0', ...imgStyle }}
      />

      {/* Overlays (caption, badges) render above the image. */}
      {children}

      {/* Label that rides under the cursor, signalling the image is clickable */}
      {hint && (
        <div ref={hintRef} aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, pointerEvents: 'none', display: showHint ? 'inline-flex' : 'none',
          alignItems: 'center', gap: 5, padding: '6px 11px', whiteSpace: 'nowrap', willChange: 'transform',
          background: 'rgba(15,15,13,0.92)', color: '#fff',
          fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
          boxShadow: '0 6px 18px rgba(15,15,13,0.32)',
        }}>
          {hint}
        </div>
      )}
    </div>
  )
}
