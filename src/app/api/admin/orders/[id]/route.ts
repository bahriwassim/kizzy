import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await params
    const id = String(ctx?.id || '')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const supabase = getSupabaseAdmin()
    let { data: order, error: orderErr } = await supabase.from('orders').select('*').eq('id', id).single()
    if (orderErr && orderErr.code !== 'PGRST116') throw orderErr
    let { data: tickets, error: ticketsErr } = await supabase
      .from('tickets')
      .select('order_id,product_name,ticket_index,qr_data_url')
      .eq('order_id', id)
      .order('ticket_index', { ascending: true })
    if (ticketsErr && ticketsErr.code !== 'PGRST116') throw ticketsErr
    let { data: bottles, error: bottlesErr } = await supabase
      .from('order_bottles')
      .select('seat_label,tier,bottle_id,count,on_site')
      .eq('order_id', id)
    if (bottlesErr && bottlesErr.code !== 'PGRST116') throw bottlesErr
    try {
      const stripe = await getStripe()
      const session = await stripe.checkout.sessions.retrieve(id)
      if (!order) {
        const payload = {
          id,
          email: session.customer_details?.email ?? session.customer_email,
          name: session.metadata?.customer_name ?? session.customer_details?.name ?? null,
          phone: session.metadata?.customer_phone ?? session.customer_details?.phone ?? null,
          amount_total: session.amount_total,
          currency: session.currency,
          status: 'paid',
          created_at: new Date().toISOString(),
        }
        await supabase.from('orders').upsert(payload)
        const { data: refreshedOrder } = await supabase.from('orders').select('*').eq('id', id).single()
        order = refreshedOrder || order
      }
      if (!Array.isArray(tickets) || tickets.length === 0) {
        const items = await stripe.checkout.sessions.listLineItems(id, { limit: 100 })
        const envSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://gardenpartyparis.com'
        const site = envSite.replace(/\/+$/, '')
        const lang = String(session.metadata?.lang || 'fr')
        const confirmUrl = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(id)}`
        const qrDataUrl = await (await import('qrcode')).default.toDataURL(confirmUrl, { width: 256, margin: 1 })
        let nextIdx = 1
        for (const item of items.data) {
          const quantity = item.quantity || 1
          for (let i = 0; i < quantity; i++) {
            await supabase.from('tickets').insert({
              order_id: id,
              product_name: item.description,
              ticket_index: nextIdx++,
              qr_data_url: qrDataUrl,
              status: 'valid',
              created_at: new Date().toISOString(),
            })
          }
        }
        const { data: refreshedTickets } = await supabase
          .from('tickets')
          .select('order_id,product_name,ticket_index,qr_data_url')
          .eq('order_id', id)
          .order('ticket_index', { ascending: true })
        tickets = Array.isArray(refreshedTickets) ? refreshedTickets : tickets
      }
      if (!Array.isArray(bottles) || bottles.length === 0) {
        const meta = String((session?.metadata as any)?.bottles_meta || '').trim()
        if (meta) {
          const entries = meta.split(';').map(s => s.trim()).filter(Boolean)
          for (const e of entries) {
            const parts = e.split('|')
            const seat_label = parts[0] || ''
            const tier = parts[1] || ''
            if (parts.length === 3 && parts[2] === 'on_site') {
              await supabase
                .from('order_bottles')
                .insert({ order_id: id, seat_label, tier, bottle_id: null, count: 0, on_site: true, created_at: new Date().toISOString() })
            } else if (parts.length >= 4) {
              const bottle_id = parts[2]
              const count = Number(parts[3] || 0)
              if (bottle_id && count > 0) {
                await supabase
                  .from('order_bottles')
                  .insert({ order_id: id, seat_label, tier, bottle_id, count, on_site: false, created_at: new Date().toISOString() })
              }
            }
          }
          const { data: refreshed } = await supabase
            .from('order_bottles')
            .select('seat_label,tier,bottle_id,count,on_site')
            .eq('order_id', id)
          bottles = Array.isArray(refreshed) ? refreshed : []
        }
      }
    } catch {}
    return NextResponse.json({
      order: order || null,
      tickets: Array.isArray(tickets) ? tickets : [],
      bottles: Array.isArray(bottles) ? bottles : [],
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to load order' }, { status: 500 })
  }
}
