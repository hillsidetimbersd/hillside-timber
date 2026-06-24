import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/lib/squarespace'

export default function TopPicks({ products }: { products: Product[] }) {
  if (products.length < 3) return null

  return (
    <section style={{ background: 'var(--cream)', padding: '110px var(--section-pad-x)', borderTop: '1px solid var(--border)' }}>
      <div className="picks-band">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div className="label" style={{ marginBottom: 14 }}>Hand-Picked</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 60px)', fontWeight: 800,
              letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95,
            }}>
              Our Top Picks
            </h2>
            <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', marginTop: 12, maxWidth: 520, lineHeight: 1.6 }}>
              The most striking pieces in the yard right now. One of a kind, and they move fast.
            </p>
          </div>
          <a href="/shop" className="btn-ghost">View All Inventory</a>
        </div>

        <div className="picks-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
