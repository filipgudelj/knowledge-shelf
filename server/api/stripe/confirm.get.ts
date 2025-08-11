import Stripe from 'stripe'
import { getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { session_id } = getQuery(event) as { session_id?: string }
  if (!session_id)
    throw createError({ statusCode: 400, statusMessage: 'Missing session_id' })

  const config = useRuntimeConfig(event)
  const stripe = new Stripe(config.stripeSecretKey as string)

  const session = await stripe.checkout.sessions.retrieve(session_id)
  if (session.payment_status !== 'paid') {
    throw createError({ statusCode: 400, statusMessage: 'Payment not paid' })
  }

  const supabase = await serverSupabaseClient(event)

  const { data: existing, error: existErr } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle()
  if (existErr)
    throw createError({ statusCode: 500, statusMessage: existErr.message })
  if (existing) {
    return { ok: true, order_id: existing.id }
  }

  const li = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  })

  const items = li.data.map((row) => {
    const product = row.price?.product as Stripe.Product | null
    const title = product?.name || row.description || 'Item'
    const bookIdStr = product?.metadata?.book_id
    const qty = row.quantity ?? 1
    const unit = (row.amount_subtotal ?? 0) / qty / 100

    return {
      book_id: bookIdStr ? Number(bookIdStr) : null,
      title_snapshot: title,
      unit_price: unit,
      quantity: qty,
    }
  })

  const md = session.metadata ?? {}
  const subtotal = md.subtotal
    ? parseFloat(md.subtotal)
    : (session.amount_subtotal ?? 0) / 100

  const shipping_price = md.shipping_price ? parseFloat(md.shipping_price) : 0

  const total = md.total
    ? parseFloat(md.total)
    : (session.amount_total ?? 0) / 100

  const { data: order } = await supabase
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

  const rows = items.map((i) => ({
    order_id: order.id,
    book_id: i.book_id,
    title_snapshot: i.title_snapshot,
    unit_price: i.unit_price.toFixed(2),
    quantity: i.quantity,
  }))

  await supabase.from('order_items').insert(rows)

  return { ok: true, order_id: order.id }
})
