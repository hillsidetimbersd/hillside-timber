'use client'

import { useEffect, useRef } from 'react'
import { useBrand } from '@/components/brand/BrandContext'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

const COL1 = [
  { src: `${SQ}1697488198174-7SVF03EX4UGLZZ3I34GW/P1034392.jpg?format=1000w`, alt: 'Figured Aspen slab' },
  { src: `${SQ}1692104173691-BIEF3Y5F8OFOHBO8DQ0Q/P1034323.jpg?format=1000w`, alt: 'Claro Walnut slab' },
  { src: `${SQ}1708316209057-NHWRYM9BBIJRL0VQ12NS/P1034650.jpg?format=1000w`, alt: 'Claro Walnut — thicker cut' },
  { src: `${SQ}681a7c84-6273-4630-8988-950545f190cc/P1023900.jpg?format=1000w`, alt: 'Claro Walnut — widest board' },
]

const COL2 = [
  { src: `${SQ}1764093395121-0WQ7WW0YAVSHZPO6D52D/9B46D0B9-5BD4-42C9-8428-3BEB7F129B63.jpeg?format=1000w`, alt: 'Buckeye Burl coffee table' },
  { src: `${SQ}1761401660020-VJ5G2D3392H7MRV1C0LZ/A93426BF-DEC6-48AB-91DE-BB03E59DEA5D.jpeg?format=1000w`, alt: 'Spalted Maple slab' },
  { src: `${SQ}1759355251530-0O1H7JPOLOXE3B0248R6/CB61FB9D-BDB8-42E8-930E-DBB229165D6E.jpeg?format=1000w`, alt: 'Sioux Falls Woodworking workshop' },
  { src: `${SQ}1761697039666-AO6NP43V1TJMFDDBDK9T/880BD484-10A9-499E-98BB-80566B2C2A79.jpeg?format=1000w`, alt: 'Buckeye Root Burl' },
  { src: `${SQ}1750808621194-JX4ZOUAW9PR4AG1C9LDN/14D9FB14-4F2A-4D81-A063-50D1C1E6D7C3.jpeg?format=1000w`, alt: 'Bastogne Walnut — over 10 feet' },
]

const COL3 = [
  { src: `${SQ}1759355687085-7AIZ7D8QCALT0C3GA1D6/9FAF763E-9726-4E27-A5F2-B0E353DFE575.jpeg?format=1000w`, alt: 'Redwood Burl slab' },
  { src: `${SQ}1745095419568-LH71E35DTPQKHL61P6BK/9DF98A45-AB03-4795-9684-813C07F20FA3.jpeg?format=1000w`, alt: 'Black Walnut — harvested in Sioux Falls' },
  { src: `${SQ}1742855807836-AJ4CGF9Y2TAVS8UJNKRW/28D8A477-B232-454F-A79D-27E031680231.jpeg?format=1000w`, alt: 'Silver Maple mantel' },
  { src: `${SQ}44d1cdae-31c0-4553-a9cf-ebce83dc1871/P1034776.jpg?format=1000w`, alt: 'Workshop detail' },
  { src: `${SQ}1701369870793-FY5EXBGCQFL1FDGB96TN/P1034450.jpg?format=1000w`, alt: 'Claro Walnut live edge' },
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

export default function GalleryScroll() {
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
  }, [])

  const isHero = brand.key === 'ht'

  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Section header — when on HT, this IS the homepage hero */}
      <div style={{
        padding: isHero
          ? 'calc(var(--switcher-h) + var(--nav-h) + 72px) 60px 32px'
          : '80px 60px 0',
        textAlign: 'center',
      }}>
        <div className="label" style={{ marginBottom: 18, color: 'var(--green)' }}>
          {isHero ? 'Black Hills Region · South Dakota' : 'The Work'}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isHero ? 'clamp(54px, 7vw, 104px)' : 'clamp(40px, 5vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-2px',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          color: 'var(--black)',
          marginBottom: 20,
        }}>
          {isHero ? (
            <>From the<br /><span style={{ color: 'var(--green)' }}>Black Hills.</span></>
          ) : (
            <>Every slab.<br /><span style={{ color: 'var(--green)' }}>Every story.</span></>
          )}
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: isHero ? '15px' : '14px',
          color: 'var(--gray-dark)',
          maxWidth: 480,
          margin: '0 auto',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          {isHero
            ? 'Twenty-four species and counting. Solar kiln dried on site. Locally harvested from the Black Hills and the surrounding region.'
            : 'Locally harvested and handcrafted in South Dakota. Browse our gallery of slabs, finished pieces, and completed projects.'}
        </p>
        {isHero && (
          <div style={{ marginTop: 28, display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/shop" className="btn-primary">Browse the Slab Catalog</a>
            <a href="/about" className="btn-ghost">Our Story</a>
          </div>
        )}
      </div>

      {/* Scroll container */}
      <div ref={wrapRef} style={{ position: 'relative', height: '350vh', perspective: '1000px', perspectiveOrigin: 'center top' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            perspective: '1000px',
            perspectiveOrigin: 'center top',
          }}
        >
          {/* Top fade */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 120,
            background: 'linear-gradient(to bottom, var(--cream), transparent)',
            zIndex: 10, pointerEvents: 'none',
          }} />

          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
              width: '100%',
              height: '100%',
              padding: '0 40px',
              willChange: 'transform',
            }}
          >
            <GalleryCol colRef={col1Ref} images={COL1} marginTop="-20px" />
            <GalleryCol colRef={col2Ref} images={COL2} marginTop="-50%" />
            <GalleryCol colRef={col3Ref} images={COL3} marginTop="-20px" />
          </div>

          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
            background: 'linear-gradient(to top, var(--cream), transparent)',
            zIndex: 10, pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* CTA below */}
      <div style={{
        padding: '80px 60px',
        background: 'var(--cream)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'center',
        borderTop: '1px solid var(--border)',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            textTransform: 'uppercase',
            color: 'var(--black)',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            From tree to<br />finished piece.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--gray)',
            lineHeight: 1.8,
            maxWidth: 380,
            fontStyle: 'italic',
          }}>
            Every item in our inventory is one of a kind. Browse the full catalog or start a conversation about your custom project.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CtaCard title="Shop Wood Slabs" sub="Live edge, rounds, mantels — 24+ species" href="/shop" />
          <CtaCard title="Blanks, Burls & Billets" sub="Turning stock, burl caps, figured wood" href="/shop?type=burl" />
          <CtaCard title="Request a Custom Project" sub="Sioux Falls Woodworking — handcrafted to order" href="/custom" accent />
        </div>
      </div>
    </div>
  )
}

function GalleryCol({
  colRef,
  images,
  marginTop,
}: {
  colRef: React.RefObject<HTMLDivElement | null>
  images: { src: string; alt: string }[]
  marginTop: string
}) {
  return (
    <div
      ref={colRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        willChange: 'transform',
        marginTop,
      }}
    >
      {images.map((img) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading="lazy"
          style={{
            width: '100%',
            aspectRatio: '16/10',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 3,
            flexShrink: 0,
            background: '#e0dbd0',
            boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
            transition: 'box-shadow 0.3s',
          }}
        />
      ))}
    </div>
  )
}

function CtaCard({ title, sub, href, accent }: { title: string; sub: string; href: string; accent?: boolean }) {
  return (
    <a
      href={href}
      style={{
        background: '#fff',
        border: `1px solid ${accent ? 'var(--green)' : 'var(--border)'}`,
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--green)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(42,92,63,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = accent ? 'var(--green)' : 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          color: 'var(--black)',
          marginBottom: 3,
          textTransform: 'uppercase',
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--gray)',
          fontStyle: 'italic',
        }}>
          {sub}
        </div>
      </div>
      <span style={{
        fontSize: '18px',
        color: 'var(--green)',
        fontWeight: 700,
      }}>
        →
      </span>
    </a>
  )
}
