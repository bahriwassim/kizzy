'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, QrCode } from 'lucide-react';
import Link from 'next/link';
import { type Locale } from '@/i18n-config';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase';

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
          return;
        }
        const supabase = getSupabaseBrowser();
        const { data: orderRow } = await supabase.from('orders').select('*').eq('id', sessionId).single();
        const { data: ticketRows } = await supabase.from('tickets').select('order_id, product_name, ticket_index, qr_data_url').eq('order_id', sessionId).order('ticket_index', { ascending: true });
        if (!cancelled) {
          setOrder(orderRow || null);
          setTickets(ticketRows || []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Erreur inattendue');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

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
        const supabase = getSupabaseBrowser();
        const { data: orderRow } = await supabase.from('orders').select('*').eq('id', sessionId).single();
        const { data: ticketRows } = await supabase.from('tickets').select('order_id, product_name, ticket_index, qr_data_url').eq('order_id', sessionId).order('ticket_index', { ascending: true });
        if (!cancelled) {
          setOrder(orderRow || null)
          setTickets(ticketRows || [])
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
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>{pageContent.orderId}:</strong> {order?.id}</p>
                  <p><strong>{pageContent.date}:</strong> {order?.created_at ? new Date(order.created_at).toLocaleString(lang) : '-'}</p>
                  <p><strong>{pageContent.tickets}:</strong> {tickets.length > 0 ? tickets.map(t => t.product_name).join(', ') : '-'}</p>
                  <p><strong>{pageContent.totalPaid}:</strong> {totalPaid} €</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <QrCode className="w-20 h-20" />
                  <span className="text-xs text-muted-foreground">{pageContent.scanAtEntry}</span>
                </div>
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
