import { NextResponse } from 'next/server'
import { sendEmail, emailConfigured, escapeHtml, OWNER_EMAIL } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      message?: string
      company?: string
    }

    // Honeypot: a real person never fills the hidden "company" field. Quietly accept and drop.
    if (body.company) return NextResponse.json({ success: true })

    const name = body.name?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const message = body.message?.trim() ?? ''

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please add your name, email, and a message.' }, { status: 400 })
    }
    if (!/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!emailConfigured()) {
      return NextResponse.json(
        { error: 'Messaging is not set up yet. Please call (605) 310-4846 or email us directly.' },
        { status: 503 },
      )
    }

    const sent = await sendEmail({
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `New website message from ${name}`,
      html: `
        <p>New message from the contact form:</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
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
