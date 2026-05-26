'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { List, X, ShoppingBag } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'
import { useCart } from '@/components/cart/useCart'

const HT_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const SFW_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/custom', label: 'Custom Projects' },
  { href: '/resources', label: 'Resources' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const brand = useBrand()
  const { count } = useCart()
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
  const accent = transparent && lightHero ? 'var(--green)' : 'var(--tan)'
  const wordmark = brand.key === 'ht' ? 'Hillside Timber' : 'Sioux Falls Woodworking'

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
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {brand.key === 'ht' ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/assets/logos/ht-logo.webp"
              alt="Hillside Timber"
              style={{
                height: '34px',
                width: 'auto',
                maxWidth: '200px',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          ) : (
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: textColor,
              transition: 'color 0.35s',
            }}>
              {wordmark}
            </span>
          )}
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: textColor,
                textDecoration: 'none',
                opacity: 0.9,
                transition: 'opacity 0.15s, color 0.35s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
            >
              {l.label}
            </Link>
          ))}

          {/* Cart */}
          <button
            aria-label="Cart"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#2a5c3f',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 700,
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {count}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <List size={24} />}
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
          nav > div > a { display: none; }
          nav > div > button:first-of-type { display: flex !important; }
        }
      `}</style>
    </>
  )
}
