'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { QrCode } from 'lucide-react'

export default function EmailsPage() {
  const { toast } = useToast()
  const [subject, setSubject] = useState("Vos billets pour Touch Of Class NYE 2026 sont confirmés !");
  const [body, setBody] = useState(`Bonjour {NOM_CLIENT},

Merci pour votre achat ! Nous sommes ravis de vous compter parmi nous pour Touch Of Class NYE 2026.

Voici les détails de votre commande :
ID de commande : {ID_COMMANDE}
Billets : {LISTE_BILLETS}

Veuillez présenter le code QR ci-dessous à l'entrée de l'événement.

{QR_CODE}

À bientôt !
L'équipe de Touch Of Class NYE 2026`);

  const handleSave = () => {
    // In a real app, this would save the template to a database.
    console.log("Saving email template:", { subject, body });
    toast({
      title: "Modèle enregistré",
      description: "Le modèle d'e-mail de confirmation a été mis à jour.",
    });
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="font-headline text-3xl font-bold">Modèles d'E-mails</h1>
                <p className="text-muted-foreground">Personnalisez l'e-mail de confirmation envoyé aux clients.</p>
            </div>
            <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>E-mail de Confirmation de Billet</CardTitle>
                <CardDescription>Ce modèle est utilisé pour l'e-mail envoyé après un achat réussi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="subject">Sujet de l'e-mail</Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="body">Corps de l'e-mail</Label>
                    <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[300px]" />
                </div>
            </CardContent>
        </Card>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Aperçu</CardTitle>
                    <CardDescription>Voici à quoi ressemblera l'e-mail.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 text-sm border-t">
                    <p><strong>Sujet :</strong> {subject}</p>
                    <div className="p-4 border rounded-lg bg-background min-h-[300px] whitespace-pre-wrap font-sans">
                        {body
                            .replace('{NOM_CLIENT}', 'Jean Dupont')
                            .replace('{ID_COMMANDE}', '#K26-1A2B3C')
                            .replace('{LISTE_BILLETS}', '2x VIP (V1, V2), 1x Premium (P5)')
                            .replace('{QR_CODE}', '')}
                        <div className="flex flex-col items-center justify-center text-center mt-4">
                            <QrCode className="w-24 h-24 text-foreground" />
                            <p className="text-xs text-muted-foreground mt-1">Scannez à l'entrée</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Variables Disponibles</CardTitle>
                    <CardDescription>Utilisez ces variables pour personnaliser l'e-mail.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p><code>{`{NOM_CLIENT}`}</code> - Le nom complet de l'acheteur.</p>
                    <p><code>{`{ID_COMMANDE}`}</code> - L'identifiant unique de la commande.</p>
                    <p><code>{`{LISTE_BILLETS}`}</code> - Un résumé des billets achetés avec les numéros de siège.</p>
                    <p><code>{`{QR_CODE}`}</code> - Le code QR unique pour le scan.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
