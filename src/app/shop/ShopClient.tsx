'use client'

import { useState, useMemo } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/lib/squarespace'

export default function ShopClient({ products, sections }: { products: Product[]; sections: string[] }) {
  const brand = useBrand()
  const [section, setSection] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (section !== 'All' && !p.sections.includes(section)) return false
      if (q && !`${p.name} ${p.sku} ${p.sections.join(' ')}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [products, section, search])

  const countFor = (s: string) =>
    s === 'All' ? products.length : products.filter((p) => p.sections.includes(s)).length

  // Live header stats (always reflect the full inventory, not the active section).
  const onSale = products.filter((p) => p.onSale).length
  const comingSoon = products.filter((p) => p.drying).length
  const stats: { n: string; label: string }[] = [
    { n: String(products.length), label: products.length === 1 ? 'Piece' : 'Pieces' },
  ]
  if (brand.key === 'ht') stats.push({ n: '24+', label: 'Species' })
  if (onSale > 0) stats.push({ n: String(onSale), label: 'On Sale' })
  else if (comingSoon > 0) stats.push({ n: String(comingSoon), label: 'Still Drying' })

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Header */}
      <div style={{ padding: '38px var(--section-pad-x) 30px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
        <div className="shop-header-inner" style={{
          maxWidth: 'var(--content-wide)', margin: '0 auto', display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: 660 }}>
            <div className="label" style={{ marginBottom: 10 }}>
              {brand.key === 'ht' ? 'Wood Inventory' : 'Finished Pieces'}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 60px)', fontWeight: 800,
              letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95, marginBottom: 12,
            }}>
              {brand.key === 'ht' ? 'Shop the Slab Yard' : 'Finished Pieces'}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray-dark)', maxWidth: 580, lineHeight: 1.65, fontStyle: 'italic' }}>
              {brand.key === 'ht'
                ? 'Every piece is one of a kind, locally harvested and solar kiln dried in-house. Every photo is a real piece in our current inventory; when one sells, we take it down.'
                : 'Handcrafted furniture built to last a lifetime. Every photo is a real piece; once it sells, we take it down.'}
            </p>
          </div>

          {/* Live stat strip */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {stats.map((st, i) => (
              <div key={st.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '0 22px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: 'var(--green)', letterSpacing: '-1px', lineHeight: 1 }}>
                  {st.n}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginTop: 7 }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop layout — outer padding + inner max-width mirrors the header so
          the sidebar/grid edges align exactly with the title and stats above. */}
      <div style={{ padding: '38px var(--section-pad-x) 64px' }}>
        <div className="shop-layout" style={{
          display: 'flex', gap: 40,
          maxWidth: 'var(--content-wide)', margin: '0 auto', alignItems: 'flex-start',
        }}>
        {/* Sidebar: search + sections */}
        <aside className="shop-sidebar" style={{ width: 240, flexShrink: 0, paddingRight: 32 }}>
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <MagnifyingGlass size={16} weight="bold" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--green)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Species, piece no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = '#fff' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--cream)' }}
              style={{
                width: '100%', padding: '12px 14px 12px 40px', fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-14)', border: '1.5px solid var(--border)', background: 'var(--cream)',
                color: 'var(--black)', outline: 'none', borderRadius: 'var(--radius)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            />
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 12, paddingLeft: 12 }}>
            Browse
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sections.map((s) => {
              const active = section === s
              return (
                <button
                  key={s}
                  className="shop-section-btn"
                  onClick={() => setSection(s)}
                  aria-pressed={active}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                    width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
                    padding: '11px 12px', borderRadius: 'var(--radius-sm)',
                    background: active ? 'var(--green)' : 'transparent',
                    color: active ? '#fff' : 'var(--gray-dark)',
                    fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 700,
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                    transition: 'background 0.18s ease, color 0.18s ease',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(42,92,63,0.08)' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <span>{s}</span>
                  <span style={{ fontSize: 'var(--fs-11)', fontWeight: 700, color: active ? 'rgba(255,255,255,0.78)' : 'var(--gray)' }}>{countFor(s)}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray)' }}>
              {section === 'All' ? 'All Pieces' : section} · {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--gray)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', fontStyle: 'italic' }}>
                {products.length === 0 ? 'Inventory is loading. Check back in a moment.' : 'No pieces match. Try another section or search.'}
              </p>
            </div>
          ) : (
            <div key={section} className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      <style>{`
        .shop-section-btn:focus { outline: none; }
        .shop-section-btn:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
        @keyframes shopGridFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .shop-grid { animation: shopGridFade 0.35s cubic-bezier(0.22, 0.61, 0.36, 1); }
        @media (prefers-reduced-motion: reduce) { .shop-grid { animation: none; } }
      `}</style>
    </div>
  )
}
