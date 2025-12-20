import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any))
    const order_id = String(body?.order_id || body?.orderId || '')
    const toOverride = String(body?.to || '')
    const lang = String(body?.lang || 'fr')
    if (!order_id) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id,email,name')
      .eq('id', order_id)
      .single()
    if (orderErr || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const { data: tickets } = await supabase
      .from('tickets')
      .select('ticket_index')
      .eq('order_id', order_id)
      .order('ticket_index', { ascending: true })
    const count = Array.isArray(tickets) && tickets.length > 0 ? tickets.length : 1

    const envSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://gardenpartyparis.com'
    const site = envSite.replace(/\/+$/, '')
    const confirmUrl = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(order_id)}`
    const qrDataUrl = await QRCode.toDataURL(confirmUrl, { width: 256, margin: 1 })

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.EMAIL_FROM || 'noreply@garden-party.kizzyevent.com'
    const to = toOverride || order?.email || ''
    if (!host || !user || !pass) return NextResponse.json({ error: 'SMTP not configured' }, { status: 400 })
    if (!to) return NextResponse.json({ error: 'Missing recipient' }, { status: 400 })

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const imageHtml = `<div style="margin:12px 0;"><img src="${qrDataUrl}" width="180" height="180" alt="QR Réservation" /></div>`
    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Vos billets</h2>
        <p>Merci pour votre achat. Présentez ce QR code à l'entrée.</p>
        <p>Voir le détail de votre commande&nbsp;: <a href="${confirmUrl}" target="_blank" rel="noopener">${confirmUrl}</a></p>
        ${imageHtml}
      </div>
    `
    await transporter.sendMail({ from, to, subject: 'Confirmation de vos billets — renvoi', html })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to resend email' }, { status: 500 })
  }
}
