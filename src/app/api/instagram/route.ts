import { NextResponse } from 'next/server'

// Behold.so feed — sort order is configured in the Behold dashboard (set to "Most Liked")
// Feed URL format: https://feeds.behold.so/{FEED_ID}

interface BeholdPost {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  timestamp: string
  caption?: string
}

export async function GET() {
  const feedUrl = process.env.BEHOLD_FEED_URL

  if (!feedUrl) {
    return NextResponse.json({ posts: [], configured: false })
  }

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } })

    if (!res.ok) {
      console.error('[instagram] Behold fetch error:', res.status)
      return NextResponse.json({ posts: [], configured: true, error: 'fetch_error' })
    }

    const data: BeholdPost[] = await res.json()

    const posts = data.slice(0, 6).map((post) => ({
      id: post.id,
      src: post.mediaType === 'VIDEO' ? (post.thumbnailUrl ?? post.mediaUrl) : post.mediaUrl,
      permalink: post.permalink,
    }))

    return NextResponse.json({ posts, configured: true })
  } catch (err) {
    console.error('[instagram] Behold fetch failed:', err)
    return NextResponse.json({ posts: [], configured: true, error: 'fetch_failed' })
  }
}
