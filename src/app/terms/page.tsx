import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'The terms for using the Hillside Timber and Sioux Falls Woodworking website.',
}

const linkStyle = { color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: 3 }

export default function TermsPage() {
  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 'calc(var(--content-text) + 2 * var(--section-pad-x))', margin: '0 auto', padding: '80px var(--section-pad-x) 44px', borderBottom: '1px solid var(--border)' }}>
        <div className="label" style={{ marginBottom: 14 }}>Legal</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(46px, 6vw, 84px)', fontWeight: 800,
          letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95, marginBottom: 14,
        }}>
          Terms of Use
        </h1>
        <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)' }}>
          Effective June 2026
        </p>
      </div>

      <div style={{ padding: '52px var(--section-pad-x) 120px', maxWidth: 'calc(var(--content-text) + 2 * var(--section-pad-x))', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', lineHeight: 1.75, color: 'var(--black)', marginBottom: 40 }}>
          By using this site you agree to these terms. The site is run by Hillside Timber and Sioux Falls
          Woodworking, the same family business in South Dakota.
        </p>

        <Section title="Our inventory">
          <p>The pieces shown here reflect our live store and can change at any time. Availability, dimensions, and prices are not guaranteed until you complete checkout. Wood is a natural material, so color, grain, and figure vary from piece to piece and from what you see on a screen. Listed dimensions are approximate.</p>
        </Section>

        <Section title="Buying a piece">
          <p>Purchases are completed on our store hosted by Squarespace and are subject to the store terms and our policies there. We describe and photograph each piece as accurately as we can.</p>
        </Section>

        <Section title="Custom work and estimates">
          <p>The calculators, quotes, and price ranges on this site are planning tools, not binding offers. A custom order is confirmed only once we have agreed on the details and price in writing.</p>
        </Section>

        <Section title="Using this site">
          <p>The text, photos, and tools on this site belong to us. Please do not copy or reuse them without permission. The site and its tools are provided as is, and we do our best to keep them accurate and available.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these terms? Email <a href="mailto:hillsidetimbersd@gmail.com" style={linkStyle}>hillsidetimbersd@gmail.com</a> or call <a href="tel:+16053104846" style={linkStyle}>(605) 310-4846</a>.</p>
        </Section>

        <Section title="Changes">
          <p>We may update these terms from time to time. When we do, we will change the date at the top of this page.</p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 38 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'var(--fs-18)', fontWeight: 800,
        letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--black)', marginBottom: 12,
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', lineHeight: 1.75,
        color: 'var(--gray-dark)', display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {children}
      </div>
    </section>
  )
}
