import { cookies } from 'next/headers'
import Link from 'next/link'
import { Phone, EnvelopeSimple, ChatCircle } from '@phosphor-icons/react/dist/ssr'
import { getSquarespaceProducts, pickRelated } from '@/lib/squarespace'
import { getCtaState } from '@/lib/shop-cta'
import { getBrand } from '@/lib/brand'
import { formatPrice } from '@/lib/square'
import { REVIEW_STATS } from '@/lib/reviews'
import { Stars } from '@/components/reviews/marks'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductCta from '@/components/shop/ProductCta'
import ProductCard from '@/components/shop/ProductCard'

// Inventory mirrors the live Squarespace store, so render per request.
export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const all = await getSquarespaceProducts()
  // Resolve by slug, then by id (the spec allows either as the route param).
  const product = all.find((p) => p.slug === slug) ?? all.find((p) => p.id === slug)

  // Read the cookie only for the chrome fallback; the page itself follows the
  // piece's own brand so a shared link always resolves, regardless of cookie.
  const cookieStore = await cookies()
  const fallbackBrand = cookieStore.get('ww-brand')?.value === 'sfw' ? 'sfw' : 'ht'

  if (!product) return <NotFoundState brandKey={fallbackBrand} />

  const brand = getBrand(product.brand)
  const related = pickRelated(all.filter((p) => p.brand === product.brand), product, 4)

  const sold = !product.inStock && !product.drying
  const onSale = product.onSale && product.salePriceCents != null && !sold
  const primarySection =
    product.sections.find((s) => s !== 'Still Drying') ?? (brand.key === 'sfw' ? 'Finished Piece' : 'Wood Slab')
  const dimsParts = product.dimensions ? product.dimensions.split('×').map((s) => s.trim()).filter(Boolean) : []
  const thickness = dimsParts.length >= 3 ? dimsParts[2] : ''
  const availability = sold ? 'Sold' : product.drying ? 'Still drying' : 'Ready now'
  const inquiryHref = product.sku ? `/contact?piece=${encodeURIComponent(product.sku)}` : '/contact'
  const telHref = `tel:${brand.contact.phone.replace(/[^0-9]/g, '')}`

  // One computed CTA state drives the whole buy/inquire surface (and the grid card).
  const ctaState = getCtaState(product)
  const effectivePriceCents = product.onSale && product.salePriceCents ? product.salePriceCents : product.priceCents
  // CONTRACT: cart addItem(piece). The live CartItem is { id, catalogObjectId, name,
  // price (cents), image } with no sku/priceCents field, so the Piece No. rides on
  // catalogObjectId and the sale-aware price goes in `price`. The spine reconciles the
  // field names when it rewires checkout to Stripe.
  const cartPiece = {
    id: product.id,
    catalogObjectId: product.sku,
    name: product.name,
    price: effectivePriceCents,
    image: product.images[0] ?? '',
  }

  const statusBadge = sold
    ? ({ label: 'Sold', tone: 'sold' } as const)
    : product.drying
      ? ({ label: 'Still drying', tone: 'drying' } as const)
      : onSale
        ? ({ label: 'On sale', tone: 'sale' } as const)
        : undefined

  const specs: { label: string; value: string }[] = []
  if (product.dimensions) specs.push({ label: 'Dimensions', value: product.dimensions })
  if (product.species) specs.push({ label: 'Species', value: product.species })
  if (thickness) specs.push({ label: 'Thickness', value: thickness })
  specs.push({ label: 'Category', value: primarySection })
  specs.push({ label: 'Availability', value: availability })

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)' }}>
      <style>{STYLES}</style>

      <div className="pdp-wrap">
        <nav className="pdp-crumbs" aria-label="Breadcrumb">
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <span>{primarySection}</span>
          <span aria-hidden="true">/</span>
          <span className="pdp-crumbs__here">{product.name}</span>
        </nav>

        <div className="pdp-top">
          <div className="pdp-gallery-col">
            <ProductGallery
              images={product.images}
              name={product.name}
              statusBadge={statusBadge}
            />
          </div>

          <aside className="pdp-info">
            <div className="pdp-brand">{brand.name}</div>
            <div className="pdp-eyebrow">
              {product.species ? `${product.species} · ${primarySection}` : primarySection}
            </div>
            <h1 className="pdp-title">{product.name}</h1>

            {product.sku && (
              <div className="pdp-pieceno">
                <span>Piece No.</span>
                <strong>{product.sku}</strong>
              </div>
            )}

            <div className="pdp-pricerow">
              {product.priceCents === 0 ? (
                <span className="pdp-price pdp-price--inquire">Inquire for price</span>
              ) : onSale && product.salePriceCents ? (
                <span className="pdp-price">
                  <span className="pdp-price--sale">{formatPrice(product.salePriceCents)}</span>
                  <span className="pdp-price--was">{formatPrice(product.priceCents)}</span>
                </span>
              ) : (
                <span className="pdp-price">{formatPrice(product.priceCents)}</span>
              )}
              <span className={`pdp-status pdp-status--${sold ? 'sold' : product.drying ? 'drying' : 'ready'}`}>
                {availability}
              </span>
            </div>

            <dl className="pdp-specs">
              {specs.map((s) => (
                <div key={s.label} className="pdp-spec">
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>

            <ProductCta ctaState={ctaState} piece={cartPiece} inquiryHref={inquiryHref} />

            <div className="pdp-trust">
              <span className="pdp-trust__item">
                <Stars count={5} color="var(--green)" size={14} />
                {REVIEW_STATS.rating} on Google
              </span>
              <span className="pdp-trust__dot" aria-hidden="true">·</span>
              <span className="pdp-trust__item">Two generations</span>
              <span className="pdp-trust__dot" aria-hidden="true">·</span>
              <span className="pdp-trust__item">Ships nationwide</span>
            </div>

            {product.description && <p className="pdp-desc">{product.description}</p>}
          </aside>
        </div>
      </div>

      <Shipping city={brand.contact.city} />

      {related.length > 0 && (
        <section className="pdp-section pdp-section--cream">
          <div className="pdp-sec-inner">
            <div className="pdp-sec-head">
              <div className="label">More from the yard</div>
              <h2 className="pdp-sec-h2">More like this</h2>
            </div>
            <div className="pdp-related">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta name={product.name} inquiryHref={inquiryHref} phone={brand.contact.phone} email={brand.contact.email} telHref={telHref} />
    </div>
  )
}

function Shipping({ city }: { city: string }) {
  return (
    <section className="pdp-section pdp-section--white">
      <div className="pdp-sec-inner pdp-ship">
        <div>
          <div className="label">Getting it home</div>
          <h2 className="pdp-sec-h2">Pickup or nationwide freight</h2>
        </div>
        <p className="pdp-ship__copy">
          Small pieces ship by standard carrier. Large, heavy slabs go by LTL freight, quoted per piece so you
          only pay for what it takes to move yours. Prefer to see it in person first? Local pickup is by
          appointment, {city}.
        </p>
      </div>
    </section>
  )
}

function FinalCta({
  name,
  inquiryHref,
  phone,
  email,
  telHref,
}: {
  name: string
  inquiryHref: string
  phone: string
  email: string
  telHref: string
}) {
  return (
    <section className="pdp-final">
      <div className="pdp-final__inner">
        <h2 className="pdp-final__h2">Questions about this piece?</h2>
        <p className="pdp-final__sub">
          Ask anything about {name}: finishing, dimensions, delivery. A real person answers, usually same day.
        </p>
        <div className="pdp-final__actions">
          <a href={inquiryHref} className="pdp-final__btn pdp-final__btn--solid">
            <ChatCircle size={17} weight="bold" /> Send a message
          </a>
          <a href={telHref} className="pdp-final__btn">
            <Phone size={16} weight="bold" /> {phone}
          </a>
          <a href={`mailto:${email}`} className="pdp-final__btn">
            <EnvelopeSimple size={16} weight="bold" /> Email us
          </a>
        </div>
      </div>
    </section>
  )
}

function NotFoundState({ brandKey }: { brandKey: 'ht' | 'sfw' }) {
  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 'var(--content-text)', margin: '0 auto', padding: '120px var(--section-pad-x) 160px', textAlign: 'center' }}>
        <div className="label" style={{ marginBottom: 14 }}>Piece not found</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 16, lineHeight: 1 }}>
          This one is no longer listed
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--gray-dark)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          It may have sold and come down, or the link is out of date. The rest of the {brandKey === 'sfw' ? 'finished pieces' : 'yard'} is one click away.
        </p>
        <Link href="/shop" className="btn-primary">Browse the shop</Link>
      </div>
    </div>
  )
}

const STYLES = `
.pdp-wrap { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--section-pad-x); }

.pdp-crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; padding: 26px 0 22px; font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); }
.pdp-crumbs a { color: var(--green); text-decoration: none; }
.pdp-crumbs a:hover { text-decoration: underline; }
.pdp-crumbs__here { color: var(--black); }

.pdp-top { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(330px, 0.95fr); gap: 48px; align-items: start; padding-bottom: 28px; }
/* The gallery is the shorter column, so it pins while the longer info column scrolls past. */
.pdp-gallery-col { position: sticky; top: calc(var(--switcher-h) + var(--nav-h) + 24px); align-self: start; }

.pdp-brand { display: inline-flex; align-items: center; width: fit-content; margin-bottom: 14px; padding: 6px 12px; border-radius: 999px; background: rgba(42,92,63,0.10); color: var(--green); font-family: var(--font-display); font-size: var(--fs-9); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.pdp-eyebrow { font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--green); margin-bottom: 10px; }
.pdp-title { font-family: var(--font-display); font-size: clamp(28px, 3vw, 44px); font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; color: var(--black); line-height: 1.0; margin-bottom: 14px; }

.pdp-pieceno { display: inline-flex; align-items: center; gap: 8px; padding: 5px 11px; margin-bottom: 18px; border-radius: var(--radius-sm); background: var(--cream); border: 1px solid var(--border); }
.pdp-pieceno span { font-family: var(--font-display); font-size: var(--fs-9); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); }
.pdp-pieceno strong { font-family: var(--font-display); font-size: var(--fs-12); font-weight: 800; letter-spacing: 0.5px; color: var(--black); }

.pdp-pricerow { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
.pdp-price { font-family: var(--font-display); font-size: clamp(26px, 2.6vw, 34px); font-weight: 800; color: var(--black); display: inline-flex; align-items: baseline; gap: 10px; }
.pdp-price--inquire { font-family: var(--font-body); font-style: italic; font-size: var(--fs-18); color: var(--muted); font-weight: 600; }
.pdp-price--sale { color: var(--green); }
.pdp-price--was { font-size: var(--fs-15); font-weight: 700; color: var(--gray); text-decoration: line-through; }
.pdp-status { font-family: var(--font-display); font-size: var(--fs-9); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 11px; border-radius: 999px; }
.pdp-status--ready { color: var(--green); background: rgba(42,92,63,0.10); }
.pdp-status--drying { color: #8a5a1c; background: rgba(200,168,130,0.24); }
.pdp-status--sold { color: #fff; background: var(--black); }

.pdp-specs { display: grid; gap: 0; margin-bottom: 26px; }
.pdp-spec { display: flex; justify-content: space-between; gap: 16px; padding: 11px 0; border-bottom: 1px solid var(--border); }
.pdp-spec dt { font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); }
.pdp-spec dd { font-family: var(--font-body); font-size: var(--fs-14); color: var(--black); text-align: right; margin: 0; }

.pdp-cta-block { display: flex; flex-direction: column; gap: 12px; margin-bottom: 22px; }
.pdp-cta { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 52px; padding: 0 24px; border: none; cursor: pointer; font-family: var(--font-display); font-size: var(--fs-12); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border-radius: var(--radius-sm); transition: background 0.2s ease, color 0.2s ease, transform 0.1s ease; }
.pdp-cta--black { background: var(--black); color: #fff; }
.pdp-cta--black:hover { background: var(--green); }
.pdp-cta--green { background: var(--green); color: #fff; }
.pdp-cta--green:hover { background: var(--black); }
.pdp-cta--added { background: var(--green); }
.pdp-cta:disabled { cursor: default; }
.pdp-cta--disabled { background: transparent; border: 1px solid var(--border); color: var(--gray); cursor: not-allowed; }
.pdp-cta:focus-visible, .pdp-ghost:focus-visible { outline: 3px solid var(--tan); outline-offset: 3px; }
.pdp-cta:not(.pdp-cta--disabled):active { transform: translateY(1px); }
@media (prefers-reduced-motion: reduce) { .pdp-cta { transition: background 0.2s ease, color 0.2s ease; } .pdp-cta:active { transform: none; } }
.pdp-cta-sub { display: flex; flex-wrap: wrap; gap: 8px 20px; }
.pdp-ghost { font-family: var(--font-display); font-size: var(--fs-11); font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--gray-dark); text-decoration: none; min-height: 28px; display: inline-flex; align-items: center; }
.pdp-ghost:hover { color: var(--green); }
.pdp-cta-note { font-family: var(--font-body); font-size: var(--fs-12); font-style: italic; color: var(--muted); line-height: 1.55; margin: 2px 0 0; }

.pdp-trust { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 22px; }
.pdp-trust__item { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: var(--fs-11); font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--gray-dark); }
.pdp-trust__dot { color: var(--border); }

.pdp-desc { font-family: var(--font-body); font-size: var(--fs-15); line-height: 1.75; color: var(--gray-dark); max-width: 62ch; margin: 0; }

/* ── Supporting sections ── */
.pdp-section { padding: 64px var(--section-pad-x); }
.pdp-section--cream { background: var(--cream); }
.pdp-section--white { background: #fff; border-top: 1px solid var(--border); }
.pdp-sec-inner { max-width: var(--content-max); margin: 0 auto; }
.pdp-sec-head { margin-bottom: 30px; }
.pdp-sec-h2 { font-family: var(--font-display); font-size: clamp(24px, 2.4vw, 34px); font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; color: var(--black); line-height: 1.02; margin-top: 8px; }

.pdp-ship { display: grid; grid-template-columns: minmax(220px, 320px) 1fr; gap: 40px; align-items: start; }
.pdp-ship__copy { font-family: var(--font-body); font-size: var(--fs-16); line-height: 1.75; color: var(--gray-dark); max-width: 62ch; margin: 6px 0 0; }

.pdp-related { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }

/* ── Final CTA band ── */
.pdp-final { background: var(--green); padding: 70px var(--section-pad-x); }
.pdp-final__inner { max-width: var(--content-text); margin: 0 auto; text-align: center; }
.pdp-final__h2 { font-family: var(--font-display); font-size: clamp(26px, 3vw, 40px); font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; color: #fff; line-height: 1.02; margin-bottom: 12px; }
.pdp-final__sub { font-family: var(--font-body); font-size: var(--fs-15); font-style: italic; line-height: 1.7; color: rgba(255,255,255,0.86); max-width: 52ch; margin: 0 auto 28px; }
.pdp-final__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.pdp-final__btn { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 22px; font-family: var(--font-display); font-size: var(--fs-11); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border-radius: var(--radius-sm); color: #fff; border: 1.5px solid rgba(255,255,255,0.55); transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
.pdp-final__btn:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
.pdp-final__btn--solid { background: #fff; color: var(--green); border-color: #fff; }
.pdp-final__btn--solid:hover { background: var(--cream); color: var(--green); }
.pdp-final__btn:focus-visible { outline: 3px solid var(--tan); outline-offset: 3px; }

/* ── Responsive ── */
@media (max-width: 960px) {
  .pdp-top { grid-template-columns: 1fr; gap: 28px; }
  .pdp-gallery-col { position: static; }
  .pdp-ship { grid-template-columns: 1fr; gap: 14px; }
  .pdp-related { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .pdp-related { grid-template-columns: 1fr; }
  .pdp-cta { width: 100%; }
}
`
