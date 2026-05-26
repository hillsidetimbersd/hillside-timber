'use client'

import { CheckCircle } from '@phosphor-icons/react'

interface Props {
  onClose: () => void
}

export default function SuccessScreen({ onClose }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 16, padding: '40px 32px',
      textAlign: 'center',
    }}>
      <CheckCircle size={64} color="var(--green)" weight="light" />
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px', fontWeight: 800,
        textTransform: 'uppercase', color: 'var(--black)',
        letterSpacing: '-0.5px', lineHeight: 1.1,
      }}>
        We&apos;ve got<br />your project.
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px', color: 'var(--gray)',
        maxWidth: 300, fontStyle: 'italic', lineHeight: 1.7,
      }}>
        Slavic reviews every request personally and will be in touch within 1 to 2 business days. We love what we do. Let&apos;s build something great together.
      </p>
      <button onClick={onClose} className="btn-ghost" style={{ marginTop: 8 }}>
        Close
      </button>
    </div>
  )
}
