/**
 * Best-effort in-memory fixed-window rate limiter for the public form endpoints.
 *
 * On serverless this state lives per instance, so it is a speed bump against scripted
 * abuse and accidental double-submits, not a hard global guarantee. A durable limiter
 * (Vercel KV / Upstash) is the upgrade path if real abuse appears; this is adequate for
 * a low-traffic contact/inquiry form and adds no dependencies.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Drop expired buckets so the map cannot grow without bound under unique-IP traffic. */
function sweep(now: number): void {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  /** Seconds until the window resets, for a Retry-After header. */
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    sweep(now)
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSeconds: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }

  bucket.count++
  return { ok: true, retryAfterSeconds: 0 }
}

/** The caller's IP from the proxy headers Vercel sets, or 'unknown' as a shared fallback. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}
