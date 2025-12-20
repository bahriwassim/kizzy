import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseAdmin()
    const url = new URL(req.url)
    const limit = Math.max(1, Math.min(500, Number(url.searchParams.get('limit') || 100)))
    const offset = Math.max(0, Number(url.searchParams.get('offset') || 0))

    const { data, error } = await supabase
      .from('orders')
      .select('id,email,name,phone,amount_total,currency,status,created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ orders: Array.isArray(data) ? data : [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
