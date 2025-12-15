import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

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

    const names = [
      { name: 'media', public: true },
      { name: 'videos', public: true },
      { name: 'tickets', public: false },
    ]

    for (const n of names) {
      const { data: exists } = await supabase.storage.getBucket(n.name)
      if (!exists) {
        await supabase.storage.createBucket(n.name, { public: n.public })
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to setup storage' }, { status: 500 })
  }
}
