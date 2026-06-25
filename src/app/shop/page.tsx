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

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string | string[] }>
}) {
  const cookieStore = await cookies()
  const brandKey: BrandKey = cookieStore.get('ww-brand')?.value === 'sfw' ? 'sfw' : 'ht'
  const products = await getProductsByBrand(brandKey)
  const sections = sectionsForBrand(products)

  // Seed the species filter from a homepage deep-link (/shop?species=Walnut). Only honor
  // a value that matches a species actually in this brand's inventory, so a stale or hand
  // -typed link never lands on a confusing empty grid.
  const sp = await searchParams
  const speciesParam = Array.isArray(sp.species) ? sp.species[0] : sp.species
  const inStockSpecies = new Set(products.map((p) => p.species).filter((s): s is string => s !== null))
  const initialSpecies = speciesParam && inStockSpecies.has(speciesParam) ? [speciesParam] : []

  return <ShopClient products={products} sections={sections} initialSpecies={initialSpecies} />
}
