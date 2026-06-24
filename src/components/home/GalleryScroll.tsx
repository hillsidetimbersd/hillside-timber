'use client'

import { useEffect, useRef } from 'react'
import { useBrand } from '@/components/brand/BrandContext'
import MagnifyImage from '@/components/media/MagnifyImage'
import type { Product } from '@/lib/squarespace'

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

function tileLabel(product: Product): string {
  return product.sections.find((s) => s !== 'Still Drying') ?? 'Wood Slab'
}

export default function GalleryScroll({ products = [] }: { products?: Product[] }) {
  const brand = useBrand()
  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const col3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const grid = gridRef.current
    const col1 = col1Ref.current
    const col2 = col2Ref.current
    const col3 = col3Ref.current
    if (!wrap || !grid || !col1 || !col2 || !col3) return

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const wrapH = wrap.offsetHeight
      const winH = window.innerHeight
      const scrolled = -rect.top
      const total = wrapH - winH
      const progress = clamp(scrolled / total, 0, 1)

      const tiltProgress = clamp(progress / 0.4, 0, 1)
      const rotateX = lerp(28, 0, tiltProgress)

      grid.style.transform = `rotateX(${rotateX}deg) scale(${lerp(1.04, 1, tiltProgress)})`
      grid.style.transformOrigin = '50% 0%'

      const colProgress = clamp((progress - 0.3) / 0.7, 0, 1)
      col1.style.transform = `translateY(${lerp(-6, 4, colProgress)}%)`
      col2.style.transform = `translateY(${lerp(20, 4, colProgress)}%)`
      col3.style.transform = `translateY(${lerp(-6, 4, colProgress)}%)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [products.length])

  const isHero = brand.key === 'ht'
  const col1 = products.filter((_, i) => i % 3 === 0)
  const col2 = products.filter((_, i) => i % 3 === 1)
  const col3 = products.filter((_, i) => i % 3 === 2)
  const hasGallery = products.length >= 3

  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Section header — when on HT, this IS the homepage hero */}
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
            <a href="/shop" className="btn-primary">Browse the Slab Catalog</a>
            <a href="/about" className="btn-ghost">Our Story</a>
          </div>
        )}
      </div>

      {/* Scroll-pinned gallery of live, random inventory */}
      {hasGallery && (
        <div ref={wrapRef} style={{ position: 'relative', height: '350vh', perspective: '1000px', perspectiveOrigin: 'center top' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', perspective: '1000px', perspectiveOrigin: 'center top' }}>
            {/* Top fade */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 120,
              background: 'linear-gradient(to bottom, var(--cream), transparent)',
              zIndex: 10, pointerEvents: 'none',
            }} />

            <div
              ref={gridRef}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
                width: '100%', height: '100%', padding: '0 40px', willChange: 'transform',
              }}
            >
              <GalleryCol colRef={col1Ref} items={col1} marginTop="-20px" />
              <GalleryCol colRef={col2Ref} items={col2} marginTop="-50%" />
              <GalleryCol colRef={col3Ref} items={col3} marginTop="-20px" />
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

      {/* CTA below */}
      <div style={{
        padding: '96px var(--section-pad-x)', background: 'var(--cream)', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        borderTop: '1px solid var(--border)', maxWidth: 'var(--content-max)', margin: '0 auto',
      }} className="gallery-cta-grid">
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800,
            letterSpacing: '-0.5px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 1.1, marginBottom: 12,
          }}>
            From tree to<br />finished piece.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray)', lineHeight: 1.8, maxWidth: 480, fontStyle: 'italic',
          }}>
            Every photo above is a real piece in our inventory, pulled fresh each visit. Browse the full catalog or start a conversation about your custom project.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CtaCard title="Shop Wood Slabs" sub="Live edge, rounds, mantels. 24+ species." href="/shop" />
          <CtaCard title="Blanks, Burls & Billets" sub="Turning stock, burl caps, figured wood." href="/shop" />
          <CtaCard title="Request a Custom Project" sub="Sioux Falls Woodworking, handcrafted to order." href="/custom" accent />
        </div>
      </div>

      <style>{`
        .gallery-tile { position: relative; display: block; border-radius: var(--radius); overflow: hidden; flex-shrink: 0; text-decoration: none; box-shadow: var(--shadow-sm); transition: box-shadow 0.25s ease; }
        .gallery-tile:hover { box-shadow: var(--shadow); }
        .gallery-tile:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
      `}</style>
    </div>
  )
}

function GalleryCol({ colRef, items, marginTop }: {
  colRef: React.RefObject<HTMLDivElement | null>
  items: Product[]
  marginTop: string
}) {
  return (
    <div ref={colRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, willChange: 'transform', marginTop }}>
      {items.map((p) => (
        <GalleryTile key={p.id} product={p} />
      ))}
    </div>
  )
}

function GalleryTile({ product }: { product: Product }) {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="gallery-tile"
      aria-label={`${product.name}, view on the store`}
    >
      <MagnifyImage src={product.images[0]} alt={product.name} lensSize={150} zoom={2.2} hint="View Piece →" style={{ aspectRatio: '16/10' }}>
        {/* Caption: species + name */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '14px 16px', pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(15,15,13,0.85) 0%, rgba(15,15,13,0.12) 44%, rgba(15,15,13,0) 66%)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: 3 }}>
            {tileLabel(product)}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-15)', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase', color: '#fff', lineHeight: 1.1 }}>
            {product.name}
          </div>
        </div>
      </MagnifyImage>
    </a>
  )
}

function CtaCard({ title, sub, href, accent }: { title: string; sub: string; href: string; accent?: boolean }) {
  return (
    <a
      href={href}
      style={{
        background: '#fff', border: `1px solid ${accent ? 'var(--green)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '20px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
        textDecoration: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(42,92,63,0.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = accent ? 'var(--green)' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--black)', marginBottom: 3, textTransform: 'uppercase' }}>
          {title}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-11)', color: 'var(--gray)', fontStyle: 'italic' }}>
          {sub}
        </div>
      </div>
      <span style={{ fontSize: 'var(--fs-18)', color: 'var(--green)', fontWeight: 700 }}>→</span>
    </a>
  )
}
