'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/square'
import { FALLBACK_PRODUCTS_CLIENT } from '@/app/shop/products-client'
import { recommendTable } from './calculator-data'

type Seats = 4 | 6 | 8 | 10 | 12

const SEAT_OPTIONS: Seats[] = [4, 6, 8, 10, 12]

export default function TablePlanner() {
  const [seats, setSeats] = useState<Seats>(8)
  const [liveEdge, setLiveEdge] = useState(true)
  const [epoxy, setEpoxy] = useState(false)
  const [roomL, setRoomL] = useState('')
  const [roomW, setRoomW] = useState('')

  const recommendation = useMemo(() => {
    const roomLengthFt = roomL ? parseFloat(roomL) : undefined
    const roomWidthFt = roomW ? parseFloat(roomW) : undefined
    return recommendTable({
      seats,
      liveEdge,
      epoxy,
      roomLengthFt: roomLengthFt && !isNaN(roomLengthFt) ? roomLengthFt : undefined,
      roomWidthFt: roomWidthFt && !isNaN(roomWidthFt) ? roomWidthFt : undefined,
    })
  }, [seats, liveEdge, epoxy, roomL, roomW])

  // Match inventory to recommendation
  const matches = useMemo(() => {
    return FALLBACK_PRODUCTS_CLIENT
      .filter((p) => {
        if (p.brand !== 'ht' && p.brand !== 'both') return false
        if (p.type !== 'Live Edge Slab' && p.type !== 'Mantel' && p.type !== 'Table') return false
        const match = p.dimensions.match(/(\d+(?:\.\d+)?)"\s*x\s*(\d+(?:\.\d+)?)"/)
        if (!match) return false
        const slabLength = parseFloat(match[1])
        const slabWidth = parseFloat(match[2])
        const needsWidth = epoxy ? 22 : recommendation.widthMin - 4
        return slabLength >= recommendation.minLength && slabWidth >= needsWidth
      })
      .slice(0, 2)
  }, [recommendation, epoxy])

  return (
    <div className="tp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      {/* LEFT: Inputs */}
      <div>
        <SectionLabel>How many people are you seating?</SectionLabel>
        <div className="tp-seat-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
          marginBottom: 32,
        }}>
          {SEAT_OPTIONS.map((n) => {
            const active = seats === n
            return (
              <button
                key={n}
                onClick={() => setSeats(n)}
                style={{
                  padding: '14px 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: active ? '#fff' : 'var(--gray)',
                  border: `1px solid ${active ? 'var(--black)' : 'var(--border)'}`,
                  background: active ? 'var(--black)' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {n}{n === 12 ? '+' : ''}
              </button>
            )
          })}
        </div>

        <SectionLabel>Table style</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 32,
        }}>
          <ToggleCard
            active={liveEdge}
            title="Live Edge"
            desc={'Natural bark edge preserved. Width varies 2–4" along the slab.'}
            onClick={() => setLiveEdge(!liveEdge)}
          />
          <ToggleCard
            active={epoxy}
            title="Epoxy / River"
            desc="Two bookmatched slabs with an epoxy pour between them."
            onClick={() => setEpoxy(!epoxy)}
          />
        </div>

        <SectionLabel>
          Room dimensions <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: '11px', color: 'var(--gray)' }}>(optional)</span>
        </SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 12,
          alignItems: 'center',
          marginBottom: 28,
        }}>
          <RoomInput label="Length" value={roomL} onChange={setRoomL} placeholder="14" />
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            color: 'var(--gray)',
            textAlign: 'center',
            paddingTop: 24,
          }}>×</div>
          <RoomInput label="Width" value={roomW} onChange={setRoomW} placeholder="12" />
        </div>

        {recommendation.maxSupportedLength !== null && (
          <div style={{
            background: 'var(--cream)',
            border: '1px solid var(--border)',
            padding: '16px 20px',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--gray)',
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}>
            Standard dining clearance is 36" on each side. Your {roomL} ft room supports a table up to{' '}
            <span style={{ color: 'var(--green)', fontStyle: 'normal' }}>
              {recommendation.maxSupportedLength}" long
            </span>
            {' '}comfortably.
          </div>
        )}
      </div>

      {/* RIGHT: Result */}
      <div style={{
        background: 'var(--black)',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignSelf: 'start',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--tan)',
            marginBottom: 10,
          }}>
            Recommended Slab Size
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '38px',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
          }}>
            {recommendation.isRiverTable ? (
              <>
                2 slabs<br />
                {recommendation.widthMin}–{recommendation.widthMax}" × {recommendation.idealLengthMin}"
              </>
            ) : (
              <>
                {recommendation.widthMin}–{recommendation.widthMax}" × {recommendation.idealLengthMin}"
              </>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
            fontStyle: 'italic',
            marginTop: 8,
          }}>
            {recommendation.isRiverTable
              ? `River table · ${seats} seats · each slab ~${Math.round((recommendation.widthMin - 4) / 2)}" wide before pour`
              : `${seats} seats · seats ${Math.floor(seats / 2)} per long side`
            }
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StatRow label="Min. Slab Length" value={`${recommendation.minLength}"`} />
          <StatRow label="Ideal Length" value={`${recommendation.idealLengthMin}–${recommendation.idealLengthMax}"`} />
          <StatRow
            label={recommendation.isRiverTable ? 'Each Slab Width' : 'Recommended Width'}
            value={recommendation.isRiverTable
              ? `${Math.round((recommendation.widthMin - 4) / 2)}–${Math.round((recommendation.widthMax - 4) / 2)}"`
              : `${recommendation.widthMin}–${recommendation.widthMax}"`
            }
          />
          {recommendation.isRiverTable && (
            <StatRow
              label="Epoxy Channel"
              value={`${recommendation.epoxyChannelMin}–${recommendation.epoxyChannelMax}" typical`}
            />
          )}
          <StatRow label="Standard Table Height" value={`${recommendation.tableHeightMin}–${recommendation.tableHeightMax}"`} />
        </div>

        {recommendation.isRiverTable && (
          <div style={{
            background: 'rgba(200, 168, 130, 0.08)',
            border: '1px solid rgba(200, 168, 130, 0.25)',
            padding: '16px 20px',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'rgba(200, 168, 130, 0.9)',
            lineHeight: 1.6,
          }}>
            River tables need{' '}
            <strong style={{ fontStyle: 'normal', color: 'var(--tan)' }}>two bookmatched slabs</strong>
            {' '}from the same log for a mirrored grain pattern. We source matched pairs. Ask about availability when you request a quote.
          </div>
        )}

        {recommendation.roomFits !== null && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: recommendation.roomFits ? 'rgba(42, 92, 63, 0.2)' : 'rgba(192, 57, 43, 0.2)',
            border: `1px solid ${recommendation.roomFits ? 'rgba(42, 92, 63, 0.5)' : 'rgba(192, 57, 43, 0.5)'}`,
            padding: '10px 16px',
            alignSelf: 'flex-start',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: recommendation.roomFits ? 'var(--green)' : '#c0392b',
            }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: recommendation.roomFits ? '#a8c898' : '#e8a08a',
            }}>
              {recommendation.roomFits
                ? `Fits comfortably in a ${roomL} × ${roomW} ft room`
                : `Room is a bit tight for this table. Consider a smaller slab or larger room.`
              }
            </span>
          </div>
        )}
      </div>

      {/* Inventory match — full width below grid */}
      <div style={{ gridColumn: '1 / -1', marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 28 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--green)',
          marginBottom: 16,
        }}>
          Matching Slabs in the Yard
        </div>
        <div className="tp-inventory" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}>
          {matches.map((product) => (
            <InventoryCard key={product.id} product={product} />
          ))}
          {/* Always show fallback CTA card */}
          <Link
            href="/custom"
            style={{
              border: '1px dashed var(--border)',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 12,
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--green)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--gray)',
              lineHeight: 1.6,
            }}>
              {recommendation.isRiverTable
                ? 'Need a matched pair or a specific species for a river table?'
                : 'Need a specific size or species not in the yard right now?'
              }
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--green)',
              border: '1px solid var(--green)',
              padding: '10px 20px',
              alignSelf: 'center',
            }}>
              Request a Custom Piece →
            </span>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tp-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .tp-seat-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .tp-inventory { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'var(--green)',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}

function ToggleCard({ active, title, desc, onClick }: {
  active: boolean
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? 'var(--black)' : 'var(--border)'}`,
        background: active ? 'var(--black)' : '#fff',
        padding: '16px 18px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: active ? '#fff' : 'var(--gray)',
        }}>
          {title}
        </span>
        <div style={{
          width: 16,
          height: 16,
          border: `1px solid ${active ? '#fff' : 'var(--border)'}`,
          background: active ? 'var(--green)' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#fff',
          fontWeight: 700,
        }}>
          {active && '✓'}
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontStyle: 'italic',
        color: active ? 'rgba(255,255,255,0.55)' : 'var(--gray)',
        lineHeight: 1.5,
      }}>
        {desc}
      </div>
    </button>
  )
}

function RoomInput({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--gray)',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        style={{
          width: '100%',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          padding: '14px 18px',
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--black)',
          outline: 'none',
        }}
      />
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontStyle: 'italic',
        color: 'var(--gray)',
        marginTop: 6,
      }}>
        Feet
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--tan)',
      }}>
        {value}
      </span>
    </div>
  )
}

function InventoryCard({ product }: { product: { id: string; name: string; dimensions: string; kilnStatus: string; price: number; species: string } }) {
  const kilnLabel = product.kilnStatus === 'solar-kiln' ? 'Solar Kiln' : product.kilnStatus === 'air-dried' ? 'Air Dried' : 'Green'
  return (
    <Link href={`/shop?species=${encodeURIComponent(product.species)}`} style={{
      border: '1px solid var(--border)',
      background: '#fff',
      padding: 16,
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--green)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '13px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--black)',
      }}>
        {product.name}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontStyle: 'italic',
        color: 'var(--gray)',
      }}>
        {product.dimensions} · {kilnLabel}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--black)',
        marginTop: 4,
      }}>
        {formatPrice(product.price)}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--green)',
        marginTop: 6,
      }}>
        View Slab →
      </div>
    </Link>
  )
}
