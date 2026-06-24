'use client'

import { useEffect, useRef } from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Conversation',
    body: 'Tell us what you want to build, where it lives, and how it gets used. Sketches, Pinterest boards, or napkin notes are welcome.',
  },
  {
    n: '02',
    title: 'Slab Selection',
    body: 'You pick the material from our inventory. Burl, walnut, claro, ash. We pull the slab and reserve it for your build.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'Hand joinery, mortise and tenon, dovetails, breadboard ends. Built in our Sioux Falls shop. No outsourcing, no veneer.',
  },
  {
    n: '04',
    title: 'Finish & Deliver',
    body: 'Hand-rubbed oil or hardwax finish. Delivered locally or freighted nationwide. White-glove install on request.',
  },
]

export default function ProcessStrip() {
  const flowRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const flow = flowRef.current
    const rail = railRef.current
    if (!flow || !rail) return
    // Respect reduced motion: leave the timeline in its drawn default, no JS.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Without IntersectionObserver, leave the timeline fully drawn (the CSS
    // default) rather than arm a start-state we could never reveal.
    if (typeof IntersectionObserver === 'undefined') return

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
    // the steps on their hidden start-state (no React re-render).
    flow.classList.add('flow-armed')
    io.observe(flow)

    // Scroll-linked seam: the fill bottom tracks an activation line ~60% down
    // the viewport, clamped to the rail; each station lights as that line passes
    // its centre. Batch every layout read (rail + node centres) before any
    // write, so a frame forces at most one reflow. Written straight to the DOM.
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
      style={{
        background: 'var(--black)',
        color: '#fff',
        padding: '132px var(--section-pad-x)',
      }}
    >
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>
            How We Work
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
            From conversation <span style={{ color: 'var(--tan)' }}>to install.</span>
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
            Most projects move from first call to delivery in six to twelve weeks. You see the slab before we cut it and sign off on the finish before it ships.
          </p>
        </div>

        <div ref={flowRef} className="flow flow--steps">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="flow-stage"
              style={{ '--rd': `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="flow-node">{s.n}</div>
              <div className="flow-text">
                <div className="flow-title">{s.title}</div>
                <p className="flow-body">{s.body}</p>
              </div>
            </div>
          ))}

          {/* Rail last so the seam paints over the gutter (absolutely positioned). */}
          <div className="flow-rail" ref={railRef}>
            <span className="flow-rail-fill" />
          </div>
        </div>
      </div>
    </section>
  )
}
