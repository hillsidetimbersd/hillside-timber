'use client'

import { useState, useMemo, useEffect, type CSSProperties, type Dispatch, type SetStateAction, type ReactNode } from 'react'
import { MagnifyingGlass, CaretDown, X, Tag } from '@phosphor-icons/react'
import { useBrand } from '@/components/brand/BrandContext'
import ProductCard from '@/components/shop/ProductCard'
import {
  priceBandsForBrand,
  priceBandKeyOf,
  INQUIRE_BAND_KEY,
  type Product,
  type BrandKey,
} from '@/lib/squarespace'

/** Toggle a value in or out of a string-array filter state. */
function toggleIn(setter: Dispatch<SetStateAction<string[]>>, value: string) {
  setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
}

const SPECIES_VISIBLE = 7

export default function ShopClient({ products, sections, initialSpecies = [] }: { products: Product[]; sections: string[]; initialSpecies?: string[] }) {
  const brand = useBrand()
  const brandKey: BrandKey = brand.key === 'sfw' ? 'sfw' : 'ht'

  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  // Seeded from a homepage species deep-link (validated server-side in page.tsx).
  const [species, setSpecies] = useState<string[]>(initialSpecies)
  const [priceKeys, setPriceKeys] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])
  const [onSale, setOnSale] = useState(false)
  const [allSpecies, setAllSpecies] = useState(false)
  // Open the species group when arriving with a species preselected, so the active filter is visible.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    initialSpecies.length > 0 ? { category: true, species: true } : { category: true },
  )
  const toggleGroup = (id: string) => setOpenGroups((g) => ({ ...g, [id]: !g[id] }))

  // Sticky sidebar on desktop only. The grid stacks the sidebar above itself at
  // 768px and below (globals.css), where pinning would be wrong, so mirror that
  // exact breakpoint here. Start false so the server render and the first client
  // render agree (no hydration mismatch), then resolve from matchMedia on mount.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Sold pieces (out of stock and not still drying) are removed from the shop
  // entirely, so the grid and every count below agree on what is actually buyable.
  const visible = useMemo(() => products.filter((p) => p.inStock || p.drying), [products])

  // One predicate per filter group. Faceting reuses these: results apply all of
  // them; a group's own chip counts apply all of them except that group's.
  const matchers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return {
      category: (p: Product) => categories.length === 0 || categories.some((c) => p.sections.includes(c)),
      species: (p: Product) => species.length === 0 || (p.species !== null && species.includes(p.species)),
      price: (p: Product) => priceKeys.length === 0 || priceKeys.includes(priceBandKeyOf(p, brandKey)),
      availability: (p: Product) => availability.length === 0 || availability.includes(p.drying ? 'drying' : 'ready'),
      sale: (p: Product) => !onSale || p.onSale,
      search: (p: Product) =>
        q === '' || `${p.name} ${p.sku} ${p.sections.join(' ')} ${p.species ?? ''}`.toLowerCase().includes(q),
    }
  }, [search, categories, species, priceKeys, availability, onSale, brandKey])

  const filtered = useMemo(
    () => visible.filter((p) => Object.values(matchers).every((fn) => fn(p))),
    [visible, matchers],
  )

  // Live, faceted counts: each group counts against every OTHER active group, so a
  // chip shows how many pieces you would get if you picked it given the rest.
  const facetCounts = useMemo(() => {
    const baseFor = (exclude: string) =>
      visible.filter((p) => Object.entries(matchers).every(([k, fn]) => k === exclude || fn(p)))
    const catBase = baseFor('category')
    const spBase = baseFor('species')
    const prBase = baseFor('price')
    const avBase = baseFor('availability')
    const saleBase = baseFor('sale')
    const tally = (arr: Product[], pred: (p: Product) => boolean) =>
      arr.reduce((n, p) => (pred(p) ? n + 1 : n), 0)
    return {
      category: (c: string) => tally(catBase, (p) => p.sections.includes(c)),
      species: (s: string) => tally(spBase, (p) => p.species === s),
      price: (k: string) => tally(prBase, (p) => priceBandKeyOf(p, brandKey) === k),
      availability: (a: string) => tally(avBase, (p) => (p.drying ? 'drying' : 'ready') === a),
      sale: tally(saleBase, (p) => p.onSale),
    }
  }, [visible, matchers, brandKey])

  // Which chips EXIST is computed once from the full brand inventory, so the rail
  // never adds or drops chips while you filter; only their counts and enabled state change.
  const options = useMemo(() => {
    const categoryOpts = sections.filter((s) => s !== 'All')

    const speciesTotals = new Map<string, number>()
    for (const p of visible) if (p.species) speciesTotals.set(p.species, (speciesTotals.get(p.species) ?? 0) + 1)
    const speciesOpts =
      brandKey === 'ht'
        ? [...speciesTotals.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s)
        : []

    const usedBands = new Set(visible.map((p) => priceBandKeyOf(p, brandKey)))
    const priceOpts: { key: string; label: string }[] = priceBandsForBrand(brandKey)
      .filter((b) => usedBands.has(b.key))
      .map((b) => ({ key: b.key, label: b.label }))
    if (usedBands.has(INQUIRE_BAND_KEY)) priceOpts.push({ key: INQUIRE_BAND_KEY, label: 'Inquire' })

    const availabilityOpts: { key: string; label: string }[] = []
    if (visible.some((p) => !p.drying)) availabilityOpts.push({ key: 'ready', label: 'Ready now' })
    if (visible.some((p) => p.drying)) availabilityOpts.push({ key: 'drying', label: 'Still drying' })

    return { categoryOpts, speciesOpts, priceOpts, availabilityOpts, hasSale: visible.some((p) => p.onSale) }
  }, [visible, sections, brandKey])

  const priceLabel = (k: string) => options.priceOpts.find((o) => o.key === k)?.label ?? k
  const activeChips = [
    ...categories.map((c) => ({ id: `cat:${c}`, group: 'Category', value: c, remove: () => toggleIn(setCategories, c) })),
    ...species.map((s) => ({ id: `sp:${s}`, group: 'Species', value: s, remove: () => toggleIn(setSpecies, s) })),
    ...priceKeys.map((k) => ({ id: `pr:${k}`, group: 'Price', value: priceLabel(k), remove: () => toggleIn(setPriceKeys, k) })),
    ...availability.map((a) => ({ id: `av:${a}`, group: 'Availability', value: a === 'drying' ? 'Still drying' : 'Ready now', remove: () => toggleIn(setAvailability, a) })),
    ...(onSale ? [{ id: 'sale', group: 'Status', value: 'On sale', remove: () => setOnSale(false) }] : []),
  ]
  const anyActive = activeChips.length > 0
  const isFiltered = anyActive || search.trim().length > 0
  const clearAll = () => {
    setSearch('')
    setCategories([])
    setSpecies([])
    setPriceKeys([])
    setAvailability([])
    setOnSale(false)
  }

  // Live header stats (the full buyable inventory, not the active filters).
  const onSaleCount = visible.filter((p) => p.onSale).length
  const comingSoon = visible.filter((p) => p.drying).length
  const stats: { n: string; label: string }[] = [
    { n: String(visible.length), label: visible.length === 1 ? 'Piece' : 'Pieces' },
  ]
  if (brand.key === 'ht') stats.push({ n: '24+', label: 'Species' })
  if (onSaleCount > 0) stats.push({ n: String(onSaleCount), label: 'On Sale' })
  else if (comingSoon > 0) stats.push({ n: String(comingSoon), label: 'Still Drying' })

  // Sidebar pins on desktop, just below the fixed switcher + nav chrome; on
  // mobile it stacks above the grid, so it stays in normal flow there.
  const sidebarStyle: CSSProperties = { width: 264, flexShrink: 0 }
  if (isDesktop) {
    sidebarStyle.position = 'sticky'
    sidebarStyle.top = 'calc(var(--switcher-h) + var(--nav-h))'
  }

  const speciesShown = allSpecies ? options.speciesOpts : options.speciesOpts.slice(0, SPECIES_VISIBLE)

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      {/* Header */}
      <div style={{ padding: '38px var(--section-pad-x) 30px', borderBottom: '1px solid var(--border)', background: 'var(--cream)' }}>
        <div className="shop-header-inner" style={{
          maxWidth: 'var(--content-wide)', margin: '0 auto', display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: 660 }}>
            <div className="label" style={{ marginBottom: 10 }}>
              {brand.key === 'ht' ? 'Wood Inventory' : 'Finished Pieces'}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 60px)', fontWeight: 800,
              letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--black)', lineHeight: 0.95, marginBottom: 12,
            }}>
              {brand.key === 'ht' ? 'Shop the Slab Yard' : 'Finished Pieces'}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray-dark)', maxWidth: 580, lineHeight: 1.65, fontStyle: 'italic' }}>
              {brand.key === 'ht'
                ? 'Every piece is one of a kind, locally harvested and solar kiln dried in-house. Every photo is a real piece in our current inventory; when one sells, we take it down.'
                : 'Handcrafted furniture built to last a lifetime. Every photo is a real piece; once it sells, we take it down.'}
            </p>
          </div>

          {/* Live stat strip */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {stats.map((st, i) => (
              <div key={st.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '0 22px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, color: 'var(--green)', letterSpacing: '-1px', lineHeight: 1 }}>
                  {st.n}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginTop: 7 }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop layout — outer padding + inner max-width mirrors the header so
          the sidebar/grid edges align exactly with the title and stats above. */}
      <div style={{ padding: '38px var(--section-pad-x) 64px' }}>
        <div className="shop-layout" style={{
          display: 'flex', gap: 40,
          maxWidth: 'var(--content-wide)', margin: '0 auto', alignItems: 'flex-start',
        }}>
        {/* Sidebar: search + faceted filter groups */}
        <aside className="shop-sidebar" style={sidebarStyle}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <MagnifyingGlass size={16} weight="bold" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--green)', pointerEvents: 'none' }} />
            <input
              type="text"
              aria-label="Search pieces"
              placeholder="Species, piece no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = '#fff' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--cream)' }}
              style={{
                width: '100%', padding: '12px 14px 12px 40px', fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-14)', border: '1.5px solid var(--border)', background: 'var(--cream)',
                color: 'var(--black)', outline: 'none', borderRadius: 'var(--radius)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            />
          </div>

          {/* On sale: a featured quick toggle */}
          {options.hasSale && (
            <button
              type="button"
              className="shop-saletoggle"
              aria-pressed={onSale}
              onClick={() => setOnSale((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                width: '100%', padding: '13px 15px', marginBottom: 8, cursor: 'pointer',
                borderRadius: 'var(--radius)', border: `1px solid ${onSale ? 'var(--green)' : 'var(--border)'}`,
                background: onSale ? 'var(--green)' : '#fff', color: onSale ? '#fff' : 'var(--gray-dark)',
                transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <Tag size={15} weight={onSale ? 'fill' : 'bold'} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>On sale</span>
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)', fontWeight: 700, color: onSale ? 'rgba(255,255,255,0.78)' : 'var(--gray)' }}>{facetCounts.sale}</span>
            </button>
          )}

          {options.categoryOpts.length >= 2 && (
            <FilterGroup id="category" title="Category" activeCount={categories.length} open={!!openGroups.category} onToggle={() => toggleGroup('category')}>
              {options.categoryOpts.map((c) => (
                <Chip key={c} label={c} count={facetCounts.category(c)} active={categories.includes(c)} onClick={() => toggleIn(setCategories, c)} />
              ))}
            </FilterGroup>
          )}

          {options.speciesOpts.length >= 2 && (
            <FilterGroup id="species" title="Species" activeCount={species.length} open={!!openGroups.species} onToggle={() => toggleGroup('species')}>
              {speciesShown.map((s) => (
                <Chip key={s} label={s} count={facetCounts.species(s)} active={species.includes(s)} onClick={() => toggleIn(setSpecies, s)} />
              ))}
              {options.speciesOpts.length > SPECIES_VISIBLE && (
                <button type="button" className="shop-more" onClick={() => setAllSpecies((v) => !v)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', padding: '6px 11px', cursor: 'pointer',
                    borderRadius: 999, border: '1px dashed var(--border)', background: 'transparent',
                    color: 'var(--gray)', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)',
                  }}>
                  {allSpecies ? 'Show less' : `+${options.speciesOpts.length - SPECIES_VISIBLE} more`}
                </button>
              )}
            </FilterGroup>
          )}

          {options.priceOpts.length >= 2 && (
            <FilterGroup id="price" title="Price" activeCount={priceKeys.length} open={!!openGroups.price} onToggle={() => toggleGroup('price')}>
              {options.priceOpts.map((o) => (
                <Chip key={o.key} label={o.label} count={facetCounts.price(o.key)} active={priceKeys.includes(o.key)} onClick={() => toggleIn(setPriceKeys, o.key)} />
              ))}
            </FilterGroup>
          )}

          {options.availabilityOpts.length >= 2 && (
            <FilterGroup id="availability" title="Availability" activeCount={availability.length} open={!!openGroups.availability} onToggle={() => toggleGroup('availability')} last>
              {options.availabilityOpts.map((o) => (
                <Chip key={o.key} label={o.label} count={facetCounts.availability(o.key)} active={availability.includes(o.key)} onClick={() => toggleIn(setAvailability, o.key)} />
              ))}
            </FilterGroup>
          )}
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {anyActive && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }}>
                Filtering
              </span>
              {activeChips.map((c) => (
                <ActiveBadge key={c.id} group={c.group} value={c.value} onRemove={c.remove} />
              ))}
              <button type="button" className="shop-clear" onClick={clearAll}
                style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--green)' }}>
                Clear all
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray)' }}>
              {isFiltered ? 'Filtered' : 'All pieces'} · {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--gray)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-16)', fontStyle: 'italic', marginBottom: isFiltered ? 18 : 0 }}>
                {products.length === 0
                  ? 'Inventory is loading. Check back in a moment.'
                  : 'No pieces match. Try a different search or fewer filters.'}
              </p>
              {isFiltered && (
                <button type="button" className="shop-clear" onClick={clearAll}
                  style={{ cursor: 'pointer', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 18px', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-11)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      <style>{`
        .shop-chip:focus-visible, .shop-grouphdr:focus-visible, .shop-saletoggle:focus-visible,
        .shop-clear:focus-visible, .shop-more:focus-visible, .shop-chip-x:focus-visible {
          outline: 2px solid var(--green); outline-offset: 2px;
        }
        .shop-chip[aria-pressed="false"]:not(:disabled):hover { border-color: var(--green); background: rgba(42,92,63,0.06); }
        .shop-saletoggle[aria-pressed="false"]:hover { border-color: var(--green); }
        .shop-more:hover { border-color: var(--green); color: var(--green); }
        .shop-chip-x { width: 18px; height: 18px; }
        .shop-chip-x:hover { background: rgba(0,0,0,0.1); }
        /* Comfortable touch targets when the rail stacks on mobile (matches the 768px stack point). */
        @media (max-width: 768px) {
          .shop-chip { min-height: 44px; }
          .shop-chip-x { width: 30px; height: 30px; }
          .shop-more { min-height: 40px; }
        }
        @keyframes shopGridFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .shop-grid { animation: shopGridFade 0.35s cubic-bezier(0.22, 0.61, 0.36, 1); }
        @media (prefers-reduced-motion: reduce) { .shop-grid { animation: none; } }
      `}</style>
    </div>
  )
}

/** A collapsible filter group: a pill header that keeps its active-count badge when collapsed. */
function FilterGroup({ id, title, activeCount, open, onToggle, last, children }: {
  id: string
  title: string
  activeCount: number
  open: boolean
  onToggle: () => void
  last?: boolean
  children: ReactNode
}) {
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <button
        type="button"
        className="shop-grouphdr"
        aria-expanded={open}
        aria-controls={`group-${id}`}
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          width: '100%', padding: '15px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--black)' }}>
            {title}
          </span>
          {activeCount > 0 && (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, color: '#fff', background: 'var(--green)', padding: '2px 8px', borderRadius: 999, lineHeight: 1.4 }}>
              {activeCount}
            </span>
          )}
        </span>
        <CaretDown size={14} weight="bold" style={{ color: 'var(--gray)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>
      {open && (
        <div id={`group-${id}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 7, paddingBottom: 16 }}>
          {children}
        </div>
      )}
    </div>
  )
}

/** A selectable count chip. Disabled (dimmed) when its live count is 0 and it is not already chosen. */
function Chip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  const disabled = count === 0 && !active
  return (
    <button
      type="button"
      className="shop-chip"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '6px 11px', borderRadius: 999,
        border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
        background: active ? 'var(--green)' : '#fff',
        color: active ? '#fff' : disabled ? 'var(--gray)' : 'var(--gray-dark)',
        opacity: disabled ? 0.45 : 1,
        fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)', fontWeight: 700, letterSpacing: '0.3px',
        transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 'var(--fs-11)', fontWeight: 700, color: active ? 'rgba(255,255,255,0.72)' : 'var(--gray)' }}>{count}</span>
    </button>
  )
}

/** An applied filter shown above the grid: `group │ value ✕`, removable. */
function ActiveBadge({ group, value, onRemove }: { group: string; value: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 5px 5px 11px',
      background: '#fff', border: '1px solid var(--border)', borderRadius: 999,
      fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', color: 'var(--gray)',
    }}>
      {group}
      <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.3px', color: 'var(--black)' }}>{value}</span>
      <button
        type="button"
        className="shop-chip-x"
        aria-label={`Remove ${group} ${value}`}
        onClick={onRemove}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--gray)', cursor: 'pointer' }}
      >
        <X size={11} weight="bold" />
      </button>
    </span>
  )
}
