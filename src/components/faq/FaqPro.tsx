'use client'

import { useState, useMemo, useEffect, Fragment, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CaretDown, MagnifyingGlass, X } from '@phosphor-icons/react'
import Link from 'next/link'

export type FaqItem = {
  /** Stable id; used for the deep-link anchor (e.g. /faq#shipping). */
  id: string
  question: string
  answer: string
  /** Optional link rendered under the answer (e.g. to /services). */
  cta?: { href: string; label: string }
}

// Springs lifted from the faq-pro reference so the motion feels identical.
const EXPAND = { type: 'spring', stiffness: 150, damping: 26, mass: 1.05 } as const
const COLLAPSE = { type: 'spring', stiffness: 190, damping: 30, mass: 1.1 } as const
const EASE = [0.16, 1, 0.3, 1] as const

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Wrap matches of `query` in a warm highlight. */
function highlight(text: string, query: string): ReactNode {
  const q = query.trim()
  if (!q) return text
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} style={{ background: 'rgba(200,168,130,0.5)', color: 'var(--black)', borderRadius: 2, padding: '0 2px' }}>
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

function matchesQuery(item: FaqItem, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
}

/**
 * Searchable FAQ accordion in the "faq-pro" style: a rounded pill search field,
 * rounded muted rows, a chevron that rotates, spring-animated expand/collapse,
 * search highlighting, and an empty state. Brand tokens + Phosphor + motion.
 *
 * Deep links: visiting with a hash that matches an item id (e.g. /faq#shipping)
 * opens that answer and scrolls it into view.
 */
export default function FaqPro({
  items,
  searchPlaceholder = 'Search questions…',
  defaultOpenFirst = true,
  searchable = true,
}: {
  items: FaqItem[]
  searchPlaceholder?: string
  defaultOpenFirst?: boolean
  searchable?: boolean
}) {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(defaultOpenFirst && items[0] ? items[0].id : null)

  const searching = query.trim().length > 0
  const visible = useMemo(() => items.filter((it) => matchesQuery(it, query)), [items, query])

  // Keep a sensible item open while filtering, without syncing state in an effect.
  const effectiveOpenId =
    openId && visible.some((v) => v.id === openId) ? openId : searching ? visible[0]?.id ?? null : openId

  // Deep-link: /…#<id> opens and scrolls to that answer. setState runs inside rAF
  // (not synchronously in the effect body) so it sequences open-then-scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    if (!hash || !items.some((it) => it.id === hash)) return
    const el = document.getElementById(`faq-${hash}`)
    requestAnimationFrame(() => {
      setOpenId(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [items])

  return (
    <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {searchable && (
        <div style={{ position: 'relative' }}>
          <MagnifyingGlass
            size={18}
            aria-hidden="true"
            style={{ position: 'absolute', top: '50%', left: 18, transform: 'translateY(-50%)', color: 'var(--gray)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--green)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            style={{
              height: 50, width: '100%', borderRadius: 999, border: '1px solid var(--border)', background: '#fff',
              padding: '0 44px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--black)',
              outline: 'none', transition: 'border-color 0.15s',
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              style={{ position: 'absolute', top: '50%', right: 11, transform: 'translateY(-50%)', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--gray)' }}
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence initial={false}>
          {visible.length > 0 ? (
            visible.map((item) => {
              const isOpen = effectiveOpenId === item.id
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  id={`faq-${item.id}`}
                  style={{ scrollMarginTop: 'calc(var(--switcher-h) + var(--nav-h) + 16px)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '16px 20px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-16)', fontWeight: 700, letterSpacing: '0.2px', color: 'var(--black)', lineHeight: 1.4 }}>
                      {highlight(item.question, query)}
                    </span>
                    <CaretDown
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      style={{ marginTop: 3, flexShrink: 0, color: 'var(--green)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0 }} transition={{ height: isOpen ? EXPAND : COLLAPSE }} style={{ overflow: 'hidden' }}>
                    <motion.div
                      initial={false}
                      animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -6 }}
                      transition={{ opacity: { duration: isOpen ? 0.38 : 0.2, ease: EASE, delay: isOpen ? 0.06 : 0 }, y: isOpen ? EXPAND : COLLAPSE }}
                      style={{ padding: '0 20px 18px', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray-dark)', lineHeight: 1.7 }}
                    >
                      {highlight(item.answer, query)}
                      {item.cta && (
                        <Link
                          href={item.cta.href}
                          style={{ display: 'inline-block', marginTop: 10, fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13)', fontWeight: 600, color: 'var(--green)', textDecoration: 'underline', textUnderlineOffset: 3 }}
                        >
                          {item.cta.label} →
                        </Link>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })
          ) : (
            <motion.p
              key="faq-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '32px 8px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-15)', color: 'var(--gray)' }}
            >
              No questions match your search.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
