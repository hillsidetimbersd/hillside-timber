// Single source of truth for the Solar Kiln Drying page. Content mirrors the
// original Squarespace /solar-kiln page (the explainer, the 3-step process, and
// the FAQ), cleaned up. Same pattern as services.ts / reviews.ts.

// Icon keys the KilnProcess client island maps to Phosphor components. Kept as
// strings (not components) because this file is imported by the server page and
// React components are not serializable across the server/client boundary.
export type KilnIconKey =
  | 'Sun'
  | 'SolarRoof'
  | 'Fan'
  | 'ArrowsClockwise'
  | 'StackSimple'
  | 'ThermometerSimple'
  | 'Drop'
  | 'SolarPanel'
  | 'Snowflake'
  | 'Truck'

export interface KilnPoint {
  n: string
  icon: KilnIconKey
  title: string
  body: string
}

export interface KilnSpec {
  icon: KilnIconKey
  title: string
  body: string
}

export const SOLAR_KILN = {
  eyebrow: 'Solar Kiln Drying',
  heading: ['Dried slow,', 'by the sun.'],
  sub: 'Every slab we sell is dried in our own solar kiln on the property, using the sun instead of fossil fuels or electricity.',
  intro:
    "At Hillside Timber we are committed to sustainable practices for harvesting and processing wood, so we built a solar kiln on our property. A solar kiln dries timber with the sun's energy rather than fossil fuels or electricity, which makes it more energy efficient, more environmentally friendly, and easier on the wood.",
  // Preparation -> Drying -> Inspection is a real sequence, so it earns numbers.
  steps: [
    {
      n: '01',
      title: 'Preparation',
      body: 'The wood is carefully selected and stacked inside the kiln so air can circulate evenly around every board.',
    },
    {
      n: '02',
      title: 'Drying',
      body: 'Fans move air through the stack for even heat and moisture, which prevents mold. A fully loaded kiln dries in two to four months, depending on the species and starting moisture.',
    },
    {
      n: '03',
      title: 'Inspection',
      body: 'We monitor temperature, humidity, and moisture throughout. Once the wood hits its target moisture, it comes out for a final inspection and goes into the warehouse.',
    },
  ],
  dryTime: '2-4',
  dryTimeLabel: 'Months per load',
  faqs: [
    {
      q: 'What are the advantages of a solar kiln?',
      a: 'Even heat and humidity prevent the warping, cracking, and other defects that less controlled drying can cause. It is energy efficient, and it handles a wide range of species and slab sizes.',
    },
    {
      q: 'What wood species can you dry?',
      a: 'A wide range, including walnut, oak, ash, and many more. If you are after something specific, just ask.',
    },
    {
      q: 'How long does drying take?',
      a: 'Usually two to four months, depending on the species, the starting moisture content, and the weather.',
    },
    {
      q: 'Is solar-dried wood as good as traditionally kiln-dried?',
      a: 'Yes. The wood dries evenly and thoroughly, so the quality matches a traditional kiln while using far less energy.',
    },
  ],

  // The seven mechanisms the custom cutaway diagram annotates. The order is the
  // narrative the diagram reads in: sun in, gathered, moved, looped, through the
  // stack, collected, vented out. `n` matches the numbered pin on the SVG.
  howItWorks: {
    eyebrow: 'How it works',
    heading: 'Sun in, moisture out',
    sub: 'Hover a point to find it on the kiln. The whole thing runs on sunshine, no fossil fuels and no grid power.',
    points: [
      { n: '1', icon: 'Sun', title: 'Sunlight in', body: 'Free heat the kiln gathers all day long.' },
      { n: '2', icon: 'SolarRoof', title: 'Clear collector roof', body: 'A clear, sun-facing roof traps warmth inside.' },
      { n: '3', icon: 'Fan', title: 'Solar-powered fans', body: 'Fans run on the sun and keep the air moving.' },
      { n: '4', icon: 'ArrowsClockwise', title: 'A circulating loop', body: 'Warm air sweeps across the top, then down through the stack.' },
      { n: '5', icon: 'StackSimple', title: 'Stickered stack', body: 'Boards are spaced so air flows between every plank.' },
      { n: '6', icon: 'ThermometerSimple', title: 'Black collector panel', body: 'A dark panel soaks up heat and shields the wood from direct sun.' },
      { n: '7', icon: 'Drop', title: 'Vents', body: 'Vents open to release heat and moisture as the wood dries.' },
    ] as KilnPoint[],
  },

  // A short, buyer-friendly read on the build. Not a construction manual.
  built: {
    eyebrow: "How it's built",
    dims: '60" × 132" × 105.5"',
    dimsLabel: 'Width × length × height',
    specs: [
      { icon: 'SolarRoof', title: 'Solar collector roof', body: 'Greenhouse-rated panels, pitched near 45° to the sun.' },
      { icon: 'SolarPanel', title: 'Runs on sunshine', body: 'A solar panel powers the fans, so the kiln runs on the sun.' },
      { icon: 'Snowflake', title: 'Insulated walls', body: "R-13 walls hold the day's heat through cool nights." },
      { icon: 'Truck', title: 'Built to move', body: 'Mounted on timber skids, so it can be relocated.' },
    ] as KilnSpec[],
  },
}

const SS_CONTENT = 'https://images.squarespace-cdn.com/content/v1/60007801ebc4a249bd3ce872'

// Verified Squarespace assets from the live /solar-kiln page.
export const KILN_PHOTOS = {
  // The solar kiln building on the property.
  building: `${SS_CONTENT}/af8a717e-47f4-459f-9b22-e451a53dad52/Resized_20240503_201028_1714790903627.jpeg`,
  // A finished, figured slab: the payoff of slow drying.
  result: `${SS_CONTENT}/6cb9c6be-9492-4a27-8768-a9fa4a2ec000/P1034767.jpg`,
}

/** Append a Squarespace CDN sizing param for crisp delivery at a given width. */
export function sizeKilnImage(url: string, width: number): string {
  if (!url.includes('images.squarespace-cdn.com')) return url
  return `${url}?format=${width}w`
}
