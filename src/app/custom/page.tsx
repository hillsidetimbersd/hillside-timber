import type { Metadata } from 'next'
import CustomPageClient from './CustomPageClient'

export const metadata: Metadata = {
  title: 'Custom Projects · Sioux Falls Woodworking',
}

export default function CustomPage() {
  return <CustomPageClient />
}
