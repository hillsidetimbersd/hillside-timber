// Single source of truth for the Solar Kiln Drying page. Content mirrors the
// original Squarespace /solar-kiln page (the explainer, the 3-step process, and
// the FAQ), cleaned up. Same pattern as services.ts / reviews.ts.

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
