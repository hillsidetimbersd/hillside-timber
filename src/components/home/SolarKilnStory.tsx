'use client'

import { useEffect, useRef, useState } from 'react'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

const STEPS = [
  {
    n: '01',
    title: 'Sourced',
    spec: 'South Dakota & beyond',
    body: 'Standing dead, fallen, or harvested by hand across South Dakota. We also bring in rare and exotic species from around the country and the world. Every log is logged, photographed, and traced.',
    img: `${SQ}1701369870793-FY5EXBGCQFL1FDGB96TN/P1034450.jpg?format=1000w`,
  },
  {
    n: '02',
    title: 'Sawn',
    spec: 'Wood-Mizer, flitch numbered',
    body: 'Cut on a Wood-Mizer mill in our yard. Live edges preserved. Slabs are flitch-numbered so book matches stay together.',
    img: `${SQ}697f79d8-101f-4df9-983d-9454b9b3082b/P1034571.jpg?format=1000w`,
  },
  {
    n: '03',
    title: 'Solar Kiln Dried',
    spec: 'Dried to 6 to 8 percent',
    body: 'Custom-built solar kiln on site. Slow, even drying that pulls moisture down to 6 to 8% without baking out the figure or the color.',
    img: '/instagram/01.jpg',
  },
  {
    n: '04',
    title: 'Listed',
    spec: 'Measured, listed individually',
    body: 'Each slab is measured, photographed in natural light, and listed individually. What you see online is the slab you take home.',
    img: `${SQ}1692104173691-BIEF3Y5F8OFOHBO8DQ0Q/P1034323.jpg?format=1000w`,
  },
]

export default function SolarKilnStory() {
  const gridRef = useRef<HTMLDivElement>(null)
  // `armed` = JS is running, so the pre-reveal hidden state may apply.
  // `inView` = the section has scrolled into view, so it may draw.
  // Both gate the animation; without JS or with reduced motion the section
  // renders fully drawn (the visible end-state is the CSS default).
  const [armed, setArmed] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    setArmed(true)
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback when IntersectionObserver is unavailable: reveal immediately.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="solar-kiln" style={{
      background: 'var(--black)',
      color: '#fff',
      padding: '132px var(--section-pad-x)',
      // Offset the fixed header when reached via the /#solar-kiln nav link.
      scrollMarginTop: 'calc(var(--switcher-h) + var(--nav-h))',
    }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>
            Log to Listing
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 4.5vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            Four steps. <span style={{ color: 'var(--tan)' }}>One slab at a time.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-17)',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            We control the chain from the standing tree to the slab on your truck. No middlemen, no mystery moisture, no guessing what arrives.
          </p>
        </div>

        <div
          ref={gridRef}
          className={`kiln-grid${armed ? ' kiln-armed' : ''}${inView ? ' in-view' : ''}`}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="kiln-card"
              // Per-step stagger: each station lights as the rail reaches it.
              // Custom property consumed by transition-delay in globals.css.
              style={{ '--kiln-d': `${120 + i * 240}ms` } as React.CSSProperties}
            >
              <div className="kiln-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="kiln-img"
                  src={s.img}
                  alt={`${s.title}: ${s.spec}`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="kiln-scrim" />
              </div>
              <div className="kiln-seam">
                <span className="kiln-fill" />
                <span className="kiln-tab">{s.n}</span>
              </div>
              <div className="kiln-caption">
                <div className="kiln-title">{s.title}</div>
                <div className="kiln-spec">{s.spec}</div>
                <p className="kiln-body">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
