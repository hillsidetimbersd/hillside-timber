'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  alt: string
  /** Magnification factor of the lens. */
  zoom?: number
  /** Diameter of the lens, in px. */
  lensSize?: number
  /** Styles for the root container (e.g. aspectRatio). */
  style?: React.CSSProperties
  /** Styles for the base image (e.g. sold-state opacity/grayscale). */
  imgStyle?: React.CSSProperties
  className?: string
  /** Overlays (badges, captions, buttons) rendered above the image and lens. */
  children?: React.ReactNode
  /** Optional label that rides with the lens (e.g. "View Piece"). Use only when the whole image is clickable. */
  hint?: string
}

/**
 * An image that shows a magnifying-glass lens on hover: a masked, zoomed copy of
 * the image follows the cursor inside a glass ring. Used on the home gallery and
 * the shop product cards so customers can inspect slab grain.
 *
 * Smoothness: the lens appears instantly, positioned at the cursor on enter (no
 * fade, no center-jump), and the ring is moved with a GPU transform. Styles are
 * mutated via refs on mousemove, so there is no React re-render while tracking.
 * Disabled for prefers-reduced-motion (cursor stays, no lens).
 */
export default function MagnifyImage({
  src, alt, zoom = 2.3, lensSize = 160, style, imgStyle, className, children, hint,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLImageElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const lensOn = active && !reduced

  function place(x: number, y: number) {
    const mask = `radial-gradient(circle ${lensSize / 2}px at ${x}px ${y}px, #000 99%, transparent 100%)`
    if (lensRef.current) {
      lensRef.current.style.maskImage = mask
      lensRef.current.style.webkitMaskImage = mask
    }
    if (zoomRef.current) zoomRef.current.style.transformOrigin = `${x}px ${y}px`
    if (ringRef.current) ringRef.current.style.transform = `translate(${x - lensSize / 2}px, ${y - lensSize / 2}px)`
    if (hintRef.current) {
      // Ride just below the lens, but flip above it near the bottom edge so the label never clips.
      const h = rootRef.current ? rootRef.current.offsetHeight : 0
      const belowY = y + lensSize / 2 + 12
      const labelY = h > 0 && belowY > h - 30 ? y - lensSize / 2 - 40 : belowY
      hintRef.current.style.transform = `translate(${x}px, ${labelY}px) translate(-50%, 0)`
    }
  }

  function coords(e: React.MouseEvent<HTMLDivElement>) {
    const el = rootRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  return (
    <div
      ref={rootRef}
      className={className}
      onMouseEnter={(e) => { if (reduced) return; const p = coords(e); if (p) place(p.x, p.y); setActive(true) }}
      onMouseLeave={() => setActive(false)}
      onMouseMove={(e) => { if (reduced) return; const p = coords(e); if (p) place(p.x, p.y) }}
      style={{ position: 'relative', overflow: 'hidden', cursor: lensOn ? 'none' : 'pointer', ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', background: '#e0dbd0', ...imgStyle }}
      />

      {/* Overlays (caption, badges) render BELOW the lens so the magnifier and its
          label always ride above them. Badges that must stay visible set their own z-index. */}
      {children}

      {/* Magnified copy, masked to a circle at the cursor */}
      <div ref={lensRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', display: lensOn ? 'block' : 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={zoomRef} src={src} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: 'center' }} />
      </div>

      {/* Glass ring (stands in for the cursor) */}
      <div ref={ringRef} aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, width: lensSize, height: lensSize, borderRadius: '50%', pointerEvents: 'none',
        display: lensOn ? 'block' : 'none', willChange: 'transform',
        border: '2px solid rgba(255,255,255,0.8)',
        boxShadow: '0 10px 30px rgba(15,15,13,0.42), inset 0 0 22px rgba(15,15,13,0.28)',
      }} />

      {/* Label that rides with the lens, signalling the image is clickable */}
      {hint && (
        <div ref={hintRef} aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, pointerEvents: 'none', display: lensOn ? 'inline-flex' : 'none',
          alignItems: 'center', gap: 5, padding: '6px 11px', whiteSpace: 'nowrap', willChange: 'transform',
          background: 'rgba(15,15,13,0.92)', color: '#fff',
          fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
          boxShadow: '0 6px 18px rgba(15,15,13,0.32)',
        }}>
          {hint}
        </div>
      )}
    </div>
  )
}
