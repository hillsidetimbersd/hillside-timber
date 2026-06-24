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

export type ServiceFaq = {
  /** Stable id, used as the React key. */
  id: string
  question: string
  answer: string
}

export const SLAB_FLATTENING = {
  eyebrow: 'Flat and ready to build',
  title: 'Slab Flattening & Leveling',
  lead: 'A slab that cupped, bowed, or twisted while it dried will not sit flat on its own. We run it across our flattening table, taking down the high spots until both faces are parallel and true, so your build starts on a dead-flat surface.',
  rate: '$120',
  rateUnit: '/ hr',
  minimum: '30-minute minimum',
  maxSize: '6 × 16 ft',
  maxSizeLabel: 'Max single-slab size',
  note: 'Call ahead to schedule a time.',
  // Common questions, answered from what we already publish: the rate and
  // minimum, the max single-slab size, the call-ahead step, and what flattening
  // does. The page renders every entry below automatically.
  faqs: [
    {
      id: 'what-it-does',
      question: 'What does flattening actually do?',
      answer:
        'It removes the cup, bow, and twist a slab picks up as it dries. We take down the high spots on both faces until they sit parallel and true, leaving a surface that is ready to sand, finish, and build on.',
    },
    {
      id: 'pricing',
      question: 'How is it priced?',
      answer:
        'Flattening runs $120 an hour, with a 30-minute minimum. Most single slabs are finished well inside an hour, so bring yours by and we will tell you what to expect before we start.',
    },
    {
      id: 'max-size',
      question: 'How large a slab can you handle?',
      answer:
        'Our table takes one slab at a time, up to 6 feet wide and 16 feet long. If your piece runs larger than that, call and we will talk through the options.',
    },
    {
      id: 'scheduling',
      question: 'How do I get a slab flattened?',
      answer:
        'Give us a call so we can set a time, then drop the slab off at the yard. We are 15 miles west of Sioux Falls on Highway 42, near Canistota.',
    },
    // PHASE 2 — owner to supply. Append more entries here as { id, question,
    // answer } and they render automatically below. Likely additions: how flat
    // the finished surface gets, what to bring or prep beforehand, and typical
    // turnaround time.
  ] satisfies ServiceFaq[],
}
