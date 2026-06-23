/**
 * Read-only bridge to the live Squarespace store (www.hillsidetimber.com).
 *
 * Johan manages all inventory in Squarespace. This site reads it through the
 * public `?format=json-pretty` collection feed (no API key required) and
 * normalizes it into a source-agnostic `Product` shape that the shop, gallery,
 * and home sections consume. Buying happens on Squarespace, so every product
 * carries a `productUrl` that links back to its Squarespace product page.
 *
 * The feed is undocumented but stable. If it ever changes, the hardened
 * fallback is the official Squarespace Commerce API (needs a Commerce plan).
 */

export type BrandKey = 'ht' | 'sfw'

export interface Product {
  id: string
  /** Cleaned title: species/descriptor with the dimensions and "(SKU)" stripped. */
  name: string
  /** Squarespace SKU, shown to shoppers as the "Piece No." (e.g. "BK-112525-2"). */
  sku: string
  /** Parsed dimension string, e.g. `28" × 35" × 2"`. Empty when the title has none. */
  dimensions: string
  /** Store sections this piece belongs to (e.g. "Live Edge Slabs", "Coming Soon"). */
  sections: string[]
  /** True when the piece sits in the Squarespace "Coming Soon" category (green / drying). */
  drying: boolean
  priceCents: number
  salePriceCents: number | null
  onSale: boolean
  images: string[]
  description: string
  inStock: boolean
  /** Absolute URL of the piece on the Squarespace store, where checkout works. */
  productUrl: string
  brand: BrandKey
  /** Squarespace "starred" flag, used to drive the Our Top Picks section. */
  starred: boolean
}

const SS_BASE = 'https://www.hillsidetimber.com'
const REVALIDATE_SECONDS = 600

/** A store collection (or category) to read, with the metadata it confers. */
interface Source {
  path: string
  brand: BrandKey
  section?: string
  drying?: boolean
}

/**
 * The wood-slabs store maps to Hillside Timber, its categories become shop
 * sections, and "Coming Soon" is Johan's green/drying bucket. Finished Items
 * maps to Sioux Falls Woodworking.
 */
const SOURCES: Source[] = [
  { path: '/wood-slabs', brand: 'ht' },
  { path: '/wood-slabs/live-edge-slabs', brand: 'ht', section: 'Live Edge Slabs' },
  { path: '/wood-slabs/rounds', brand: 'ht', section: 'Rounds' },
  { path: '/wood-slabs/mantels', brand: 'ht', section: 'Mantels' },
  { path: '/wood-slabs/coming-soon', brand: 'ht', section: 'Coming Soon', drying: true },
  { path: '/blanks-burls-billets', brand: 'ht', section: 'Blanks, Burls & Billets' },
  { path: '/finished-items-store', brand: 'sfw' },
]

// ─── Raw feed shapes (only the fields we read) ───

interface RawMoney {
  value?: string
  currency?: string
}

interface RawVariant {
  sku?: string
  priceMoney?: RawMoney
  salePriceMoney?: RawMoney
  onSale?: boolean
  qtyInStock?: number
  unlimited?: boolean
}

interface RawItem {
  id: string
  title?: string
  body?: string
  excerpt?: string
  fullUrl?: string
  assetUrl?: string
  starred?: boolean
  priceCents?: number
  salePriceCents?: number
  onSale?: boolean
  variants?: RawVariant[]
  items?: { assetUrl?: string }[]
}

interface RawFeed {
  items?: RawItem[]
  pagination?: { nextPage?: boolean; nextPageOffset?: number }
}

// ─── Parsing helpers ───

const DIMENSION_RE = /\d[\d.\s/]*[”"″]\s*[x×X]\s*\d[\d.\s/]*[”"″](?:\s*[x×X]\s*\d[\d.\s/]*[”"″])?/

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&rsquo;|&apos;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Pull a `28"x35"x2"`-style token from the title and present it as `28" × 35" × 2"`. */
function parseDimensions(title: string): string {
  const match = title.match(DIMENSION_RE)
  if (!match) return ''
  return match[0]
    .replace(/[”″]/g, '"')
    .replace(/\s*[x×X]\s*/g, ' × ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Title minus the trailing "(SKU)" and the dimensions, leaving the species/descriptor. */
function cleanName(title: string): string {
  return title
    .replace(/\(([^)]*)\)\s*$/, '')
    .replace(DIMENSION_RE, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function skuFromTitle(title: string): string {
  const match = title.match(/\(([^)]+)\)\s*$/)
  return match ? match[1].trim() : ''
}

/**
 * Prefer the per-product gallery images (`items[].assetUrl`), which resolve to the
 * high-res content CDN, over the item-level `assetUrl` (a low-res redirect). Add a
 * sizing param so the CDN delivers a crisp, right-sized image.
 */
function sizeImage(url: string): string {
  if (url.includes('images.squarespace-cdn.com') && !/[?&]format=/.test(url)) {
    return `${url}?format=1000w`
  }
  return url
}

/** Squarespace money objects carry a dollar string (e.g. "410.00"); convert to cents. */
function moneyToCents(money?: RawMoney): number | null {
  if (!money?.value) return null
  const n = parseFloat(money.value)
  return Number.isNaN(n) ? null : Math.round(n * 100)
}

function normalize(raw: RawItem, source: Source): Product {
  const title = (raw.title ?? '').trim()
  const variant = raw.variants?.[0]
  const sku = (variant?.sku || skuFromTitle(title) || '').trim()

  const cdnImages = (raw.items ?? [])
    .map((i) => i.assetUrl)
    .filter((u): u is string => !!u)
    .map(sizeImage)
  const images = cdnImages.length > 0
    ? Array.from(new Set(cdnImages))
    : raw.assetUrl ? [raw.assetUrl] : []

  // Pricing lives on the first sellable variant; the item-level fields are a fallback.
  const priceCents = moneyToCents(variant?.priceMoney) ?? raw.priceCents ?? 0
  const onSale = !!variant?.onSale || !!raw.onSale
  const salePriceCents = onSale
    ? moneyToCents(variant?.salePriceMoney) ?? raw.salePriceCents ?? null
    : null

  const inStock = variant ? !!variant.unlimited || (variant.qtyInStock ?? 0) > 0 : true

  return {
    id: raw.id,
    name: cleanName(title) || title,
    sku,
    dimensions: parseDimensions(title),
    sections: source.section ? [source.section] : [],
    drying: !!source.drying,
    priceCents,
    salePriceCents,
    onSale,
    images,
    description: stripHtml(raw.excerpt || raw.body || ''),
    inStock,
    productUrl: raw.fullUrl ? `${SS_BASE}${raw.fullUrl}` : SS_BASE,
    brand: source.brand,
    starred: !!raw.starred,
  }
}

// ─── Feed fetching ───

async function fetchSource(source: Source): Promise<{ raw: RawItem; source: Source }[]> {
  const out: { raw: RawItem; source: Source }[] = []
  let offset: number | undefined
  // Guard against an unexpected pagination loop on the public feed.
  for (let page = 0; page < 25; page++) {
    const url = `${SS_BASE}${source.path}?format=json-pretty${offset ? `&offset=${offset}` : ''}`
    let feed: RawFeed
    try {
      const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
      if (!res.ok) break
      feed = (await res.json()) as RawFeed
    } catch {
      break
    }
    for (const raw of feed.items ?? []) {
      if (raw?.id) out.push({ raw, source })
    }
    if (!feed.pagination?.nextPage || feed.pagination.nextPageOffset == null) break
    offset = feed.pagination.nextPageOffset
  }
  return out
}

/**
 * Read every configured collection, merge by product id (a piece can sit in
 * several categories), and return the normalized catalog. Sections and the
 * drying flag accumulate across the category feeds.
 */
export async function getSquarespaceProducts(): Promise<Product[]> {
  const batches = await Promise.all(SOURCES.map(fetchSource))
  const byId = new Map<string, Product>()

  for (const batch of batches) {
    for (const { raw, source } of batch) {
      const existing = byId.get(raw.id)
      if (existing) {
        if (source.section && !existing.sections.includes(source.section)) {
          existing.sections.push(source.section)
        }
        if (source.drying) existing.drying = true
      } else {
        byId.set(raw.id, normalize(raw, source))
      }
    }
  }

  return Array.from(byId.values())
}

export async function getProductsByBrand(brand: BrandKey): Promise<Product[]> {
  const all = await getSquarespaceProducts()
  return all.filter((p) => p.brand === brand)
}

/** Distinct section tabs present for a brand, in store order, with "All" first. */
export function sectionsForBrand(products: Product[]): string[] {
  const order = ['Live Edge Slabs', 'Rounds', 'Mantels', 'Blanks, Burls & Billets', 'Coming Soon']
  const present = new Set(products.flatMap((p) => p.sections))
  return ['All', ...order.filter((s) => present.has(s))]
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Pure selectors. The caller fetches the catalog once (getSquarespaceProducts) and
// derives every home view from it, so the ~300 products normalize a single time per request.

/** Random, in-stock, photographed pieces for the home gallery (reshuffles per request). */
export function pickRandom(products: Product[], count: number): Product[] {
  return shuffle(products.filter((p) => p.images.length > 0 && p.inStock)).slice(0, count)
}

/** Highest-value, in-stock, non-drying pieces for "Our Top Picks". */
export function pickTopPicks(products: Product[], count: number): Product[] {
  return products
    .filter((p) => p.inStock && !p.drying && p.priceCents > 0 && p.images.length > 0)
    .sort((a, b) => b.priceCents - a.priceCents)
    .slice(0, count)
}

/** On-sale, photographed pieces for the "On Sale" showcase. */
export function pickOnSale(products: Product[], count: number): Product[] {
  return shuffle(products.filter((p) => p.onSale && p.salePriceCents != null && p.images.length > 0)).slice(0, count)
}
