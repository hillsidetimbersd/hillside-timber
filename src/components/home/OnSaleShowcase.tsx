import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/lib/squarespace'

export default function OnSaleShowcase({ products }: { products: Product[] }) {
  if (products.length < 3) return null

  return (
    <section>
      {/* Animated "On Sale" marquee (reuses the ticker keyframes in globals.css) */}
      <div style={{ overflow: 'hidden', background: 'var(--green)', padding: '13px 0' }} aria-hidden="true">
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'ticker 30s linear infinite', willChange: 'transform' }}>
          {Array.from({ length: 2 }).map((_, half) => (
            <div key={half} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 18px',
                  fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800,
                  letterSpacing: '3px', textTransform: 'uppercase', color: '#fff',
                }}>
                  On Sale <span style={{ color: 'var(--tan)' }}>·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--cream)', padding: '90px var(--section-pad-x)' }}>
        <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
            <div>
              <div className="label" style={{ marginBottom: 14 }}>Marked Down</div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 60px)', fontWeight: 800,
                letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95,
              }}>
                On Sale Now
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--gray)', fontStyle: 'italic', marginTop: 12, maxWidth: 520, lineHeight: 1.6 }}>
                A rotating selection of pieces at a special price. When they sell, they are gone.
              </p>
            </div>
            <a href="/shop" className="btn-ghost">Shop All Pieces</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
