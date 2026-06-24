import type { Metadata } from 'next'
import { getSquarespaceProducts, toPiecePreview } from '@/lib/squarespace'
import FaqClient from './FaqClient'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about ordering, shipping, custom work, drying, and caring for live edge slabs from Hillside Timber.',
}

// Pulls live inventory so the "Ask us" form can attach real Piece No.s.
export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const all = await getSquarespaceProducts()
  const pieces = all.filter((p) => p.sku && p.images.length > 0).map(toPiecePreview)
  return <FaqClient pieces={pieces} />
}
