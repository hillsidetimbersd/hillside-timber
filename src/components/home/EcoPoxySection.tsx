/** EcoPoxy retail partner feature. Two real photos: the finished epoxy piece
 *  (/assets/photos/ecopoxy-result.webp) with the EcoPoxy FlowCast kit framed as an
 *  inset (/assets/photos/ecopoxy-product.webp). A CSS gradient fallback keeps each
 *  panel looking intentional if a photo is ever missing (no broken image). */
export default function EcoPoxySection() {
  return (
    <section style={{
      // The green bridge peak of the dark-run descent: the brand green has
      // emerged here (fitting, EcoPoxy is the bio-resin partner). Holds the
      // green, then settles flat onto the Reviews tone so the seams above and
      // below have no hard line. No grain here, so the texture stays continuous
      // across the green sections.
      background: 'linear-gradient(180deg, var(--tone-ecopoxy) 0%, var(--tone-ecopoxy) 74%, var(--tone-reviews) 94%, var(--tone-reviews) 100%)',
      color: '#fff', padding: '120px var(--section-pad-x)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient green wash for depth, kept clear of the top/bottom edges so it
          never brightens a seam. */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '20%', right: '-4%', width: '52%', height: '60%',
        background: 'radial-gradient(closest-side, rgba(58,122,85,0.18), transparent 70%)',
        filter: 'blur(24px)', zIndex: 1, pointerEvents: 'none',
      }} />

      <div className="ecopoxy-grid" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 72, alignItems: 'center', position: 'relative', zIndex: 2 }}>
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
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'rgba(255,255,255,0.74)', lineHeight: 1.8, maxWidth: 520, marginBottom: 18 }}>
            We have partnered with EcoPoxy, a leader in bio-based epoxy resins made with natural,
            plant-based ingredients. Built for live edge river tables, art, and woodworking, they cure
            crystal clear and hold up beautifully, with a fraction of the environmental footprint.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'rgba(255,255,255,0.74)', lineHeight: 1.8, maxWidth: 520, marginBottom: 30 }}>
            Pick up UVPOXY and FlowCast in store, and pair it with the right slab for your next pour.
            Stop by the yard by appointment to see the full selection.
          </p>
          <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/shop" className="btn-primary">Find Your Slab</a>
            <a href="/contact" className="btn-ghost-white">Ask Us About a Pour</a>
          </div>
        </div>

        {/* The finished epoxy piece, with the EcoPoxy product kit framed as an inset */}
        <div style={{ position: 'relative' }}>
          {/* glow behind the frame */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: '-10% -7%', borderRadius: 28,
            background: 'radial-gradient(58% 58% at 38% 28%, rgba(58,122,85,0.5), transparent 72%)',
            filter: 'blur(34px)', zIndex: 0,
          }} />

          {/* main: finished epoxy piece */}
          <div
            role="img"
            aria-label="A woodworker pouring EcoPoxy FlowCast resin in the workshop"
            style={{
              position: 'relative', zIndex: 1, aspectRatio: '4 / 3', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 34px 80px rgba(0,0,0,0.55)',
              // Real photo on top, premium gradient underneath as a graceful fallback.
              background:
                "url('/assets/photos/ecopoxy-result.webp') center/cover no-repeat," +
                'linear-gradient(135deg, #243a2c 0%, #12100d 100%)',
            }}
          >
            {/* in-stock tag */}
            <div style={{
              position: 'absolute', top: 14, left: 14, display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '7px 12px', borderRadius: 999, background: 'rgba(12,12,10,0.5)',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-light)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#fff' }}>
                In stock · At the yard
              </span>
            </div>
          </div>

          {/* inset: the EcoPoxy FlowCast product kit, framed like a photo */}
          <div
            role="img"
            aria-label="EcoPoxy FlowCast kit, stocked at Hillside Timber"
            style={{
              position: 'absolute', right: 14, bottom: 14, width: '43%', zIndex: 2,
              aspectRatio: '4 / 3', borderRadius: 'var(--radius)', overflow: 'hidden',
              border: '4px solid var(--cream)',
              boxShadow: '0 22px 48px rgba(0,0,0,0.62)',
              background:
                "url('/assets/photos/ecopoxy-product.webp') center/cover no-repeat," +
                'linear-gradient(135deg, #2a2a26 0%, #12100d 100%)',
            }}
          />
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
