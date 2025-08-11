import Stripe from 'stripe'
import { readBody, getRequestURL } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    items: {
      book_id: number
      title: string
      price: number
      quantity: number
      cover_url?: string
    }[]
    email: string
    name: string
    surname: string
    phone?: string
    country: string
    city: string
    zip: string
    address: string
    notes?: string
    shipping_method: string
    shipping_price: number
    subtotal: number
    total: number
  }>(event)

  const user = await serverSupabaseUser(event)
  const config = useRuntimeConfig(event)
  const stripe = new Stripe(config.stripeSecretKey as string)
  const url = new URL(getRequestURL(event))
  const origin = `${url.protocol}//${url.host}`

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    body.items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round((i.price ?? 0) * 100),
        product_data: {
          name: i.title,
          images: i.cover_url ? [i.cover_url] : undefined,
          metadata: { book_id: String(i.book_id) },
        },
      },
    }))

  if (body.shipping_price && body.shipping_price > 0) {
    const label =
      body.shipping_method === 'express'
        ? 'Shipping (Express)'
        : 'Shipping (Standard)'
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(body.shipping_price * 100), // convert € to cents
        product_data: { name: label },
      },
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: body.email,
    locale: 'auto',
    line_items,
    metadata: {
      user_id: user?.id ?? '',
      email: body.email,
      name: body.name,
      surname: body.surname,
      phone: body.phone ?? '',
      country: body.country,
      city: body.city,
      zip: body.zip,
      address: body.address,
      notes: body.notes ?? '',
      shipping_method: body.shipping_method,
      shipping_price: String(body.shipping_price),
      subtotal: String(body.subtotal),
      total: String(body.total),
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancelled`,
  })

  return { id: session.id }
})
