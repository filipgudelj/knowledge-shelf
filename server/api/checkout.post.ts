// server/api/checkout.post.ts
import Stripe from 'stripe'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { amount, email } = await readBody<{ amount: number; email?: string }>(
    event,
  )

  if (!amount || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid amount' })
  }

  const config = useRuntimeConfig(event)
  const stripe = new Stripe(config.stripeSecretKey as string)

  const url = new URL(getRequestURL(event))
  const origin = `${url.protocol}//${url.host}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    payment_method_types: ['card'],
    locale: 'auto',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(amount),
          product_data: { name: 'Order' },
        },
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancelled`,
  })

  return { id: session.id }
})
