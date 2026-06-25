import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured, escapeHtml, OWNER_EMAIL } from '@/lib/email'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const rl = rateLimit(`inquiry:${clientIp(request)}`, 5, 60_000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
      )
    }

    const formData = await request.formData()

    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null
    const phone = formData.get('phone') as string | null
    const zip = formData.get('zip') as string | null
    const deliveryMethod = formData.get('deliveryMethod') as string | null
    const projectType = formData.get('projectType') as string | null
    const species = formData.getAll('species') as string[]
    const finish = formData.get('finish') as string | null
    const dimensionsRaw = formData.get('dimensions') as string | null
    const budget = formData.get('budget') as string | null
    const timeline = formData.get('timeline') as string | null
    const vision = formData.get('vision') as string | null

    // Real store pieces the visitor referenced (optional). Capped so a crafted
    // request can't bloat the owner's email past delivery limits.
    type RefPiece = { sku?: string; name?: string; dimensions?: string; price?: string; url?: string; drying?: boolean }
    let referencedPieces: RefPiece[] = []
    const referencedPiecesRaw = formData.get('referencedPieces')
    if (typeof referencedPiecesRaw === 'string') {
      try {
        const parsed = JSON.parse(referencedPiecesRaw) as unknown
        if (Array.isArray(parsed)) {
          referencedPieces = (parsed as RefPiece[]).filter((p) => p?.sku).slice(0, 25)
        }
      } catch {
        // Malformed JSON: drop the references rather than failing the inquiry.
      }
    }

    if (!name || !email || !projectType || !budget || !vision) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }
    if (!/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    // Server-side length caps: the form enforces these in the UI, but a direct caller
    // could submit multi-megabyte fields that bloat the DB row and the notification email.
    if (
      name.length > 200 || email.length > 320 || vision.length > 5000 ||
      projectType.length > 200 || budget.length > 200 ||
      (phone?.length ?? 0) > 50 || (zip?.length ?? 0) > 20
    ) {
      return NextResponse.json({ error: 'One or more fields is too long.' }, { status: 400 })
    }

    // Guarded like referencedPieces above: malformed dimensions drop to null rather than
    // failing the whole inquiry with an opaque 500. Typed so the later read needs no cast.
    let dimensions: { l?: string; w?: string; h?: string; unit?: string } | null = null
    if (dimensionsRaw) {
      try {
        const parsed = JSON.parse(dimensionsRaw) as unknown
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          dimensions = parsed as { l?: string; w?: string; h?: string; unit?: string }
        }
      } catch {
        // Malformed dimensions: drop rather than fail the inquiry.
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Server-side upload limits. DropZone enforces these in the UI, but a direct caller
    // bypasses it: this endpoint writes to public storage with the service-role key, so
    // it must bound count, size, and type itself. Trust the validated MIME (not the
    // user-supplied filename) for both the type check and the stored extension.
    const MAX_PHOTOS = 8
    const MAX_BYTES = 10 * 1024 * 1024
    const ALLOWED_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
    const photoUrls: string[] = []
    for (let i = 0; i < MAX_PHOTOS; i++) {
      const entry = formData.get(`photo_${i}`)
      if (!entry) break
      if (!(entry instanceof File)) continue
      const ext = ALLOWED_TYPES[entry.type]
      if (!ext || entry.size === 0 || entry.size > MAX_BYTES) continue
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('inquiry-photos')
        .upload(path, entry, { contentType: entry.type })
      if (!uploadError) {
        const { data } = supabase.storage.from('inquiry-photos').getPublicUrl(path)
        photoUrls.push(data.publicUrl)
      }
    }

    const { error } = await supabase.from('inquiries').insert({
      name,
      email,
      phone: phone || null,
      zip_code: zip || null,
      delivery_method: deliveryMethod || null,
      project_type: projectType,
      species_preference: species.length > 0 ? species : null,
      finish_preference: finish || null,
      dimensions,
      budget_range: budget,
      timeline: timeline || null,
      description: vision,
      photo_urls: photoUrls.length > 0 ? photoUrls : null,
      status: 'new',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Best-effort notifications. The inquiry is already saved, so email failures
    // never fail the request.
    if (emailConfigured()) {
      // dimensions is already typed and validated above (or null).
      const dims = dimensions
      const dimsText = dims
        ? [dims.l, dims.w, dims.h].filter(Boolean).join(' x ') + (dims.unit ? ` ${dims.unit}` : '')
        : ''
      const rows: [string, string][] = [
        ['Project', projectType ?? ''],
        ['Budget', budget ?? ''],
        ['Timeline', timeline ?? ''],
        ['Species', species.length > 0 ? species.join(', ') : ''],
        ['Finish', finish ?? ''],
        ['Dimensions', dimsText],
        ['Delivery', deliveryMethod ?? ''],
        ['Phone', phone ?? ''],
        ['Zip', zip ?? ''],
      ].filter(([, v]) => v) as [string, string][]

      const detailHtml = rows
        .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0"><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join('')
      const photosHtml = photoUrls.length > 0
        ? `<p><strong>Photos:</strong><br>${photoUrls.map((u) => `<a href="${u}">${escapeHtml(u)}</a>`).join('<br>')}</p>`
        : ''

      const piecesHtml = referencedPieces.length
        ? `
          <p style="margin:16px 0 4px;font-weight:bold">Referenced ${referencedPieces.length} piece${referencedPieces.length > 1 ? 's' : ''}:</p>
          ${referencedPieces
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

      await sendEmail({
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `New custom project request from ${name}${referencedPieces.length ? ` · ${referencedPieces.length} piece${referencedPieces.length > 1 ? 's' : ''}` : ''}`,
        html: `
          <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) submitted a custom project request.</p>
          <table style="border-collapse:collapse;font-size:14px">${detailHtml}</table>
          <p style="white-space:pre-wrap"><strong>Vision:</strong><br>${escapeHtml(vision)}</p>
          ${piecesHtml}
          ${photosHtml}
        `,
      })

      await sendEmail({
        to: email,
        subject: 'We received your custom project request',
        html: `
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thanks for reaching out about your custom project. We have your request, and we
          review every one personally. We will be in touch soon to talk through the details.</p>
          <p>In the meantime, if anything comes up you can reach us at (605) 310-4846.</p>
          <p>Sioux Falls Woodworking</p>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Inquiry route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
