export interface SpeciesInfo {
  name: string
  weightPerBF: number
  pricePerBFMin: number
  pricePerBFMax: number
  gradient: string
  blurb: string
  tier: 'Premium' | 'Popular' | 'Mid-range' | 'Rustic' | 'Unique' | 'Accessible'
}

export const SPECIES: Record<string, SpeciesInfo> = {
  'Black Walnut': {
    name: 'Black Walnut',
    weightPerBF: 3.6,
    pricePerBFMin: 18,
    pricePerBFMax: 28,
    gradient: 'linear-gradient(135deg, #3d2314 0%, #5c3520 40%, #3d2314 70%, #4a2c1a 100%)',
    blurb: 'Premium · Rich dark grain',
    tier: 'Premium',
  },
  'White Oak': {
    name: 'White Oak',
    weightPerBF: 3.4,
    pricePerBFMin: 12,
    pricePerBFMax: 18,
    gradient: 'linear-gradient(135deg, #c8a070 0%, #b08050 40%, #c8a070 70%, #b89060 100%)',
    blurb: 'Popular · Warm open grain',
    tier: 'Popular',
  },
  Cherry: {
    name: 'Cherry',
    weightPerBF: 3.0,
    pricePerBFMin: 10,
    pricePerBFMax: 16,
    gradient: 'linear-gradient(135deg, #a0502a 0%, #8c4020 40%, #a05030 70%, #904828 100%)',
    blurb: 'Mid-range · Reddish tone',
    tier: 'Mid-range',
  },
  Elm: {
    name: 'Elm',
    weightPerBF: 2.9,
    pricePerBFMin: 8,
    pricePerBFMax: 14,
    gradient: 'linear-gradient(135deg, #a08060 0%, #8c6c48 40%, #a08060 70%, #947058 100%)',
    blurb: 'Unique · Interlocked grain',
    tier: 'Unique',
  },
  'Ponderosa Pine': {
    name: 'Ponderosa Pine',
    weightPerBF: 2.2,
    pricePerBFMin: 6,
    pricePerBFMax: 10,
    gradient: 'linear-gradient(135deg, #e8d4a0 0%, #d4bc88 40%, #e8d4a0 70%, #dcc890 100%)',
    blurb: 'Rustic · Light character',
    tier: 'Rustic',
  },
  Cottonwood: {
    name: 'Cottonwood',
    weightPerBF: 2.3,
    pricePerBFMin: 6,
    pricePerBFMax: 12,
    gradient: 'linear-gradient(135deg, #d4c4a0 0%, #c4b08c 40%, #d4c4a0 70%, #caba94 100%)',
    blurb: 'Accessible · Light color',
    tier: 'Accessible',
  },
}

export const SPECIES_ORDER = [
  'White Oak',
  'Black Walnut',
  'Cherry',
  'Elm',
  'Ponderosa Pine',
  'Cottonwood',
]

// Board Foot math
export function boardFeet(thickness: number, width: number, length: number): number {
  if (!thickness || !width || !length) return 0
  return (thickness * width * length) / 144
}

export function slabWeight(bf: number, species: string): number {
  const info = SPECIES[species]
  if (!info) return bf * 2.8
  return bf * info.weightPerBF
}

export function shippingMethod(weightLbs: number): 'Ground' | 'LTL Freight' {
  return weightLbs > 70 ? 'LTL Freight' : 'Ground'
}

// Table Planner rules
export interface TableRecommendation {
  isRiverTable: boolean
  slabCount: 1 | 2
  minLength: number
  idealLengthMin: number
  idealLengthMax: number
  widthMin: number
  widthMax: number
  epoxyChannelMin?: number
  epoxyChannelMax?: number
  tableHeightMin: number
  tableHeightMax: number
  roomFits: boolean | null
  maxSupportedLength: number | null
}

export function recommendTable(opts: {
  seats: number
  liveEdge: boolean
  epoxy: boolean
  roomLengthFt?: number
  roomWidthFt?: number
}): TableRecommendation {
  const { seats, epoxy, roomLengthFt } = opts

  // 24" per person along the length, minimum 60" for 4 seats
  const minLength = Math.max(60, seats * 12)
  const idealLengthMin = seats * 12
  const idealLengthMax = seats * 14

  const widthMin = epoxy ? 44 : 38
  const widthMax = epoxy ? 52 : 44

  const maxSupportedLength = roomLengthFt ? roomLengthFt * 12 - 72 : null
  const roomFits = maxSupportedLength !== null ? maxSupportedLength >= idealLengthMin : null

  return {
    isRiverTable: epoxy,
    slabCount: epoxy ? 2 : 1,
    minLength,
    idealLengthMin,
    idealLengthMax,
    widthMin,
    widthMax,
    epoxyChannelMin: epoxy ? 2 : undefined,
    epoxyChannelMax: epoxy ? 6 : undefined,
    tableHeightMin: 29,
    tableHeightMax: 30,
    roomFits,
    maxSupportedLength,
  }
}

// Quote Builder data
export interface PieceTypeInfo {
  key: string
  label: string
  sub: string
  basePriceMin: number
  basePriceMax: number
}

export const PIECE_TYPES: PieceTypeInfo[] = [
  { key: 'dining-table', label: 'Dining Table', sub: 'Live edge · seats 4–12', basePriceMin: 3200, basePriceMax: 8800 },
  { key: 'coffee-table', label: 'Coffee Table', sub: 'Low · living room centerpiece', basePriceMin: 1400, basePriceMax: 3800 },
  { key: 'bench', label: 'Bench', sub: 'Entry, dining, or outdoor', basePriceMin: 900, basePriceMax: 2400 },
  { key: 'desk', label: 'Desk', sub: 'Home office · custom size', basePriceMin: 2200, basePriceMax: 5600 },
  { key: 'mantel', label: 'Mantel', sub: 'Fireplace surround', basePriceMin: 600, basePriceMax: 1800 },
  { key: 'shelf', label: 'Shelf', sub: 'Floating · any length', basePriceMin: 280, basePriceMax: 900 },
]

export interface BaseStyleInfo {
  key: string
  label: string
  priceModifier: number
}

export const BASE_STYLES: BaseStyleInfo[] = [
  { key: 'steel-legs', label: 'Steel Legs', priceModifier: 1.0 },
  { key: 'wood-legs', label: 'Wood Legs', priceModifier: 1.15 },
  { key: 'pedestal', label: 'Pedestal', priceModifier: 1.25 },
  { key: 'trestle', label: 'Trestle', priceModifier: 1.2 },
  { key: 'wall-mount', label: 'Wall Mount', priceModifier: 0.85 },
]

export interface FinishInfo {
  key: string
  label: string
  priceModifier: number
}

export const FINISHES: FinishInfo[] = [
  { key: 'matte-oil', label: 'Matte Oil', priceModifier: 1.0 },
  { key: 'satin-lacquer', label: 'Satin Lacquer', priceModifier: 1.08 },
  { key: 'natural-wax', label: 'Natural Wax', priceModifier: 1.04 },
]

export interface QuoteState {
  pieceType: string | null
  species: string | null
  dimensionsL: string
  dimensionsW: string
  dimensionsH: string
  baseStyle: string | null
  finish: string | null
}

export function priceRange(state: QuoteState): { min: number; max: number } | null {
  if (!state.pieceType) return null
  const piece = PIECE_TYPES.find((p) => p.key === state.pieceType)
  if (!piece) return null

  let min = piece.basePriceMin
  let max = piece.basePriceMax

  if (state.species) {
    const info = SPECIES[state.species]
    if (info) {
      const speciesFactor = info.pricePerBFMax / 15
      min = min * speciesFactor
      max = max * speciesFactor
    }
  }

  const l = parseFloat(state.dimensionsL)
  const w = parseFloat(state.dimensionsW)
  if (!isNaN(l) && !isNaN(w)) {
    const sizeFactor = (l * w) / (72 * 36)
    min = min * Math.max(0.7, Math.min(1.6, sizeFactor))
    max = max * Math.max(0.7, Math.min(1.6, sizeFactor))
  }

  if (state.baseStyle) {
    const base = BASE_STYLES.find((b) => b.key === state.baseStyle)
    if (base) {
      min = min * base.priceModifier
      max = max * base.priceModifier
    }
  }

  if (state.finish) {
    const fin = FINISHES.find((f) => f.key === state.finish)
    if (fin) {
      min = min * fin.priceModifier
      max = max * fin.priceModifier
    }
  }

  return { min: Math.round(min / 50) * 50, max: Math.round(max / 50) * 50 }
}

export function quoteProgress(state: QuoteState): number {
  let complete = 0
  if (state.pieceType) complete++
  if (state.species) complete++
  if (state.dimensionsL && state.dimensionsW && state.dimensionsH) complete++
  if (state.baseStyle && state.finish) complete++
  return complete
}
