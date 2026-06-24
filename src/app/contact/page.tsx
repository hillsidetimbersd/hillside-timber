import type { Metadata } from 'next'
import { getSquarespaceProducts, toPiecePreview } from '@/lib/squarespace'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about a slab, a custom piece, or a question. Call, email, or send the details and we will follow up.',
}

// Pulls live inventory so the piece picker can search real Piece No.s.
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const all = await getSquarespaceProducts()
  const pieces = all.filter((p) => p.sku && p.images.length > 0).map(toPiecePreview)
  return <ContactClient pieces={pieces} />
}
