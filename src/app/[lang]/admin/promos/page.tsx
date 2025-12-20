 'use client'
 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";

type PromoRow = { id: string; code: string; type: string; value: number; status: string; redemptions?: number }

export default function PromosPage() {
    const [promos, setPromos] = React.useState<PromoRow[]>([])
    const params = useParams() as { lang?: string }
    const lang = params?.lang || 'fr'
    React.useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/admin/promos', { cache: 'no-store' })
                const data = await res.json().catch(() => [])
                if (res.ok && Array.isArray(data) && data.length > 0) {
                    setPromos(data)
                    return
                }
                const { data: clientData } = await getSupabaseBrowser()
                  .from('promos')
                  .select('id,code,type,value,status,redemptions')
                setPromos(Array.isArray(clientData) ? clientData as any : [])
            } catch {
                try {
                    const { data: clientData } = await getSupabaseBrowser()
                      .from('promos')
                      .select('id,code,type,value,status,redemptions')
                    setPromos(Array.isArray(clientData) ? clientData as any : [])
                } catch {
                    setPromos([])
                }
            }
        })()
    }, [])
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Codes Promotionnels</h1>
                    <p className="text-muted-foreground">Créez et gérez des codes de réduction pour vos événements.</p>
                </div>
                <Button asChild>
                    <Link href={`/${lang}/admin/promos/form`}>Créer un code promo</Link>
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
                            {promos.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-muted-foreground">Aucun code promotionnel</TableCell></TableRow>
                            ) : promos.map((promo) => (
                                <TableRow key={promo.id}>
                                    <TableCell className="font-medium">{promo.code}</TableCell>
                                    <TableCell>{promo.type}</TableCell>
                                    <TableCell>{promo.value}</TableCell>
                                    <TableCell>
                                        <Badge variant={promo.status === 'Actif' ? 'default' : promo.status === 'Expiré' ? 'secondary' : 'outline'}>
                                            {promo.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{promo.redemptions ?? 0}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/${lang}/admin/promos/form?id=${promo.id}`}>Modifier</Link>
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
