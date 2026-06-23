'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react'
import { useCart } from '@/components/cart/useCart'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  // The buyer reaches this page only after Square processes payment, so the cart is spent.
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div style={{
        maxWidth: 620,
        margin: '0 auto',
        padding: '100px 24px 120px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ color: 'var(--green)', marginBottom: 28 }}>
          <CheckCircle size={56} weight="duotone" />
        </div>

        <div className="label" style={{ marginBottom: 16 }}>Order Confirmed</div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 5vw, 56px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          color: 'var(--black)',
          lineHeight: 0.95,
          marginBottom: 24,
        }}>
          Thank you.
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          color: 'var(--gray-dark)',
          lineHeight: 1.8,
          fontStyle: 'italic',
          maxWidth: 440,
          marginBottom: 40,
        }}>
          Your payment went through and a receipt is on its way to your email. We will be in touch
          shortly to arrange pickup or freight. Every piece is one of a kind, and yours is now
          reserved for you.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/shop" className="btn-primary">Continue Browsing</Link>
          <Link href="/" className="btn-ghost">Back Home</Link>
        </div>
      </div>
    </div>
  )
}
