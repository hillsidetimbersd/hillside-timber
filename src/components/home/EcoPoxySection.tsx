export default function EcoPoxySection() {
  return (
    <section className="grain" style={{ background: 'var(--black)', color: '#fff', padding: '120px var(--section-pad-x)', position: 'relative', overflow: 'hidden' }}>
      <div className="ecopoxy-grid" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 72, alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div>
          <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>
            Now Available · At the Yard
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 66px)', fontWeight: 800,
            letterSpacing: '-1.5px', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 22,
          }}>
            EcoPoxy <span style={{ color: 'var(--tan)' }}>Epoxy Systems</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, maxWidth: 520, marginBottom: 18 }}>
            We have partnered with EcoPoxy, a leader in bio-based epoxy resins made with natural,
            plant-based ingredients. Built for live edge river tables, art, and woodworking, they cure
            crystal clear and hold up beautifully, with a fraction of the environmental footprint.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, maxWidth: 520, marginBottom: 30 }}>
            Pick up UVPOXY and FlowCast in store, and pair it with the right slab for your next pour.
            Stop by the yard by appointment to see the full selection.
          </p>
          <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/shop" className="btn-primary">Find Your Slab</a>
            <a href="/contact" className="btn-ghost-white">Ask Us About a Pour</a>
          </div>
        </div>

        {/* Resin-pour panel: an editorial stand-in for the product, built in CSS. */}
        <div style={{
          position: 'relative', aspectRatio: '4 / 3', borderRadius: 4, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          background:
            'radial-gradient(130% 100% at 28% 18%, rgba(58,122,85,0.55), transparent 58%),' +
            'radial-gradient(110% 90% at 78% 72%, rgba(200,168,130,0.42), transparent 55%),' +
            'radial-gradient(80% 70% at 60% 45%, rgba(42,92,63,0.35), transparent 60%),' +
            'linear-gradient(135deg, #1b1b18 0%, #0f0f0d 100%)',
        }}>
          {/* Glossy resin highlight */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%)',
          }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
              EcoPoxy
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: 'var(--tan)', marginTop: 8 }}>
              Bio-Based Epoxy Resin
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ecopoxy-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
