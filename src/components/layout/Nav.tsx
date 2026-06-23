'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { List, X } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'

const HT_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const SFW_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/custom', label: 'Custom' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const brand = useBrand()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = brand.key === 'sfw' ? SFW_LINKS : HT_LINKS
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = isHome && !scrolled
  const lightHero = brand.key === 'ht'
  const navBg = transparent ? 'transparent' : 'rgba(15,15,13,0.96)'
  const navBorder = transparent ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)'
  const textColor = transparent && lightHero ? 'var(--black)' : '#fff'

  const half = Math.ceil(links.length / 2)
  const leftLinks = links.slice(0, half)
  const rightLinks = links.slice(half)

  const linkStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    color: textColor,
    textDecoration: 'none',
    opacity: 0.9,
    transition: 'opacity 0.15s, color 0.35s',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 'var(--switcher-h)',
          left: 0,
          right: 0,
          height: 'var(--nav-h)',
          background: navBg,
          borderBottom: navBorder,
          backdropFilter: transparent ? 'none' : 'blur(12px)',
          zIndex: 50,
          transition: 'background 0.35s, border-color 0.35s, backdrop-filter 0.35s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 40px',
        }}
      >
        {/* Centered links, split into two groups flanking the center emblem */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34, justifyContent: 'flex-end' }}>
            {leftLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Center gap that clears the overhanging emblem */}
          <div aria-hidden style={{ width: 'calc(var(--emblem-size) + 56px)', flexShrink: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 34, justifyContent: 'flex-start' }}>
            {rightLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right cluster: cart + mobile toggle, pinned right so the links stay centered */}
        <div style={{ position: 'absolute', right: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={26} /> : <List size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 'calc(var(--switcher-h) + var(--nav-h))',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,15,13,0.97)',
          zIndex: 49,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '32px',
                fontWeight: 800,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </>
  )
}
