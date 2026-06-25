# Shop: Custom Cart, Stripe Checkout, and Sold-State Sync

Date: 2026-06-24
Status: Design, awaiting approval
Owner: Johan

## Goal

Let a buyer move from the custom shop, through a product detail page and a cart that both live on our own site, to a Stripe-hosted payment page on our own domain, and guarantee that a one-of-a-kind piece can never be sold twice. Slavik and Sam keep adding products and photos in Squarespace exactly as they do today. Nothing about their workflow changes.

This replaces the current behavior, where a shop card links out to a Squarespace product page for purchase.

## Decisions locked (from brainstorming)

1. Add to cart happens on a dedicated product detail page (PDP), not from the grid card.
2. Multi-piece cart: a buyer can add several distinct pieces and pay once. Each piece is quantity 1 (one of a kind).
3. Shipping is arranged separately: checkout collects the buyer's address for the record and charges $0 shipping. Freight or delivery is quoted and invoiced after the sale. This honors the existing no-shipping-calculator rule.
4. Payment processor is the existing connected Stripe account (already the live online processor for the Squarespace store). No new processor. Square stays untouched as the in-person point-of-sale tool.

## Non-goals (explicitly out of scope)

- Commissions and custom work. Those stay on the existing inquiry form and become a separate deposit/invoice flow later (Stripe Invoices). They never touch the cart.
- Shipping rate calculation of any kind.
- A Stripe product catalog. Prices are passed inline from the piece data.
- A new admin surface for Slavik and Sam. They stay in Squarespace.
- Customer accounts or logins.
- Multi-quantity line items.

## Architecture overview

Five parts:

1. Catalog (unchanged). Squarespace is the editing surface. The site reads the catalog through the existing `src/lib/squarespace.ts` bridge. This is the display source for pieces, photos, dimensions, and price.
2. Availability layer (new, Supabase). A table that records, per piece, whether it is `available`, `reserved`, or `sold`. This is the single source of truth for sold-state, because neither Squarespace nor Square learns about a Stripe sale.
3. Product detail page and cart (new and adapted, on our site). A PDP per piece with the full photo set and an Add to cart action, plus the existing `useCart` and `CartDrawer` revived and mounted.
4. Checkout and payment (new, Stripe). A server route reserves the cart's pieces, creates a Stripe Checkout Session priced inline from the piece data, and redirects to Stripe on our own domain.
5. Sync (new, Stripe webhook). Stripe reports the outcome; the webhook marks pieces sold or releases reservations, and emails Slavik and Sam.

## Data model (Supabase)

Two new tables.

### `piece_availability`
The sold-state ledger. One row per piece that has ever entered a checkout. Absence of a row means `available`.

- `squarespace_id` text, primary key. The stable Squarespace product id.
- `sku` text. The human Piece No. parsed from the title.
- `status` text, check in (`available`, `reserved`, `sold`), default `available`.
- `reserved_session_id` text, nullable. The Stripe Checkout Session currently holding the piece.
- `reserved_until` timestamptz, nullable. Reservation expiry (now + 30 minutes).
- `updated_at` timestamptz, default now().

### `orders`
A record of completed sales, so the owner has an order list (Stripe's dashboard is a payments ledger, not an order pipeline).

- `id` uuid, primary key.
- `stripe_session_id` text, unique.
- `stripe_payment_intent` text.
- `amount_total` integer (cents).
- `currency` text.
- `buyer_name` text.
- `buyer_email` text.
- `shipping_address` jsonb.
- `piece_ids` text[]. Squarespace ids in the order.
- `piece_skus` text[].
- `status` text, check in (`paid`, `refunded`), default `paid`.
- `created_at` timestamptz, default now().

## Buyer flow (end to end)

1. Shop grid (existing, being built). Each available piece links to its PDP.
2. PDP. Full photos, dimensions, description, price. If the piece is available and has a real price, an Add to cart button. If it is drying or has no real price (the `$9,999.99` placeholder), an Inquire link to the existing form instead of Buy.
3. Cart drawer. The buyer reviews pieces (each quantity 1) and clicks Checkout.
4. Checkout route (`POST /api/checkout`). For every piece in the cart, atomically re-check it is still available and reserve it for 30 minutes. If any piece is no longer available, abort, release anything reserved in this request, and return a clear "a piece in your cart just sold" message. Otherwise create a Stripe Checkout Session and return its URL.
5. Stripe payment page on `payments.<domain>`. The buyer pays. Address is collected; shipping charge is $0.
6. Redirect to `/shop/success` (existing page, adapted), which clears the cart.
7. Webhook fires asynchronously: mark pieces sold, write the order, email Slavik and Sam.

## Component and file plan

Grounded in the current repo (confirmed 2026-06-24). The implementation plan will reconcile exact edits against the in-progress shop page.

New:
- `src/app/shop/[slug]/page.tsx` and a PDP client component. The product detail page. Resolves a piece from the Squarespace bridge by slug or id.
- `src/lib/stripe.ts`. Stripe client, Checkout Session creation, and a helper that builds Stripe `price_data` from a `Product`.
- `src/lib/availability.ts`. Supabase reads and writes for piece status: atomic reserve, mark sold, release, and a merge helper that overlays status onto the catalog.
- `src/lib/supabase.ts`. A shared server-side Supabase client (currently the client is created inline in the inquiry route; extract it).
- `src/app/api/stripe/webhook/route.ts`. Handles `checkout.session.completed`, `checkout.session.expired`, and `charge.refunded`.
- Supabase migration creating `piece_availability` and `orders`.

Adapt:
- `src/components/cart/useCart.ts` and `src/components/cart/CartDrawer.tsx`. Revive, mount the drawer, and wire Checkout to the new Stripe route. Remove the "Shipping calculated at checkout" copy.
- `src/components/layout/Nav.tsx`. Add a cart button with an item count.
- `src/components/shop/ProductCard.tsx`. Available pieces link to the PDP instead of opening the Squarespace URL in a new tab. Drying and unpriced pieces keep their Inquire behavior.
- `src/app/shop/ShopClient.tsx` and the shop read. Overlay availability status so reserved and sold pieces show as Sold with no Buy button.
- `src/app/shop/success/page.tsx`. Confirm against the Stripe session instead of the Square flow.

Replace or retire:
- `src/app/api/checkout/route.ts`. Rewrite from Square Payment Links to a Stripe Checkout Session with reservation.
- `src/lib/square.ts` online usage. Retire for online checkout. Keep the pure `formatPrice` helper (move it to a neutral util so the shop no longer imports from `square.ts`). Square the in-person processor and the Square account are unaffected.

## Stripe Checkout Session details

- Hosted Checkout Session (`mode: payment`). Card data never touches our servers; this keeps PCI scope at SAQ A.
- `line_items` use inline `price_data` built from each piece (name, image, `unit_amount` in cents). No Stripe Product or Price objects are stored.
- `expires_at` set to 30 minutes, matching the reservation window.
- `shipping_address_collection` with `allowed_countries: ['US']`. No `shipping_options` (shipping is arranged separately, $0 at checkout).
- `metadata` carries the piece ids and skus so the webhook can map the sale back to pieces.
- Custom domain checkout enabled (`payments.<domain>`, a Stripe add-on at about $10/month) so the URL stays on brand.
- Branding (logo, colors, fonts) configured in the Stripe dashboard.
- Sales tax: `automatic_tax` is left off at launch. Stripe Tax can be enabled later, but it requires registering in South Dakota first (home-state nexus, which Stripe will not do for us). Flagged as a follow-up, independent of this build.

## The sync (webhook events)

- `checkout.session.completed`: for each piece in `metadata`, set `status = sold`; insert an `orders` row from the session (buyer, address, amounts, pieces); email Slavik and Sam via the existing Resend setup with the piece, buyer, and contact details.
- `checkout.session.expired`: release each reserved piece back to `available` if its `reserved_session_id` matches.
- `charge.refunded`: set the order `status = refunded` and optionally flip the pieces back to `available` so a returned piece can relist.
- The route verifies the Stripe signature against `STRIPE_WEBHOOK_SECRET` and is idempotent (safe to receive the same event twice).

## Availability and concurrency

- Merge rule. A piece is buyable only if all are true: present in the Squarespace feed, marked in stock by the feed, has a real price (not the `$9,999.99` placeholder), and is not `reserved` or `sold` in `piece_availability`. A piece with no row is treated as available.
- Atomic reserve. Reservation uses a conditional update per piece (`update ... where squarespace_id = ? and (status = 'available' or (status = 'reserved' and reserved_until < now()))`) and checks that a row was actually updated. This is what prevents two simultaneous buyers from both reserving the same slab.
- Lazy expiry. Any `reserved` row whose `reserved_until` is in the past is treated as available on read and is reclaimable on reserve, so a missed `expired` webhook never locks a piece permanently.

## Edge cases

- Two buyers, same slab, seconds apart. The atomic reserve lets only the first through; the second is told the piece is no longer available before any Stripe session is created.
- Abandoned checkout. The 30-minute reservation expires (via webhook, with lazy expiry as backup) and the piece returns to available.
- Sold in person on the Square reader, or removed in Squarespace. The piece leaves the feed or is taken down, and the merged view stops showing it. (An optional manual "mark sold" control is noted as a possible future add, but is out of scope; the default is that the family removes the piece in Squarespace.)
- Refund. Handled in the Stripe dashboard; the `charge.refunded` webhook updates the order and can relist the piece.
- Feed outage. The Squarespace read currently fails silently. Harden it to cache last-good data and to avoid showing a Buy button when price or stock data is missing.

## Configuration and external setup (walked through with Johan)

- Generate Stripe API keys from the existing Stripe account (the one already connected to Squarespace).
- Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the custom-domain checkout setting.
- Register the Stripe webhook endpoint and enable custom-domain checkout in the Stripe dashboard.
- Add the `stripe` Node SDK to the project.
- South Dakota sales-tax registration is a separate, owner-side task before turning on Stripe Tax.

## Testing scenarios

- Test mode with Stripe test cards; webhook forwarded via the Stripe CLI.
- Happy path: add to cart, checkout, pay, piece flips to Sold, owner email arrives, order row written.
- Concurrency: two checkout attempts on the same piece; only one succeeds.
- Expiry: start checkout, abandon, confirm the piece returns to available.
- Refund: refund in Stripe, confirm order and (optional) relist.
- Unpriced and drying pieces show Inquire, never Buy.

## Risks and open notes

- The site is deliberately noindexed today, and the indexed product URLs live on Squarespace. Before any public launch of the on-site buy flow, confirm the SEO posture and add redirects from Squarespace product URLs if those pages are retired.
- Order management lives in Supabase plus owner emails, not a full pipeline. Acceptable at this volume; a small orders view can be added if wanted.
- Keeping Squarespace as the catalog editor means staying on a paid Squarespace plan and depending on the undocumented JSON feed. Hardening the read (above) reduces, but does not remove, that fragility. Moving the catalog into Supabase or Sanity later is a clean future step that would let the Squarespace bill drop entirely.
