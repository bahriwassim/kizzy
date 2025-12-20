
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Ticket, User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowser } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode'

const BOTTLE_OPTIONS: Array<{ id: string; name: string }> = [
  { id: 'vodka-70', name: 'Vodka 70 cl (Grey Goose)' },
  { id: 'vodka-magnum-15', name: 'Magnum Vodka 1,5 l (Grey Goose)' },
  { id: 'whisky-70', name: 'Whiskies 70 cl (Jack Daniels)' },
  { id: 'whisky-15', name: 'Whiskies 1,5 l (Jack Daniels)' },
  { id: 'rhum-ambre-70', name: 'Rhum Ambré 70 cl (Trois Rivières Ambre)' },
  { id: 'champagne-moet-70', name: 'Champagne 70 cl (Moët & Chandon)' },
  { id: 'champagne-veuve-70', name: 'Champagne 70 cl (Veuve Clicquot)' },
  { id: 'champagne-ruinart-70', name: 'Champagne 70 cl (Ruinart B.B)' },
  { id: 'champagne-belaire-70', name: 'Champagne 70 cl (Belaire B.B)' },
  { id: 'champagne-asgarnier-70', name: 'Champagne 70 cl (AS Garnier)' },
  { id: 'prosecco-70', name: 'Vin Pétillant 70 cl (Prosecco)' },
  { id: 'magnum-mocktail', name: 'Magnum sans alcool (Sex On the Beach)' },
]

type Order = {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  amount_total: number | null
  currency: string | null
  status: string | null
  created_at: string | null
}
type TicketRow = { id?: string; order_id: string; product_name: string | null; ticket_index: number | null; qr_data_url: string | null }
type BottleRow = { seat_label: string; tier: string; bottle_id: string | null; count: number | null; on_site: boolean | null }

const formatAmount = (amount: number | null, currency: string | null) => {
  const euros = ((amount ?? 0) / 100).toFixed(2);
  return `${euros} ${String(currency || 'EUR').toUpperCase()}`;
};
const formatDate = (iso: string | null) => {
  const d = iso ? new Date(iso) : null;
  return d ? d.toLocaleDateString() : '-';
};
const statusLabel = (status: string | null) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'Confirmée';
  if (s === 'pending') return 'En attente';
  if (s === 'canceled') return 'Annulée';
  return status || '-';
};
const statusVariant = (status: string | null) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'default';
  if (s === 'pending') return 'secondary';
  if (s === 'canceled') return 'destructive';
  return 'outline';
};

export default function ReservationDetailsPage() {
  const params = useParams();
  const id = String(params.id || '');
  const lang = String((params as any).lang || 'fr')
  const { toast } = useToast()

  const [order, setOrder] = React.useState<Order | null>(null);
  const [tickets, setTickets] = React.useState<TicketRow[]>([]);
  const [items, setItems] = React.useState<Array<{ description: string; quantity: number }>>([]);
  const [bottles, setBottles] = React.useState<BottleRow[]>([]);
  const [testEmail, setTestEmail] = React.useState('')
  const [sendingTest, setSendingTest] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const [qrUrl, setQrUrl] = React.useState('')

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { cache: 'no-store' })
        const json = await res.json()
        if (res.ok) {
          setOrder(json?.order || null)
          const rows = Array.isArray(json?.tickets) ? json.tickets as any[] : []
          setTickets(rows as any)
          const grouped: Record<string, number> = {}
          const normalize = (name: string) => {
            const raw = String(name || '').trim()
            const u = raw.toUpperCase()
            if (u.includes('TABLE')) {
              const tier = u.includes('ULTRA VIP') ? 'ULTRA VIP'
                : u.includes('PLATINIUM') ? 'PLATINIUM'
                : u.includes('VIP') ? 'VIP'
                : u.includes('PREMIUM') ? 'PREMIUM'
                : u.includes('PRESTIGE') ? 'PRESTIGE'
                : u.includes('STANDARD') ? 'STANDARD'
                : 'TABLE'
              return `Table ${tier}`
            }
            return raw || 'Billet'
          }
          rows.forEach(r => {
            const name = normalize(String(r.product_name || 'Billet'))
            grouped[name] = (grouped[name] || 0) + 1
          })
          setItems(Object.entries(grouped).map(([description, quantity]) => ({ description, quantity })))
          const rawBottles = Array.isArray(json?.bottles) ? (json.bottles as any) : []
          const sortedBottles = [...rawBottles].sort((a, b) => {
            const la = String(a.seat_label || '')
            const lb = String(b.seat_label || '')
            if (la !== lb) return la.localeCompare(lb, undefined, { numeric: true })
            const ta = String(a.tier || '')
            const tb = String(b.tier || '')
            if (ta !== tb) return ta.localeCompare(tb)
            const ia = String(a.bottle_id || '')
            const ib = String(b.bottle_id || '')
            return ia.localeCompare(ib)
          })
          setBottles(sortedBottles)
          return
        }
      } catch {}
      // Fallback client
      try {
        const supabase = getSupabaseBrowser();
        const { data: orderRow } = await supabase.from('orders').select('*').eq('id', id).single()
        setOrder((orderRow as any) || null);
        const { data: ticketRows } = await supabase.from('tickets').select('order_id,product_name,ticket_index,qr_data_url').eq('order_id', id)
        const rows = Array.isArray(ticketRows) ? ticketRows : [];
        setTickets(rows as any);
        const grouped: Record<string, number> = {};
        const normalize = (name: string) => {
          const raw = String(name || '').trim()
          const u = raw.toUpperCase()
          if (u.includes('TABLE')) {
            const tier = u.includes('ULTRA VIP') ? 'ULTRA VIP'
              : u.includes('PLATINIUM') ? 'PLATINIUM'
              : u.includes('VIP') ? 'VIP'
              : u.includes('PREMIUM') ? 'PREMIUM'
              : u.includes('PRESTIGE') ? 'PRESTIGE'
              : u.includes('STANDARD') ? 'STANDARD'
              : 'TABLE'
            return `Table ${tier}`
          }
          return raw || 'Billet'
        }
        rows.forEach(r => {
          const name = normalize(String(r.product_name || 'Billet'));
          grouped[name] = (grouped[name] || 0) + 1;
        });
        setItems(Object.entries(grouped).map(([description, quantity]) => ({ description, quantity })));
        const { data: bottleRows } = await supabase.from('order_bottles').select('seat_label,tier,bottle_id,count,on_site').eq('order_id', id)
        const rawBottles = Array.isArray(bottleRows) ? (bottleRows as any) : []
        const sortedBottles = [...rawBottles].sort((a, b) => {
          const la = String(a.seat_label || '')
          const lb = String(b.seat_label || '')
          if (la !== lb) return la.localeCompare(lb, undefined, { numeric: true })
          const ta = String(a.tier || '')
          const tb = String(b.tier || '')
          if (ta !== tb) return ta.localeCompare(tb)
          const ia = String(a.bottle_id || '')
          const ib = String(b.bottle_id || '')
          return ia.localeCompare(ib)
        })
        setBottles(sortedBottles)
      } catch {
        setOrder(null)
        setTickets([])
        setItems([])
        setBottles([])
      }
    })()
  }, [id]);

  React.useEffect(() => {
    (async () => {
      try {
        if (!order?.id) {
          setQrUrl('')
          return
        }
        const envSite = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
        const site = String(envSite).replace(/\/+$/, '')
        const confirmUrl = `${site}/${lang}/confirmation?session_id=${encodeURIComponent(order.id)}`
        const dataUrl = await QRCode.toDataURL(confirmUrl, { width: 256, margin: 1 })
        setQrUrl(dataUrl)
      } catch {
        setQrUrl('')
      }
    })()
  }, [order?.id, lang])

  const sendTestEmail = async () => {
    if (!testEmail) return
    setSendingTest(true)
    try {
      const res = await fetch('/api/payments/workbench/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail, lang }),
      })
      const j = await res.json().catch(() => ({} as any))
      if (res.ok) {
        const preview = typeof j?.previewUrl === 'string' ? j.previewUrl : ''
        toast({ title: 'E-mail de test envoyé', description: preview ? `Prévisualisation: ${preview}` : `Vérifiez ${testEmail}` })
      } else {
        toast({ variant: 'destructive', title: 'Échec de l’envoi', description: j?.error || 'Erreur inconnue' })
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: e.message || 'Impossible d’envoyer' })
    } finally {
      setSendingTest(false)
    }
  }

  const resendEmailToClient = async () => {
    setResending(true)
    try {
      const res = await fetch('/api/admin/orders/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: id, lang }),
      })
      const j = await res.json().catch(() => ({} as any))
      if (res.ok) {
        toast({ title: 'E-mail renvoyé', description: `Envoyé à ${order?.email || 'client'}` })
      } else {
        toast({ variant: 'destructive', title: 'Échec du renvoi', description: j?.error || 'Erreur inconnue' })
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Erreur', description: e.message || 'Impossible de renvoyer' })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/${lang}/admin/reservations`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-headline text-3xl font-bold">Détails de la réservation</h1>
          <p className="text-muted-foreground">Commande {order?.id || id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu de la Commande</CardTitle>
              <CardDescription>Résumé des produits associés aux billets.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantité</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-muted-foreground">Aucun article</TableCell></TableRow>
                  ) : items.map((item, idx) => (
                    <TableRow key={`${item.description}-${idx}`}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end space-y-2 bg-secondary/50 p-4">
              <div className="flex justify-between w-full max-w-xs">
                <span className="text-muted-foreground">Date</span>
                <span>{formatDate(order?.created_at || null)}</span>
              </div>
              <Separator className="my-2 max-w-xs" />
              <div className="flex justify-between w-full max-w-xs font-bold text-lg">
                <span>Total</span>
                <span>{formatAmount(order?.amount_total || null, order?.currency || null)}</span>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code de la réservation</CardTitle>
              <CardDescription>Un seul QR code par commande.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Réservation" className="h-40 w-40 object-contain bg-white border rounded" />
                ) : (
                  <div className="h-40 w-40 flex items-center justify-center bg-white border rounded">
                    <Ticket className="h-12 w-12 text-black" />
                  </div>
                )}
                <div className="mt-3 text-sm text-muted-foreground">
                  {tickets.length > 0 ? `${tickets.length} billet(s)` : 'Aucun billet'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bouteilles</CardTitle>
              <CardDescription>Sélection des bouteilles par table (incluses).</CardDescription>
            </CardHeader>
            <CardContent>
              {bottles.length === 0 ? (
                <div className="text-sm text-muted-foreground">Aucune sélection de bouteilles</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Bouteille</TableHead>
                      <TableHead className="text-center">Quantité</TableHead>
                      <TableHead>Mode</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bottles.map((b, idx) => (
                      <TableRow key={`b-${idx}`}>
                        <TableCell className="font-medium">{b.seat_label}</TableCell>
                        <TableCell>{b.tier}</TableCell>
                        <TableCell>{
                          b.on_site
                            ? '-'
                            : (BOTTLE_OPTIONS.find(opt => opt.id === String(b.bottle_id || ''))?.name || (b.bottle_id || '-'))
                        }</TableCell>
                        <TableCell className="text-center">{b.on_site ? '-' : (b.count || 0)}</TableCell>
                        <TableCell>{b.on_site ? 'Sur place' : 'Pré-sélection'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Statut</CardTitle>
              <Badge variant={statusVariant(order?.status ?? null) as any}>
                {statusLabel(order?.status ?? null)}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gérer le statut de la commande ou effectuer des actions comme un remboursement.
              </p>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <Button variant="secondary" className="w-full">Rembourser la commande</Button>
                <Button onClick={resendEmailToClient} disabled={resending || !order?.email} className="w-full">
                  {resending ? 'Renvoi…' : 'Renvoyer l’e-mail au client'}
                </Button>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
              <CardDescription>Informations du contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order?.name || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {order?.email ? (
                  <a href={`mailto:${order.email}`} className="text-accent underline hover:text-accent/80">
                    {order.email}
                  </a>
                ) : <span>-</span>}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order?.phone || '-'}</span>
              </div>
              <div className="pt-2 space-y-2">
                <div className="text-xs text-muted-foreground">Envoyer un e-mail de test</div>
                <div className="flex items-center gap-2">
                  <Input placeholder="email de test" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
                  <Button onClick={sendTestEmail} disabled={sendingTest || !testEmail}>Envoyer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
