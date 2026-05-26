'use client'

import { ShoppingBag } from '@phosphor-icons/react'
import type { SquareProduct } from '@/lib/square'
import { formatPrice } from '@/lib/square'
import { useCart } from '@/components/cart/useCart'

const KILN_LABELS = {
  'solar-kiln': 'Solar Kiln Dried',
  'air-dried': 'Air Dried',
  'green': 'Green',
}

export default function ProductCard({ product }: { product: SquareProduct }) {
  const { addItem } = useCart()

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    })
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image */}
      <div style={{
        aspectRatio: '4/3',
        overflow: 'hidden',
        background: '#f0ede8',
        position: 'relative',
      }}>
        {product.images[0] ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#e0dbd0' }} />
        )}
        {/* Kiln badge */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          padding: '4px 8px',
          background: 'rgba(15,15,13,0.85)',
          backdropFilter: 'blur(4px)',
          fontFamily: 'var(--font-display)',
          fontSize: '8px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#2a5c3f',
        }}>
          {KILN_LABELS[product.kilnStatus]}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {product.species && (
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: 4,
          }}>
            {product.species}
          </div>
        )}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          textTransform: 'uppercase',
          color: 'var(--black)',
          marginBottom: 4,
          lineHeight: 1.2,
        }}>
          {product.name}
        </h3>
        {product.dimensions && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--gray)',
            marginBottom: 8,
            fontStyle: 'italic',
          }}>
            {product.dimensions}
          </div>
        )}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--gray-dark)',
          lineHeight: 1.6,
          flex: 1,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--black)',
          }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              background: 'var(--black)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--green)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--black)')}
          >
            <ShoppingBag size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
