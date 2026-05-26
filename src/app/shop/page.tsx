'use client'

import { useState, useMemo } from 'react'
import { useBrand } from '@/components/brand/BrandContext'
import ShopFilters, { DEFAULT_FILTERS, type FilterState } from '@/components/shop/ShopFilters'
import ProductCard from '@/components/shop/ProductCard'
import FreightCalculator from '@/components/shop/FreightCalculator'
import { FALLBACK_PRODUCTS_CLIENT } from './products-client'

export default function ShopPage() {
  const brand = useBrand()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const products = useMemo(() => {
    return FALLBACK_PRODUCTS_CLIENT.filter((p) => {
      if (p.brand !== brand.key && p.brand !== 'both') return false
      if (filters.species && p.species !== filters.species) return false
      if (filters.type && p.type !== filters.type) return false
      if (filters.kilnStatus && p.kilnStatus !== filters.kilnStatus) return false
      if (p.price > filters.maxPrice) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.species.toLowerCase().includes(q) && !p.type.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [brand.key, filters])

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Page header */}
      <div style={{
        padding: '60px 60px 40px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--cream)',
      }}>
        <div className="label" style={{ marginBottom: 12 }}>
          {brand.key === 'ht' ? 'Wood Inventory' : 'Finished Pieces'}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          color: 'var(--black)',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          {brand.key === 'ht' ? 'Shop the Slab Yard' : 'Finished Pieces'}
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--gray)',
          maxWidth: 500,
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          {brand.key === 'ht'
            ? 'Every piece is one of a kind. Locally harvested from South Dakota and solar kiln dried in-house.'
            : 'Handcrafted furniture built to last a lifetime. Each piece is unique.'
          }
        </p>
      </div>

      {/* Shop layout */}
      <div style={{
        display: 'flex',
        padding: '48px 60px',
        gap: 40,
        maxWidth: 1400,
        margin: '0 auto',
        alignItems: 'flex-start',
      }}>
        {/* Sidebar */}
        <ShopFilters filters={filters} onChange={setFilters} />

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--gray)',
            }}>
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {products.length === 0 ? (
            <div style={{
              padding: '80px 40px',
              textAlign: 'center',
              color: 'var(--gray)',
              border: '1px solid var(--border)',
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic' }}>
                No pieces match your filters.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {brand.key === 'ht' && <FreightCalculator />}
        </div>
      </div>
    </div>
  )
}
