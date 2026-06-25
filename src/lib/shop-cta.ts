import type { Product } from '@/lib/squarespace'

// NOTE: this lives in its own file (not squarespace.ts) only because the catalog
// bridge was being edited in parallel by the cart/checkout spine when the PDP was
// built. It can fold into squarespace.ts later. It imports the Product type only.

/** The store's "not priced yet" placeholder ($9,999.99 in cents). normalize() already
 *  maps it to 0, so this is belt-and-suspenders in case a raw price ever slips through. */
const PLACEHOLDER_PRICE_CENTS = 999999

/** Whether a piece carries a real, sellable price (not 0 and not the placeholder). */
export function hasRealPrice(product: Product): boolean {
  return product.priceCents > 0 && product.priceCents !== PLACEHOLDER_PRICE_CENTS
}

/** The single shopper-facing call to action for a piece. */
export type CtaState = 'addToCart' | 'inquire' | 'inquireForPrice' | 'sold'

/**
 * Collapse a piece's buyability into one CTA state, so the PDP and the grid card
 * render from one source of truth. `sold` is the seam for the future Supabase
 * availability overlay (reserved or sold from `piece_availability`); until that
 * lands, sold is derived from the catalog (out of stock and not still drying).
 */
export function getCtaState(product: Product, opts: { sold?: boolean } = {}): CtaState {
  const sold = opts.sold ?? (!product.inStock && !product.drying)
  if (sold) return 'sold'
  if (product.drying) return 'inquire'
  if (!hasRealPrice(product)) return 'inquireForPrice'
  return 'addToCart'
}
