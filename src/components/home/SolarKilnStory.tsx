'use client'

import { useEffect, useRef } from 'react'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'

const STEPS = [
  {
    n: '01',
    title: 'Sourced',
    spec: 'South Dakota & beyond',
    body: 'Standing dead, storm-fallen, or felled by hand across South Dakota, plus rare and exotic species brought in from around the country and the world. Every log is numbered, photographed, and traced from the day it lands in the yard.',
    img: `${SQ}1701369870793-FY5EXBGCQFL1FDGB96TN/P1034450.jpg?format=1000w`,
  },
  {
    n: '02',
    title: 'Sawn',
    spec: 'Wood-Mizer · flitch-numbered',
    body: 'Cut on our own Wood-Mizer right in the yard. Live edges left intact, and every slab is flitch-numbered so book-matched pairs stay together for the life of the build.',
    img: `${SQ}697f79d8-101f-4df9-983d-9454b9b3082b/P1034571.jpg?format=1000w`,
  },
  {
    n: '03',
    title: 'Solar Kiln Dried',
    spec: '6 to 8% moisture',
    body: 'A custom solar kiln on site dries each slab slowly and evenly, pulling moisture down to 6 to 8% without baking out the figure or the color the way a fast commercial kiln will.',
    img: '/instagram/01.jpg',
  },
  {
    n: '04',
    title: 'Listed',
    spec: 'Measured & listed one by one',
    body: 'Each slab is measured, photographed in natural light, and listed on its own. What you see online is the exact slab that comes home with you. No swaps, no surprises.',
    img: `${SQ}1692104173691-BIEF3Y5F8OFOHBO8DQ0Q/P1034323.jpg?format=1000w`,
  },
]

export default function SolarKilnStory() {
  const flowRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flow = flowRef.current
    const rail = railRef.current
    if (!flow || !rail) return
    // Respect reduced motion: leave the section in its drawn default, no JS.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Without IntersectionObserver, leave the section fully drawn (the CSS
    // default) rather than arm a start-state we could never reveal.
    if (typeof IntersectionObserver === 'undefined') return

    // One-shot reveal: fade the stages up the first time the section enters.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          flow.classList.add('flow-in')
          io.disconnect()
        }
      },
      { threshold: 0.18 },
    )
    // Arm only after the observer exists, so a setup failure can never strand
    // the stages on their hidden start-state. `.flow-armed` hands the hidden
    // stages + dark stations to the choreography (no React re-render).
    flow.classList.add('flow-armed')
    io.observe(flow)

    // Scroll-linked seam. The fill bottom tracks an activation line ~60% down
    // the viewport, clamped to the rail; each station lights once that line
    // passes its centre. Batch every layout read (rail + node centres) before
    // any write, so a frame forces at most one reflow. Written straight to the DOM.
    const nodes = Array.from(flow.querySelectorAll<HTMLElement>('.flow-node'))
    let raf = 0
    const draw = () => {
      raf = 0
      const actY = window.innerHeight * 0.6
      const railRect = rail.getBoundingClientRect()
      const nodeCenters = nodes.map((n) => {
        const nr = n.getBoundingClientRect()
        return nr.top + nr.height / 2
      })
      const p = Math.min(1, Math.max(0, (actY - railRect.top) / Math.max(1, railRect.height)))
      flow.style.setProperty('--flow-p', p.toFixed(4))
      nodes.forEach((n, i) => n.classList.toggle('is-lit', nodeCenters[i] <= actY))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="solar-kiln"
      style={{
        background:
          'linear-gradient(180deg, var(--tone-kiln) 0%, var(--tone-kiln) 80%, var(--tone-ecopoxy) 100%)',
        color: '#fff',
        padding: '132px var(--section-pad-x)',
        // Offset the fixed header when reached via the /#solar-kiln nav link.
        scrollMarginTop: 'calc(var(--switcher-h) + var(--nav-h))',
      }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>
            Log to Listing
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(38px, 4.5vw, 72px)',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              marginBottom: 18,
            }}
          >
            Four steps. <span style={{ color: 'var(--tan)' }}>One slab at a time.</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-17)',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 700,
              margin: '0 auto',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            We control the chain from the standing tree to the slab on your truck. No middlemen, no mystery moisture, no guessing what arrives.
          </p>
        </div>

        <div ref={flowRef} className="flow flow--media">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="flow-stage"
              // Per-stage reveal stagger, consumed by transition-delay in CSS.
              style={{ '--rd': `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="flow-node">{s.n}</div>
              <div className="flow-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="flow-img"
                  src={s.img}
                  alt={`${s.title}: ${s.spec}`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="flow-scrim" />
              </div>
              <div className="flow-text">
                <div className="flow-spec">{s.spec}</div>
                <div className="flow-title">{s.title}</div>
                <p className="flow-body">{s.body}</p>
              </div>
            </div>
          ))}

          {/* Rail last so the seam paints over the gutter and the stages keep a
              clean nth-child alternation (the rail is absolutely positioned). */}
          <div className="flow-rail" ref={railRef}>
            <span className="flow-rail-fill" />
          </div>
        </div>
      </div>
    </section>
  )
}
