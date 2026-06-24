const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`

export default function FreightStrip() {
  return (
    <section
      style={{
        background: 'var(--green)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN_BG,
          pointerEvents: 'none',
        }}
      />

      <div className="freight-strip-inner">
        <div style={{ flex: '0 1 auto', minWidth: 220 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-10)',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 6,
            }}
          >
            We Ship Nationwide
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 2.2vw, 26px)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            From our yard to your door.
          </div>
        </div>

        <div
          className="freight-strip-divider"
          aria-hidden="true"
          style={{ width: 1, background: 'rgba(255,255,255,0.22)', alignSelf: 'stretch' }}
        />

        <p
          style={{
            flex: 1,
            margin: 0,
            maxWidth: 560,
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-15)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.78)',
          }}
        >
          Small pieces ship via standard carrier. Large, heavy slabs ship via LTL freight.
          International orders are quoted with customs included.
        </p>
      </div>

      <style>{`
        .freight-strip-inner {
          padding: 30px var(--section-pad-x);
          display: flex;
          align-items: center;
          gap: 40px;
          max-width: var(--content-wide);
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) {
          .freight-strip-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            padding: 28px 24px !important;
          }
          .freight-strip-divider { display: none !important; }
        }
      `}</style>
    </section>
  )
}
