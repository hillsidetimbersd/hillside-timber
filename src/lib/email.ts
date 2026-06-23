import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM ?? 'Hillside Timber <onboarding@resend.dev>'
export const OWNER_EMAIL = process.env.NOTIFY_EMAIL ?? 'hillsidetimbersd@gmail.com'

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

let client: Resend | null = null
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!client) client = new Resend(key)
  return client
}

/** Escapes user-supplied text before interpolating it into notification email HTML. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Sends an email via Resend. Returns false (rather than throwing) when unconfigured or on failure. */
export async function sendEmail(opts: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}): Promise<boolean> {
  const resend = getResend()
  if (!resend) return false
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    })
    if (error) {
      console.error('Resend error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Resend send failed:', err)
    return false
  }
}
