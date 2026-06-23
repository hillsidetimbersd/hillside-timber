'use client'

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
  return (
    <section style={{
      background: 'var(--black)',
      color: '#fff',
      padding: '132px var(--section-pad-x)',
    }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="label" style={{ marginBottom: 16, color: 'var(--tan)' }}>
            How We Work
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
            From conversation <span style={{ color: 'var(--tan)' }}>to install.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '17px',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            Most projects move from first call to delivery in six to twelve weeks. You see the slab before we cut it and sign off on the finish before it ships.
          </p>
        </div>

        <div className="process-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          position: 'relative',
        }}>
          {/* horizontal connector line */}
          <div className="process-connector" style={{
            position: 'absolute',
            top: 27,
            left: '12.5%',
            right: '12.5%',
            height: 1,
            background: 'linear-gradient(to right, transparent, var(--tan), transparent)',
            opacity: 0.4,
          }} />

          {STEPS.map((s) => (
            <div key={s.n} style={{
              padding: '0 24px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              <div style={{
                width: 54,
                height: 54,
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'var(--black)',
                border: '1px solid var(--tan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                color: 'var(--tan)',
              }}>
                {s.n}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.2px',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}>
                {s.title}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.7,
                maxWidth: 240,
                margin: '0 auto',
              }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
