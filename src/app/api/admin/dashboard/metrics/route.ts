import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const now = new Date()
    const since7d = new Date(now)
    since7d.setDate(since7d.getDate() - 6)
    since7d.setHours(0, 0, 0, 0)
    const since14d = new Date(now)
    since14d.setDate(since14d.getDate() - 13)
    since14d.setHours(0, 0, 0, 0)

    const { data: orders7d } = await supabase
      .from('orders')
      .select('amount_total,created_at')
      .gte('created_at', since7d.toISOString())
    const { data: ordersPrev7d } = await supabase
      .from('orders')
      .select('amount_total,created_at')
      .gte('created_at', since14d.toISOString())
      .lte('created_at', new Date(since7d.getTime() - 1).toISOString())

    const { count: ticketsCount } = await supabase.from('tickets').select('id', { count: 'exact', head: true })

    const { data: inventoryRows } = await supabase.from('inventory').select('tier, capacity, sold_count')
    const totalSold = (inventoryRows || []).reduce((a, r) => a + (r.sold_count || 0), 0)
    const top = (inventoryRows || []).reduce<any | null>((best, row) => {
      if (!best) return row
      return (row.sold_count || 0) > (best.sold_count || 0) ? row : best
    }, null)
    const popularSection = top ? String(top.tier) : '-'
    const popularShare = top && totalSold > 0 ? Math.round(((top.sold_count || 0) / totalSold) * 100) : 0

    const { data: promosRows } = await supabase.from('promos').select('redemptions')
    const promosUsed = (promosRows || []).reduce((a, r) => a + (r.redemptions || 0), 0)

    const dailyMap = new Map<string, number>()
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      d.setHours(0, 0, 0, 0)
      dailyMap.set(d.toDateString(), 0)
    }
    let total = 0
    for (const o of orders7d || []) {
      const d = new Date(o.created_at as any)
      d.setHours(0, 0, 0, 0)
      const key = d.toDateString()
      const prev = dailyMap.get(key) || 0
      const amt = Math.round((o.amount_total || 0))
      dailyMap.set(key, prev + amt)
      total += amt
    }
    const totalRevenue = Math.round(total) / 100
    const prevTotal = (ordersPrev7d || []).reduce((a, o) => a + Math.round(o.amount_total || 0), 0)
    const revenueGrowth = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : 100

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyRevenue = Array.from(dailyMap.entries()).map(([k, v]) => {
      const date = new Date(k)
      return { name: days[date.getDay()], revenue: Math.round(v / 100) }
    })

    return NextResponse.json({
      totalRevenue,
      revenueGrowth,
      weeklyRevenue,
      ticketsSold: ticketsCount || 0,
      popularSection,
      popularShare,
      promosUsed,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to load metrics' }, { status: 500 })
  }
}
