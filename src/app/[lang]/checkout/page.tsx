'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { type Locale } from '@/i18n-config';



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
  { id: 'vodka-70', name: 'Vodka 70 cl (Grey Goose)' },
  { id: 'vodka-magnum-15', name: 'Magnum Vodka 1,5 l (Grey Goose)' },
  { id: 'whisky-70', name: 'Whiskies 70 cl (Jack Daniels)' },
  { id: 'whisky-15', name: 'Whiskies 1,5 l (Jack Daniels)' },
  { id: 'rhum-ambre-70', name: 'Rhum Ambré 70 cl (Trois Rivières Ambre)' },
  { id: 'champagne-moet-70', name: 'Champagne 70 cl (Moët & Chandon)' },
  { id: 'champagne-veuve-70', name: 'Champagne 70 cl (Veuve Clicquot)' },
  { id: 'champagne-ruinart-70', name: 'Champagne 70 cl (Ruinart B.B)' },
  { id: 'champagne-belaire-70', name: 'Champagne 70 cl (Belaire B.B)' },
  { id: 'champagne-asgarnier-70', name: 'Champagne 70 cl (AS Garnier)' },
  { id: 'prosecco-70', name: 'Vin Pétillant 70 cl (Prosecco)' },
  { id: 'magnum-mocktail', name: 'Magnum sans alcool (Sex On the Beach)' },
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
        paymentMethodLegend: "Payment Method",
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
        toastSuccessDescription: "Your tickets for Touch Of Class NYE 2026 are confirmed. See you there!",
        tableItem: "Table",
        menEntryItem: "Men's Entry",
        womenEntryItem: "Women's Entry",
        bottlesItem: "Included Bottles",
        onSiteBottle: "Choose on site",
    }
}

export default function CheckoutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { toast } = useToast();
  const router = useRouter();
  const { lang: langParam } = useParams() as { lang?: Locale };
  const lang = (langParam || 'fr') as Locale;
  const pageContent = content[lang] || content['fr'];
  
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

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

  const [phoneCode, setPhoneCode] = useState('+33')
  const phonePlaceholder = useMemo(() => (lang === 'en' ? '+1 234 567 890' : '+33 6 12 34 56 78'), [lang])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          customer: { email: values.email, name: values.fullName, phone: values.phone },
          order: {
            selectedSeats,
            simpleEntries,
            totalPrice,
          },
        }),
      })
      if (!res.ok) {
        throw new Error('Payment initialization failed')
      }
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url as string
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (e) {
      toast({
        title: 'Erreur de paiement',
        description: 'Impossible de démarrer le paiement. Réessayez plus tard.',
        variant: 'destructive',
      })
    }
  }

  if (!isMounted) return null;

  const { selectedSeats = [], simpleEntries = { men: 0, women: 0 }, selectedBottlesBySeat = {}, onSiteSeat = {}, totalPrice = 0 } = checkoutData || {};

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">{pageContent.pageTitle}</h1>
        
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
                      <div className="flex gap-2">
                        <Select value={phoneCode} onValueChange={(v) => { setPhoneCode(v); field.onChange(`${v} ${field.value?.replace(/^\+?\d+\s?/, '') || ''}`) }}>
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="+33" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+33">+33 FR</SelectItem>
                            <SelectItem value="+44">+44 UK</SelectItem>
                            <SelectItem value="+1">+1 US</SelectItem>
                            <SelectItem value="+212">+212 MA</SelectItem>
                            <SelectItem value="+49">+49 DE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={phonePlaceholder}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(`${phoneCode} ${e.target.value.replace(/^\+?\d+\s?/, '')}`)}
                          />
                        </FormControl>
                      </div>
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

                    {/* Render Bottles per table */}
                    {selectedSeats.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="font-semibold mb-2">{pageContent.bottlesItem}</p>
                            {selectedSeats.map((seat: any) => {
                                const seatBottles: Record<string, number> = (selectedBottlesBySeat?.[seat.id]) || {};
                                const hasBottles = Object.values(seatBottles).some((c) => !!c);
                                const isOnSite = !!(onSiteSeat && onSiteSeat[seat.id]);
                                return (
                                    <div key={seat.id} className="mb-2">
                                        <div className="font-medium text-sm">
                                            {pageContent.tableItem} ({seat.tier}) - {seat.label}
                                        </div>
                                        {isOnSite ? (
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>{pageContent.onSiteBottle}</span>
                                                <span>Inclus</span>
                                            </div>
                                        ) : (
                                            <>
                                                {Object.entries(seatBottles).map(([id, count]) => {
                                                    if (!count) return null;
                                                    const bottleName = BOTTLE_OPTIONS.find(b => b.id === id)?.name || id;
                                                    return (
                                                        <div key={id} className="flex justify-between text-sm text-muted-foreground">
                                                            <span>{count} x {bottleName}</span>
                                                            <span>Inclus</span>
                                                        </div>
                                                    )
                                                })}
                                                {!hasBottles && (
                                                    <div className="flex justify-between text-sm text-muted-foreground">
                                                        <span>{pageContent.onSiteBottle}</span>
                                                        <span>Inclus</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )
                            })}
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
