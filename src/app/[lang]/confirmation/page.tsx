'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { type Locale } from '@/i18n-config';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase';
import QRCode from 'qrcode';

const content = {
  fr: {
    title: "Merci pour votre commande !",
    description: "Vos billets pour Golden Paris NYE 2026 sont confirmés.",
    emailConfirmation: "Un e-mail de confirmation avec vos e-billets a été envoyé à votre adresse e-mail.",
    summaryTitle: "Résumé de la réservation",
    orderId: "ID de commande",
    date: "Date",
    tickets: "Billets",
    totalPaid: "Total payé",
    scanAtEntry: "Scannez à l'entrée",
    backToHome: "Retour à l'accueil",
    notFoundTitle: "Commande introuvable",
    notFoundDesc: "Si vous venez de payer, patientez quelques secondes et actualisez.",
    refresh: "Actualiser",
  },
  en: {
    title: "Thank you for your order!",
    description: "Your tickets for Golden Paris NYE 2026 are confirmed.",
    emailConfirmation: "A confirmation email with your e‑tickets has been sent to your email.",
    summaryTitle: "Booking Summary",
    orderId: "Order ID",
    date: "Date",
    tickets: "Tickets",
    totalPaid: "Total paid",
    scanAtEntry: "Scan at the entrance",
    backToHome: "Back to Home",
    notFoundTitle: "Order not found",
    notFoundDesc: "If you just paid, wait a few seconds and refresh.",
    refresh: "Refresh",
  },
};

type OrderRow = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  amount_total: number | null;
  currency: string | null;
  created_at: string | null;
};

type TicketRow = {
  order_id: string;
  product_name: string;
  ticket_index: number;
  qr_data_url?: string | null;
};

function ConfirmationPageContent() {
  const params = useParams<{ lang: Locale }>();
  const search = useSearchParams();
  const lang = (params?.lang as Locale) || 'fr';
  const pageContent = content[lang] || content['fr'];
  const sessionId = search.get('session_id') || '';

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [bottles, setBottles] = useState<Array<{ seat_label: string; tier: string | null; bottle_id: string | null; count: number; on_site: boolean }>>([]);

  const totalPaid = useMemo(() => {
    const cents = order?.amount_total || 0;
    return (cents / 100).toFixed(2);
  }, [order]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!sessionId) {
          setOrder(null);
          setTickets([]);
          setBottles([]);
          return;
        }
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
        const json = await res.json().catch(() => ({} as any))
        const orderRow = res.ok ? (json?.order || null) : null
        const ticketRows = res.ok ? (Array.isArray(json?.tickets) ? json.tickets : []) : []
        const bottleRows = res.ok ? (Array.isArray(json?.bottles) ? json.bottles : []) : []
        if (!cancelled) {
          setOrder(orderRow || null);
          setTickets(ticketRows || []);
          setBottles(bottleRows || []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Erreur inattendue');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    async function genQR() {
      try {
        if (!sessionId) {
          setQrUrl('');
          return;
        }
        const envSite = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
        const site = String(envSite).replace(/\/+$/, '');
        const confirmUrl = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(sessionId)}`;
        const dataUrl = await QRCode.toDataURL(confirmUrl, { width: 256, margin: 1 });
        setQrUrl(dataUrl);
      } catch {
        setQrUrl('');
      }
    }
    genQR();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false
    async function loadBottles() {
      if (!sessionId) return
      try {
        const supabase = getSupabaseBrowser();
        const { data } = await supabase
          .from('order_bottles')
          .select('seat_label,tier,bottle_id,count,on_site')
          .eq('order_id', sessionId)
        if (!cancelled) {
          setBottles(Array.isArray(data) ? data : [])
        }
      } catch {}
    }
    loadBottles()
    return () => { cancelled = true }
  }, [sessionId])

  useEffect(() => {
    let cancelled = false
    async function reconcile() {
      if (!sessionId || loading || order || reconciling) return
      try {
        setReconciling(true)
        await fetch('/api/stripe/reconcile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
        if (cancelled) return
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
        const json = await res.json().catch(() => ({} as any))
        const orderRow = res.ok ? (json?.order || null) : null
        const ticketRows = res.ok ? (Array.isArray(json?.tickets) ? json.tickets : []) : []
        const bottleRows = res.ok ? (Array.isArray(json?.bottles) ? json.bottles : []) : []
        if (!cancelled) {
          setOrder(orderRow || null)
          setTickets(ticketRows || [])
          setBottles(bottleRows || [])
        }
      } catch {}
      finally {
        if (!cancelled) setReconciling(false)
      }
    }
    reconcile()
    return () => { cancelled = true }
  }, [sessionId, loading, order, reconciling])

  useEffect(() => {
    try {
      const w = window as any
      if (order && typeof w.fbq === 'function') {
        w.fbq('track', 'Purchase', { value: ((order.amount_total || 0) / 100), currency: 'EUR' })
      }
    } catch {}
  }, [order])

  const labels = useMemo(() => {
    return lang === 'en'
      ? { entries: 'Entries', women: "Women’s Entries", men: "Men’s Entries", tables: 'Tables', bottles: 'Bottles', onSite: 'On site' }
      : { entries: 'Entrées', women: 'Entrées Femmes', men: 'Entrées Hommes', tables: 'Tables', bottles: 'Bouteilles', onSite: 'Sur place' }
  }, [lang])

  const parsedSummary = useMemo(() => {
    const men = tickets.filter(t => String(t.product_name || '').toUpperCase().includes('ENTRÉE HOMME') || String(t.product_name || '').toUpperCase().includes('ENTREE HOMME')).length
    const women = tickets.filter(t => String(t.product_name || '').toUpperCase().includes('ENTRÉE FEMME') || String(t.product_name || '').toUpperCase().includes('ENTREE FEMME')).length
    const tables: Record<string, string[]> = {}
    for (const t of tickets) {
      const name = String(t.product_name || '')
      if (name.toUpperCase().startsWith('TABLE')) {
        const m = name.match(/^Table\s+(.+?)\s*-\s*(.+)$/i)
        if (m) {
          const tier = m[1].toUpperCase()
          const label = m[2]
          const arr = tables[tier] || []
          if (!arr.includes(label)) arr.push(label)
          tables[tier] = arr
        } else {
          const arr = tables['TABLE'] || []
          arr.push(name)
          tables['TABLE'] = arr
        }
      }
    }
    return { men, women, tables }
  }, [tickets])

  const BOTTLE_NAMES: Record<string, string> = {
    'vodka-70': lang === 'en' ? 'Vodka 70 cl (Grey Goose)' : 'Vodka 70 cl (Grey Goose)',
    'vodka-magnum-15': lang === 'en' ? 'Magnum Vodka 1.5 l (Grey Goose)' : 'Magnum Vodka 1,5 l (Grey Goose)',
    'whisky-70': lang === 'en' ? 'Whisky 70 cl (Jack Daniels)' : 'Whiskies 70 cl (Jack Daniels)',
    'whisky-15': lang === 'en' ? 'Whisky 1.5 l (Jack Daniels)' : 'Whiskies 1,5 l (Jack Daniels)',
    'rhum-ambre-70': lang === 'en' ? 'Amber Rum 70 cl (Trois Rivières)' : 'Rhum Ambré 70 cl (Trois Rivières Ambre)',
    'champagne-moet-70': lang === 'en' ? 'Champagne 70 cl (Moët & Chandon)' : 'Champagne 70 cl (Moët & Chandon)',
    'champagne-veuve-70': lang === 'en' ? 'Champagne 70 cl (Veuve Clicquot)' : 'Champagne 70 cl (Veuve Clicquot)',
    'champagne-ruinart-70': lang === 'en' ? 'Champagne 70 cl (Ruinart B.B)' : 'Champagne 70 cl (Ruinart B.B)',
    'champagne-belaire-70': lang === 'en' ? 'Champagne 70 cl (Belaire B.B)' : 'Champagne 70 cl (Belaire B.B)',
    'champagne-asgarnier-70': lang === 'en' ? 'Champagne 70 cl (AS Garnier)' : 'Champagne 70 cl (AS Garnier)',
    'prosecco-70': lang === 'en' ? 'Sparkling Wine 70 cl (Prosecco)' : 'Vin Pétillant 70 cl (Prosecco)',
    'magnum-mocktail': lang === 'en' ? 'Magnum non-alcoholic (Sex On the Beach)' : 'Magnum sans alcool (Sex On the Beach)',
  }

  const TIER_PRICES: Record<string, number> = {
    'STANDARD': 250,
    'PRESTIGE': 350,
    'PREMIUM': 500,
    'VIP': 800,
    'PLATINIUM': 1000,
    'ULTRA VIP': 2000,
  }
  const ENTRY_PRICES = { women: 50, men: 80 }
  const itemized = useMemo(() => {
    const tables: Array<{ tier: string; label: string; price: number }> = []
    for (const [tier, labelsList] of Object.entries(parsedSummary.tables)) {
      const price = TIER_PRICES[tier] ?? 0
      for (const label of labelsList) {
        tables.push({ tier, label, price })
      }
    }
    const entries: Array<{ kind: 'women' | 'men'; count: number; unit: number; subtotal: number }> = []
    if (parsedSummary.women > 0) {
      const unit = ENTRY_PRICES.women
      entries.push({ kind: 'women', count: parsedSummary.women, unit, subtotal: unit * parsedSummary.women })
    }
    if (parsedSummary.men > 0) {
      const unit = ENTRY_PRICES.men
      entries.push({ kind: 'men', count: parsedSummary.men, unit, subtotal: unit * parsedSummary.men })
    }
    const tablesSubtotal = tables.reduce((s, t) => s + t.price, 0)
    const entriesSubtotal = entries.reduce((s, e) => s + e.subtotal, 0)
    const grandSubtotal = tablesSubtotal + entriesSubtotal
    const paid = Number(order?.amount_total || 0) / 100
    const delta = Math.max(0, grandSubtotal - paid)
    return { tables, entries, tablesSubtotal, entriesSubtotal, grandSubtotal, paid, delta }
  }, [parsedSummary, order])

  if (!sessionId || (!loading && !order)) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <Card className="max-w-2xl w-full text-center bg-card/50">
          <CardHeader className="items-center">
            <CardTitle className="text-2xl font-headline">{pageContent.notFoundTitle}</CardTitle>
            <CardDescription>{pageContent.notFoundDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => location.reload()} className="bg-accent text-accent-foreground hover:bg-accent/90">{pageContent.refresh}</Button>
              <Button asChild variant="outline"><Link href={`/${lang}/`}>{pageContent.backToHome}</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="max-w-2xl w-full text-center bg-card/50">
        <CardHeader className="items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-headline">{pageContent.title}</CardTitle>
          <CardDescription>{pageContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{pageContent.emailConfirmation}</p>
          <Separator />
          <div className="text-left space-y-4">
            <h3 className="font-semibold font-headline text-lg">{pageContent.summaryTitle}</h3>
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-4 sm:gap-6 items-start">
                <div className="break-words">
                  <p><strong>{pageContent.orderId}:</strong> {order?.id}</p>
                  <p><strong>{pageContent.date}:</strong> {order?.created_at ? new Date(order.created_at).toLocaleString(lang) : '-'}</p>
                  <div className="space-y-1">
                    <p><strong>{labels.entries}:</strong> {parsedSummary.women + parsedSummary.men > 0 ? `${labels.women}: ${parsedSummary.women} · ${labels.men}: ${parsedSummary.men}` : '-'}</p>
                    <p>
                      <strong>{labels.tables}:</strong>{' '}
                      {Object.keys(parsedSummary.tables).length > 0
                        ? Object.entries(parsedSummary.tables)
                            .map(([tier, labelsList]) => `${tier}: ${labelsList.join(', ')}`)
                            .join(' · ')
                        : '-'}
                    </p>
                    <p>
                      <strong>{labels.bottles}:</strong>{' '}
                      {bottles.length > 0
                        ? bottles
                            .map(b => {
                              const name = b.on_site ? labels.onSite : (BOTTLE_NAMES[String(b.bottle_id || '')] || String(b.bottle_id || ''))
                              const seat = b.seat_label ? `${String(b.tier || '').toUpperCase()} - ${b.seat_label}` : ''
                              const qty = Number(b.count || 0) > 0 && !b.on_site ? ` x ${Number(b.count || 0)}` : ''
                              return seat ? `${seat}: ${name}${qty}` : `${name}${qty}`
                            })
                            .join(' · ')
                        : '-'}
                    </p>
                  </div>
                  <p><strong>{pageContent.totalPaid}:</strong> {totalPaid} €</p>
                </div>
                <div className="flex flex-col items-center gap-1 sm:self-start">
                  {qrUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrUrl} alt="QR" className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white border rounded" />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border rounded" />
                  )}
                  <span className="text-xs text-muted-foreground">{pageContent.scanAtEntry}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <h4 className="font-semibold">{lang === 'en' ? 'Itemized totals' : 'Détail des prix par item'}</h4>
              <div className="space-y-1">
                {itemized.tables.length > 0 && (
                  <div>
                    <p className="mb-1"><strong>{lang === 'en' ? 'Tables' : 'Tables'}:</strong></p>
                    {itemized.tables.map((t, i) => (
                      <p key={`t-${t.tier}-${t.label}-${i}`} className="text-sm">{`Table ${t.tier} - ${t.label}: ${t.price} €`}</p>
                    ))}
                    <p className="mt-1 text-sm"><strong>{lang === 'en' ? 'Tables subtotal' : 'Sous-total tables'}:</strong> {itemized.tablesSubtotal} €</p>
                  </div>
                )}
                {itemized.entries.length > 0 && (
                  <div className="mt-2">
                    <p className="mb-1"><strong>{labels.entries}:</strong></p>
                    {itemized.entries.map((e, i) => (
                      <p key={`e-${e.kind}-${i}`} className="text-sm">
                        {`${e.kind === 'women' ? (lang === 'en' ? "Women's Entries" : 'Entrées Femmes') : (lang === 'en' ? "Men's Entries" : 'Entrées Hommes')} × ${e.count}: ${e.unit} € → ${e.subtotal} €`}
                      </p>
                    ))}
                    <p className="mt-1 text-sm"><strong>{lang === 'en' ? 'Entries subtotal' : 'Sous-total entrées'}:</strong> {itemized.entriesSubtotal} €</p>
                  </div>
                )}
                <p className="mt-2 text-sm"><strong>{lang === 'en' ? 'Subtotal' : 'Sous-total'}:</strong> {itemized.grandSubtotal} €</p>
                <p className="text-sm"><strong>{pageContent.totalPaid}:</strong> {itemized.paid.toFixed(2)} €</p>
              </div>
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 mt-6">
            <Link href={`/${lang}/`}>{pageContent.backToHome}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div />}>
      <ConfirmationPageContent />
    </Suspense>
  )
}
