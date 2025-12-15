import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any))
    const to = String(body?.to || '')
    if (!to) return NextResponse.json({ error: 'Missing recipient' }, { status: 400 })

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 465)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.EMAIL_FROM || 'noreply@garden-party.kizzyevent.com'
    if (!host || !user || !pass) return NextResponse.json({ error: 'SMTP not configured' }, { status: 400 })

    const payload = { orderId: 'TEST', product: 'Test Ticket', idx: 1 }
    const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), { width: 256, margin: 1 })

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Test SMTP — QR Code</h2>
        <p>Si vous recevez cet e-mail, la configuration SMTP est correcte.</p>
        <div style="margin:12px 0;"><img src="${dataUrl}" width="180" height="180" alt="QR Test"/></div>
      </div>
    `
    await transporter.sendMail({ from, to, subject: 'Test SMTP — Kizzy Event', html })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to send test email' }, { status: 500 })
  }
}
