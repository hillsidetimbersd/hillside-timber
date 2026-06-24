'use client'

import { useEffect, useRef } from 'react'
import { useBrand } from '@/components/brand/BrandContext'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

/* ─── HT: Cinematic light hero — single statement image, cream typography ─── */

const HT_CONFIG = {
  image: `${SQ}1761697039666-AO6NP43V1TJMFDDBDK9T/880BD484-10A9-499E-98BB-80566B2C2A79.jpeg?format=2500w`,
  eyebrow: 'Locally Harvested · South Dakota',
  ctaPrimary: 'Browse the Slab Catalog',
  ctaPrimaryHref: '/shop',
  ctaSecondary: 'Our Story',
  ctaSecondaryHref: '/about',
}

const HT_VALUE_PROPS = [
  { num: '01', label: 'Solar Kiln Dried', body: 'Custom-built solar kiln on site. Slow, even drying that protects the figure.' },
  { num: '02', label: 'Locally Harvested', body: 'Harvested locally across South Dakota, plus rare and exotic species from around the world.' },
  { num: '03', label: 'One of a Kind', body: 'Live edges, burls, and figured grain. No two slabs in our inventory are the same.' },
]

function HTHero({ brand }: { brand: ReturnType<typeof useBrand> }) {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    const onScroll = () => {
      bg.style.transform = `translateY(${window.scrollY * 0.25}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: 'var(--cream)',
    }}>
      {/* Background image (parallax) */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-15% 0 -15% 0',
          willChange: 'transform',
          backgroundImage: `url(${HT_CONFIG.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
        }}
      />

      {/* Cream wash from top + soft bottom shadow for legibility */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(248,246,241,0.92) 0%, rgba(248,246,241,0.18) 28%, rgba(248,246,241,0) 50%, rgba(15,15,13,0.18) 78%, rgba(15,15,13,0.55) 100%)',
        zIndex: 1,
      }} />

      {/* Top-anchored headline (sits in the cream wash) */}
      <div style={{
        position: 'absolute',
        top: 'calc(var(--switcher-h) + var(--nav-h) + 56px)',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 2,
        padding: '0 32px',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-10)',
          fontWeight: 700,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'var(--green)',
          marginBottom: 18,
        }}>
          {HT_CONFIG.eyebrow}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(56px, 7.5vw, 122px)',
          fontWeight: 800,
          letterSpacing: '-2px',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          marginBottom: 22,
        }}>
          <span style={{ color: 'var(--black)' }}>{brand.heroHeadline[0]}</span>
          <br />
          <span style={{ color: 'var(--green)' }}>{brand.heroHeadline[1]}</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-17)',
          color: 'var(--gray-dark)',
          maxWidth: 'var(--content-text)',
          margin: '0 auto 28px',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          {brand.heroSub}
        </p>
        <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={HT_CONFIG.ctaPrimaryHref} className="btn-primary">{HT_CONFIG.ctaPrimary}</a>
          <a href={HT_CONFIG.ctaSecondaryHref} className="btn-ghost">{HT_CONFIG.ctaSecondary}</a>
        </div>
      </div>

      {/* Value props — bottom strip */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '0 28px 28px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'rgba(15,15,13,0.18)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}>
          {HT_VALUE_PROPS.map((p) => (
            <div key={p.num} style={{
              padding: '20px 22px',
              background: 'rgba(248,246,241,0.86)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-10)',
                fontWeight: 700,
                letterSpacing: '3px',
                color: 'var(--green)',
                marginBottom: 6,
              }}>
                {p.num}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-13)',
                fontWeight: 700,
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: 'var(--black)',
                marginBottom: 6,
              }}>
                {p.label}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-14)',
                color: 'var(--gray-dark)',
                lineHeight: 1.55,
              }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SFW: Dark cinematic parallax hero ─── */

const SFW_CONFIG = {
  image: `${SQ}1759355251530-0O1H7JPOLOXE3B0248R6/CB61FB9D-BDB8-42E8-930E-DBB229165D6E.jpeg?format=2000w`,
  overlay: 'linear-gradient(180deg, rgba(15,10,6,0.72) 0%, rgba(15,10,6,0.35) 18%, rgba(15,10,6,0.15) 32%, rgba(15,10,6,0.45) 65%, rgba(15,10,6,0.97) 100%)',
  eyebrow: 'Handcrafted in Sioux Falls, SD',
  accentColor: '#c8a882',
  ctaPrimary: 'View Our Work',
  ctaPrimaryHref: '/gallery',
  videoWebm: '/assets/videos/sfw-hero.webm' as string | null,
  videoMp4: '/assets/videos/sfw-hero.mp4' as string | null,
  videoPoster: '/assets/videos/sfw-hero-poster.jpg',
}

const SFW_VALUE_PROPS = [
  { num: '01', label: 'Handcrafted', body: 'Every piece built by hand in our Sioux Falls workshop. No assembly lines. No shortcuts.' },
  { num: '02', label: 'One of a Kind', body: 'Natural grain, live edges, and unique character. No two pieces are ever the same.' },
  { num: '03', label: 'Custom Built', body: 'Bring us your dimensions, your vision, your space. We build it from the ground up.' },
]

function SFWHero({ brand }: { brand: ReturnType<typeof useBrand> }) {
  const bgRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const config = SFW_CONFIG

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    const onScroll = () => {
      bg.style.transform = `translateY(${window.scrollY * 0.3}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Honor reduced-motion: hold the poster frame instead of looping the B-roll.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const v = videoRef.current
      if (!v) return
      if (mq.matches) v.pause()
      else void v.play().catch(() => {})
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      {/* Background (parallax wrapper) */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-20% 0 -20% 0',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        {config.videoMp4 ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={config.videoPoster}
            aria-hidden="true"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%', display: 'block' }}
          >
            {config.videoWebm ? <source src={config.videoWebm} type="video/webm" /> : null}
            <source src={config.videoMp4} type="video/mp4" />
          </video>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${config.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        )}
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: config.overlay,
        zIndex: 1,
      }} />

      {/* Content */}
      <div className="hero-content" style={{
        position: 'relative',
        zIndex: 2,
        padding: '0 var(--section-pad-x) 60px',
      }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-10)',
          fontWeight: 700,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: config.accentColor,
          marginBottom: 20,
        }}>
          {config.eyebrow}
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(56px, 8vw, 124px)',
          fontWeight: 800,
          letterSpacing: '-2px',
          lineHeight: 0.92,
          color: '#fff',
          marginBottom: 24,
          textTransform: 'uppercase',
        }}>
          {brand.heroHeadline[0]}<br />{brand.heroHeadline[1]}
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-17)',
          color: 'rgba(255,255,255,0.7)',
          maxWidth: 480,
          lineHeight: 1.7,
          marginBottom: 36,
          fontStyle: 'italic',
        }}>
          {brand.heroSub}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 64 }}>
          <a href={config.ctaPrimaryHref} className="btn-primary">{config.ctaPrimary}</a>
          {brand.hasCustomProject
            ? <a href="/custom" className="btn-ghost-white">Start a Custom Project</a>
            : <a href="/contact" className="btn-ghost-white">Contact Us</a>
          }
        </div>

        {/* Value props */}
        <div className="hero-props-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          {SFW_VALUE_PROPS.map((p) => (
            <div key={p.num} style={{
              padding: '20px 24px',
              background: 'rgba(0,0,0,0.25)',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-10)',
                fontWeight: 700,
                letterSpacing: '3px',
                color: config.accentColor,
                marginBottom: 6,
              }}>
                {p.num}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-13)',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: 6,
              }}>
                {p.label}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-14)',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.6,
              }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Export: brand-switched hero ─── */

export default function ParallaxHero() {
  const brand = useBrand()
  if (brand.key === 'ht') return <HTHero brand={brand} />
  return <SFWHero brand={brand} />
}
