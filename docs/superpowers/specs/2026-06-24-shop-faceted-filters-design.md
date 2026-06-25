# Shop faceted filters (design)

Date: 2026-06-24
Scope: `src/app/shop/ShopClient.tsx`, `src/lib/squarespace.ts` only. No `globals.css`.

## Goal

Turn the shop's single-select section sidebar into a premium, vertical, multi-select
faceted filter rail. Reuse the `label │ value ✕` filter-badge pattern (rebuilt natively
in the brand system, not the Tremor/Tailwind source the user pasted) for active filters.
Keep both brands working and the homepage untouched in behavior except the price-sentinel
fix below.

## Filter set (decided by the live feed, 283 HT / 7 SFW visible pieces)

v1 groups, in rail order:

1. **Category** (the existing sections, now multi-select + collapsible, faceted counts).
2. **Species** (HT only): Walnut 96, Maple 76, Redwood 27, Buckeye 15, Aspen 13,
   Box Elder 12, Ash 10, then the long tail (Catalpa, Hackberry, Cottonwood, Russian
   Olive, Apple, Cedar, Elm) behind "+N more". Derived from the title with a curated
   species dictionary (~98% coverage after folding "Claro/Black Walnut" → Walnut,
   "Red Wood/Sequoia" → Redwood, etc.).
3. **Price** (named tiers, brand-aware bands):
   - HT: Under $300 (76), $300–600 (100), $600–1,200 (44), $1,200+ (45), Inquire (18).
   - SFW: higher furniture bands (Under $500, $500–1,500, $1,500–3,000, $3,000+).
4. **Availability & On sale**: Ready now (247), Still drying (36), On sale (41).

Dropped from v1: **Size**. Only 107 of 283 pieces (38%) carry parseable dimensions
(most live-edge slabs and all rounds omit them), so a size facet would misclassify the
majority. Returns when dimension entry in Squarespace is consistent.

## Price sentinel fix (root cause, flagged to owner)

18 HT pieces are priced at exactly $9,999.99 (a "not priced yet" placeholder; the real
top slab is $6,450). They currently render "$9,999.99" on live cards and dominate the
homepage Top Picks. Fix: in `normalize()`, map `priceCents === 999999` to `0`. The
codebase already treats `0` as "Inquire for price" (ProductCard, toPiecePreview) and
excludes it from Top Picks (`priceCents > 0`), so one change heals cards, Top Picks, the
contact picker, and feeds the price filter's Inquire tier. Reversible.

## Faceting rules

- **Multi-select.** Within a group, selected chips OR together; across groups they AND.
- **Stable existence, dynamic counts.** The set of chips that exist is computed once from
  the brand's full visible inventory and never changes during a session. Each chip's count
  is recomputed against the *other* groups' active selections (the count beside chip X in
  group G = pieces passing every group except G, then matching X).
- **Grey, never remove.** A chip whose live count is 0 is disabled and dimmed, not pulled
  from the rail (removing chips makes the rail twitch under the cursor).
- **No empty groups.** A group renders only when it has ≥2 chips for the brand. Species is
  HT-only. SFW shows Price + On sale until its catalog and sub-collections grow.
- Sold pieces (`!inStock && !drying`) stay excluded everywhere; counts stay honest.

## Interaction & layout

- Sticky left rail on desktop (already shipped), stacked on mobile (does not pin).
- Rail: search box (kept), then collapsible group pills. Each pill shows an uppercase
  label, a count badge, and a chevron; collapsed it keeps its count. Category expands by
  default; others start collapsed to keep the rail calm. Mobile: all collapsed by default.
- Active selections render as removable `label │ value ✕` chips in a bar above the grid,
  with a "Clear all" and a live "N of 283" result count.
- Grid: drop the `key={section}` container re-key (it breaks under a multi-select object
  and would over-animate on every toggle). Keep per-card `key={product.id}`; only the
  initial mount fades. Rewrite the grid header line for multi-select.
- Empty state ("no pieces match") gains a "Clear all filters" action.

## Brand safety & a11y

- All changes stay in the two files; `getProductsByBrand` and `sectionsForBrand` semantics
  preserved. Brand-aware config mirrors the existing `SECTION_ORDER` pattern.
- Chips and group headers are real buttons (`aria-pressed` / `aria-expanded`), keyboard
  operable, focus-visible rings intact, reduced-motion respected.

## Acceptance

- HT and SFW shops, mobile + desktop screenshots: rail filters, faceted counts, active
  chips, sticky on desktop only, no sold pieces.
- Faceting invariant verified: selecting Walnut leaves Maple's count nonzero (OR across
  groups, not AND within).
- No "$9,999.99" anywhere; those pieces read "Inquire for price"; Top Picks shows real
  top slabs. `tsc --noEmit` and `eslint .` clean.
