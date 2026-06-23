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

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Page header */}
      <div style={{ padding: '60px var(--section-pad-x) 40px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
        <div className="label" style={{ marginBottom: 12 }}>
          {brand.key === 'ht' ? 'Wood Inventory' : 'Finished Pieces'}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5vw, 72px)', fontWeight: 800,
          letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95, marginBottom: 16,
        }}>
          {brand.key === 'ht' ? 'Shop the Slab Yard' : 'Finished Pieces'}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--gray)', maxWidth: 625, lineHeight: 1.7, fontStyle: 'italic' }}>
          {brand.key === 'ht'
            ? 'Every piece is one of a kind. Locally harvested from South Dakota and solar kiln dried in-house.'
            : 'Handcrafted furniture built to last a lifetime. Each piece is unique.'}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--gray)', fontStyle: 'italic', marginTop: 10 }}>
          Every photo is a real piece in our current inventory. When one sells, we take it down.
        </p>
      </div>

      {/* Shop layout */}
      <div className="shop-layout" style={{
        display: 'flex', padding: '48px var(--section-pad-x)', gap: 40,
        maxWidth: 'var(--content-wide)', margin: '0 auto', alignItems: 'flex-start',
      }}>
        {/* Sidebar: sections + search */}
        <aside className="shop-sidebar" style={{ width: 230, flexShrink: 0, paddingRight: 36 }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 32 }}>
            <MagnifyingGlass size={15} weight="bold" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            <input
              type="text"
              placeholder="Search species, piece no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 34px', fontFamily: 'var(--font-body)',
                fontSize: '13px', border: '1px solid var(--border)', background: '#fff',
                color: 'var(--black)', outline: 'none',
              }}
            />
          </div>

          {/* Sections */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 14,
          }}>
            Browse
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {sections.map((s) => {
              const active = section === s
              return (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                    padding: '9px 0', borderBottom: '1px solid var(--border)',
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                    color: active ? 'var(--green)' : 'var(--gray-dark)',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--black)' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--gray-dark)' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />}
                    {s}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: 700 }}>{countFor(s)}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
              textTransform: 'uppercase', color: 'var(--gray)',
            }}>
              {section === 'All' ? '' : `${section} · `}{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--gray)', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontStyle: 'italic' }}>
                {products.length === 0
                  ? 'Inventory is loading. Check back in a moment.'
                  : 'No pieces match. Try another section or search.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
