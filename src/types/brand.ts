export type BrandKey = 'ht' | 'sfw'

export interface BrandContact {
  phone: string
  email: string
  address: string
  city: string
}

export interface BrandConfig {
  key: BrandKey
  name: string
  shortName: string
  domain: string
  tagline: string
  heroHeadline: string[]
  heroSub: string
  accentColor: string
  logo: string | null
  instagram: string
  instagramHandle: string
  contact: BrandContact
  hasCustomProject: boolean
}
