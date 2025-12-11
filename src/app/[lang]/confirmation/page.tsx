'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, QrCode } from 'lucide-react';
import Link from 'next/link';
import { type Locale } from '@/i18n-config';

const content = {
    fr: {
        title: "Merci pour votre commande !",
        description: "Vos billets pour Golden Paris NYE 2026 sont confirmés.",
        emailConfirmation: "Un e-mail de confirmation avec vos e-billets a été envoyé à votre adresse e-mail. Nous sommes impatients de célébrer avec vous !",
        summaryTitle: "Résumé de la réservation",
        orderId: "ID de commande",
        date: "Date",
        tickets: "Billets",
        totalPaid: "Total payé",
        scanAtEntry: "Scannez à l'entrée",
        backToHome: "Retour à l'accueil",
        ticketDetails: "1x Table VIP, 2x Entrée Femme"
    },
    en: {
        title: "Thank you for your order!",
        description: "Your tickets for Golden Paris NYE 2026 are confirmed.",
        emailConfirmation: "A confirmation email with your e-tickets has been sent to your email address. We look forward to celebrating with you!",
        summaryTitle: "Booking Summary",
        orderId: "Order ID",
        date: "Date",
        tickets: "Tickets",
        totalPaid: "Total paid",
        scanAtEntry: "Scan at the entrance",
        backToHome: "Back to Home",
        ticketDetails: "1x VIP Table, 2x Women's Entry"
    }
}

export default async function ConfirmationPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const pageContent = content[lang] || content['fr'];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="max-w-2xl w-full text-center bg-card/50">
        <CardHeader className="items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-headline">{pageContent.title}</CardTitle>
          <CardDescription>{pageContent.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            {pageContent.emailConfirmation}
          </p>
          <Separator />
          <div className="text-left space-y-4">
            <h3 className="font-semibold font-headline text-lg">{pageContent.summaryTitle}</h3>
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p><strong>{pageContent.orderId}:</strong> #K26-1A2B3C</p>
                        <p><strong>{pageContent.date}:</strong> December 31, 2025</p>
                        <p><strong>{pageContent.tickets}:</strong> {pageContent.ticketDetails}</p>
                        <p><strong>{pageContent.totalPaid}:</strong> 920,00 €</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <QrCode className="w-20 h-20" />
                        <span className="text-xs text-muted-foreground">{pageContent.scanAtEntry}</span>
                    </div>
                </div>
            </div>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 mt-6">
            <Link href={`/${lang}/`}>{pageContent.backToHome}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
