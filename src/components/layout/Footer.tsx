'use client'

import Link from 'next/link'
import { InstagramLogo, Phone, Envelope, MapPin } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'

export default function Footer() {
  const brand = useBrand()
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: '#0f0f0d',
      color: '#fff',
      padding: '80px 60px 40px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="footer-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
        gap: 60,
        marginBottom: 60,
        maxWidth: 1200,
        margin: '0 auto 60px',
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 800,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            {brand.name}
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-13)',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.8,
            marginBottom: 24,
            maxWidth: 280,
          }}>
            {brand.tagline} Locally harvested, solar kiln dried, and finished in South Dakota.
          </p>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-10)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            <InstagramLogo size={16} />
            {brand.instagramHandle}
          </a>
        </div>

        {/* Shop */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 20,
          }}>
            Shop
          </div>
          {brand.key === 'ht' ? (
            <>
              <FooterLink href="/shop">Wood Slabs</FooterLink>
              <FooterLink href="/shop?type=burl">Blanks & Burls</FooterLink>
              <FooterLink href="/shop?type=mantel">Mantels</FooterLink>
              <FooterLink href="/shop?type=round">Rounds & Cookies</FooterLink>
            </>
          ) : (
            <>
              <FooterLink href="/shop">Finished Pieces</FooterLink>
              <FooterLink href="/custom">Custom Projects</FooterLink>
              <FooterLink href="/shop?type=table">Tables</FooterLink>
              <FooterLink href="/shop?type=bench">Benches</FooterLink>
            </>
          )}
        </div>

        {/* Company */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 20,
          }}>
            Company
          </div>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/gallery">Gallery</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </div>

        {/* Contact */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 20,
          }}>
            Get in Touch
          </div>
          <ContactItem icon={<Phone size={14} />} href={`tel:${brand.contact.phone.replace(/\D/g,'')}`}>
            {brand.contact.phone}
          </ContactItem>
          <ContactItem icon={<Envelope size={14} />} href={`mailto:${brand.contact.email}`}>
            {brand.contact.email}
          </ContactItem>
          <ContactItem icon={<MapPin size={14} />}>
            {brand.contact.address}<br />{brand.contact.city}
          </ContactItem>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-10)',
          letterSpacing: '1px',
          color: 'rgba(255,255,255,0.3)',
        }}>
          &copy; {year} {brand.name}. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          <FooterLinkSm href="/privacy">Privacy</FooterLinkSm>
          <FooterLinkSm href="/terms">Terms</FooterLinkSm>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-13)',
        color: 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        marginBottom: 12,
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
    >
      {children}
    </Link>
  )
}

function FooterLinkSm({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-10)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        textDecoration: 'none',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
    >
      {children}
    </Link>
  )
}

function ContactItem({ icon, href, children }: { icon: React.ReactNode; href?: string; children: React.ReactNode }) {
  const inner = (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{ color: '#2a5c3f', marginTop: 2, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
        {children}
      </span>
    </div>
  )
  if (href) {
    return (
      <a
        href={href}
        style={{ textDecoration: 'none', display: 'block', transition: 'opacity 0.15s' }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {inner}
      </a>
    )
  }
  return <div>{inner}</div>
}
