import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Hillside Timber and Sioux Falls Woodworking handle the information you share through this site.',
}

const linkStyle = { color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: 3 }

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 'calc(var(--content-text) + 2 * var(--section-pad-x))', margin: '0 auto', padding: '80px var(--section-pad-x) 44px', borderBottom: '1px solid var(--border)' }}>
        <div className="label" style={{ marginBottom: 14 }}>Legal</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(46px, 6vw, 84px)', fontWeight: 800,
          letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95, marginBottom: 14,
        }}>
          Privacy Policy
        </h1>
        <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)' }}>
          Effective June 2026
        </p>
      </div>

      <div style={{ padding: '52px var(--section-pad-x) 120px', maxWidth: 'calc(var(--content-text) + 2 * var(--section-pad-x))', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', lineHeight: 1.75, color: 'var(--black)', marginBottom: 40 }}>
          This policy explains what we collect when you use this site and how we use it. It covers Hillside Timber
          and Sioux Falls Woodworking, run by the same family business in South Dakota.
        </p>

        <Section title="What we collect">
          <p>We only collect what you choose to send us:</p>
          <ul style={ulStyle}>
            <li><strong>Form details.</strong> When you use the contact form or start a custom project, we collect your name, email, phone number, ZIP code, the project details you describe, and any reference photos you attach.</li>
            <li><strong>A site preference.</strong> A small cookie remembers whether you are viewing the Hillside Timber or the Sioux Falls Woodworking side of the site. It holds no personal information.</li>
          </ul>
          <p>We do not run advertising or third party tracking on this site.</p>
        </Section>

        <Section title="How we use it">
          <p>We use your information for one thing: to respond to you. That means replying to your question, preparing a quote, and following up about your project. We never sell or rent your information to anyone.</p>
        </Section>

        <Section title="Where it is stored">
          <p>Form submissions and any photos you attach are stored securely with the service providers that run this site, and they are accessible only to us. We also send ourselves an email notification so we can get back to you. We keep this information only as long as we need it to help with your project.</p>
        </Section>

        <Section title="Buying a piece">
          <p>Checkout happens on our store hosted by Squarespace, which has its own privacy policy and processes payment. We never see your full card details. Anything you enter at checkout is handled by Squarespace under their terms.</p>
        </Section>

        <Section title="Your choices">
          <p>You can ask us what information we have about you, correct it, or have it deleted. Just email us and we will take care of it.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about this policy? Email <a href="mailto:hillsidetimbersd@gmail.com" style={linkStyle}>hillsidetimbersd@gmail.com</a> or call <a href="tel:+16053104846" style={linkStyle}>(605) 310-4846</a>.</p>
        </Section>

        <Section title="Changes">
          <p>We may update this policy from time to time. When we do, we will change the date at the top of this page.</p>
        </Section>
      </div>
    </div>
  )
}

const ulStyle = { margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column' as const, gap: 10 }

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
