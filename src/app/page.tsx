import { cookies } from 'next/headers'
import ParallaxHero from '@/components/home/ParallaxHero'
import GalleryScroll from '@/components/home/GalleryScroll'
import VendorTicker from '@/components/home/VendorTicker'
import ReviewsSection from '@/components/home/ReviewsSection'
import InstagramFeed from '@/components/home/InstagramFeed'
import SpeciesLibrary from '@/components/home/SpeciesLibrary'
import SolarKilnStory from '@/components/home/SolarKilnStory'
import FeaturedPieces from '@/components/home/FeaturedPieces'
import ProcessStrip from '@/components/home/ProcessStrip'
import CustomCtaStrip from '@/components/home/CustomCtaStrip'
import FreightStrip from '@/components/home/FreightStrip'

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

  return (
    <>
      <GalleryScroll />
      <FreightStrip />
      <VendorTicker />
      <SpeciesLibrary />
      <SolarKilnStory />
      <ReviewsSection />
      <InstagramFeed />
    </>
  )
}
