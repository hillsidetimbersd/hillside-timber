'use client'

import Link from 'next/link'
import { ArrowUpRight, ChatCircle, Tag } from '@phosphor-icons/react'
import type { Product } from '@/lib/squarespace'
import { getCtaState, type CtaState } from '@/lib/shop-cta'
import { formatPrice } from '@/lib/square'
import HoverImage from '@/components/media/HoverImage'

/** Eyebrow label: the piece's primary store section. "Still Drying" is shown as a badge, never here. */
function primarySection(product: Product): string {
  const named = product.sections.find((s) => s !== 'Still Drying')
  return named ?? (product.brand === 'sfw' ? 'Finished Piece' : 'Wood Slab')
}

export default function ProductCard({ product }: { product: Product }) {
  const cta = getCtaState(product)
  const sold = cta === 'sold'
  const inquiryHref = product.sku ? `/contact?piece=${encodeURIComponent(product.sku)}` : '/contact'
  const detailHref = product.slug ? `/shop/${product.slug}` : '/shop'

  const badges = (
    <>
      {product.drying && (
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
      <style>{ACTION_STYLES}</style>

      {/* Product image with badges */}
      {product.images[0] ? (
        <HoverImage
          src={product.images[0]}
          alt={product.name}
          style={{ aspectRatio: '4/3', background: '#f0ede8' }}
          imgStyle={{ opacity: sold ? 0.55 : 1, filter: sold ? 'grayscale(0.35)' : 'none' }}
        >
          {badges}
        </HoverImage>
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
          <div className="muted-text" style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)',
            marginBottom: 8,
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
            Still drying in our solar kiln. Inquire to reserve it, or claim it when it&apos;s ready.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <PriceBlock product={product} />
          <CardAction cta={cta} detailHref={detailHref} inquiryHref={inquiryHref} />
        </div>
      </div>
    </div>
  )
}

function PriceBlock({ product }: { product: Product }) {
  // A $0 price is never a real price to show; route the shopper to ask.
  if (product.priceCents === 0) {
    return (
      <span className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)' }}>
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

/**
 * The card's action, from one computed CTA state. An available piece links to its
 * detail page (Add to cart lives there, never on the grid card); drying and
 * unpriced pieces keep the Inquire link; a sold piece shows a disabled chip.
 */
function CardAction({ cta, detailHref, inquiryHref }: { cta: CtaState; detailHref: string; inquiryHref: string }) {
  if (cta === 'sold') {
    return <span className="pc-action pc-action--sold" aria-disabled="true">Sold</span>
  }
  if (cta === 'inquire') {
    return (
      <a href={inquiryHref} className="pc-action pc-action--inquire">
        <ChatCircle size={14} weight="bold" />
        Inquire
      </a>
    )
  }
  if (cta === 'inquireForPrice') {
    return (
      <a href={inquiryHref} className="pc-action pc-action--inquire">
        <ChatCircle size={14} weight="bold" />
        Inquire for price
      </a>
    )
  }
  return (
    <Link href={detailHref} className="pc-action pc-action--view">
      View Piece
      <ArrowUpRight size={14} weight="bold" />
    </Link>
  )
}

const ACTION_STYLES = `
.pc-action {
  display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px;
  font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; white-space: nowrap;
  border: none; border-radius: var(--radius-sm); text-decoration: none; cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease;
}
.pc-action--view { background: var(--black); color: #fff; }
.pc-action--view:hover { background: var(--green); }
.pc-action--inquire { background: transparent; color: var(--green); border: 1.5px solid var(--green); }
.pc-action--inquire:hover { background: var(--green); color: #fff; }
.pc-action--sold { background: transparent; color: var(--gray); border: 1px solid var(--border); cursor: not-allowed; }
.pc-action:focus-visible { outline: 3px solid var(--tan); outline-offset: 2px; }
.pc-action:not(.pc-action--sold):active { transform: translateY(1px); }
@media (prefers-reduced-motion: reduce) {
  .pc-action { transition: background 0.2s ease, color 0.2s ease; }
  .pc-action:active { transform: none; }
}
`
