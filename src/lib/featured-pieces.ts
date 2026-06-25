/**
 * Curated source for the SFW homepage "Recent Work" mosaic.
 *
 * Images come live from the Squarespace portfolio (matched by slug) so the
 * section never goes stale; the slot and eyebrow are curated here because the
 * feed carries neither species/finish nor a layout intent. If a pinned slug ever
 * leaves the portfolio, the stored cover keeps the card from blanking.
 *
 * To reorder or swap a piece, edit `FEATURED`. The first entry is the hero, the
 * second is the tall portrait accent, the rest are tiles (the last collapses to
 * a band on tablet and is hidden on mobile).
 */

import { getPortfolioCovers, sizePortfolioImage } from './portfolio'

export type FeaturedSlot = 'hero' | 'portrait' | 'tile'

export interface FeaturedPiece {
  slug: string
  title: string
  /** Species and form, drawn from the title (the feed has no finish/dimensions). */
  eyebrow: string
  slot: FeaturedSlot
  /** CDN cover, already sized for its cell. */
  cover: string
  href: string
}

interface FeaturedConfig {
  slug: string
  slot: FeaturedSlot
  eyebrow: string
  /** CDN request width for this cell. */
  width: number
  /** Used only if the slug is missing from the live feed. */
  fallbackTitle: string
  fallbackCover: string
}

const CDN = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872'

// Six of the seven live portfolio pieces, ordered for the mosaic.
const FEATURED: FeaturedConfig[] = [
  {
    slug: 'black-walnut-bookmatch-statement-table',
    slot: 'hero',
    eyebrow: 'Black Walnut · Bookmatched',
    width: 1600,
    fallbackTitle: 'Black Walnut Bookmatch Statement Table',
    fallbackCover: `${CDN}/a30f735d-dd5c-4317-8f6c-422f52cd9747/DSC_9656.JPG`,
  },
  {
    slug: 'crimson-king-angel-table',
    slot: 'portrait',
    eyebrow: 'Crimson King Maple',
    width: 1100,
    fallbackTitle: 'Crimson King Angel Table',
    fallbackCover: `${CDN}/0c116535-8976-4f17-b706-2e1f20012f93/P1034755.jpg`,
  },
  {
    slug: 'ash-bookmatch-conference-table',
    slot: 'tile',
    eyebrow: 'Ash · Bookmatched',
    width: 1000,
    fallbackTitle: 'Ash Bookmatch Conference Table',
    fallbackCover: `${CDN}/f26aacce-8693-494b-b59f-6882909d5b8b/P1034352.jpg`,
  },
  {
    slug: 'live-edge-walnut-table',
    slot: 'tile',
    eyebrow: 'Walnut · Live Edge',
    width: 1000,
    fallbackTitle: 'Live Edge Walnut Table',
    fallbackCover: `${CDN}/38ec4cfd-0a25-4b2d-aee8-1747d685739c/P1011745.jpeg`,
  },
  {
    slug: 'quilted-cottonwood-table',
    slot: 'tile',
    eyebrow: 'Quilted Cottonwood',
    width: 1000,
    fallbackTitle: 'Quilted Cottonwood Table',
    fallbackCover: `${CDN}/19533975-3747-4e5d-bc1f-389843f8d318/P1034507.jpg`,
  },
  {
    slug: 'maple-and-walnut-pen-holders',
    slot: 'tile',
    eyebrow: 'Maple & Walnut · Small Batch',
    width: 1000,
    fallbackTitle: 'Maple and Walnut Pen Holders',
    fallbackCover: `${CDN}/bc241602-7bfd-4644-8784-4806ecc04751/DSC_9626.jpeg`,
  },
]

/**
 * Merge the curated config with the live portfolio: live cover when the slug is
 * present, stored cover otherwise. Always returns the full curated set in order.
 */
export async function getFeaturedPieces(): Promise<FeaturedPiece[]> {
  let covers: Awaited<ReturnType<typeof getPortfolioCovers>> = []
  try {
    covers = await getPortfolioCovers()
  } catch {
    covers = []
  }
  const bySlug = new Map(covers.map((c) => [c.slug, c]))

  return FEATURED.map((cfg) => {
    const live = bySlug.get(cfg.slug)
    const rawCover = live?.cover || cfg.fallbackCover
    return {
      slug: cfg.slug,
      title: live?.title || cfg.fallbackTitle,
      eyebrow: cfg.eyebrow,
      slot: cfg.slot,
      cover: sizePortfolioImage(rawCover, cfg.width),
      href: '/gallery',
    }
  })
}
