import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/lib/squarespace'
import SaleDisplaceText from '@/components/home/SaleDisplaceText'

export default function OnSaleShowcase({ products }: { products: Product[] }) {
  if (products.length < 3) return null

  return (
    <section
      className="grain"
      style={{
        position: 'relative', overflow: 'hidden',
        // Deepest tone in the dark-run descent; settles flat onto the kiln tone
        // at its base so the seam below it has no hard line.
        background: 'linear-gradient(180deg, var(--tone-onsale) 0%, var(--tone-onsale) 80%, var(--tone-kiln) 94%, var(--tone-kiln) 100%)',
        color: '#fff',
        padding: '80px var(--section-pad-x)',
      }}
    >
      {/* Faint green wash for depth (same device as EcoPoxy) */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-24%', left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: '150%',
        background: 'radial-gradient(closest-side, rgba(42,92,63,0.32), transparent 72%)',
        filter: 'blur(34px)', zIndex: 1, pointerEvents: 'none',
      }} />

      <div className="picks-band" style={{ position: 'relative', zIndex: 3 }}>
        {/* The signature: a WebGL "On Sale" headline that ripples toward the cursor */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="label" style={{ color: 'var(--tan)', marginBottom: 12 }}>Marked Down</div>
          <h2 className="sr-only">On Sale</h2>
          <SaleDisplaceText text="On Sale" />
          <p className="balance-text" style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', color: 'rgba(255,255,255,0.66)',
            fontStyle: 'italic', maxWidth: 660, margin: '16px auto 0', lineHeight: 1.7,
          }}>
            A small, rotating selection of our slabs, rounds, and burls, marked down for a short while.
            Each one is genuinely one of a kind, so when a piece sells, it is gone for good. If something
            here speaks to you, claim it before it is spoken for.
          </p>
          <div style={{ marginTop: 24 }}>
            <a href="/shop" className="btn-ghost-white">Shop All Pieces</a>
          </div>
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
