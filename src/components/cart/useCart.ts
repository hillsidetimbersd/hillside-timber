'use client'

import { useCallback, useSyncExternalStore } from 'react'

export interface CartItem {
  id: string
  /** Square item variation id, used to build the authoritative order at checkout. */
  catalogObjectId: string
  name: string
  price: number
  image?: string
  qty: number
}

const KEY = 'woodworking-cart'
const EMPTY: CartItem[] = []

// Shared external store: one source of truth for every component reading the cart.
// useSyncExternalStore is the React-blessed way to subscribe to a non-React store
// (localStorage here), and it removes the set-state-in-effect hydration flash. As a
// bonus it fixes a real bug in the old effect version: `storage` events don't fire in
// the tab that wrote them, so two `useCart()` consumers in the same tab never stayed
// in sync. Now every mutation notifies all subscribers directly.
let cachedRaw: string | null = null
let cachedItems: CartItem[] = EMPTY
const listeners = new Set<() => void>()

function readRaw(): string {
  if (typeof window === 'undefined') return '[]'
  return localStorage.getItem(KEY) ?? '[]'
}

/** A parsed entry is only trusted if it has the fields the cart math relies on.
 *  Guards against a stale/tampered/legacy value under the key poisoning totals. */
function isCartItem(v: unknown): v is CartItem {
  if (typeof v !== 'object' || v === null) return false
  const i = v as Record<string, unknown>
  return (
    typeof i.id === 'string' &&
    typeof i.catalogObjectId === 'string' &&
    typeof i.name === 'string' &&
    typeof i.price === 'number' &&
    Number.isFinite(i.price) &&
    typeof i.qty === 'number' &&
    Number.isFinite(i.qty) &&
    i.qty > 0
  )
}

// Must return a referentially stable value when the data is unchanged, or
// useSyncExternalStore will loop. We re-parse only when the raw string changes.
function getSnapshot(): CartItem[] {
  const raw = readRaw()
  if (raw === cachedRaw) return cachedItems
  cachedRaw = raw
  try {
    // JSON.parse only throws on malformed JSON; a valid-but-wrong value (null, a
    // number, an object) parses fine, so we must also confirm it is an array of
    // well-formed items. Otherwise items.reduce() below crashes every cart reader,
    // including the Nav badge mounted on every page.
    const parsed: unknown = JSON.parse(raw)
    cachedItems = Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY
  } catch {
    cachedItems = EMPTY
  }
  return cachedItems
}

function getServerSnapshot(): CartItem[] {
  return EMPTY
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

function write(next: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(next))
  cachedRaw = null // force a re-read (and fresh reference) on the next snapshot
  listeners.forEach((notify) => notify())
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addItem = useCallback((item: Omit<CartItem, 'qty'>) => {
    const prev = getSnapshot()
    const existing = prev.find((i) => i.id === item.id)
    write(
      existing
        ? prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...item, qty: 1 }],
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    write(getSnapshot().filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => write(EMPTY), [])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return { items, count, subtotal, addItem, removeItem, clearCart }
}
