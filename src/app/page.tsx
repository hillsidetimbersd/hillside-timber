import { cookies } from 'next/headers'
import { getSquarespaceProducts, pickRandom, pickTopPicks, pickOnSale } from '@/lib/squarespace'
import ParallaxHero from '@/components/home/ParallaxHero'
import GalleryScroll from '@/components/home/GalleryScroll'
import TopPicks from '@/components/home/TopPicks'
import OnSaleShowcase from '@/components/home/OnSaleShowcase'
import EcoPoxySection from '@/components/home/EcoPoxySection'
import VendorTicker from '@/components/home/VendorTicker'
import ReviewsSection from '@/components/home/ReviewsSection'
import InstagramFeed from '@/components/home/InstagramFeed'
import SpeciesLibrary from '@/components/home/SpeciesLibrary'
import SolarKilnStory from '@/components/home/SolarKilnStory'
import FeaturedPieces from '@/components/home/FeaturedPieces'
import ProcessStrip from '@/components/home/ProcessStrip'
import CustomCtaStrip from '@/components/home/CustomCtaStrip'
import FreightStrip from '@/components/home/FreightStrip'

// The home gallery pulls random live inventory and reshuffles on each visit.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const cookieStore = await cookies()
  const brandKey = cookieStore.get('ww-brand')?.value ?? 'ht'

  if (brandKey === 'sfw') {
    return (
      <>
        <ParallaxHero />
        <FreightStrip />
        <VendorTicker />
        <FeaturedPieces />
        <ProcessStrip />
        <CustomCtaStrip />
        <ReviewsSection />
        <InstagramFeed />
      </>
    )
  }

  // Fetch the catalog once, derive every product-driven home view from it.
  const all = await getSquarespaceProducts()
  const ht = all.filter((p) => p.brand === 'ht')

  return (
    <>
      <GalleryScroll products={pickRandom(ht, 15)} />
      <TopPicks products={pickTopPicks(ht, 4)} />
      <FreightStrip />
      <VendorTicker />
      <SpeciesLibrary />
      <OnSaleShowcase products={pickOnSale(ht, 8)} />
      <SolarKilnStory />
      <EcoPoxySection />
      <ReviewsSection />
      <InstagramFeed />
    </>
  )
}
