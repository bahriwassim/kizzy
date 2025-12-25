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
        .upsert({
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
      const tierCounts: Record<string, number> = {}

      const envSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3600'
      const site = envSite.replace(/\/+$/, '')
      const lang = String(session.metadata?.lang || 'fr')
      const confirmUrl = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(session.id)}`
      const qrDataUrl = await QRCode.toDataURL(confirmUrl, { width: 256, margin: 1 })
      let nextIdx = 1
      const { data: existingTickets } = await supabase
        .from('tickets')
        .select('id')
        .eq('order_id', session.id)
      const hasTickets = Array.isArray(existingTickets) && existingTickets.length > 0
      if (!hasTickets) {
        for (const item of items.data) {
          const quantity = item.quantity || 1
          for (let i = 0; i < quantity; i++) {
            await supabase.from('tickets').insert({
              order_id: session.id,
              product_name: item.description,
              ticket_index: nextIdx++,
              qr_data_url: qrDataUrl,
              status: 'valid',
              created_at: new Date().toISOString(),
            })
          }
          const desc = (item.description || '').toUpperCase()
          if (desc.includes('TABLE')) {
            const tier = desc.includes('ULTRA VIP') ? 'ULTRA VIP'
              : desc.includes('PLATINIUM') ? 'PLATINIUM'
              : desc.includes('VIP') ? 'VIP'
              : desc.includes('PREMIUM') ? 'PREMIUM'
              : desc.includes('PRESTIGE') ? 'PRESTIGE'
              : desc.includes('STANDARD') ? 'STANDARD'
              : 'OTHER'
            if (tier !== 'OTHER') {
              tierCounts[tier] = (tierCounts[tier] || 0) + (item.quantity || 1)
            }
          }
        }
      }

      if (!hasTickets) {
        for (const [tier, qty] of Object.entries(tierCounts)) {
          await supabase.rpc('increment_inventory', { p_tier: tier, p_qty: qty })
        }
      }

      const bottlesMeta = String((session.metadata?.bottles_meta || '')).trim()
      const { data: existingBottles } = await supabase
        .from('order_bottles')
        .select('order_id')
        .eq('order_id', session.id)
      const hasBottles = Array.isArray(existingBottles) && existingBottles.length > 0
      if (bottlesMeta && !hasBottles) {
        const entries = bottlesMeta.split(';').map(s => s.trim()).filter(Boolean)
        for (const e of entries) {
          const parts = e.split('|')
          const seatLabel = parts[0] || ''
          const tier = parts[1] || ''
          if (parts.length === 3 && parts[2] === 'on_site') {
            try {
              await supabase.from('order_bottles').insert({
                order_id: session.id,
                seat_label: seatLabel,
                tier,
                bottle_id: null,
                count: 0,
                on_site: true,
                created_at: new Date().toISOString(),
              })
            } catch {}
          } else if (parts.length >= 4) {
            const bottleId = parts[2]
            const count = Number(parts[3] || 0)
            if (bottleId && count > 0) {
              try {
                await supabase.from('order_bottles').insert({
                  order_id: session.id,
                  seat_label: seatLabel,
                  tier,
                  bottle_id: bottleId,
                  count,
                  on_site: false,
                  created_at: new Date().toISOString(),
                })
              } catch {}
            }
          }
        }
      }

      const promoCode = (session.metadata?.promo_code || '').toString().trim()
      if (promoCode && !hasTickets) {
        try {
          const { data: promo } = await supabase
            .from('promos')
            .select('code, redemptions')
            .eq('code', promoCode)
            .single()
          if (promo) {
            const current = Number(promo.redemptions || 0)
            await supabase
              .from('promos')
              .update({ redemptions: current + 1 })
              .eq('code', promoCode)
          }
        } catch {}
      }

      await supabase.from('tickets').update({ qr_data_url: qrDataUrl }).eq('order_id', session.id)

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

        const orderLink = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(session.id)}`
        const imageHtml = `<div style="margin:12px 0;"><img src="${qrDataUrl}" width="180" height="180" alt="QR Réservation" /></div>`

        const html = `
          <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
            <h2>Vos billets</h2>
            <p>Merci pour votre achat. Présentez ce QR code à l'entrée.</p>
            <p>Voir le détail de votre commande&nbsp;: <a href="${orderLink}" target="_blank" rel="noopener">${orderLink}</a></p>
            ${imageHtml}
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
