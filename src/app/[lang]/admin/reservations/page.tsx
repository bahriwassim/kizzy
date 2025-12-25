'use client';

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";

type OrderRow = {
  id: string
  email: string | null
  name: string | null
  amount_total: number | null
  currency: string | null
  status: string | null
  created_at: string | null
}

const ITEMS_PER_PAGE = 10;

const formatAmount = (amount: number | null, currency: string | null) => {
  const cents = amount ?? 0;
  const euros = Math.round(cents) / 100;
  return `${euros.toFixed(2)} ${String(currency || 'EUR').toUpperCase()}`;
};

const formatDate = (iso: string | null) => {
  const d = iso ? new Date(iso) : null;
  return d ? d.toLocaleDateString() : '-';
};

const getStatusLabel = (status: string | null) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'Confirmée';
  if (s === 'pending') return 'En attente';
  if (s === 'canceled') return 'Annulée';
  return status || '-';
};

const getStatusVariant = (status: string | null) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'paid':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'canceled':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function ReservationsPage() {
  const [orders, setOrders] = React.useState<OrderRow[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const params = useParams() as { lang?: string }
  const lang = String(params?.lang || 'fr')

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/orders?limit=200')
        if (res.ok) {
          const json = await res.json()
          const arr = Array.isArray(json?.orders) ? json.orders : []
          setOrders(arr as any)
          return
        }
      } catch {}
      try {
        const { data } = await getSupabaseBrowser()
          .from('orders')
          .select('id,email,name,amount_total,currency,status,created_at')
          .order('created_at', { ascending: false })
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      }
    })()
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-bold">Réservations</h1>
          <p className="text-muted-foreground">Suivez et gérez toutes les réservations de billets.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réservations</CardTitle>
          <CardDescription>Une vue d'ensemble de toutes les commandes passées.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">Aucune réservation</TableCell>
                </TableRow>
              ) : currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.name || order.email || '-'}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatAmount(order.amount_total, order.currency)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/${lang}/admin/reservations/${order.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir les détails</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline">
              Précédent
            </Button>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
              Suivant
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
