import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { lang = 'fr', customer, order } = body as {
      lang?: string
      customer: { email: string; name: string; phone?: string }
      order: {
        selectedSeats?: Array<{ id: string; label: string; tier: string; price: number }>
        simpleEntries?: { women?: number; men?: number }
        totalPrice?: number
      }
    }

    const supabase = getSupabaseAdmin()
    const { data: inventoryRows } = await supabase.from('inventory').select('tier, capacity, sold_count')
    const inventory = Object.fromEntries((inventoryRows || []).map(r => [String(r.tier).toUpperCase(), r]))

    const requestedByTier: Record<string, number> = {}
    for (const seat of order?.selectedSeats || []) {
      const tier = String(seat.tier || '').toUpperCase()
      requestedByTier[tier] = (requestedByTier[tier] || 0) + 1
    }
    for (const [tier, qty] of Object.entries(requestedByTier)) {
      const row = inventory[tier]
      if (!row) {
        return NextResponse.json({ error: `Tier ${tier} indisponible` }, { status: 409 })
      }
      if ((row.sold_count || 0) + qty > (row.capacity || 0)) {
        return NextResponse.json({ error: `Stock insuffisant pour ${tier}` }, { status: 409 })
      }
    }

    const envSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://gardenpartyparis.com'
    const site = envSite.replace(/\/+$/, '')
    const successUrl = `${site}/${lang}/confirmation?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${site}/${lang}/checkout`

    const line_items: Array<Stripe.Checkout.SessionCreateParams.LineItem> = []

    for (const seat of order?.selectedSeats || []) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round((seat.price ?? 0) * 100),
          product_data: { name: `Table ${seat.tier} - ${seat.label}` },
        },
      })
    }

    const womenCount = order?.simpleEntries?.women ?? 0
    const menCount = order?.simpleEntries?.men ?? 0
    if (womenCount > 0) {
      line_items.push({
        quantity: womenCount,
        price_data: {
          currency: 'eur',
          unit_amount: 5000,
          product_data: { name: 'Entrée Femme' },
        },
      })
    }
    if (menCount > 0) {
      line_items.push({
        quantity: menCount,
        price_data: {
          currency: 'eur',
          unit_amount: 8000,
          product_data: { name: 'Entrée Homme' },
        },
      })
    }

    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone || '',
        lang,
        inventory_check: JSON.stringify(requestedByTier),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items,
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unexpected error' }, { status: 500 })
  }
}
