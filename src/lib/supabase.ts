import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL as string
const anonKey = process.env.SUPABASE_ANON_KEY as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export function getSupabaseClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  }
  return createClient(url, anonKey, { auth: { persistSession: false } })
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } })
}

export function getSupabaseBrowser(): SupabaseClient {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const publicAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  if (!publicUrl || !publicAnon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return createClient(publicUrl, publicAnon, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
}
