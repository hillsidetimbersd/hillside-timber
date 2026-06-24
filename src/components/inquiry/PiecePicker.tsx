'use client'

import { useMemo, useState } from 'react'
import { MagnifyingGlass, X, Tag } from '@phosphor-icons/react'
import type { PiecePreview } from '@/lib/squarespace'

/**
 * Shared product-reference picker used by every inquiry surface (contact, FAQ,
 * custom project form). The visitor searches the live catalog by Piece No.,
 * name, or species and attaches one or more real pieces to their message.
 *
 * Controlled: the host owns the selected list (`value` / `onChange`) so it can
 * react to the selection (e.g. seed a message). Query state stays internal.
 *
 * Two sizes so it looks native in each host:
 *  - `lg` (default): full-width forms (contact, FAQ). Results float as an overlay.
 *  - `sm`: the compact 640px custom-project card. Results render inline so the
 *    card's `overflow: hidden` never clips them and there's no z-index fragility.
 */

interface SizeTokens {
  inputFont: string
  inputPad: string
  inputPadLeft: number
  iconLeft: number
  iconTop: number
  resultImg: number
  cardImg: number
  cardName: string
  floating: boolean
}

const SIZES: Record<'lg' | 'sm', SizeTokens> = {
  lg: {
    inputFont: 'var(--fs-14)', inputPad: '12px 14px', inputPadLeft: 38,
    iconLeft: 13, iconTop: 14, resultImg: 44, cardImg: 84, cardName: 'var(--fs-16)',
    floating: true,
  },
  sm: {
    inputFont: 'var(--fs-13)', inputPad: '10px 12px', inputPadLeft: 34,
    iconLeft: 11, iconTop: 12, resultImg: 38, cardImg: 60, cardName: 'var(--fs-14)',
    floating: false,
  },
}

const FIELD_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)',
}

interface Props {
  pieces: PiecePreview[]
  value: PiecePreview[]
  onChange: (next: PiecePreview[]) => void
  /** Visual scale. `lg` for full-width forms, `sm` for the compact custom card. */
  size?: 'lg' | 'sm'
  /** Unique per host so the input id / label association never collides. */
  idPrefix?: string
  /** Field label. Falls back to a selection-aware default. */
  label?: string
  /** Helper text shown inline next to the label. */
  hint?: string
  /** Longer helper line shown under the label (matches the form's label → helper → control rhythm). */
  description?: string
  /** Search input placeholder before anything is picked. */
  placeholder?: string
}

export default function PiecePicker({
  pieces, value, onChange,
  size = 'lg', idPrefix = 'piece',
  label, hint = 'optional, add as many as you like', description,
  placeholder = 'Search by Piece No., name, or species…',
}: Props) {
  const [query, setQuery] = useState('')
  const t = SIZES[size]
  const inputId = `${idPrefix}-search`
  const has = value.length > 0

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return pieces
      .filter((p) => !value.some((s) => s.sku === p.sku))
      .filter((p) => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query, pieces, value])

  function addPiece(p: PiecePreview) {
    if (!value.some((x) => x.sku === p.sku)) onChange([...value, p])
    setQuery('')
  }
  function removePiece(sku: string) {
    onChange(value.filter((x) => x.sku !== sku))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', fontFamily: 'var(--font-body)', fontSize: t.inputFont,
    padding: t.inputPad, paddingLeft: t.inputPadLeft,
    border: '1px solid var(--border)', outline: 'none', background: '#fff',
    color: 'var(--black)', borderRadius: 'var(--radius)', transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  }

  const resultsList = results.length > 0 && (
    <div
      role="listbox"
      aria-label="Matching pieces"
      style={{
        background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)', overflow: 'hidden', maxHeight: 320, overflowY: 'auto',
        ...(t.floating
          ? { position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20 }
          : { marginTop: 6 }),
      }}
    >
      {results.map((p) => (
        <button
          key={p.id}
          type="button"
          role="option"
          aria-selected={false}
          onClick={() => addPiece(p)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
            padding: '10px 12px', background: 'none', border: 'none',
            borderBottom: '1px solid var(--border)', cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cream)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt="" style={{ width: t.resultImg, height: t.resultImg, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, background: '#e0dbd0' }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.name}{p.drying ? <span style={{ color: 'var(--green)' }}> · Still Drying</span> : ''}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--gray)' }}>Piece No. {p.sku}</span>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 800, color: 'var(--green)', flexShrink: 0 }}>{p.priceLabel}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div>
      <label htmlFor={inputId} style={{ ...FIELD_LABEL, display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6 }}>
        {label ?? (has ? `Your pieces (${value.length})` : 'Which pieces?')}
        {hint && (
          <span className="muted-text" style={{ letterSpacing: '0.3px', textTransform: 'none', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)', fontWeight: 400 }}>
            {hint}
          </span>
        )}
      </label>

      {description && (
        <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-11)', lineHeight: 1.6, marginTop: -2, marginBottom: 10 }}>
          {description}
        </p>
      )}

      {has && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {value.map((p) => (
            <PieceCard key={p.sku} piece={p} imgSize={t.cardImg} nameSize={t.cardName} onRemove={() => removePiece(p.sku)} />
          ))}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <MagnifyingGlass size={16} weight="bold" style={{ position: 'absolute', left: t.iconLeft, top: t.iconTop, color: 'var(--green)', pointerEvents: 'none' }} />
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={has ? 'Add another piece…' : placeholder}
          autoComplete="off"
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          style={inputStyle}
        />
        {resultsList}
      </div>

      {query.trim().length >= 2 && results.length === 0 && (
        <p className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', marginTop: 8 }}>
          No pieces match that. Try a species or a Piece No., or just describe it in your message.
        </p>
      )}
    </div>
  )
}

/** An elevated, shop-card-style summary of one chosen piece. */
function PieceCard({ piece, imgSize, nameSize, onRemove }: { piece: PiecePreview; imgSize: number; nameSize: string; onRemove: () => void }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: 12,
        background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--green)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={piece.image} alt={piece.name} style={{ width: imgSize, height: imgSize, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0, background: '#e0dbd0', display: 'block' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--green)' }}>{piece.section}</span>
          {piece.drying && (
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1px',
              textTransform: 'uppercase', color: 'var(--green)', background: 'rgba(42,92,63,0.1)', padding: '2px 7px', borderRadius: 999,
            }}>
              Still Drying
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: nameSize, fontWeight: 700, textTransform: 'uppercase', color: 'var(--black)', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 7 }}>
          {piece.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {piece.dimensions && (
            <span className="muted-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12)' }}>{piece.dimensions}</span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--cream)', border: '1px solid var(--border)' }}>
            <Tag size={11} weight="fill" style={{ color: 'var(--green)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-9)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gray)' }}>No.</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-10)', fontWeight: 800, color: 'var(--black)' }}>{piece.sku}</span>
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-13)', fontWeight: 800, color: 'var(--green)' }}>{piece.priceLabel}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${piece.name}`}
        style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-dark)' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--gray-dark)' }}
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  )
}
