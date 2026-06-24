'use client'

import { useState } from 'react'
import { X, ShoppingBag, Trash } from '@phosphor-icons/react'
import { useCart } from './useCart'
import { formatPrice } from '@/lib/square'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, subtotal, removeItem, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ catalogObjectId: i.catalogObjectId, qty: i.qty })),
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Checkout failed. Please try again.')
        setLoading(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Checkout failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,15,13,0.5)',
            zIndex: 80,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        background: '#fff',
        zIndex: 90,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="var(--green)" />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-14)',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--black)',
            }}>
              Cart ({items.length})
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              color: 'var(--gray)',
            }}>
              <ShoppingBag size={48} opacity={0.25} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', fontStyle: 'italic' }}>
                Your cart is empty.
              </p>
              <a href="/shop" className="btn-ghost" style={{ fontSize: 'var(--fs-10)' }}>Browse Products</a>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                gap: 14,
                padding: '16px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                {item.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', flexShrink: 0, background: '#f0ede8' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-12)',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: 'var(--black)',
                    marginBottom: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--fs-14)',
                    fontWeight: 800,
                    color: 'var(--black)',
                  }}>
                    {formatPrice(item.price)}
                  </div>
                  <div className="muted-text" style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--fs-11)',
                    marginTop: 2,
                  }}>
                    Qty: {item.qty}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', alignSelf: 'flex-start', padding: 4 }}
                >
                  <Trash size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid var(--border)',
            background: '#fff',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-11)',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
              }}>
                Subtotal
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--black)',
              }}>
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="muted-text" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-11)',
              marginBottom: 16,
            }}>
              Shipping calculated at checkout. Heavy items may require freight quote.
            </p>
            {error && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-12)',
                color: '#9b2c2c',
                marginBottom: 12,
                lineHeight: 1.5,
              }}>
                {error}
              </p>
            )}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginBottom: 8,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Processing…' : 'Checkout via Square'}
            </button>
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-10)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'var(--gray)',
                cursor: 'pointer',
                padding: '6px 0',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
