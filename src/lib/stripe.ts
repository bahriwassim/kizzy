import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

let cached: Stripe | null = null

export async function getStripe(): Promise<Stripe> {
  if (cached) return cached
  const envSecret = process.env.STRIPE_SECRET_KEY as string
  if (envSecret) {
    cached = new Stripe(envSecret, { typescript: true })
    return cached
  }
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('payment_config')
    .select('secret_key')
    .eq('id', 'default')
    .single()
  if (error || !data?.secret_key) {
    throw new Error('Missing Stripe secret key')
  }
  cached = new Stripe(data.secret_key, { typescript: true })
  return cached
}
