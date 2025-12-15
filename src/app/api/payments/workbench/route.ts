import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    let source: 'env' | 'db' | 'none' = 'none'
    try {
      const stripe = await getStripe()
      // Inspect where the key came from by checking env presence
      source = process.env.STRIPE_SECRET_KEY ? 'env' : 'db'
      // Simple call to verify the key works
      const balance = await stripe.balance.retrieve()
      const webhookSecretEnv = !!process.env.STRIPE_WEBHOOK_SECRET
      let webhookSecretDb = false
      if (!webhookSecretEnv) {
        const supabase = getSupabaseAdmin()
        const { data } = await supabase.from('payment_config').select('webhook_secret').eq('id', 'default').single()
        webhookSecretDb = !!data?.webhook_secret
      }
      return NextResponse.json({
        stripe_ok: true,
        source,
        webhook_secret_present: webhookSecretEnv || webhookSecretDb,
        balance_available: (balance?.available || []).reduce((n: number, c: any) => n + (c?.amount || 0), 0),
        balance_pending: (balance?.pending || []).reduce((n: number, c: any) => n + (c?.amount || 0), 0),
      })
    } catch (err: any) {
      return NextResponse.json({ stripe_ok: false, source, error: err.message || 'Stripe error' }, { status: 200 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to run workbench' }, { status: 500 })
  }
}
