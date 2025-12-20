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
    const { data: order, error: orderErr } = await supabase.from('orders').select('*').eq('id', id).single()
    if (orderErr && orderErr.code !== 'PGRST116') throw orderErr
    const { data: tickets, error: ticketsErr } = await supabase
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
    if (!Array.isArray(bottles) || bottles.length === 0) {
      try {
        const stripe = await getStripe()
        const session = await stripe.checkout.sessions.retrieve(id)
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
      } catch {}
    }
    return NextResponse.json({
      order: order || null,
      tickets: Array.isArray(tickets) ? tickets : [],
      bottles: Array.isArray(bottles) ? bottles : [],
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to load order' }, { status: 500 })
  }
}
