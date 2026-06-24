/**
 * Read-only bridge to the two service photos on the live Squarespace "Our Services"
 * page (www.hillsidetimber.com/our-services): the milling slab-stack shot and the
 * flattening-table shot. Mirrors the approach in `portfolio.ts`.
 *
 * The page lists Custom Milling first, then Slab Flattening, so the photos are
 * matched by page order. The two known CDN assets are kept as a fallback so the
 * page never renders empty, and the live fetch lets Johan swap a photo on
 * Squarespace without a code change. Size at the call site with `sizeServiceImage`.
 */

const SS_BASE = 'https://www.hillsidetimber.com'
const SERVICES_PATH = '/our-services'
const REVALIDATE_SECONDS = 3600

const SS_CONTENT = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872'

// Verified assets: P1023394 is stacked live-edge slabs (milling); P1034571 is the
// operator at the flattening table (flattening).
const FALLBACK: ServicePhotos = {
  milling: `${SS_CONTENT}/3875eb50-8a33-43c4-af58-77e1d035d34e/P1023394.jpg`,
  flattening: `${SS_CONTENT}/697f79d8-101f-4df9-983d-9454b9b3082b/P1034571.jpg`,
}

export interface ServicePhotos {
  /** Bare CDN URL for the custom-milling photo. */
  milling: string
  /** Bare CDN URL for the slab-flattening photo. */
  flattening: string
}

/** Squarespace content CDN photos (jpg/jpeg), captured clean (no query string). */
const ASSET_RE = /https:\/\/images\.squarespace-cdn\.com\/content\/[^\s"'<>\\?]+?\.jpe?g/gi

function clean(url: string): string {
  const i = url.indexOf('?')
  return i === -1 ? url : url.slice(0, i)
}

/** Append a Squarespace CDN sizing param so callers can request crisp widths. */
export function sizeServiceImage(url: string, width: number): string {
  if (!url.includes('images.squarespace-cdn.com')) return url
  return `${url}?format=${width}w`
}

/**
 * Read the two service photos from the live page in DOM order (milling first,
 * flattening second), dropping the logo. Any failure degrades to the known assets.
 */
export async function getServicePhotos(): Promise<ServicePhotos> {
  try {
    const res = await fetch(`${SS_BASE}${SERVICES_PATH}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; HillsideTimberSite/1.0)' },
    })
    if (!res.ok) return FALLBACK

    const html = await res.text()
    const seen = new Set<string>()
    const photos: string[] = []
    for (const raw of html.match(ASSET_RE) ?? []) {
      const url = clean(raw)
      if (/logo/i.test(url)) continue
      if (seen.has(url)) continue
      seen.add(url)
      photos.push(url)
    }

    return {
      milling: photos[0] ?? FALLBACK.milling,
      flattening: photos[1] ?? FALLBACK.flattening,
    }
  } catch {
    return FALLBACK
  }
}
