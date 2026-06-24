import type { BrandConfig, BrandKey } from '@/types/brand'

export const BRANDS: Record<BrandKey, BrandConfig> = {
  ht: {
    key: 'ht',
    name: 'Hillside Timber',
    shortName: 'HT',
    domain: 'hillsidetimber.com',
    tagline: 'Locally harvested, solar kiln dried.',
    footerBlurb: 'Locally harvested, solar kiln dried, and finished in South Dakota.',
    heroHeadline: ['Every slab.', 'Every story.'],
    heroSub: 'Locally harvested and solar kiln dried in South Dakota. 24+ species available.',
    accentColor: '#2a5c3f',
    logo: '/assets/logos/ht-logo.webp',
    instagram: 'https://instagram.com/hillsidetimber',
    instagramHandle: '@hillsidetimber',
    contact: {
      phone: '(605) 310-4846',
      email: 'hillsidetimbersd@gmail.com',
      address: 'Visits by appointment',
      city: '15 mi west of Sioux Falls on Hwy 42',
    },
    hasCustomProject: false,
  },
  sfw: {
    key: 'sfw',
    name: 'Sioux Falls Woodworking',
    shortName: 'SFW',
    domain: 'siouxfallswoodworking.com',
    tagline: 'Handcrafted in South Dakota.',
    footerBlurb: 'Heirloom furniture and custom pieces, handcrafted in Sioux Falls.',
    heroHeadline: ['From tree.', 'To heirloom.'],
    heroSub: 'Custom furniture and finished pieces handcrafted in Sioux Falls. Every piece is one of a kind.',
    accentColor: '#2a5c3f',
    logo: null,
    instagram: 'https://instagram.com/hillsidetimber',
    instagramHandle: '@hillsidetimber',
    contact: {
      phone: '(605) 310-4846',
      email: 'hillsidetimbersd@gmail.com',
      address: 'Visits by appointment',
      city: '15 mi west of Sioux Falls on Hwy 42',
    },
    hasCustomProject: true,
  },
}

export function getBrand(key: string): BrandConfig {
  return BRANDS[key as BrandKey] ?? BRANDS.ht
}
