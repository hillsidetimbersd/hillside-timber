// Single source of truth for the services Hillside Timber offers beyond the slab
// yard: custom milling and slab flattening. Mirrors the reviews.ts pattern so the
// /services page (and any future reuse) read the same numbers from one place.
// Pricing matches the live Squarespace "Our Services" page.

export type MillingTier = {
  /** Log diameter range, in inches, e.g. "20-25". */
  dia: string
  /** Price per cut for softwood, in whole dollars. */
  soft: number
  /** Price per cut for hardwood, in whole dollars. */
  hard: number
}

// Price per cut by log diameter and species. Scales up with size; hardwood costs
// more than softwood at every tier.
export const MILLING_TIERS: MillingTier[] = [
  { dia: '20-25', soft: 20, hard: 25 },
  { dia: '26-30', soft: 25, hard: 30 },
  { dia: '31-35', soft: 30, hard: 35 },
  { dia: '36-40', soft: 35, hard: 45 },
  { dia: '41-45', soft: 40, hard: 50 },
  { dia: '46-50', soft: 50, hard: 70 },
  { dia: '51-55', soft: 60, hard: 80 },
  { dia: '56-60', soft: 70, hard: 100 },
  { dia: '61-65', soft: 85, hard: 120 },
  { dia: '66-70', soft: 100, hard: 140 },
]

export const CUSTOM_MILLING = {
  // Eyebrow encodes the transformation, not a sequence number (the two services
  // are parallel offerings, not steps).
  eyebrow: 'From log to slab',
  title: 'Custom Milling',
  lead: 'We mill your logs into slabs, handling anything up to 60 inches in diameter. Live edges are preserved, and every flitch is numbered so book matches stay together.',
  maxDiameter: 'Logs up to 60 in diameter',
  tiers: MILLING_TIERS,
  priceCaption: 'Price per cut',
  // Metal hidden in a log can break a mill blade; these recover the cost.
  bladeNote: 'Broken-blade charges from metal in the log: $40 for a small blade, $80 for a large blade.',
}

export const SLAB_FLATTENING = {
  eyebrow: 'Flat and ready to build',
  title: 'Slab Flattening & Leveling',
  lead: 'Got a slab that needs leveling? Our flattening table takes single slabs up to 6 feet wide and 16 feet long, finished flat and ready to build.',
  rate: '$120',
  rateUnit: '/ hr',
  minimum: '30-minute minimum',
  maxSize: '6 × 16 ft',
  maxSizeLabel: 'Max single-slab size',
  note: 'Call ahead to schedule a time.',
}
