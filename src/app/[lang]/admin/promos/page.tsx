import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const promos = [
    { id: "promo_1", code: "NYE2026", type: "Pourcentage", value: "15%", status: "Actif", redemptions: 42 },
    { id: "promo_2", code: "EARLYBIRD", type: "Montant Fixe", value: "50€", status: "Expiré", redemptions: 210 },
    { id: "promo_3", code: "VIPACCESS", type: "Montant Fixe", value: "100€", status: "Programmé", redemptions: 0 },
    { id: "promo_4", code: "LASTCHANCE", type: "Pourcentage", value: "10%", status: "Brouillon", redemptions: 0 },
];

export default function PromosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Codes Promotionnels</h1>
                    <p className="text-muted-foreground">Créez et gérez des codes de réduction pour vos événements.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/promos/form">Créer un code promo</Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Codes Promo</CardTitle>
                    <CardDescription>Liste de tous les codes de réduction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Valeur</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Utilisations</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promos.map((promo) => (
                                <TableRow key={promo.id}>
                                    <TableCell className="font-medium">{promo.code}</TableCell>
                                    <TableCell>{promo.type}</TableCell>
                                    <TableCell>{promo.value}</TableCell>
                                    <TableCell>
                                        <Badge variant={promo.status === 'Actif' ? 'default' : promo.status === 'Expiré' ? 'secondary' : 'outline'}>
                                            {promo.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{promo.redemptions}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/promos/form?id=${promo.id}`}>Modifier</Link>
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
