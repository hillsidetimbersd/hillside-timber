import type { Metadata } from 'next'
import { Suspense } from 'react'
import CalculatorsPageClient from './CalculatorsPageClient'

export const metadata: Metadata = {
  title: 'Calculators · Hillside Timber',
  description:
    'Free tools to plan your slab or custom woodworking project. Board foot calculator, dining table planner, and a live quote builder.',
}

export default function CalculatorsPage() {
  return (
    <Suspense fallback={null}>
      <CalculatorsPageClient />
    </Suspense>
  )
}
