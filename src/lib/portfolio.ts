/**
 * Read-only bridge to the live Squarespace "Photo Gallery" portfolio
 * (www.hillsidetimber.com/photo-gallery).
 *
 * Johan curates finished-work projects in Squarespace as a portfolio collection.
 * Each project is one piece (a table, a set of pen holders) photographed many
 * times. This module reads that portfolio so the gallery page always mirrors the
 * real one, the same way `squarespace.ts` mirrors the store.
 *
 * Two reads are needed because the portfolio feed only carries each project's
 * cover:
 *   1. `/photo-gallery?format=json-pretty` → the list of projects + cover image.
 *   2. each project page's HTML → the full set of gallery photos (the feed's
 *      `body` is empty; the photos live in a Squarespace gallery block).
 *
 * Everything degrades gracefully: a failed project scrape falls back to just the
 * cover, and a failed feed returns an empty list (the page renders an empty
 * state). Images are returned as bare CDN asset URLs; size them at the call site
 * with `sizePortfolioImage` so cards stay light and the lightbox stays crisp.
 */

const SS_BASE = 'https://www.hillsidetimber.com'
const GALLERY_PATH = '/photo-gallery'
// Portfolios change rarely, so cache longer than the store feed.
const REVALIDATE_SECONDS = 3600

export interface PortfolioProject {
  id: string
  /** Project title, e.g. "Black Walnut Bookmatch Statement Table". */
  title: string
  /** A short, honest category derived from the title (e.g. "Custom Table"). */
  category: string
  /** URL slug, e.g. "black-walnut-bookmatch-statement-table". */
  slug: string
  /** Absolute URL of the project on the Squarespace site. */
  productUrl: string
  /** The cover photo (also the first entry in `images`). Bare CDN URL. */
  cover: string
  /** Every gallery photo, cover first, in page order. Bare CDN URLs. */
  images: string[]
  /** Number of photos (== images.length), shown as a "12 photos" cue. */
  count: number
}

// ─── Raw feed shapes (only the fields we read) ───

interface RawPortfolioItem {
  id: string
  title?: string
  urlId?: string
  fullUrl?: string
  assetUrl?: string
  recordTypeLabel?: string
}

interface RawPortfolioFeed {
  items?: RawPortfolioItem[]
  pagination?: { nextPage?: boolean; nextPageOffset?: number }
}

// ─── Parsing helpers ───

/** Squarespace content CDN photos (jpg/jpeg), captured clean (no query string). */
const ASSET_RE = /https:\/\/images\.squarespace-cdn\.com\/content\/[^\s"'<>\\?]+?\.jpe?g/gi

/** Drop any query string so the same asset (placeholder + full-res) dedupes to one. */
function clean(url: string): string {
  const i = url.indexOf('?')
  return i === -1 ? url : url.slice(0, i)
}

/** Last path segment (the upload filename). Used to dedupe the cover vs gallery. */
function fileName(url: string): string {
  const i = url.lastIndexOf('/')
  return i === -1 ? url : url.slice(i + 1)
}

/** Turn a title into a short, truthful category label for the card eyebrow. */
function categoryFromTitle(title: string): string {
  const t = title.toLowerCase()
  if (/conference/.test(t)) return 'Conference Table'
  if (/table/.test(t)) return 'Custom Table'
  if (/pen|holder|board|cutting|coaster|box/.test(t)) return 'Small-Batch Pieces'
  if (/mantel/.test(t)) return 'Mantel'
  return 'Finished Work'
}

/**
 * Append a Squarespace CDN sizing param. Callers pass a width so cards request a
 * small image and the lightbox requests a large one. URLs are bare, so this only
 * ever adds a single `?format=` param.
 */
export function sizePortfolioImage(url: string, width: number): string {
  if (!url.includes('images.squarespace-cdn.com')) return url
  return `${url}?format=${width}w`
}

/**
 * Pull every gallery photo URL from a project page. `excludeBases` carries the
 * covers of the *other* projects so the "next / previous project" thumbnails a
 * portfolio page links to never leak into this project's set.
 */
function extractImages(html: string, excludeBases: Set<string>): string[] {
  const matches = html.match(ASSET_RE) ?? []
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of matches) {
    const url = clean(raw)
    if (/logo/i.test(url)) continue
    if (excludeBases.has(url)) continue
    if (seen.has(url)) continue
    seen.add(url)
    out.push(url)
  }
  return out
}

// ─── Fetching ───

async function fetchPortfolioFeed(): Promise<RawPortfolioItem[]> {
  const out: RawPortfolioItem[] = []
  let offset: number | undefined
  // Guard against an unexpected pagination loop on the public feed.
  for (let page = 0; page < 10; page++) {
    const url = `${SS_BASE}${GALLERY_PATH}?format=json-pretty${offset ? `&offset=${offset}` : ''}`
    let feed: RawPortfolioFeed
    try {
      const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
      if (!res.ok) break
      feed = (await res.json()) as RawPortfolioFeed
    } catch {
      break
    }
    for (const it of feed.items ?? []) {
      if (it?.id && it.recordTypeLabel === 'portfolio-item') out.push(it)
    }
    if (!feed.pagination?.nextPage || feed.pagination.nextPageOffset == null) break
    offset = feed.pagination.nextPageOffset
  }
  return out
}

async function fetchProjectPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; HillsideTimberSite/1.0)' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export interface PortfolioCover {
  slug: string
  title: string
  /** Bare CDN cover URL; size it at the call site with `sizePortfolioImage`. */
  cover: string
}

/**
 * Lightweight read for callers that only need each project's cover (the homepage
 * "Recent Work" mosaic): one feed request, no per-project page scrape. Use
 * `getPortfolioProjects` instead when you need the full photo set (the gallery).
 */
export async function getPortfolioCovers(): Promise<PortfolioCover[]> {
  const items = await fetchPortfolioFeed()
  return items
    .map((it) => ({
      title: (it.title ?? '').trim(),
      slug: (it.fullUrl ?? '').split('/').filter(Boolean).pop() ?? '',
      cover: it.assetUrl ? clean(it.assetUrl) : '',
    }))
    .filter((p) => p.slug && p.cover)
}

/**
 * Read the portfolio: list its projects, then fetch each project page in
 * parallel to collect its full photo set. The cover is forced first so it is the
 * "main photo" the lightbox opens on. Projects with no resolvable photo are
 * dropped so the grid never renders an empty card.
 */
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const items = await fetchPortfolioFeed()

  const stubs = items.map((it) => ({
    id: it.id,
    title: (it.title ?? '').trim(),
    slug: (it.fullUrl ?? '').split('/').filter(Boolean).pop() ?? '',
    productUrl: it.fullUrl ? `${SS_BASE}${it.fullUrl}` : SS_BASE,
    fullUrl: it.fullUrl ?? '',
    coverBase: it.assetUrl ? clean(it.assetUrl) : '',
  }))

  const allCovers = new Set(stubs.map((s) => s.coverBase).filter(Boolean))

  const projects = await Promise.all(
    stubs.map(async (s): Promise<PortfolioProject> => {
      const otherCovers = new Set(allCovers)
      otherCovers.delete(s.coverBase) // keep this project's cover, drop neighbors'

      let gallery: string[] = []
      if (s.fullUrl) {
        const html = await fetchProjectPage(s.productUrl)
        if (html) gallery = extractImages(html, otherCovers)
      }

      // Open on Johan's curated cover (the feed's portfolio thumbnail), then the
      // rest of the shoot in page order. Squarespace stores the cover as its own
      // asset URL, so drop any gallery photo sharing the cover's filename to avoid
      // a duplicate first slide (camera filenames are unique within a project).
      const coverFile = fileName(s.coverBase)
      const rest = coverFile ? gallery.filter((g) => fileName(g) !== coverFile) : gallery
      const images = s.coverBase ? [s.coverBase, ...rest] : gallery

      return {
        id: s.id,
        title: s.title,
        category: categoryFromTitle(s.title),
        slug: s.slug,
        productUrl: s.productUrl,
        cover: images[0] ?? '',
        images,
        count: images.length,
      }
    }),
  )

  return projects.filter((p) => p.images.length > 0)
}
