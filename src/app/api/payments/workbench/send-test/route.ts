import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any))
    const to = String(body?.to || '')
    const lang = String(body?.lang || 'fr')
    if (!to) return NextResponse.json({ error: 'Missing recipient' }, { status: 400 })

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.EMAIL_FROM || 'noreply@garden-party.kizzyevent.com'
    const envSite = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://gardenpartyparis.com'
    const site = envSite.replace(/\/+$/, '')
    const url = `${site}/${lang}/confirmation?session_id=TEST`
    const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 1 })

    if (!host || !user || !pass) {
      const testAccount = await nodemailer.createTestAccount()
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      })
      const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Test SMTP — QR Code</h2>
        <p>Si vous recevez cet e-mail, la configuration SMTP est correcte.</p>
        <p>Lien de test : <a href="${url}" target="_blank" rel="noopener">${url}</a></p>
        <div style="margin:12px 0;"><img src="${dataUrl}" width="180" height="180" alt="QR Test"/></div>
      </div>
    `
      const info = await transporter.sendMail({ from: 'no-reply@test.local', to, subject: 'Test SMTP — Kizzy Event', html })
      const previewUrl = nodemailer.getTestMessageUrl(info) || ''
      return NextResponse.json({ ok: true, previewUrl }, { status: 200 })
    }

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
        <p>Lien de test : <a href="${url}" target="_blank" rel="noopener">${url}</a></p>
        <div style="margin:12px 0;"><img src="${dataUrl}" width="180" height="180" alt="QR Test"/></div>
      </div>
    `
    const info = await transporter.sendMail({ from, to, subject: 'Test SMTP — Kizzy Event', html })
    const previewUrl = nodemailer.getTestMessageUrl(info) || ''
    return NextResponse.json({ ok: true, previewUrl }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Failed to send test email' }, { status: 500 })
  }
}
