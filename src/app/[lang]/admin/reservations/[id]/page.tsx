
'use client';

import { useParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, QrCode, Ticket, User, Calendar, DollarSign, Mail, Phone } from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, you would fetch this based on the ID
const reservationDetails = {
    id: "#K26-1A2B3C",
    customer: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    event: "Golden Paris NYE 2026",
    date: "2024-07-28",
    status: "Confirmée",
    amount: "920,00 €",
    items: [
        { id: 'item-1', description: 'Table VIP - T-V5', quantity: 1, price: '800,00 €' },
        { id: 'item-2', description: 'Entrée simple (Femme)', quantity: 2, price: '120,00 €' },
    ],
    subtotal: "920,00 €",
};


const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Confirmée':
            return 'default';
        case 'En attente':
            return 'secondary';
        case 'Annulée':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function ReservationDetailsPage() {
    const params = useParams();
    const id = params.id;

    // In a real app, you'd fetch the reservation by `id` here.
    // For now, we'll just display the mock data.

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
                    <p className="text-muted-foreground">Commande {reservationDetails.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Contenu de la Commande</CardTitle>
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
                                    {reservationDetails.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.description}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{item.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                         <CardFooter className="flex flex-col items-end space-y-2 bg-secondary/50 p-4">
                            <div className="flex justify-between w-full max-w-xs">
                                <span className="text-muted-foreground">Sous-total</span>
                                <span>{reservationDetails.subtotal}</span>
                            </div>
                             <Separator className="my-2 max-w-xs" />
                            <div className="flex justify-between w-full max-w-xs font-bold text-lg">
                                <span>Total</span>
                                <span>{reservationDetails.amount}</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Statut</CardTitle>
                             <Badge variant={getStatusVariant(reservationDetails.status) as any}>
                                {reservationDetails.status}
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
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{reservationDetails.customer}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${reservationDetails.email}`} className="text-accent underline hover:text-accent/80">
                                    {reservationDetails.email}
                                </a>
                            </div>
                             <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{reservationDetails.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Code QR</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-2 text-center">
                            <div className="p-2 border rounded-md bg-white">
                                <QrCode className="h-24 w-24 text-black" />
                            </div>
                            <p className="text-xs text-muted-foreground">Utiliser ce code pour le scan à l'entrée.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
