import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

type Payload = {
  id?: string
  code: string
  type: 'Pourcentage' | 'Montant Fixe'
  value: number
  status: 'Brouillon' | 'Actif' | 'Programmé' | 'Expiré'
  startDate?: string | null
  endDate?: string | null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Payload>
    const supabase = getSupabaseAdmin()
    const code = (body.code || '').trim().toUpperCase()
    const type = body.type === 'Montant Fixe' ? 'Montant Fixe' : 'Pourcentage'
    const status = body.status === 'Actif' || body.status === 'Programmé' || body.status === 'Expiré' ? body.status : 'Brouillon'
    const value = Number(body.value ?? 0)
    const startDate = body.startDate ? new Date(body.startDate).toISOString() : null
    const endDate = body.endDate ? new Date(body.endDate).toISOString() : null

    if (!code || !value || value < 0) {
      return NextResponse.json({ error: 'Code et valeur requis' }, { status: 400 })
    }

    if (body.id) {
      const { error } = await supabase
        .from('promos')
        .update({ code, type, value, status, startDate, endDate })
        .eq('id', body.id)
      if (error) {
        const { error: retryErr } = await supabase
          .from('promos')
          .update({ code, type, value, status })
          .eq('id', body.id)
        if (retryErr) return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ ok: true, id: body.id })
    } else {
      const { data, error } = await supabase
        .from('promos')
        .insert({ code, type, value, status, startDate, endDate, redemptions: 0 })
        .select('id')
        .single()
      if (error) {
        const { data: data2, error: retryErr } = await supabase
          .from('promos')
          .insert({ code, type, value, status, redemptions: 0 })
          .select('id')
          .single()
        if (retryErr) return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json({ ok: true, id: data2?.id })
      }
      return NextResponse.json({ ok: true, id: data?.id })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
