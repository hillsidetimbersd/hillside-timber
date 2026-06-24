'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Tag } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'
import HoverImage from '@/components/media/HoverImage'
import type { Product } from '@/lib/squarespace'

type Align = 'left' | 'center' | 'right'

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

function tileLabel(product: Product): string {
  return product.sections.find((s) => s !== 'Still Drying') ?? 'Wood Slab'
}

export default function GalleryScroll({ products = [] }: { products?: Product[] }) {
  const brand = useBrand()
  const wrapRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const col3Ref = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const col1 = col1Ref.current
    const col2 = col2Ref.current
    const col3 = col3Ref.current
    if (!wrap || !col1 || !col2 || !col3) return

    // offsetHeight only changes on resize, so cache it instead of reading layout
    // every frame.
    let total = wrap.offsetHeight - window.innerHeight
    let frame = 0

    const apply = () => {
      frame = 0
      const scrolled = clamp(-wrap.getBoundingClientRect().top, 0, total)

      // The centre column is coupled to the header text — both ride up at half
      // page-speed, so the centre stays right under the text the whole way and the two
      // never drift apart. The side columns trail slower behind them, for depth.
      const text = textRef.current
      if (text) text.style.transform = `translateY(${scrolled * 0.5}px)`
      col2.style.transform = `translateY(${-scrolled * 0.5}px)`
      col1.style.transform = `translateY(${-scrolled * 0.3}px)`
      col3.style.transform = `translateY(${-scrolled * 0.3}px)`
    }

    // Coalesce bursts of scroll events into one transform write per frame, applied
    // inside rAF (right before paint) so the parallax stays locked to the scroll
    // instead of lagging a beat behind it and bouncing.
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(apply) }
    const onResize = () => { total = wrap.offsetHeight - window.innerHeight; apply() }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    apply()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [products.length])

  const isHero = brand.key === 'ht'
  const col1 = products.filter((_, i) => i % 3 === 0)
  const col2 = products.filter((_, i) => i % 3 === 1)
  const col3 = products.filter((_, i) => i % 3 === 2)
  const hasGallery = products.length >= 3

  return (
    <div style={{ background: 'var(--cream)' }}>
      {isHero && hasGallery ? (
        /* Hero — the gallery fills the view and pins/parallaxes (the scroll stays).
           The side columns rise tall to flank the headline; the centre column sits
           low so the wording is never covered. The headline is overlaid on top and
           scrolls away with the page. */
        <div ref={wrapRef} style={{ position: 'relative', height: '380vh' }}>
          {/* Gallery backdrop — sticky + parallaxing */}
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: 1 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
              width: '100%', height: '100%', padding: 'calc(var(--switcher-h) + var(--nav-h) + 28px) 24px 0',
            }}>
              <GalleryCol colRef={col1Ref} items={col1} marginTop="0px" align="left" />
              <GalleryCol colRef={col2Ref} items={col2} marginTop="500px" align="center" />
              <GalleryCol colRef={col3Ref} items={col3} marginTop="0px" align="right" />
            </div>
            {/* Cream blend top + bottom */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, var(--cream), transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, background: 'linear-gradient(to top, var(--cream), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          </div>

          {/* Headline — overlaid at the top, parallaxes away at half page-speed; only the buttons are clickable */}
          <div ref={textRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 5, pointerEvents: 'none', willChange: 'transform' }}>
            {/* Faint cream lift behind the words — subtle, no hard oval. Sized to cover the
                whole stack (label through subtext), not just the headline, so the italic
                line below never sits on a bare photo. Per-text shadows finish the job. */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 40% at 50% 35%, rgba(248,246,241,0.46) 0%, rgba(248,246,241,0.14) 58%, transparent 76%)' }} />
            <div style={{
              position: 'relative', height: '100%',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', textAlign: 'center',
              padding: 'calc(var(--switcher-h) + var(--nav-h) + 52px) var(--section-pad-x) 0',
            }}>
              <div className="label" style={{ marginBottom: 18, color: 'var(--green)', textShadow: '0 0 10px var(--cream)' }}>
                Locally Harvested · South Dakota
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 7vw, 118px)', fontWeight: 800,
                letterSpacing: '-2px', lineHeight: 0.9, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 20,
                textShadow: '0 2px 22px var(--cream), 0 0 12px var(--cream)',
              }}>
                Slow-Dried<br /><span style={{ color: 'var(--green)' }}>Premium Slabs.</span>
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--gray-dark)',
                maxWidth: '430px', margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic',
                textShadow: '0 0 6px var(--cream), 0 0 12px var(--cream), 0 1px 16px var(--cream)',
              }}>
                Twenty-four species and counting. Solar kiln dried on site. Harvested locally across South Dakota, with rare and exotic species sourced from around the world.
              </p>
              <div style={{ marginTop: 28, display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto' }}>
                <Link href="/shop" className="btn-primary">Browse the Slab Catalog</Link>
                <a href="/about" className="btn-ghost">Our Story</a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Section header (gallery page / non-hero use) */}
          <div style={{
            padding: isHero
              ? 'calc(var(--switcher-h) + var(--nav-h) + 72px) var(--section-pad-x) 32px'
              : '96px var(--section-pad-x) 0',
            textAlign: 'center',
          }}>
            <div className="label" style={{ marginBottom: 18, color: 'var(--green)' }}>
              {isHero ? 'Locally Harvested · South Dakota' : 'The Work'}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isHero ? 'clamp(56px, 7vw, 118px)' : 'clamp(42px, 5vw, 72px)',
              fontWeight: 800,
              letterSpacing: '-2px',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              color: 'var(--black)',
              marginBottom: 20,
            }}>
              {isHero ? (
                <>Slow-Dried<br /><span style={{ color: 'var(--green)' }}>Premium Slabs.</span></>
              ) : (
                <>Every slab.<br /><span style={{ color: 'var(--green)' }}>Every story.</span></>
              )}
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: isHero ? '17px' : '16px',
              color: 'var(--gray-dark)',
              maxWidth: 'var(--content-text)',
              margin: '0 auto',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              {isHero
                ? 'Twenty-four species and counting. Solar kiln dried on site. Harvested locally across South Dakota, with rare and exotic species sourced from around the world.'
                : 'Locally harvested and handcrafted in South Dakota. Browse our gallery of slabs, finished pieces, and completed projects.'}
            </p>
            {isHero && (
              <div style={{ marginTop: 28, display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/shop" className="btn-primary">Browse the Slab Catalog</Link>
                <a href="/about" className="btn-ghost">Our Story</a>
              </div>
            )}
          </div>

          {/* Scroll-pinned gallery of live, random inventory */}
          {hasGallery && (
            <div ref={wrapRef} style={{ position: 'relative', height: '350vh' }}>
              <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
                {/* Top fade */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 120,
                  background: 'linear-gradient(to bottom, var(--cream), transparent)',
                  zIndex: 10, pointerEvents: 'none',
                }} />

                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
                    width: '100%', height: '100%', padding: '0 40px',
                  }}
                >
                  <GalleryCol colRef={col1Ref} items={col1} marginTop="-20px" align="left" />
                  <GalleryCol colRef={col2Ref} items={col2} marginTop="-50%" align="center" />
                  <GalleryCol colRef={col3Ref} items={col3} marginTop="-20px" align="right" />
                </div>

                {/* Bottom fade */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
                  background: 'linear-gradient(to top, var(--cream), transparent)',
                  zIndex: 10, pointerEvents: 'none',
                }} />
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .gallery-tile { position: relative; display: block; border-radius: var(--radius); overflow: hidden; flex-shrink: 0; text-decoration: none; box-shadow: var(--shadow-sm); transition: box-shadow 0.25s ease; }
        .gallery-tile:hover { box-shadow: var(--shadow); }
        .gallery-tile:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
        /* Captions fan to their column's edge. align-items moves the pill (which
           ignores text-align); text-align fans the wrapped eyebrow/name lines.
           The scrim is one curved (radial) pool whose anchor (--cap-pos) sits under
           that same corner, so the darkest area always falls beneath the text and the
           rest of the slab stays exposed. These live in CSS, not inline, so the mobile
           rules below can override them. */
        .gallery-cap {
          display: flex; flex-direction: column; justify-content: flex-end;
          background: radial-gradient(130% 90% at var(--cap-pos, 50% 100%),
            rgba(15,15,13,0.95) 0%, rgba(15,15,13,0.68) 28%, rgba(15,15,13,0.28) 54%, rgba(15,15,13,0) 76%);
        }
        .gallery-cap--left   { align-items: flex-start; text-align: left;   --cap-pos: 6% 100%; }
        .gallery-cap--center { align-items: center;     text-align: center; --cap-pos: 50% 100%; }
        .gallery-cap--right  { align-items: flex-end;   text-align: right;  --cap-pos: 94% 100%; }
        .gallery-piece-no { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        /* On phones the gallery is three narrow columns: the fan is imperceptible and
           the pill is too cramped, so collapse everything back to a clean left caption
           (text and the scrim pool both return to the bottom-left). */
        @media (max-width: 640px) {
          .gallery-piece-no { display: none; }
          .gallery-cap--center, .gallery-cap--right { align-items: flex-start; text-align: left; --cap-pos: 6% 100%; }
        }
      `}</style>
    </div>
  )
}

function GalleryCol({ colRef, items, marginTop, align }: {
  colRef: React.RefObject<HTMLDivElement | null>
  items: Product[]
  marginTop: string
  align: Align
}) {
  return (
    <div ref={colRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, willChange: 'transform', marginTop }}>
      {items.map((p) => (
        <GalleryTile key={p.id} product={p} align={align} />
      ))}
    </div>
  )
}

function GalleryTile({ product, align }: { product: Product; align: Align }) {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gallery-tile"
      aria-label={`${product.name}, view on the store`}
    >
      <HoverImage src={product.images[0]} alt={product.name} hint="View Piece →" style={{ aspectRatio: '16/10' }}>
        {/* Caption: section + name + Piece No., fanned to the column's edge (left / centre / right).
            The scrim is a curved pool anchored under that same corner (see the gallery-cap classes). */}
        <div className={`gallery-cap gallery-cap--${align}`} style={{
          position: 'absolute', inset: 0, padding: '14px 16px', pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: 3 }}>
            {tileLabel(product)}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-15)', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase', color: '#fff', lineHeight: 1.1 }}>
            {product.name}
          </div>
          {product.sku && (
            <div className="gallery-piece-no" style={{
              marginTop: 7, padding: '3px 8px 3px 7px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(15,15,13,0.5)', border: '1px solid rgba(200,168,130,0.45)',
            }}>
              <Tag size={11} weight="fill" style={{ color: 'var(--tan)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--tan)', opacity: 0.75 }}>Piece No.</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 800, letterSpacing: '0.5px', color: '#fff' }}>{product.sku}</span>
            </div>
          )}
        </div>
      </HoverImage>
    </a>
  )
}

