# Reviews Page Design — Hillside Timber

Date: 2026-06-23
Status: Approved (design), in implementation

## Goal
A full, detailed, premium `/reviews` page built entirely on the business's *real*
reviews (Google + Facebook). No fabricated content. It must match the existing site's
design language exactly (Barlow Condensed display, Lora body, cream/green/tan/black
palette, hairline-divided stat rows, grain overlay, `.section-wrap` rhythm).

## Source content (verbatim, real)
Owner is **Slavik**; his son is **Sam**. Family-run, two generations. This thread is
independently confirmed by three reviewers and anchors the page.

Google (profile shows 5.0, "3 reviews"; Birdeye lists a 4th, "Arbor Master", with no
visible text — counted toward the rating only, no card):
1. Heidi Evilsizor (Local Guide) — 5★ — "The owner was super nice, friendly and
   communicative! He had a great selection of raw edge wood planks and timbers. He had
   a wealth of knowledge on how to work with them and was very up front about his prices
   and how they would look when finished. We were very impressed! We'll definitely be
   coming back! His son Sam, was out helping and very kind and very professional as
   well!" — owner reply: "Thank you Heidi"
2. Tyler Curtis — 5★ — "Purchased an Ash slab for a diy office desk project. He gave me
   great tips and the slab was great quality. Looking forward to purchasing another slab
   for a future coffee table project." — owner reply: "Thank you Tyler"
3. OrangeSmoothie (Local Guide) — 5★ — "Highly recommend! Super knowledgeable. Great
   selection of high quality wood at a great price, I would say the best in the area."

Facebook (3 of 3 recommend = 100%):
4. John Stevens — "Expert craftsmanship is quickly dying. Not here. 2 generations of
   experts. Excellent choice for any custom wood project."
5. Jim Glover — "Great material, and great selection of material. Slavik is very friendly
   and knowledgeable." (original was truncated mid-sentence on FB; trimmed to complete
   sentences — restore full text if provided)
6. Cathy Stoltz — "beautiful assortment of fine lumber and very personal service!"

## Decisions
- Direction: editorial "wall of trust" (header + trust strip → aggregate stat bar →
  one featured pull-quote → source-attributed card wall → CTA band).
- Sources: Google + Facebook, with a per-card source badge.
- Dates: omitted on cards (some FB reviews have none; relative dates drift/read stale).
  Longevity shown once in the stat bar instead.
- Homepage `ReviewsSection` fabricated reviews (Marcus T./Sarah K./Derek J.) are
  replaced with 3 real ones pulled from the same data file.

## Architecture
- `src/lib/reviews.ts` — single source of truth. Exports a typed `Review[]` and an
  `aggregate` summary (rating, count, recommendPct, since/longevity). `Review` carries
  source ('google' | 'facebook'), author, isLocalGuide?, rating?, recommend?, text,
  context? (e.g. "Ash slab · office desk"), ownerReply?, featured?.
- `src/app/reviews/page.tsx` — server component (mirrors about/faq). Sections styled
  inline with CSS vars, same as the rest of the site. CSS scroll-reveal only; no carousel.
- `src/components/layout/Nav.tsx` — add `/reviews` to both HT_LINKS and SFW_LINKS.
- `src/components/home/ReviewsSection.tsx` — import the 3 featured reviews from
  `src/lib/reviews.ts`; delete the local fabricated `REVIEWS` array.
- External links: "Read on Google" → the Google profile; "Leave a review" → Google
  write-a-review; Facebook → facebook.com/hillsidetimber.

## Out of scope (YAGNI)
- Source filter UI (only 6 reviews).
- JSON-LD review schema (site is deliberately noindexed; revisit when it goes live).
- A reviews CMS / live API pull (Google bot-walls scraping; content is curated by hand).

## Success criteria
- Zero fabricated content; every word traces to a real Google/Facebook review.
- Visually indistinguishable in quality/rhythm from the About page.
- Responsive (desktop + mobile verified by screenshot), reduced-motion safe.
- Build + lint clean.
