'use client'

const SQ = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872/'
const BG = `${SQ}1764093395121-0WQ7WW0YAVSHZPO6D52D/9B46D0B9-5BD4-42C9-8428-3BEB7F129B63.jpeg?format=2000w`

export default function CustomCtaStrip() {
  return (
    <section style={{
      position: 'relative',
      minHeight: 520,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--black)',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 60%',
        filter: 'grayscale(0.2) brightness(0.55)',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(15,15,13,0.4) 0%, rgba(15,15,13,0.85) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '96px var(--section-pad-x)',
        maxWidth: 960,
      }}>
        <div className="label" style={{ marginBottom: 18, color: 'var(--tan)' }}>
          Custom Project Inquiries
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(42px, 5.5vw, 90px)',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          color: '#fff',
          marginBottom: 22,
        }}>
          Have something <br />
          <span style={{ color: 'var(--tan)' }}>in mind?</span>
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-17)',
          color: 'rgba(255,255,255,0.7)',
          maxWidth: 480,
          margin: '0 auto 32px',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          A dining table that anchors the room. A mantel that finally fits the space. A bench, a desk, a coffee table built once and built right. Tell us what you are imagining.
        </p>
        <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/custom" className="btn-primary" style={{ background: 'var(--tan)', color: 'var(--black)' }}>
            Start a Custom Project
          </a>
          <a href="/contact" className="btn-ghost-white">Or just say hello</a>
        </div>
      </div>
    </section>
  )
}
