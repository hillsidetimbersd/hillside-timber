'use client'

import { ArrowUpRight, ChatCircle, Tag } from '@phosphor-icons/react'
import type { Product } from '@/lib/squarespace'
import { formatPrice } from '@/lib/square'
import MagnifyImage from '@/components/media/MagnifyImage'

/** Eyebrow label: the piece's primary store section. "Still Drying" is shown as a badge, never here. */
function primarySection(product: Product): string {
  const named = product.sections.find((s) => s !== 'Still Drying')
  return named ?? (product.brand === 'sfw' ? 'Finished Piece' : 'Wood Slab')
}

export default function ProductCard({ product }: { product: Product }) {
  const sold = !product.inStock && !product.drying
  const reserve = product.drying
  const inquiryHref = `/contact?piece=${encodeURIComponent(product.sku)}`

  const badges = (
    <>
      {reserve && (
        <div style={{
          position: 'absolute', top: 12, left: 12, padding: '5px 10px', pointerEvents: 'none', zIndex: 3,
          background: 'rgba(15,15,13,0.92)', backdropFilter: 'blur(4px)',
          fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700,
          letterSpacing: '1.6px', textTransform: 'uppercase', color: 'var(--tan)',
        }}>
          Still Drying
        </div>
      )}
      {sold ? (
        <div style={{
          position: 'absolute', top: 12, right: 12, padding: '5px 10px', pointerEvents: 'none', zIndex: 3,
          background: 'var(--black)', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)',
          fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff',
        }}>
          Sold
        </div>
      ) : product.onSale ? (
        <div style={{
          position: 'absolute', top: 12, right: 12, padding: '5px 10px', pointerEvents: 'none', zIndex: 3,
          background: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)',
          fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff',
        }}>
          Sale
        </div>
      ) : null}
    </>
  )

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Image with magnifying lens to inspect the grain */}
      {product.images[0] ? (
        <MagnifyImage
          src={product.images[0]}
          alt={product.name}
          lensSize={150}
          zoom={2.4}
          style={{ aspectRatio: '4/3', background: '#f0ede8' }}
          imgStyle={{ opacity: sold ? 0.55 : 1, filter: sold ? 'grayscale(0.35)' : 'none' }}
        >
          {badges}
        </MagnifyImage>
      ) : (
        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#f0ede8', position: 'relative' }}>
          <div style={{ width: '100%', height: '100%', background: '#e0dbd0' }} />
          {badges}
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 4,
        }}>
          {primarySection(product)}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--fs-16)', fontWeight: 700,
          letterSpacing: '0.3px', textTransform: 'uppercase', color: 'var(--black)',
          marginBottom: 4, lineHeight: 1.15,
        }}>
          {product.name}
        </h3>

        {product.dimensions && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', color: 'var(--gray)',
            marginBottom: 8, fontStyle: 'italic',
          }}>
            {product.dimensions}
          </div>
        )}

        {/* Piece No. — a tag-style locator chip */}
        {product.sku && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
            padding: '4px 9px 4px 8px', marginBottom: 12, borderRadius: 'var(--radius-sm)',
            background: 'var(--cream)', border: '1px solid var(--border)',
          }}>
            <Tag size={12} weight="fill" style={{ color: 'var(--green)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gray)' }}>
              Piece No.
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 800, letterSpacing: '0.5px', color: 'var(--black)' }}>
              {product.sku}
            </span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {product.drying && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', fontStyle: 'italic',
            color: 'var(--green)', lineHeight: 1.45, marginBottom: 10,
          }}>
            Still drying in our solar kiln. Inquire to claim it for when it&apos;s ready.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <PriceBlock product={product} />
          <CardAction product={product} sold={sold} reserve={reserve} inquiryHref={inquiryHref} />
        </div>
      </div>
    </div>
  )
}

function PriceBlock({ product }: { product: Product }) {
  // A $0 price is never a real price to show; route the shopper to ask.
  if (product.priceCents === 0) {
    return (
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', fontStyle: 'italic', color: 'var(--gray)' }}>
        Inquire for price
      </span>
    )
  }
  if (product.onSale && product.salePriceCents) {
    return (
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-18)', fontWeight: 800, color: 'var(--green)' }}>
          {formatPrice(product.salePriceCents)}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 700, color: 'var(--gray)', textDecoration: 'line-through' }}>
          {formatPrice(product.priceCents)}
        </span>
      </span>
    )
  }
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-18)', fontWeight: 800, color: 'var(--black)' }}>
      {formatPrice(product.priceCents)}
    </span>
  )
}

const ACTION_BASE = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
  fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700,
  letterSpacing: '1px', textTransform: 'uppercase' as const, textDecoration: 'none',
  whiteSpace: 'nowrap' as const, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
}

function CardAction({ product, sold, reserve, inquiryHref }: { product: Product; sold: boolean; reserve: boolean; inquiryHref: string }) {
  if (sold) {
    return (
      <span style={{ ...ACTION_BASE, color: 'var(--gray)', border: '1px solid var(--border)', cursor: 'not-allowed' }}>
        Sold
      </span>
    )
  }
  if (reserve) {
    return (
      <a
        href={inquiryHref}
        style={{ ...ACTION_BASE, background: 'transparent', color: 'var(--green)', border: '1.5px solid var(--green)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green)' }}
      >
        <ChatCircle size={14} weight="bold" />
        Inquire
      </a>
    )
  }
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...ACTION_BASE, background: 'var(--black)', color: '#fff', border: 'none' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--green)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--black)')}
    >
      View Piece
      <ArrowUpRight size={14} weight="bold" />
    </a>
  )
}
