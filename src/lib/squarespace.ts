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
  /** Store sections this piece belongs to (e.g. "Live Edge Slabs", "Still Drying"). */
  sections: string[]
  /** True when the piece is in Johan's Squarespace "Coming Soon" collection (shown on-site as "Still Drying" / green). */
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
 * sections, and the "Coming Soon" collection is his green / still drying bucket. Finished Items
 * maps to Sioux Falls Woodworking.
 */
const SOURCES: Source[] = [
  { path: '/wood-slabs', brand: 'ht' },
  { path: '/wood-slabs/live-edge-slabs', brand: 'ht', section: 'Live Edge Slabs' },
  { path: '/wood-slabs/rounds', brand: 'ht', section: 'Rounds' },
  { path: '/wood-slabs/mantels', brand: 'ht', section: 'Mantels' },
  { path: '/wood-slabs/coming-soon', brand: 'ht', section: 'Still Drying', drying: true },
  { path: '/blanks-burls-billets', brand: 'ht', section: 'Blanks, Burls & Billets' },
  { path: '/finished-items-store', brand: 'sfw' },
  // PHASE 2 (blocked on owner): Sioux Falls Woodworking has only the single
  // /finished-items-store feed today, so its shop shows just "All". When the
  // owner provides the real SFW sub-collection URLs and their category names,
  // add one Source per sub-collection here, mirroring the HT wood-slab rows
  // above. Shape (slug + label are placeholders, get the real ones from the owner):
  //   { path: '/finished-items-store/<sub-collection-slug>', brand: 'sfw', section: '<Category Name>' },
  // Each `section` then becomes a sidebar tab automatically (sectionsForBrand is
  // brand-aware and hides empty categories). Do not invent these paths.
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

/**
 * Title minus the dimensions and the SKU, leaving the species/descriptor.
 * Roughly 40% of titles append the SKU bare (e.g. "Black Walnut BW5525-7") rather
 * than parenthesized, so we strip the known SKU wherever it sits, not just a
 * trailing "(...)". This keeps the name clean so the SKU can be shown on its own
 * as the "Piece No." without printing the same code twice.
 */
function cleanName(title: string, sku = ''): string {
  let name = title
    .replace(/\(([^)]*)\)\s*$/, '')
    .replace(DIMENSION_RE, '')
  if (sku) {
    const esc = sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    name = name.replace(new RegExp(`\\(?\\s*${esc}\\s*\\)?`, 'ig'), ' ')
  }
  return name.replace(/\s{2,}/g, ' ').trim()
}

/**
 * The buyer-facing piece code as written in the title. Most titles end with the
 * code parenthesized, e.g. "… (BK-112525-2)"; about a tenth append it bare, e.g.
 * "Black Walnut Round BW071423-3". Dimensions are dropped first so a measurement
 * is never mistaken for the code. A code is 1-4 letters then digits.
 */
function pieceCodeFromTitle(title: string): string {
  const t = title.replace(DIMENSION_RE, ' ')
  const paren = t.match(/\(([^)]+)\)\s*$/)
  if (paren) return paren[1].trim()
  const bare = t.trim().match(/(?:^|\s)([A-Za-z]{1,4}-?\d[\w-]*)$/)
  return bare ? bare[1] : ''
}

/** Square's auto-generated SKUs (e.g. "SQ1609285") are internal ids, not the
 *  shop's buyer-facing piece code, so they never get shown as a "Piece No.". */
function isSquareAutoId(s: string): boolean {
  return /^SQ\d{5,}$/i.test(s)
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
  // Prefer the human code written in the title. Only fall back to the variant's
  // SKU when the title carries no code and that SKU isn't a Square auto-id.
  const titleCode = pieceCodeFromTitle(title)
  const variantSku = (variant?.sku ?? '').trim()
  const sku = titleCode || (isSquareAutoId(variantSku) ? '' : variantSku)

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
    name: cleanName(title, sku) || title,
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

/**
 * Canonical category order per brand. Sections present on a brand's pieces but
 * not listed here are appended in first-seen order, so a newly-sourced
 * sub-collection becomes a tab the moment its products carry a `section`, with
 * no code change. "Still Drying" always sorts last.
 */
const SECTION_ORDER: Record<BrandKey, string[]> = {
  ht: ['Live Edge Slabs', 'Rounds', 'Mantels', 'Blanks, Burls & Billets', 'Still Drying'],
  // SFW has no categorized sub-collections yet (see the PHASE 2 note on SOURCES).
  // Real categories will order themselves here automatically once sourced.
  sfw: [],
}

const DRYING_SECTION = 'Still Drying'

/**
 * Section tabs for a brand, with "All" first and empty categories hidden.
 * Brand-aware: the brand's canonical order leads, any sections present but not
 * in that order follow in first-seen order, and the drying bucket pins last.
 */
export function sectionsForBrand(products: Product[]): string[] {
  // Every piece handed here shares one brand (the caller filters by brand first).
  const preferred = SECTION_ORDER[products[0]?.brand ?? 'ht'] ?? []

  // Sections actually present, in the order the pieces first introduce them.
  const present: string[] = []
  for (const p of products) {
    for (const s of p.sections) {
      if (!present.includes(s)) present.push(s)
    }
  }
  const isPresent = (s: string) => present.includes(s)

  const ordered = [
    ...preferred.filter((s) => s !== DRYING_SECTION && isPresent(s)),
    ...present.filter((s) => s !== DRYING_SECTION && !preferred.includes(s)),
  ]
  if (isPresent(DRYING_SECTION)) ordered.push(DRYING_SECTION)

  return ['All', ...ordered]
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

/** On-sale, photographed pieces for the "On Sale" showcase. Excludes sold pieces
 *  (a piece can carry a sale price yet already be gone) — only show what's buyable. */
export function pickOnSale(products: Product[], count: number): Product[] {
  return shuffle(
    products.filter(
      (p) => p.onSale && p.salePriceCents != null && p.images.length > 0 && (p.inStock || p.drying),
    ),
  ).slice(0, count)
}

/** A trimmed product shape for the contact-form piece picker (keeps the client payload small). */
export interface PiecePreview {
  id: string
  sku: string
  name: string
  dimensions: string
  image: string
  section: string
  priceLabel: string
  drying: boolean
  productUrl: string
}

export function toPiecePreview(p: Product): PiecePreview {
  const cents = p.onSale && p.salePriceCents ? p.salePriceCents : p.priceCents
  const section = p.sections.find((s) => s !== 'Still Drying') ?? (p.brand === 'sfw' ? 'Finished Piece' : 'Wood Slab')
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    dimensions: p.dimensions,
    image: p.images[0] ?? '',
    section,
    priceLabel: cents > 0 ? `$${Math.round(cents / 100).toLocaleString()}` : 'Inquire for price',
    drying: p.drying,
    productUrl: p.productUrl,
  }
}
