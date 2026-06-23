import { NextResponse } from 'next/server'
import { getSquareClient, getAvailabilityMap } from '@/lib/square'

interface CheckoutLine {
  catalogObjectId: string
  qty: number
}

export async function POST(request: Request) {
  try {
    const client = getSquareClient()
    const locationId = process.env.SQUARE_LOCATION_ID
    if (!client || !locationId) {
      return NextResponse.json({ error: 'Checkout is not configured yet.' }, { status: 503 })
    }

    const body = (await request.json()) as { items?: CheckoutLine[] }
    const items = (body.items ?? []).filter(
      (i): i is CheckoutLine =>
        typeof i?.catalogObjectId === 'string' && i.catalogObjectId.length > 0 && Number(i?.qty) > 0,
    )
    if (items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    // Re-verify availability against Square. For one-of-a-kind pieces, a slab that sold
    // between page load and checkout must not be purchasable a second time.
    const availability = await getAvailabilityMap(
      client,
      items.map((i) => i.catalogObjectId),
    )
    const unavailable = items.filter(
      (i) => i.catalogObjectId in availability && !availability[i.catalogObjectId],
    )
    if (unavailable.length > 0) {
      return NextResponse.json(
        {
          error: 'One or more pieces just sold. Please remove them and try again.',
          unavailable: unavailable.map((i) => i.catalogObjectId),
        },
        { status: 409 },
      )
    }

    const origin = request.headers.get('origin') ?? new URL(request.url).origin

    // Square builds the order from the catalog variation ids and computes the authoritative
    // price; the client-supplied price is never trusted.
    const res = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId,
        lineItems: items.map((i) => ({
          quantity: String(i.qty),
          catalogObjectId: i.catalogObjectId,
        })),
      },
      checkoutOptions: {
        redirectUrl: `${origin}/shop/success`,
        askForShippingAddress: true,
        merchantSupportEmail: 'hillsidetimbersd@gmail.com',
      },
    })

    const url = res.paymentLink?.url ?? res.paymentLink?.longUrl
    if (!url) {
      return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
