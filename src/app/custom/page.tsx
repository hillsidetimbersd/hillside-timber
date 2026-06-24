import type { Metadata } from 'next'
import { getSquarespaceProducts, toPiecePreview } from '@/lib/squarespace'
import CustomPageClient from './CustomPageClient'

export const metadata: Metadata = {
  title: 'Custom Projects · Sioux Falls Woodworking',
}

// Pulls live inventory so the project form can reference real Piece No.s.
export const dynamic = 'force-dynamic'

export default async function CustomPage() {
  const all = await getSquarespaceProducts()
  const pieces = all.filter((p) => p.sku && p.images.length > 0).map(toPiecePreview)
  return <CustomPageClient pieces={pieces} />
}
