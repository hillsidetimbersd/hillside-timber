import { cookies } from 'next/headers'
import { getProductsByBrand, sectionsForBrand, type BrandKey } from '@/lib/squarespace'
import ShopClient from './ShopClient'

// Inventory reflects the live Squarespace store, so render per request.
export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const cookieStore = await cookies()
  const brandKey: BrandKey = cookieStore.get('ww-brand')?.value === 'sfw' ? 'sfw' : 'ht'
  const products = await getProductsByBrand(brandKey)
  const sections = sectionsForBrand(products)

  return <ShopClient products={products} sections={sections} />
}
