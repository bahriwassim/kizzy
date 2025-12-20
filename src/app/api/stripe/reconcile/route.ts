import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import QRCode from 'qrcode'
import nodemailer from 'nodemailer'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any))
    const session_id = String(body?.session_id || '')
    if (!session_id) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

    const stripe = await getStripe()
    const session = await stripe.checkout.sessions.retrieve(session_id)
    if (!session || (session.payment_status !== 'paid' && session.status !== 'complete')) {
      return NextResponse.json({ error: 'Session not paid' }, { status: 409 })
    }

    const supabase = getSupabaseAdmin()

    let existingOrder: any = null
    try {
      const { data } = await supabase.from('orders').select('id').eq('id', session.id).single()
      existingOrder = data
    } catch {}
    let created = false
    if (!existingOrder) {
      await supabase
        .from('orders')
        .insert({
          id: session.id,
          email: session.customer_details?.email ?? session.customer_email,
          name: (session.metadata as any)?.customer_name ?? session.customer_details?.name ?? null,
          phone: (session.metadata as any)?.customer_phone ?? session.customer_details?.phone ?? null,
          amount_total: session.amount_total,
          currency: session.currency,
          status: 'paid',
          created_at: new Date().toISOString(),
        })
      created = true
    }

    const { data: existingTickets, error: ticketsErr } = await supabase
      .from('tickets')
      .select('id')
      .eq('order_id', session.id)
    const hasTickets = Array.isArray(existingTickets) && existingTickets.length > 0

    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
    const tierCounts: Record<string, number> = {}

    if (!hasTickets) {
      const envSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://gardenpartyparis.com'
      const site = envSite.replace(/\/+$/, '')
      const lang = String((session.metadata as any)?.lang || 'fr')
      const confirmUrl = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(session.id)}`
      const qrDataUrl = await QRCode.toDataURL(confirmUrl, { width: 256, margin: 1 })
      let nextIdx = 1
      for (const item of items.data) {
        const quantity = item.quantity || 1
        for (let i = 0; i < quantity; i++) {
          await supabase.from('tickets').insert({
            order_id: session.id,
            product_name: item.description,
            ticket_index: nextIdx++,
            qr_data_url: null,
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

      for (const [tier, qty] of Object.entries(tierCounts)) {
        await supabase.rpc('increment_inventory', { p_tier: tier, p_qty: qty })
      }

      const bottlesMeta = String(((session.metadata as any)?.bottles_meta || '')).trim()
      if (bottlesMeta) {
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

      const promoCode = ((session.metadata as any)?.promo_code || '').toString().trim()
      if (promoCode) {
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

      const host = process.env.SMTP_HOST
      const port = Number(process.env.SMTP_PORT || 587)
      const user = process.env.SMTP_USER
      const pass = process.env.SMTP_PASS
      const from = process.env.EMAIL_FROM || 'noreply@garden-party.kizzyevent.com'
      const to = (session.customer_details?.email ?? session.customer_email) || ''

      if (host && user && pass && to) {
        try {
          const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
          const orderLink = `${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://gardenpartyparis.com').replace(/\/+$/, '')}/${String((session.metadata as any)?.lang || 'fr')}/confirmation?session_id=${encodeURIComponent(session.id)}`
          const imageHtml = `<div style="margin:12px 0;"><img src="${qrDataUrl}" width="180" height="180" alt="QR Réservation" /></div>`
          const html = `
            <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
              <h2>Vos billets</h2>
              <p>Merci pour votre achat. Présentez ce QR code à l'entrée.</p>
              <p>Voir le détail de votre commande&nbsp;: <a href="${orderLink}" target="_blank" rel="noopener">${orderLink}</a></p>
              ${imageHtml}
            </div>
          `
          await transporter.sendMail({ from, to, subject: 'Confirmation de vos billets', html })
        } catch {}
      }
    }

    return NextResponse.json({ ok: true, created, tickets_created: !hasTickets })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Reconcile failed' }, { status: 500 })
  }
}
