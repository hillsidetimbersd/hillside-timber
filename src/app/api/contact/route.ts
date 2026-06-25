import { NextResponse } from 'next/server'
import { sendEmail, emailConfigured, escapeHtml, OWNER_EMAIL } from '@/lib/email'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const rl = rateLimit(`contact:${clientIp(request)}`, 5, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
      )
    }

    const body = (await request.json()) as {
      name?: string
      email?: string
      message?: string
      company?: string
      pieces?: Array<{ sku?: string; name?: string; dimensions?: string; price?: string; url?: string; drying?: boolean }>
    }

    // Honeypot: a real person never fills the hidden "company" field. Quietly accept and drop.
    if (body.company) return NextResponse.json({ success: true })

    const name = body.name?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const message = body.message?.trim() ?? ''
    // Cap the list so a crafted request can't bloat the owner's email past delivery limits.
    const pieces = (Array.isArray(body.pieces) ? body.pieces.filter((p) => p?.sku) : []).slice(0, 25)

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please add your name, email, and a message.' }, { status: 400 })
    }
    if (!/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    // Length caps so a direct caller cannot bloat the owner's notification email.
    if (name.length > 200 || email.length > 320 || message.length > 5000) {
      return NextResponse.json({ error: 'One or more fields is too long.' }, { status: 400 })
    }
    if (!emailConfigured()) {
      return NextResponse.json(
        { error: 'Messaging is not set up yet. Please call (605) 310-4846 or email us directly.' },
        { status: 503 },
      )
    }

    const piecesHtml = pieces.length
      ? `
        <p style="margin:16px 0 4px;font-weight:bold">Inquiring about ${pieces.length} piece${pieces.length > 1 ? 's' : ''}:</p>
        ${pieces
          .map(
            (pc) => `
        <p style="margin:8px 0;padding:12px 16px;background:#f6f4ef;border-left:3px solid #2a5c3f">
          ${escapeHtml(pc.name ?? '')} (Piece No. ${escapeHtml(pc.sku ?? '')})${pc.drying ? ' &middot; Still Drying' : ''}
          ${pc.dimensions ? `<br>${escapeHtml(pc.dimensions)}` : ''}${pc.price ? ` &middot; ${escapeHtml(pc.price)}` : ''}
          ${pc.url && /^https?:\/\//i.test(pc.url) ? `<br><a href="${escapeHtml(pc.url)}">${escapeHtml(pc.url)}</a>` : ''}
        </p>`,
          )
          .join('')}`
      : ''

    const sent = await sendEmail({
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `New website message from ${name}${pieces.length ? ` · ${pieces.length} piece${pieces.length > 1 ? 's' : ''}` : ''}`,
      html: `
        <p>New message from the contact form:</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        ${piecesHtml}
      `,
    })
    if (!sent) {
      return NextResponse.json(
        { error: 'Could not send your message. Please try again or call us.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
