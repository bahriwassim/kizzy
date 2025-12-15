
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

  const [order, setOrder] = React.useState<Order | null>(null);
  const [tickets, setTickets] = React.useState<TicketRow[]>([]);
  const [items, setItems] = React.useState<Array<{ description: string; quantity: number }>>([]);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      const supabase = getSupabaseBrowser();
      try {
        const { data } = await supabase.from('orders').select('*').eq('id', id).single()
        setOrder((data as any) || null);
      } catch {
        setOrder(null);
      }
      try {
        const { data } = await supabase.from('tickets').select('order_id,product_name,ticket_index,qr_data_url').eq('order_id', id)
        const rows = Array.isArray(data) ? data : [];
        setTickets(rows as any);
        const grouped: Record<string, number> = {};
        rows.forEach(r => {
          const name = String(r.product_name || 'Billet').trim();
          grouped[name] = (grouped[name] || 0) + 1;
        });
        setItems(Object.entries(grouped).map(([description, quantity]) => ({ description, quantity })));
      } catch {
        setTickets([]);
        setItems([]);
      }
    })()
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/reservations">
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
              <CardTitle>Billets et QR Codes</CardTitle>
              <CardDescription>Codes QR générés à la confirmation de paiement.</CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <div className="text-sm text-muted-foreground">Aucun billet</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tickets.map((t, idx) => (
                    <div key={`${t.order_id}-${idx}`} className="p-2 border rounded-md bg-background flex flex-col items-center">
                      {t.qr_data_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.qr_data_url} alt="QR Code" className="h-32 w-32 object-contain bg-white" />
                      ) : (
                        <div className="h-32 w-32 flex items-center justify-center bg-white">
                          <Ticket className="h-10 w-10 text-black" />
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground text-center">{t.product_name || 'Billet'} #{t.ticket_index ?? idx + 1}</div>
                    </div>
                  ))}
                </div>
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
              <Button variant="secondary" className="w-full">Rembourser la commande</Button>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
