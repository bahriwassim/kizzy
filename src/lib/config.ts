import { getSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'

const CONFIG_ID = 'soiree'

export async function fetchSoireeConfig() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('config')
    .select('data')
    .eq('id', CONFIG_ID)
    .single()
  if (error) throw error
  return (data?.data ?? {}) as any
}

export async function saveSoireeConfig(payload: any) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('config')
    .upsert({ id: CONFIG_ID, data: payload, updated_at: new Date().toISOString() })
  if (error) throw error
  return { ok: true }
}

