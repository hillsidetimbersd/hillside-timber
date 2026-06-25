'use client'

import Link from 'next/link'
import { ShoppingBag, Check, ChatCircle } from '@phosphor-icons/react'
import { useCart, type CartItem } from '@/components/cart/useCart'
import type { CtaState } from '@/lib/shop-cta'

/** The cart's item shape, minus the quantity it assigns itself. */
type CartPiece = Omit<CartItem, 'qty'>

/**
 * The PDP call to action, rendered from one computed `ctaState`. Only the
 * "Add to cart" branch is interactive; the inquire and sold branches are links
 * and a disabled chip. The future reserved/sold overlay just changes `ctaState`.
 */
export default function ProductCta({
  ctaState,
  piece,
  inquiryHref,
}: {
  ctaState: CtaState
  piece: CartPiece
  inquiryHref: string
}) {
  const { addItem, items } = useCart()

  if (ctaState === 'sold') {
    return (
      <div className="pdp-cta-block">
        <span className="pdp-cta pdp-cta--disabled" aria-disabled="true">Sold</span>
        <p className="pdp-cta-note">
          This one found a home. Browse the shop for what is still available, or ask about something similar.
        </p>
        <div className="pdp-cta-sub">
          <Link href="/shop" className="pdp-ghost">Browse the shop</Link>
          <a href={inquiryHref} className="pdp-ghost">Ask about a similar piece</a>
        </div>
      </div>
    )
  }

  if (ctaState === 'inquire') {
    return (
      <div className="pdp-cta-block">
        <a href={inquiryHref} className="pdp-cta pdp-cta--green">
          <ChatCircle size={17} weight="bold" /> Inquire
        </a>
        <p className="pdp-cta-note">
          Still drying in our solar kiln. Inquire to reserve it now, or claim it when it is ready.
        </p>
      </div>
    )
  }

  if (ctaState === 'inquireForPrice') {
    return (
      <div className="pdp-cta-block">
        <a href={inquiryHref} className="pdp-cta pdp-cta--green">
          <ChatCircle size={17} weight="bold" /> Inquire for price
        </a>
        <p className="pdp-cta-note">
          This piece is not priced online yet. Send a note and we will get you a number.
        </p>
      </div>
    )
  }

  // addToCart. Each piece is one of a kind (quantity 1), so once it is in the cart we
  // disable the button rather than let a second click push the cart's qty to 2.
  const inCart = items.some((i) => i.id === piece.id)

  function handleAdd() {
    // CONTRACT: cart addItem(piece)
    addItem(piece)
  }

  return (
    <div className="pdp-cta-block">
      <button
        type="button"
        onClick={handleAdd}
        disabled={inCart}
        aria-live="polite"
        className={`pdp-cta pdp-cta--black${inCart ? ' pdp-cta--added' : ''}`}
      >
        {inCart ? (
          <><Check size={18} weight="bold" /> In cart</>
        ) : (
          <><ShoppingBag size={17} weight="bold" /> Add to cart</>
        )}
      </button>
      <p className="pdp-cta-note">
        {inCart
          ? 'This piece is in your cart. It is one of a kind, so check out soon to make it yours.'
          : 'One of a kind. Secure checkout on our own site; freight or local delivery is arranged after the sale.'}
      </p>
    </div>
  )
}
