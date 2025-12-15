'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";
import { getSupabaseBrowser } from "@/lib/supabase";

type EventRow = { id: string; name: string; status: string; tickets_sold?: number; total_revenue?: number }

export default function EventsPage() {
    const [events, setEvents] = React.useState<EventRow[]>([])
    React.useEffect(() => {
        (async () => {
            try {
                const { data } = await getSupabaseBrowser().from('events').select('id,name,status,tickets_sold,total_revenue')
                setEvents(Array.isArray(data) ? data : [])
            } catch {
                setEvents([])
            }
        })()
    }, [])
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
                            {events.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-muted-foreground">Aucun événement</TableCell></TableRow>
                            ) : events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={event.status === 'Actif' ? 'default' : event.status === 'Terminé' ? 'secondary' : 'outline'}>
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{event.tickets_sold ?? 0}</TableCell>
                                    <TableCell>{event.total_revenue ?? 0}</TableCell>
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
