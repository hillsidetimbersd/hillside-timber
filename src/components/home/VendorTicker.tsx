'use client'

const PARTNERS = [
  'EcoPoxy',
  'Rubio Monocoat',
  'Wood-Mizer',
  'General Finishes',
  'Festool',
  'Osmo',
  'TotalBoat',
  'TimberKing',
]

export default function VendorTicker() {
  const doubled = [...PARTNERS, ...PARTNERS, ...PARTNERS]

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '32px 0',
      overflow: 'hidden',
      background: '#fff',
    }}>
      <div style={{ marginBottom: 22, textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-10)',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--gray)',
        }}>
          Trusted Partners &amp; Suppliers
        </span>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 80,
          width: 'max-content',
          animation: 'ticker 50s linear infinite',
        }}>
          {doubled.map((name, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-18)',
              fontWeight: 700,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'var(--black)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              opacity: 0.75,
            }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
