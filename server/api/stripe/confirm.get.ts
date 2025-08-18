import Stripe from 'stripe'
import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const { session_id } = getQuery(event) as { session_id?: string }
  if (!session_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing session_id' })
  }

  const config = useRuntimeConfig(event)
  const stripe = new Stripe(config.stripeSecretKey as string)

  const session = await stripe.checkout.sessions.retrieve(session_id)
  if (session.payment_status !== 'paid') {
    throw createError({ statusCode: 400, statusMessage: 'Payment not paid' })
  }

  const supabase = await serverSupabaseClient<any>(event)

  const { data: existing, error: existErr } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle()
  if (existErr) {
    throw createError({ statusCode: 500, statusMessage: existErr.message })
  }
  if (existing) {
    return { ok: true, order_id: existing.id }
  }

  const li = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  })

  const mapped = li.data.map((row) => {
    const product = row.price?.product as Stripe.Product | null
    const meta = (product?.metadata ?? {}) as Record<string, string>
    const title = product?.name || row.description || 'Item'
    const qty = row.quantity ?? 1
    const lineSubtotalCents = row.amount_subtotal ?? 0

    const isShipping = meta.kind === 'shipping' || /^Shipping\b/i.test(title)

    const unit = lineSubtotalCents / Math.max(qty, 1) / 100

    return {
      isShipping,
      book_id: meta.book_id ? Number(meta.book_id) : null,
      title_snapshot: title,
      unit_price: unit,
      quantity: qty,
      line_total: lineSubtotalCents / 100,
    }
  })

  const productItems = mapped.filter((i) => !i.isShipping)
  const shippingAmount = mapped
    .filter((i) => i.isShipping)
    .reduce((s, i) => s + i.line_total, 0)

  const md = session.metadata ?? {}
  const subtotal =
    md.subtotal !== undefined
      ? parseFloat(md.subtotal)
      : productItems.reduce((s, i) => s + i.unit_price * i.quantity, 0)

  const shipping_price =
    md.shipping_price !== undefined
      ? parseFloat(md.shipping_price)
      : shippingAmount

  const total =
    md.total !== undefined
      ? parseFloat(md.total)
      : (session.amount_total ??
          Math.round((subtotal + shipping_price) * 100)) / 100

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      user_id: (md.user_id || null) as string | null,
      email: session.customer_details?.email ?? (md.email || ''),
      name: md.name || '',
      surname: md.surname || '',
      phone: md.phone || null,
      country: md.country || '',
      city: md.city || '',
      zip: md.zip || '',
      address: md.address || '',
      shipping_method: md.shipping_method || 'standard',
      notes: (md.notes || null) as string | null,
      subtotal: subtotal.toFixed(2),
      shipping_price: shipping_price.toFixed(2),
      total: total.toFixed(2),
    })
    .select('id')
    .single()

  if (orderErr) {
    throw createError({ statusCode: 500, statusMessage: orderErr.message })
  }

  if (productItems.length) {
    const rows = productItems.map((i) => ({
      order_id: order.id,
      book_id: i.book_id,
      title_snapshot: i.title_snapshot,
      unit_price: i.unit_price.toFixed(2),
      quantity: i.quantity,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(rows)
    if (itemsErr) {
      throw createError({ statusCode: 500, statusMessage: itemsErr.message })
    }
  }

  const totalsByBook = productItems.reduce<Record<number, number>>((acc, i) => {
    if (i.book_id == null) return acc
    acc[i.book_id] = (acc[i.book_id] || 0) + i.quantity
    return acc
  }, {})

  const bookIds = Object.keys(totalsByBook).map(Number)

  if (bookIds.length) {
    const { data: books, error: booksErr } = await supabase
      .from('books')
      .select('id, stock, sales_count')
      .in('id', bookIds)

    if (booksErr) {
      throw createError({ statusCode: 500, statusMessage: booksErr.message })
    }

    for (const b of books ?? []) {
      const need = totalsByBook[b.id] || 0
      const current = Number(b.stock ?? 0)
      if (current < need) {
        throw createError({
          statusCode: 409,
          statusMessage: `Out of stock for book ${b.id}`,
        })
      }
    }

    const updates = (books ?? []).map((b) => {
      const qty = totalsByBook[b.id] || 0
      return supabase
        .from('books')
        .update({
          stock: Number(b.stock ?? 0) - qty,
          sales_count: Number(b.sales_count ?? 0) + qty,
        })
        .eq('id', b.id)
    })

    const results = await Promise.all(updates)
    const updErr = results.find((r) => r.error)?.error
    if (updErr) {
      throw createError({ statusCode: 500, statusMessage: updErr.message })
    }
  }

  const toEmail = session.customer_details?.email ?? (md.email || '')
  if (toEmail) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    })

    const lang = String(md.locale || 'en').toLowerCase()
    const t =
      lang === 'hr'
        ? {
            thanks: 'Hvala na narudžbi!',
            order: 'Narudžba',
            item: 'Artikl',
            quantity: 'Količina',
            price: 'Cijena',
            subtotal: 'Međuzbroj',
            shipping: 'Dostava',
            total: 'Ukupno',
            shipTo: 'Dostava na:',
            phone: 'Telefon',
            notes: 'Napomena',
            rights: 'Sva prava pridržana.',
          }
        : {
            thanks: 'Thanks for your order!',
            order: 'Order',
            item: 'Item',
            quantity: 'Quantity',
            price: 'Price',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            total: 'Total',
            shipTo: 'Shipping to:',
            phone: 'Phone',
            notes: 'Notes',
            rights: 'All rights reserved.',
          }

    const itemRows = productItems
      .map(
        (i) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${i.title_snapshot}</td>
          <td align="center" style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${i.quantity}</td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${i.unit_price.toFixed(2)} €</td>
        </tr>
      `,
      )
      .join('')

    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
</head>
<body style="margin:0;padding:0;background:#f6f7f9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#1aa3ff;color:#ffffff;padding:20px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:.3px;">
              Knowledge Shelf
            </td>
          </tr>

          <tr>
            <td style="padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">${t.thanks}</h2>
              <p style="margin:0 0 16px;font-size:14px;color:#374151;">${t.order} <strong>#${order.id}</strong></p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr>
                    <th align="left"   style="font-size:12px;color:#6b7280;padding:8px 0;border-bottom:1px solid #f1f5f9;">${t.item}</th>
                    <th align="center" style="font-size:12px;color:#6b7280;padding:8px 0;border-bottom:1px solid #f1f5f9;">${t.quantity}</th>
                    <th align="right"  style="font-size:12px;color:#6b7280;padding:8px 0;border-bottom:1px solid #f1f5f9;">${t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-collapse:collapse;">
                <tr>
                  <td align="left"  style="padding:6px 0;font-size:14px;color:#111827;">${t.subtotal}</td>
                  <td align="right" style="padding:6px 0;font-size:14px;color:#111827;"><strong>${Number(subtotal).toFixed(2)} €</strong></td>
                </tr>
                <tr>
                  <td align="left"  style="padding:6px 0;font-size:14px;color:#111827;">${t.shipping}</td>
                  <td align="right" style="padding:6px 0;font-size:14px;color:#111827;"><strong>${Number(shipping_price).toFixed(2)} €</strong></td>
                </tr>
                <tr>
                  <td align="left"  style="padding:8px 0;border-top:1px solid #f1f5f9;font-size:16px;font-weight:700;color:#111827;">${t.total}</td>
                  <td align="right" style="padding:8px 0;border-top:1px solid #f1f5f9;font-size:16px;font-weight:700;color:#111827;">${Number(total).toFixed(2)} €</td>
                </tr>
              </table>

              <div style="margin-top:16px;padding:12px;background:#fcfcfc;border:1px solid #e5e7eb;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:14px;color:#111827;"><strong>${t.shipTo}</strong></p>
                <p style="margin:0;font-size:14px;color:#374151;">
                  ${md.name || ''} ${md.surname || ''}<br/>
                  ${md.address || ''}<br/>
                  ${md.zip || ''} ${md.city || ''}, ${md.country || ''}<br/>
                  ${md.phone ? `${t.phone}: ${md.phone}<br/>` : ``}
                </p>
              </div>

              ${
                md.notes
                  ? `
              <div style="margin-top:12px;padding:12px;background:#fcfcfc;border:1px solid #e5e7eb;border-radius:6px;">
                <p style="margin:0 0 4px;font-size:14px;color:#111827;"><strong>${t.notes}</strong></p>
                <p style="margin:0;font-size:14px;color:#374151;">${String(md.notes).replace(/\n/g, '<br/>')}</p>
              </div>`
                  : ``
              }
            </td>
          </tr>

          <tr>
            <td style="background:#f3f4f6;color:#6b7280;padding:12px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} Knowledge Shelf. ${t.rights}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER!,
        to: toEmail,
        subject: `${t.order} #${order.id} ${lang === 'hr' ? 'potvrda' : 'confirmation'}`,
        html,
        replyTo: process.env.SMTP_USER!,
      })
    } catch (err) {
      console.error('Order confirmation email failed', err)
    }
  }

  return { ok: true, order_id: order.id }
})
