'use client'

import { useState, useEffect, useCallback } from 'react'

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

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(readCart())
    const onStorage = () => setItems(readCart())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const persist = useCallback((next: CartItem[]) => {
    localStorage.setItem(KEY, JSON.stringify(next))
    setItems(next)
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      const next = existing
        ? prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearCart = useCallback(() => persist([]), [persist])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return { items, count, subtotal, addItem, removeItem, clearCart }
}
