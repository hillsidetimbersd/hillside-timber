'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { List, X, CaretDown } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'

type NavLink = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

// Reviews and FAQ live under About as a dropdown. Shared so both brands stay in sync.
const ABOUT_CHILDREN = [
  { href: '/reviews', label: 'Reviews' },
  { href: '/faq', label: 'FAQ' },
]

const HT_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About', children: ABOUT_CHILDREN },
  { href: '/contact', label: 'Contact' },
]

const SFW_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/custom', label: 'Custom' },
  { href: '/about', label: 'About', children: ABOUT_CHILDREN },
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
  // When the nav has a backdrop (scrolled past a hero, or any non-home page) it becomes
  // a frosted, floating, rounded bar rather than a flat full-width black box.
  const solid = !transparent
  const lightHero = brand.key === 'ht'
  const textColor = transparent && lightHero ? 'var(--black)' : '#fff'

  const half = Math.ceil(links.length / 2)
  const leftLinks = links.slice(0, half)
  const rightLinks = links.slice(half)

  const linkStyle: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--fs-13)',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: textColor,
    textDecoration: 'none',
    opacity: 0.9,
    transition: 'opacity 0.15s, color 0.35s',
    whiteSpace: 'nowrap',
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
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 28px',
        }}
      >
        {/* Frosted floating pill — sized to the menu (not the full viewport), fades in once a hero is scrolled past.
            The two link groups are forced to equal width so the centered emblem stays dead-center no matter how
            long the labels are. */}
        <div
          className="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            padding: '11px 26px',
            borderRadius: 999,
            border: solid ? '1px solid rgba(255,255,255,0.16)' : '1px solid transparent',
            background: solid ? 'rgba(18,18,16,0.55)' : 'transparent',
            backdropFilter: solid ? 'blur(22px) saturate(150%)' : 'none',
            WebkitBackdropFilter: solid ? 'blur(22px) saturate(150%)' : 'none',
            boxShadow: solid ? '0 18px 48px rgba(0,0,0,0.32)' : 'none',
            transition: 'background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'flex-end', minWidth: 244 }}>
            {leftLinks.map((l) => (
              <NavItem key={l.href} item={l} linkStyle={linkStyle} />
            ))}
          </div>

          {/* Center gap that clears the overhanging emblem */}
          <div aria-hidden style={{ width: 'calc(var(--emblem-size) + 56px)', flexShrink: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'flex-start', minWidth: 244 }}>
            {rightLinks.map((l) => (
              <NavItem key={l.href} item={l} linkStyle={linkStyle} />
            ))}
          </div>
        </div>

        {/* Right cluster: mobile toggle, pinned right so the links stay centered */}
        <div style={{ position: 'absolute', right: 40, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 18, zIndex: 1 }}>
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
          gap: 30,
          overflowY: 'auto',
          padding: '40px 0',
        }}>
          {links.map((l) => (
            <div key={l.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Link
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '30px',
                  fontWeight: 800,
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
              {l.children?.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-18)',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: 'var(--tan)',
                    textDecoration: 'none',
                  }}
                >
                  {c.label}
                </Link>
              ))}
            </div>
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

/** A single top-level nav entry. Renders a plain link, or a hover/focus dropdown when it has children. */
function NavItem({ item, linkStyle }: { item: NavLink; linkStyle: CSSProperties }) {
  const [open, setOpen] = useState(false)

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.href}
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false) }}
    >
      <Link
        href={item.href}
        aria-haspopup="true"
        aria-expanded={open}
        style={{ ...linkStyle, opacity: open ? 1 : 0.9, display: 'inline-flex', alignItems: 'center', gap: 5 }}
      >
        {item.label}
        <CaretDown
          size={11}
          weight="bold"
          style={{ opacity: 0.65, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </Link>

      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          paddingTop: 16,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          zIndex: 60,
        }}
      >
        {/* Frosted, rounded, floating panel — echoes the nav pill rather than a flat box. */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            minWidth: 172,
            padding: 8,
            borderRadius: 16,
            background: 'rgba(20,20,18,0.72)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow:
              '0 24px 50px rgba(0,0,0,0.34), 0 6px 16px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.07)',
            transform: open ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'transform 0.2s cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          {item.children.map((c) => (
            <DropdownLink key={c.href} href={c.href} label={c.label} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DropdownLink({ href, label }: { href: string; label: string }) {
  const setActive = (el: HTMLAnchorElement) => {
    el.style.background = 'rgba(255,255,255,0.09)'
    el.style.color = 'var(--tan)'
  }
  const setRest = (el: HTMLAnchorElement) => {
    el.style.background = 'transparent'
    el.style.color = 'rgba(255,255,255,0.82)'
  }
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--fs-12)',
        fontWeight: 700,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.82)',
        textDecoration: 'none',
        padding: '11px 18px',
        borderRadius: 9,
        whiteSpace: 'nowrap',
        transition: 'background 0.16s ease, color 0.16s ease',
      }}
      onMouseEnter={(e) => setActive(e.currentTarget)}
      onMouseLeave={(e) => setRest(e.currentTarget)}
      onFocus={(e) => setActive(e.currentTarget)}
      onBlur={(e) => setRest(e.currentTarget)}
    >
      {label}
    </Link>
  )
}
