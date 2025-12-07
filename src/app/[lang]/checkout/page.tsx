'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/i18n-config';
import { useEffect, useState } from 'react';


const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  cardName: z.string().min(2, { message: 'Name on card is required.' }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: 'Card number must be 16 digits.' }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry must be in MM/YY format." }),
  cardCvc: z.string().regex(/^\d{3,4}$/, { message: 'CVC must be 3 or 4 digits.' }),
  promoCode: z.string().optional(),
});

const BOTTLE_OPTIONS = [
  { id: 'vodka', name: 'Vodka (Grey Goose)' },
  { id: 'whisky', name: 'Whisky (Jack Daniels)' },
  { id: 'gin', name: 'Gin (Bombay Sapphire)' },
  { id: 'champagne', name: 'Champagne (Moët & Chandon)' },
];

const content = {
    fr: {
        pageTitle: "Finalisez Votre Achat",
        pageDescription: "Vous n'êtes plus qu'à une étape de la célébration de l'année.",
        paymentDetailsTitle: "Détails de Paiement",
        paymentDetailsDescription: "Saisissez vos informations personnelles et de paiement.",
        contactInfoLegend: "Informations de Contact",
        fullNameLabel: "Nom Complet",
        fullNamePlaceholder: "Jean Dupont",
        emailLabel: "Adresse E-mail",
        emailPlaceholder: "vous@exemple.com",
        phoneLabel: "Numéro de téléphone",
        phonePlaceholder: "06 12 34 56 78",
        paymentMethodLegend: "Moyen de Paiement (Démo)",
        cardNameLabel: "Nom sur la Carte",
        cardNamePlaceholder: "Jean Dupont",
        cardNumberLabel: "Numéro de Carte",
        cardNumberPlaceholder: "•••• •••• •••• ••••",
        cardExpiryLabel: "Expiration (MM/AA)",
        cardExpiryPlaceholder: "MM/AA",
        cardCvcLabel: "CVC",
        cardCvcPlaceholder: "123",
        submitButton: "Confirmer l'Achat",
        orderSummaryTitle: "Résumé de la Commande",
        totalLabel: "Total",
        promoCodeTitle: "Code Promotionnel",
        promoCodePlaceholder: "Saisir le code",
        promoCodeButton: "Appliquer",
        toastSuccessTitle: "Achat réussi !",
        toastSuccessDescription: "Vos billets pour Golden Paris NYE 2026 sont confirmés. On se voit là-bas !",
        tableItem: "Table",
        menEntryItem: "Entrée Homme",
        womenEntryItem: "Entrée Femme",
        bottlesItem: "Bouteilles incluses",
        onSiteBottle: "À choisir sur place",
    },
    en: {
        pageTitle: "Finalize Your Purchase",
        pageDescription: "You are just one step away from the celebration of the year.",
        paymentDetailsTitle: "Payment Details",
        paymentDetailsDescription: "Enter your personal and payment information.",
        contactInfoLegend: "Contact Information",
        fullNameLabel: "Full Name",
        fullNamePlaceholder: "John Doe",
        emailLabel: "Email Address",
        emailPlaceholder: "you@example.com",
        phoneLabel: "Phone Number",
        phonePlaceholder: "+1 234 567 890",
        paymentMethodLegend: "Payment Method (Demo)",
        cardNameLabel: "Name on Card",
        cardNamePlaceholder: "John Doe",
        cardNumberLabel: "Card Number",
        cardNumberPlaceholder: "•••• •••• •••• ••••",
        cardExpiryLabel: "Expiration (MM/YY)",
        cardExpiryPlaceholder: "MM/YY",
        cardCvcLabel: "CVC",
        cardCvcPlaceholder: "123",
        submitButton: "Confirm Purchase",
        orderSummaryTitle: "Order Summary",
        totalLabel: "Total",
        promoCodeTitle: "Promotional Code",
        promoCodePlaceholder: "Enter code",
        promoCodeButton: "Apply",
        toastSuccessTitle: "Purchase successful!",
        toastSuccessDescription: "Your tickets for Golden Paris NYE 2026 are confirmed. See you there!",
        tableItem: "Table",
        menEntryItem: "Men's Entry",
        womenEntryItem: "Women's Entry",
        bottlesItem: "Included Bottles",
        onSiteBottle: "Choose on site",
    }
}

export default function CheckoutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const { toast } = useToast();
  const router = useRouter();
  const pageContent = content[lang] || content['fr'];
  
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const data = sessionStorage.getItem('checkoutData');
    if (data) {
        try {
            setCheckoutData(JSON.parse(data));
        } catch (e) {
            console.error("Failed to parse checkout data", e);
        }
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      promoCode: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({...values, orderDetails: checkoutData}); 
    toast({
      title: pageContent.toastSuccessTitle,
      description: pageContent.toastSuccessDescription,
    });
    
    // Clear session storage after successful purchase
    sessionStorage.removeItem('checkoutData');
    
    router.push(`/${lang}/confirmation`);
  }

  if (!isMounted) return null;

  const { selectedSeats = [], simpleEntries = { men: 0, women: 0 }, selectedBottles = {}, onSiteBottles = 0, totalPrice = 0 } = checkoutData || {};

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">{pageContent.pageTitle}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {pageContent.pageDescription}
        </p>
      </div>
      {/* Message banner about progressive price increase */}
      <div className="mb-6 rounded-md border bg-card p-4 text-center">
        <span className="font-headline text-sm md:text-base">
          Les prix augmenteront progressivement à partir du 15 décembre 2025.
        </span>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>{pageContent.paymentDetailsTitle}</CardTitle>
            <CardDescription>{pageContent.paymentDetailsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <fieldset className="space-y-4">
                  <legend className="font-headline text-lg mb-2">{pageContent.contactInfoLegend}</legend>
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{pageContent.fullNameLabel}</FormLabel>
                      <FormControl><Input placeholder={pageContent.fullNamePlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{pageContent.emailLabel}</FormLabel>
                      <FormControl><Input type="email" placeholder={pageContent.emailPlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{pageContent.phoneLabel}</FormLabel>
                      <FormControl><Input type="tel" placeholder={pageContent.phonePlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </fieldset>
                
                <Separator />

                <fieldset className="space-y-4">
                  <legend className="font-headline text-lg mb-2">{pageContent.paymentMethodLegend}</legend>
                   <FormField control={form.control} name="cardName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{pageContent.cardNameLabel}</FormLabel>
                      <FormControl><Input placeholder={pageContent.cardNamePlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{pageContent.cardNumberLabel}</FormLabel>
                      <FormControl><Input placeholder={pageContent.cardNumberPlaceholder} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <div className="flex gap-4">
                    <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{pageContent.cardExpiryLabel}</FormLabel>
                        <FormControl><Input placeholder={pageContent.cardExpiryPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="cardCvc" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{pageContent.cardCvcLabel}</FormLabel>
                        <FormControl><Input placeholder={pageContent.cardCvcPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                </fieldset>
                <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{pageContent.submitButton}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle>{pageContent.orderSummaryTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Render Tables */}
                    {selectedSeats.map((seat: any) => (
                        <div key={seat.id} className="flex justify-between">
                            <span>{pageContent.tableItem} ({seat.tier}) - {seat.label}</span>
                            <span>{seat.price} €</span>
                        </div>
                    ))}
                    
                    {/* Render Simple Entries */}
                    {simpleEntries.women > 0 && (
                        <div className="flex justify-between">
                            <span>{simpleEntries.women} x {pageContent.womenEntryItem}</span>
                            <span>{simpleEntries.women * 50} €</span>
                        </div>
                    )}
                    {simpleEntries.men > 0 && (
                        <div className="flex justify-between">
                            <span>{simpleEntries.men} x {pageContent.menEntryItem}</span>
                            <span>{simpleEntries.men * 80} €</span>
                        </div>
                    )}

                    {/* Render Bottles if any tables selected */}
                    {selectedSeats.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="font-semibold mb-2">{pageContent.bottlesItem}</p>
                            {Object.entries(selectedBottles).map(([id, count]: [string, any]) => {
                                if (count === 0) return null;
                                const bottleName = BOTTLE_OPTIONS.find(b => b.id === id)?.name || id;
                                return (
                                    <div key={id} className="flex justify-between text-sm text-muted-foreground">
                                        <span>{count} x {bottleName}</span>
                                        <span>Inclus</span>
                                    </div>
                                )
                            })}
                            {onSiteBottles > 0 && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{onSiteBottles} x {pageContent.onSiteBottle}</span>
                                    <span>Inclus</span>
                                </div>
                            )}
                        </div>
                    )}

                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>{pageContent.totalLabel}</span>
                        <span>{totalPrice} €</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle>{pageContent.promoCodeTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input placeholder={pageContent.promoCodePlaceholder} />
                        <Button variant="secondary">{pageContent.promoCodeButton}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
