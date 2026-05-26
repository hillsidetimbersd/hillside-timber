import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Barlow_Condensed, Lora } from 'next/font/google'
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

const lora = Lora({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const brandKey = cookieStore.get('ww-brand')?.value ?? 'ht'
  const brand = getBrand(brandKey)

  return {
    title: {
      default: brand.name,
      template: `%s — ${brand.name}`,
    },
    description: `${brand.name}: ${brand.tagline} ${brand.heroSub}`,
    metadataBase: new URL(`https://${brand.domain}`),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const brandKey = cookieStore.get('ww-brand')?.value ?? 'ht'

  return (
    <html lang="en" className={`${barlowCondensed.variable} ${lora.variable}`}>
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
