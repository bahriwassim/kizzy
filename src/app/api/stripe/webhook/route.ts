import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature') || ''
  let event: Stripe.Event
  try {
    const raw = await request.text()
    const stripe = await getStripe()
    let secret = process.env.STRIPE_WEBHOOK_SECRET || ''
    if (!secret) {
      const supabase = getSupabaseAdmin()
      const { data } = await supabase.from('payment_config').select('webhook_secret').eq('id', 'default').single()
      secret = data?.webhook_secret || ''
    }
    if (!secret) {
      throw new Error('Missing Stripe webhook secret')
    }
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const supabase = getSupabaseAdmin()

      const { data: order } = await supabase
        .from('orders')
        .insert({
          id: session.id,
          email: session.customer_details?.email ?? session.customer_email,
          name: session.metadata?.customer_name ?? session.customer_details?.name ?? null,
          phone: session.metadata?.customer_phone ?? session.customer_details?.phone ?? null,
          amount_total: session.amount_total,
          currency: session.currency,
          status: 'paid',
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      const stripe = await getStripe()
      const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
      const ticketImages: string[] = []
      const tierCounts: Record<string, number> = {}

      for (const item of items.data) {
        const quantity = item.quantity || 1
        for (let i = 0; i < quantity; i++) {
          const ticketId = `${session.id}-${item.description}-${i + 1}`
          const payload = JSON.stringify({ orderId: session.id, product: item.description, idx: i + 1 })
          const dataUrl = await QRCode.toDataURL(payload, { width: 256, margin: 1 })
          ticketImages.push(dataUrl)

          await supabase.from('tickets').insert({
            order_id: session.id,
            product_name: item.description,
            ticket_index: i + 1,
            qr_data_url: dataUrl,
            status: 'valid',
            created_at: new Date().toISOString(),
          })
        }
        const desc = (item.description || '').toUpperCase()
        if (desc.includes('TABLE')) {
          const tier = desc.includes('PLATINIUM') ? 'PLATINIUM' : desc.includes('PREMIUM') ? 'PREMIUM' : desc.includes('VIP') ? 'VIP' : 'OTHER'
          if (tier !== 'OTHER') {
            tierCounts[tier] = (tierCounts[tier] || 0) + (item.quantity || 1)
          }
        }
      }

      for (const [tier, qty] of Object.entries(tierCounts)) {
        await supabase.rpc('increment_inventory', { p_tier: tier, p_qty: qty })
      }

      const host = process.env.SMTP_HOST
      const port = Number(process.env.SMTP_PORT || 587)
      const user = process.env.SMTP_USER
      const pass = process.env.SMTP_PASS
      const from = process.env.EMAIL_FROM || 'noreply@garden-party.kizzyevent.com'
      const to = order?.email || session.customer_email || ''

      if (host && user && pass && to) {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        })

        const imagesHtml = ticketImages
          .map((src, idx) => `<div style="margin:12px 0;"><div style="font-weight:bold">Ticket ${idx + 1}</div><img src="${src}" width="180" height="180" alt="QR Ticket ${idx + 1}" /></div>`)
          .join('')

        const html = `
          <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
            <h2>Vos billets</h2>
            <p>Merci pour votre achat. Présentez ces QR codes à l'entrée.</p>
            ${imagesHtml}
          </div>
        `
        await transporter.sendMail({
          from,
          to,
          subject: 'Confirmation de vos billets',
          html,
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unhandled webhook error' }, { status: 500 })
  }
}
