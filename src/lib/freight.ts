export interface FreightTier {
  maxMiles: number
  label: string
  min: number
  max: number
}

export const FREIGHT_TIERS: FreightTier[] = [
  { maxMiles: 200, label: 'Local Delivery', min: 150, max: 350 },
  { maxMiles: 500, label: 'Regional Freight', min: 350, max: 650 },
  { maxMiles: 1000, label: 'Long Haul Freight', min: 650, max: 1100 },
  { maxMiles: 2000, label: 'Cross-Country LTL', min: 1100, max: 1800 },
  { maxMiles: Infinity, label: 'National LTL', min: 1800, max: 2800 },
]

// Hillside Timber sits in Canistota, SD (zip 57012)
const ORIGIN_LAT = 43.6
const ORIGIN_LON = -97.3

// Approximate latitude/longitude centroids for each 2-digit US zip prefix.
// Sourced from USPS zip region geography — accurate to ~±100 miles, which is
// plenty for an insurance-range freight estimate. Missing prefixes (APO/FPO,
// territories) fall through to a national default.
const ZIP_PREFIX_COORDS: Record<string, [number, number]> = {
  // New England (00–05)
  '00': [18.2, -66.5], '01': [42.3, -72.2], '02': [42.1, -71.3],
  '03': [43.4, -71.6], '04': [44.3, -69.8], '05': [44.3, -72.8],
  // Northeast Atlantic (06–09)
  '06': [41.6, -72.7], '07': [40.7, -74.3], '08': [40.3, -74.6], '09': [39.0, -77.0],
  // New York (10–14)
  '10': [40.7, -74.0], '11': [40.7, -73.6], '12': [42.7, -73.8],
  '13': [43.0, -75.4], '14': [42.9, -78.8],
  // Pennsylvania (15–19)
  '15': [40.4, -79.9], '16': [41.1, -78.7], '17': [40.3, -76.9],
  '18': [40.8, -75.3], '19': [40.0, -75.2],
  // DC / Delaware / Maryland (20–21)
  '20': [38.9, -77.0], '21': [39.3, -76.6],
  // Virginia (22–24)
  '22': [38.8, -77.4], '23': [37.5, -77.5], '24': [37.3, -79.9],
  // West Virginia (25–26)
  '25': [38.4, -82.0], '26': [39.3, -81.5],
  // North / South Carolina (27–29)
  '27': [35.8, -78.7], '28': [35.2, -80.8], '29': [34.0, -81.0],
  // Georgia (30–31)
  '30': [33.7, -84.4], '31': [32.5, -84.0],
  // Florida (32–34)
  '32': [30.4, -84.3], '33': [26.1, -80.1], '34': [27.3, -82.5],
  // Alabama (35–36)
  '35': [33.5, -86.8], '36': [32.4, -86.3],
  // Tennessee (37–38)
  '37': [36.2, -86.8], '38': [35.1, -89.9],
  // Mississippi (39)
  '39': [32.3, -90.2],
  // Kentucky (40–42)
  '40': [38.0, -84.5], '41': [37.0, -83.4], '42': [37.7, -87.1],
  // Ohio (43–45)
  '43': [40.0, -83.0], '44': [41.5, -81.7], '45': [39.1, -84.5],
  // Indiana (46–47)
  '46': [39.8, -86.1], '47': [38.7, -87.0],
  // Michigan (48–49)
  '48': [42.3, -83.1], '49': [43.3, -85.7],
  // Iowa (50–52)
  '50': [41.6, -93.6], '51': [42.5, -96.3], '52': [41.7, -91.6],
  // Wisconsin (53–54)
  '53': [43.0, -87.9], '54': [44.5, -88.1],
  // Minnesota (55–56)
  '55': [44.9, -93.3], '56': [45.7, -94.5],
  // South Dakota (57) — home turf
  '57': [43.8, -98.0],
  // North Dakota (58)
  '58': [46.8, -100.8],
  // Montana (59)
  '59': [46.6, -112.0],
  // Illinois (60–62)
  '60': [41.9, -87.6], '61': [40.5, -89.6], '62': [39.8, -89.6],
  // Missouri (63–65)
  '63': [38.6, -90.2], '64': [39.1, -94.6], '65': [37.2, -93.3],
  // Kansas (66–67)
  '66': [39.0, -95.7], '67': [37.7, -97.3],
  // Nebraska (68–69)
  '68': [41.2, -95.9], '69': [41.1, -100.8],
  // Louisiana (70–71)
  '70': [30.0, -90.0], '71': [32.5, -93.8],
  // Arkansas (72)
  '72': [34.7, -92.3],
  // Oklahoma (73–74)
  '73': [35.5, -97.5], '74': [36.1, -95.9],
  // Texas (75–79)
  '75': [32.8, -96.8], '76': [32.7, -97.3], '77': [29.8, -95.4],
  '78': [29.4, -98.5], '79': [31.8, -106.5],
  // Colorado (80–81)
  '80': [39.7, -104.9], '81': [38.3, -104.6],
  // Wyoming (82–83)
  '82': [41.1, -104.8], '83': [43.6, -116.2],
  // Utah (84)
  '84': [40.8, -111.9],
  // Arizona (85–86)
  '85': [33.4, -112.1], '86': [35.2, -111.6],
  // New Mexico (87–88)
  '87': [35.1, -106.6], '88': [32.3, -106.8],
  // Nevada (89)
  '89': [36.2, -115.1],
  // California (90–96)
  '90': [34.0, -118.2], '91': [34.1, -118.1], '92': [33.7, -117.8],
  '93': [35.4, -119.0], '94': [37.8, -122.3], '95': [37.6, -121.0],
  '96': [38.6, -121.5],
  // Oregon (97)
  '97': [45.5, -122.7],
  // Washington (98–99 lower half)
  '98': [47.6, -122.3], '99': [47.7, -117.4],
}

const NATIONAL_DEFAULT: [number, number] = [39.8, -98.6] // US centroid

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}

export function estimateMiles(zip: string): number {
  if (!/^\d{5}$/.test(zip)) return 0
  const prefix = zip.slice(0, 2)
  const coords = ZIP_PREFIX_COORDS[prefix] ?? NATIONAL_DEFAULT
  return haversineMiles(ORIGIN_LAT, ORIGIN_LON, coords[0], coords[1])
}

export function tierForMiles(miles: number): FreightTier {
  return FREIGHT_TIERS.find((t) => miles <= t.maxMiles) ?? FREIGHT_TIERS[FREIGHT_TIERS.length - 1]
}

export interface FreightEstimate {
  miles: number
  tier: FreightTier
}

export function estimateFreight(zip: string): FreightEstimate | null {
  if (!/^\d{5}$/.test(zip)) return null
  const miles = estimateMiles(zip)
  return {
    miles: Math.round(miles),
    tier: tierForMiles(miles),
  }
}
