import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getProductsByBrand, sectionsForBrand, type BrandKey } from '@/lib/squarespace'
import ShopClient from './ShopClient'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse live edge slabs, rounds, mantels, burls, and turning blanks. Live inventory, 24+ species, priced and ready.',
}

// Inventory reflects the live Squarespace store, so render per request.
export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const cookieStore = await cookies()
  const brandKey: BrandKey = cookieStore.get('ww-brand')?.value === 'sfw' ? 'sfw' : 'ht'
  const products = await getProductsByBrand(brandKey)
  const sections = sectionsForBrand(products)

  return <ShopClient products={products} sections={sections} />
}
