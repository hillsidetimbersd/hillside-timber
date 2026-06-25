'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Trash, ArrowRight } from '@phosphor-icons/react'
import { useCart } from '@/components/cart/useCart'
import { formatPrice } from '@/lib/square'

export default function CartPage() {
  const { items, subtotal, removeItem, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setError(null)
    setLoading(true)
    try {
      // CONTRACT: POST /api/checkout { items: [{ catalogObjectId, qty }] } — matches CartDrawer.
      // The checkout spine rewrites this route to Stripe and reconciles both callers.
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ catalogObjectId: i.catalogObjectId, qty: i.qty })) }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Checkout could not start. Please try again, or contact us and we will help.')
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Checkout could not start. Please try again, or contact us and we will help.')
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)', minHeight: '100vh' }}>
      <style>{STYLES}</style>

      <div className="cart-wrap">
        <div className="label" style={{ marginBottom: 10 }}>Your Cart</div>
        <h1 className="cart-h1">
          {items.length === 0
            ? 'Your cart is empty'
            : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'} in your cart`}
        </h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={44} weight="light" aria-hidden="true" />
            <p className="muted-text cart-empty__line">
              Nothing here yet. Every piece is one of a kind, so when one catches your eye, add it before it is gone.
            </p>
            <Link href="/shop" className="cart-cta cart-cta--black">Browse the shop</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-row">
                  <Link href={`/shop/${item.id}`} className="cart-thumb" aria-label={`View ${item.name}`}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span className="cart-thumb__empty" aria-hidden="true" />
                    )}
                  </Link>
                  <div className="cart-row__info">
                    <Link href={`/shop/${item.id}`} className="cart-row__name">{item.name}</Link>
                    {item.catalogObjectId && (
                      <div className="cart-row__sku">Piece No. {item.catalogObjectId}</div>
                    )}
                    <div className="cart-row__price">{formatPrice(item.price)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="cart-remove"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="cart-summary__row">
                <span className="cart-summary__label">Subtotal</span>
                <span className="cart-summary__total">{formatPrice(subtotal)}</span>
              </div>
              <p className="muted-text cart-summary__note">
                Freight or local delivery is arranged after the sale, so shipping is not added here. Every piece is one of a kind.
              </p>
              {error && <p className="cart-error" role="alert">{error}</p>}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="cart-cta cart-cta--black cart-summary__checkout"
              >
                {loading ? 'Starting checkout…' : (<>Proceed to checkout <ArrowRight size={16} weight="bold" /></>)}
              </button>
              <button type="button" onClick={clearCart} className="cart-clear">Clear cart</button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

const STYLES = `
.cart-wrap { max-width: var(--content-max); margin: 0 auto; padding: 48px var(--section-pad-x) 96px; }
.cart-h1 { font-family: var(--font-display); font-size: clamp(30px, 3.4vw, 48px); font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; color: var(--black); line-height: 1.0; margin-bottom: 34px; }

.cart-empty { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; color: var(--gray); max-width: 46ch; }
.cart-empty__line { font-family: var(--font-body); font-size: var(--fs-16); line-height: 1.7; }

.cart-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, 360px); gap: 48px; align-items: start; }

.cart-items { display: flex; flex-direction: column; }
.cart-row { display: flex; gap: 18px; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--border); }
.cart-row:first-child { border-top: 1px solid var(--border); }
.cart-thumb { display: block; flex-shrink: 0; width: 96px; height: 96px; border-radius: var(--radius-sm); overflow: hidden; background: #efe9df; border: 1px solid var(--border); }
.cart-thumb > img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
.cart-thumb__empty { display: block; width: 100%; height: 100%; background: #e0dbd0; }
.cart-thumb:hover > img { transform: scale(1.05); }
.cart-thumb:focus-visible { outline: 3px solid var(--green); outline-offset: 2px; }

.cart-row__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.cart-row__name { font-family: var(--font-display); font-size: var(--fs-16); font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; color: var(--black); text-decoration: none; transition: color 0.18s ease; }
.cart-row__name:hover { color: var(--green); }
.cart-row__name:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }
.cart-row__sku { font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); }
.cart-row__price { font-family: var(--font-display); font-size: var(--fs-16); font-weight: 800; color: var(--black); margin-top: 2px; }

.cart-remove { flex-shrink: 0; width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--gray); cursor: pointer; transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease; }
.cart-remove:hover { color: #fff; background: var(--black); border-color: var(--black); }
.cart-remove:focus-visible { outline: 3px solid var(--tan); outline-offset: 2px; }
.cart-remove:active { transform: translateY(1px); }

.cart-summary { position: sticky; top: calc(var(--switcher-h) + var(--nav-h) + 24px); background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-sm); }
.cart-summary__row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border); margin-bottom: 14px; }
.cart-summary__label { font-family: var(--font-display); font-size: var(--fs-11); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); }
.cart-summary__total { font-family: var(--font-display); font-size: clamp(22px, 2vw, 28px); font-weight: 800; color: var(--black); }
.cart-summary__note { font-family: var(--font-body); font-size: var(--fs-12); line-height: 1.6; margin-bottom: 18px; }
.cart-error { font-family: var(--font-body); font-size: var(--fs-13); color: #9b2c2c; line-height: 1.5; margin-bottom: 14px; }

.cart-cta { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 52px; padding: 0 26px; border: none; cursor: pointer; font-family: var(--font-display); font-size: var(--fs-12); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border-radius: var(--radius-sm); transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease; }
.cart-cta--black { background: var(--black); color: #fff; }
.cart-cta--black:hover { background: var(--green); }
.cart-cta:focus-visible { outline: 3px solid var(--tan); outline-offset: 3px; }
.cart-cta:not(:disabled):active { transform: translateY(1px); }
.cart-cta:disabled { cursor: default; opacity: 0.7; }
.cart-summary__checkout { width: 100%; }

.cart-clear { width: 100%; margin-top: 10px; background: none; border: none; cursor: pointer; font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gray); padding: 8px 0; transition: color 0.18s ease; }
.cart-clear:hover { color: var(--black); }
.cart-clear:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }

@media (max-width: 860px) {
  .cart-grid { grid-template-columns: 1fr; gap: 28px; }
  .cart-summary { position: static; }
}
@media (max-width: 560px) {
  .cart-thumb { width: 76px; height: 76px; }
}
@media (prefers-reduced-motion: reduce) {
  .cart-cta, .cart-remove { transition: background 0.2s ease, color 0.2s ease; }
  .cart-cta:active, .cart-remove:active { transform: none; }
  .cart-thumb:hover > img { transform: none; }
}
`
