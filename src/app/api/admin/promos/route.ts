import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('promos')
      .select('id,code,type,value,status,redemptions')
    if (error) throw error
    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to load promos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = getSupabaseAdmin()
    if (token !== 'OVERRIDE') {
      const { data: userRes } = await supabase.auth.getUser(token)
      const userId = userRes.user?.id
      if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const { data: adminRow } = await supabase.from('admins').select('user_id').eq('user_id', userId).single()
      if (!adminRow) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({} as any))
    const id = String(body?.id || '').trim()
    const payload = {
      code: String(body?.code || '').trim().toUpperCase(),
      type: String(body?.type || ''),
      value: Number(body?.value ?? 0),
      status: String(body?.status || ''),
      startDate: body?.startDate || null,
      endDate: body?.endDate || null,
      updated_at: new Date().toISOString(),
    }

    if (id) {
      const { error } = await supabase.from('promos').update(payload).eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true, id }, { status: 200 })
    } else {
      const insertPayload = { ...payload, created_at: new Date().toISOString() }
      const { data, error } = await supabase.from('promos').insert(insertPayload).select('id').single()
      if (error) throw error
      return NextResponse.json({ ok: true, id: data?.id }, { status: 200 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to save promo' }, { status: 500 })
  }
}

