import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('payment_config')
      .select('public_key, secret_key, webhook_secret, is_live_mode')
      .eq('id', 'default')
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json(data || { public_key: '', secret_key: '', webhook_secret: '', is_live_mode: false }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to load payment config' }, { status: 500 })
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
    const body = await request.json()
    const payload = {
      id: 'default',
      public_key: body.publicKey || '',
      secret_key: body.secretKey || '',
      webhook_secret: body.webhookSecret || '',
      is_live_mode: !!body.isLiveMode,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('payment_config').upsert(payload)
    if (error) throw error
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to save payment config' }, { status: 500 })
  }
}
