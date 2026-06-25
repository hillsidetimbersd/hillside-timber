# Recent Work: editorial mosaic redesign

Date: 2026-06-25
Scope: the SFW homepage "Recent Work / Built once. Built right." section
([FeaturedPieces.tsx](../../../src/components/home/FeaturedPieces.tsx)).

## Problem

The section reads as under-built and empty. Three causes, in order of impact:

1. The grid leaves a literal hole. The first card spans 2 of 3 columns and the
   other two span 1 each, so the bottom-right two-column quadrant is empty cream.
   That void is what reads as "empty," more than the piece count.
2. It is hardcoded to three pieces that are not even in the real portfolio, and
   it is cut off from the live portfolio feed, so it can never feel deep and it
   goes stale by hand.
3. It is the flattest section on the page. No texture, no motion, no editorial
   voice, while the hero, vendor ticker, process strip, and kiln cutaway all
   carry craft.

## Decision

An editorial mosaic of six pieces, fed live from the portfolio but hand-orderable,
echoing the real `/gallery` card language for brand cohesion.

### Composition (zero holes at every breakpoint)

A four-column mosaic: one large landscape hero, one tall portrait accent, and a
rank of four tiles.

```
Desktop (>=1100px), 4 columns:
+------------------------+---------+
|                        |  No.02  |
|   HERO (3x2)           |  tall   |
|   landscape            | portrait|
+--------+--------+------+---------+
|  tile  |  tile  | tile |  tile   |
+--------+--------+------+---------+

Tablet (700-1099px), 2 columns:   Mobile (<700px), 1 column:
+---------+---------+              hero, portrait, tile, tile
|      hero (2)     |             (last two tiles hidden; full
+---------+---------+              set lives on /gallery)
| portrait|  tile   |
+---------+---------+
|  tile   |  tile   |
+---------+---------+
|   band (2 wide)   |
+---------+---------+
```

The hero is landscape (roughly 1.7:1) so wide tables sit right. The single
portrait cell holds a sculptural or detail shot. If no piece crops well vertical,
the pre-approved fallback is two stacked landscape tiles in that column instead.

### Card (echoes the real /gallery card, not a reinvention)

Each tile is a link to `/gallery` carrying: a tan species/finish eyebrow
(`--fs-10`, Barlow Condensed, 2.5px tracking), the title in the display face
(white, uppercase), a bottom scrim, and a green arrow-circle (Phosphor
`ArrowUpRight`) that fades in on hover. Hover lifts the card (`--shadow` to
`--shadow-lg`), zooms the image to 1.06, and reveals the arrow, all transform and
opacity only, with `prefers-reduced-motion` respected. Shared tokens reused:
`--shadow`, `--shadow-lg`, `--radius-lg`, `--fs-10`, `--tan`, `--green`.

No "Piece No." numbering: the real gallery does not use it, and numbered markers
imply a sequence these pieces are not.

No invented dimensions or finishes. The portfolio feed carries neither, so cards
state only what is true (species and form from the title). The lift comes from
composition, depth, motion, and real data, not invented caption lines.

### Data (live, hand-orderable)

New module [featured-pieces.ts](../../../src/lib/featured-pieces.ts):

- A curated `FEATURED` config of six entries, each `{ slug, slot, eyebrow,
  width, fallbackTitle, fallbackCover }`, in display order.
- `getFeaturedPieces()` fetches the live portfolio (`getPortfolioProjects()`),
  matches each config entry by `slug`, and uses the live cover when present,
  falling back to the stored cover so a card never blanks if a slug leaves
  Squarespace. Covers are right-sized per slot via `sizePortfolioImage` (hero
  1600w, portrait 1100w, tiles 1000w).
- The join runs server-side in [page.tsx](../../../src/app/page.tsx); the
  component is pure presentation.

The six pinned pieces (of seven in the live portfolio):
black-walnut-bookmatch-statement-table (hero), crimson-king-angel-table
(portrait), ash-bookmatch-conference-table, live-edge-walnut-table,
quilted-cottonwood-table, maple-and-walnut-pen-holders. Reorder or repin by
editing `FEATURED`.

### Depth and motion (restrained, no slop)

The existing `.grain` noise overlay on the cream (behind content, so not over the
photos), layered warm shadows on tiles via the shadow tokens, and a staggered
scroll-reveal driven by `IntersectionObserver` (transform and opacity, reduced
motion safe, degrades to visible without JS). CTA stays "See the full portfolio"
with no count, since the portfolio is small enough that a number would undersell.

## Out of scope

The Hillside Timber homepage path (this section is SFW-only). A lighter
feed-only fetch (the section reuses the cached `getPortfolioProjects`).

## Verification

Build and lint clean; desktop (1440) and mobile (390) screenshots of the section
on the SFW homepage, judging the hero and portrait crops; switch the portrait to
the stacked-landscape fallback if its crop looks tight.
