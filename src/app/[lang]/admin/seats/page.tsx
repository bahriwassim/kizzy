import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const venues = [
    { id: "venue_1", name: "Grand Arena", location: "New York, NY", capacity: 12000, seatMaps: 3 },
    { id: "venue_2", name: "City Theater", location: "Chicago, IL", capacity: 2500, seatMaps: 1 },
    { id: "venue_3", name: "The Velvet Room", location: "Los Angeles, CA", capacity: 800, seatMaps: 2 },
];

export default function SeatsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Sièges & Salles</h1>
                    <p className="text-muted-foreground">Configurez les salles et leurs plans de sièges.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/seats/form">Ajouter une salle</Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Salles</CardTitle>
                    <CardDescription>Liste des salles configurées.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom de la Salle</TableHead>
                                <TableHead>Lieu</TableHead>
                                <TableHead>Capacité</TableHead>
                                <TableHead>Plans de Sièges</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {venues.map((venue) => (
                                <TableRow key={venue.id}>
                                    <TableCell className="font-medium">{venue.name}</TableCell>
                                    <TableCell>{venue.location}</TableCell>
                                    <TableCell>{venue.capacity}</TableCell>
                                    <TableCell>{venue.seatMaps}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/seats/form?id=${venue.id}`}>Gérer</Link>
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
