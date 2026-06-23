import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured, escapeHtml, OWNER_EMAIL } from '@/lib/email'

export async function POST(request: Request) {
  try {
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

    if (!name || !email || !projectType || !budget || !vision) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const dimensions = dimensionsRaw ? JSON.parse(dimensionsRaw) : null

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const photoUrls: string[] = []
    let i = 0
    while (formData.get(`photo_${i}`)) {
      const file = formData.get(`photo_${i}`) as File
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('inquiry-photos')
        .upload(path, file, { contentType: file.type })
      if (!uploadError) {
        const { data } = supabase.storage.from('inquiry-photos').getPublicUrl(path)
        photoUrls.push(data.publicUrl)
      }
      i++
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
      // The form submits dimensions as a JSON string of { l, w, h, unit }.
      const dims = dimensions as { l?: string; w?: string; h?: string; unit?: string } | null
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

      await sendEmail({
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `New custom project request from ${name}`,
        html: `
          <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) submitted a custom project request.</p>
          <table style="border-collapse:collapse;font-size:14px">${detailHtml}</table>
          <p style="white-space:pre-wrap"><strong>Vision:</strong><br>${escapeHtml(vision)}</p>
          ${photosHtml}
        `,
      })

      await sendEmail({
        to: email,
        subject: 'We received your custom project request',
        html: `
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thanks for reaching out about your custom project. We have your request and Slavic
          reviews every one personally. We will be in touch soon to talk through the details.</p>
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
