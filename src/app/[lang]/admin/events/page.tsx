import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const events = [
    { id: "evt_1", name: "Touch Of Class NYE 2026", status: "Actif", ticketsSold: 2350, totalRevenue: "45 231,89 €" },
    { id: "evt_2", name: "Summer Fest 2025", status: "Terminé", ticketsSold: 5420, totalRevenue: "120 500,00 €" },
    { id: "evt_3", name: "Tech Conference 2025", status: "Brouillon", ticketsSold: 0, totalRevenue: "0,00 €" },
];

export default function EventsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Événements</h1>
                    <p className="text-muted-foreground">Gérez vos événements, consultez leur statut et créez-en de nouveaux.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/events/form">Créer un événement</Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des événements</CardTitle>
                    <CardDescription>Une liste de tous les événements actuels et passés.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom de l'événement</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Billets Vendus</TableHead>
                                <TableHead>Revenu Total</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={event.status === 'Actif' ? 'default' : event.status === 'Terminé' ? 'secondary' : 'outline'}>
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{event.ticketsSold}</TableCell>
                                    <TableCell>{event.totalRevenue}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/events/form?id=${event.id}`}>Modifier</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
