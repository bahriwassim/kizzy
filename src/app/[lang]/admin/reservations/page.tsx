'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import Link from "next/link";

const reservations = [
    {
        id: "#K26-1A2B3C",
        customer: "Jean Dupont",
        event: "Golden Paris NYE 2026",
        date: "2024-07-28",
        status: "Confirmée",
        amount: "682,50 €",
    },
    {
        id: "#K26-4D5E6F",
        customer: "Marie Curie",
        event: "Golden Paris NYE 2026",
        date: "2024-07-27",
        status: "En attente",
        amount: "150,00 €",
    },
    {
        id: "#K26-7G8H9I",
        customer: "Pierre Martin",
        event: "Golden Paris NYE 2026",
        date: "2024-07-26",
        status: "Annulée",
        amount: "250,00 €",
    },
    {
        id: "#SF-J1K2L3",
        customer: "Sophie Dubois",
        event: "Summer Fest 2025",
        date: "2024-06-15",
        status: "Confirmée",
        amount: "120,00 €",
    },
    {
        id: "#SF-M4N5P6",
        customer: "Lucas Bernard",
        event: "Summer Fest 2025",
        date: "2024-06-14",
        status: "Confirmée",
        amount: "240,00 €",
    },
    {
        id: "#TC-Q7R8S9",
        customer: "Chloé Petit",
        event: "Tech Conference 2025",
        date: "2024-05-30",
        status: "Confirmée",
        amount: "499,00 €",
    },
];

const ITEMS_PER_PAGE = 5;

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

export default function ReservationsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReservations = reservations.slice(startIndex, endIndex);

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
                                <TableHead>Événement</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReservations.map((reservation) => (
                                <TableRow key={reservation.id}>
                                    <TableCell className="font-medium">{reservation.id}</TableCell>
                                    <TableCell>{reservation.customer}</TableCell>
                                    <TableCell>{reservation.event}</TableCell>
                                    <TableCell>{reservation.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(reservation.status) as any}>
                                            {reservation.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{reservation.amount}</TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/reservations/${reservation.id.replace('#','')}`}>
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