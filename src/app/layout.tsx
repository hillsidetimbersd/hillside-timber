import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Barlow_Condensed, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { BrandProvider } from '@/components/brand/BrandContext'
import BrandSwitcher from '@/components/brand/BrandSwitcher'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import { getBrand } from '@/lib/brand'

const barlowCondensed = Barlow_Condensed({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const brandKey = cookieStore.get('ww-brand')?.value ?? 'ht'
  const brand = getBrand(brandKey)

  // Resolve links and preview images against the address people actually open:
  // the live Vercel URL today, a custom domain automatically once one is added,
  // and the brand domain when running locally.
  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `https://${brand.domain}`

  const description = `${brand.name}. ${brand.heroSub}`
  const previewImage = '/assets/photos/founder.jpg'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: brand.name,
      // Per-page titles are just the page name; the brand is appended here once, with
      // the current brand. Pages must NOT hardcode the brand or it doubles.
      template: `%s · ${brand.name}`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title: brand.name,
      description,
      url: '/',
      images: [{ url: previewImage, alt: `${brand.name}, live-edge slabs in South Dakota` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: brand.name,
      description,
      images: [previewImage],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const brandKey = cookieStore.get('ww-brand')?.value ?? 'ht'

  return (
    <html lang="en" className={`${barlowCondensed.variable} ${sourceSerif.variable}`}>
      <body>
        <BrandProvider brand={brandKey}>
          <BrandSwitcher />
          <Nav />
          <main>
            {children}
          </main>
          <Footer />
        </BrandProvider>
      </body>
    </html>
  )
}
