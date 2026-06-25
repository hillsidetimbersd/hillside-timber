'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { List, X, CaretDown, ShoppingBag } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'
import { useCart } from '@/components/cart/useCart'

type NavChild = {
  href: string
  label: string
  description: string
}

type NavLink = {
  href: string
  label: string
  children?: NavChild[]
  /** Renders as the cart entry: a bag icon plus a live item-count badge. */
  cart?: boolean
}

// The About menu groups the company + credibility pages into one dropdown,
// shared by both brands so they stay in sync. Solar Kiln Drying points at the
// kiln story on the Hillside Timber home (/#solar-kiln).
const ABOUT_CHILDREN: NavChild[] = [
  { href: '/about', label: 'Our Story', description: 'How we mill, dry, and number every slab' },
  { href: '/services', label: 'Our Services', description: 'Custom milling and slab flattening' },
  { href: '/solar-kiln', label: 'Solar Kiln Drying', description: 'Drying slabs flat and stable, sun powered' },
  { href: '/reviews', label: 'Reviews', description: 'What customers say about us' },
  { href: '/faq', label: 'FAQ', description: 'Ordering, pickup, and shipping' },
  { href: '/contact', label: 'Contact', description: 'Call, email, or send the details' },
]

// Sioux Falls Woodworking folds custom work into a Shop dropdown, so its top-level
// menu stays at five entries (Home, Gallery, Shop, About, Cart).
const SFW_SHOP_CHILDREN: NavChild[] = [
  { href: '/shop', label: 'All Pieces', description: 'Finished pieces ready to take home' },
  { href: '/custom', label: 'Custom Work', description: 'Commission a one of a kind piece' },
]

const CART_LINK: NavLink = { href: '/cart', label: 'Cart', cart: true }

const HT_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About', children: ABOUT_CHILDREN },
  CART_LINK,
]

const SFW_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop', children: SFW_SHOP_CHILDREN },
  { href: '/about', label: 'About', children: ABOUT_CHILDREN },
  CART_LINK,
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
              <NavItem key={l.href} item={l} linkStyle={linkStyle} brandName={brand.name} brandTagline={brand.tagline} count={count} />
            ))}
          </div>

          {/* Center gap that clears the overhanging emblem */}
          <div aria-hidden style={{ width: 'calc(var(--emblem-size) + 56px)', flexShrink: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 30, justifyContent: 'flex-start', minWidth: 244 }}>
            {rightLinks.map((l) => (
              <NavItem key={l.href} item={l} linkStyle={linkStyle} brandName={brand.name} brandTagline={brand.tagline} count={count} />
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
                {l.label}{l.cart && count > 0 ? ` (${count})` : ''}
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
        .nav-cart-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 22px; height: 22px; padding: 0 6px; box-sizing: border-box;
          border-radius: 999px; background: var(--green); color: #fff;
          font-family: var(--font-display); font-weight: 700; font-size: 12px;
          line-height: 1; font-variant-numeric: tabular-nums; flex-shrink: 0;
        }
        .nav-cart-badge__n { display: block; transform: translateY(-0.9px); }
        .nav-cart-link:focus-visible { outline: 2px solid var(--tan); outline-offset: 4px; border-radius: 6px; }
        .nav-pop-row { transition: background 0.15s ease; }
        .nav-pop-row:hover, .nav-pop-row:focus-visible { background: var(--cream); outline: none; }
        .nav-pop-row:focus-visible { box-shadow: inset 0 0 0 2px var(--green); }
        .nav-pop-row:hover .nav-pop-title, .nav-pop-row:focus-visible .nav-pop-title { color: var(--green); }
        .nav-feat { transition: filter 0.16s ease; }
        .nav-feat:hover, .nav-feat:focus-visible { filter: brightness(1.09); outline: none; }
        .nav-feat:focus-visible { box-shadow: 0 0 0 2px var(--green); }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .nav-links { display: none !important; }
        }
      `}</style>
    </>
  )
}

/** A single top-level nav entry. Renders a plain link, or a hover/focus dropdown when it has children. */
function NavItem({ item, linkStyle, brandName, brandTagline, count }: { item: NavLink; linkStyle: CSSProperties; brandName: string; brandTagline: string; count: number }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  // The cart entry: a bag icon, the label, and a live count badge. Uses the shared
  // link color (which flips with the nav background), so it stays legible on the
  // light home hero and on the dark frosted bar alike; the badge is always green.
  if (item.cart) {
    return (
      <Link
        href={item.href}
        className="nav-cart-link"
        aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart'}
        style={{ ...linkStyle, opacity: 1, display: 'inline-flex', alignItems: 'center', gap: 7, position: 'relative' }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
      >
        <ShoppingBag size={16} weight="bold" aria-hidden="true" />
        {item.label}
        {count > 0 && (
          // HTML badge, not SVG. SVG <text> does not reflow when the webfont finishes loading,
          // so on a reload-with-items the badge froze in its fallback layout (a too-wide advance)
          // and text-anchor="middle" centered that wide cell, leaving the ink leaning left. HTML
          // text reflows correctly, so the real (condensed) font is used and flex-centers cleanly.
          // The inner span carries a tiny measured nudge to seat lining numerals (no descender)
          // dead-center vertically; horizontal is exact via flex.
          <span className="nav-cart-badge" aria-hidden="true">
            <span className="nav-cart-badge__n">{count}</span>
          </span>
        )}
      </Link>
    )
  }

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

  // Hover-intent: a short close delay keeps the panel open while the cursor
  // crosses the gap between the trigger and the panel.
  const openNow = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true) }
  const closeSoon = () => { closeTimer.current = setTimeout(() => setOpen(false), 130) }

  // shadcn "Getting started" layout: a tall brand card on the left (the About hub),
  // the rest of the pages as a titled list on the right.
  const featured = item.children.find((c) => c.href === '/about')
  const rest = item.children.filter((c) => c !== featured)

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
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

      {/* Drops straight down, centered under the trigger. */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          paddingTop: 14,
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.18s ease',
          zIndex: 60,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: featured ? 'min(520px, 92vw)' : 'min(320px, 92vw)',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: 8,
            transform: open ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'transform 0.18s cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          {/* Pointer notch up toward the trigger. */}
          <span aria-hidden="true" style={{
            position: 'absolute', top: -6, left: '50%', marginLeft: -5, width: 10, height: 10,
            background: '#fff', borderLeft: '1px solid var(--border)', borderTop: '1px solid var(--border)',
            transform: 'rotate(45deg)', borderTopLeftRadius: 2,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: featured ? '0.82fr 1fr' : '1fr', gap: 8 }}>
            {featured && (
              <Link
                href={featured.href}
                className="nav-feat"
                style={{
                  position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  minHeight: 196, padding: 16, borderRadius: 'var(--radius)', overflow: 'hidden', textDecoration: 'none',
                  // Founder photo under a green-tinted scrim: darker at the top and bottom
                  // so the tan eyebrow and white title stay legible, lighter in the middle so
                  // the photo reads through. The solid color is a fallback if the image fails.
                  backgroundColor: '#14271c',
                  backgroundImage:
                    'linear-gradient(168deg, rgba(15,26,19,0.55) 0%, rgba(15,26,19,0.30) 44%, rgba(9,17,12,0.92) 100%), url("/assets/photos/founder.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: '20% 32%',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: 'auto' }}>
                  Our Story
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 800, letterSpacing: '-0.3px', textTransform: 'uppercase', color: '#fff', lineHeight: 1.04, marginTop: 12 }}>
                  {brandName}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.5, marginTop: 7 }}>
                  {brandTagline}
                </span>
              </Link>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {rest.map((c) => <DropdownRow key={c.href} child={c} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** One row in the About dropdown: title + one-line description. */
function DropdownRow({ child }: { child: NavChild }) {
  return (
    <Link href={child.href} className="nav-pop-row" style={{ display: 'block', padding: '10px 13px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>
      <span className="nav-pop-title" style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--black)', transition: 'color 0.15s ease' }}>
        {child.label}
      </span>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', color: 'var(--gray)', lineHeight: 1.45, marginTop: 2 }}>
        {child.description}
      </span>
    </Link>
  )
}
