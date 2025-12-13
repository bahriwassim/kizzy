'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Ticket, X, ChevronLeft, Check, ArrowRight, Martini, Armchair } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { TableIcon } from '@/components/ui/table-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Locale } from '@/i18n-config';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';

type SeatStatus = 'available' | 'unavailable' | 'selected';
type SeatTier = 'STANDARD' | 'PREMIUM' | 'VIP' | 'PLATINIUM' | 'ULTRA VIP' | 'PRESTIGE';

interface Seat {
  id: string;
  label: string;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  capacity: number;
}

const tierColors: Record<SeatTier, string> = {
    'STANDARD': 'border-indigo-500 text-indigo-500',
    'PREMIUM': 'border-blue-500 text-blue-500',
    'VIP': 'border-blue-500 text-blue-500',
    'PLATINIUM': 'border-green-500 text-green-500',
    'ULTRA VIP': 'border-yellow-500 text-yellow-500',
    'PRESTIGE': 'border-purple-500 text-purple-500',
};

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const sections: { tier: SeatTier; price: number; capacity: number; labels: string[], unavailable?: string[] }[] = [
    { tier: 'STANDARD', price: 250, capacity: 2, labels: ['103', '104'], unavailable: ['103', '104'] },
    { tier: 'PRESTIGE', price: 350, capacity: 3, labels: ['105', '106'], unavailable: ['105', '106'] },
    { tier: 'ULTRA VIP', price: 2000, capacity: 5, labels: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'], unavailable: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'] },
    { tier: 'PLATINIUM', price: 1000, capacity: 4, labels: ['6', '7', '8', '9', '10', '11', '12', '13', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '1', '2', '3', '4', '5', '37', '38', '39', '40'] },
    { tier: 'VIP', price: 800, capacity: 4, labels: ['41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73'] },
    { tier: 'PREMIUM', price: 500, capacity: 4, labels: ['74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102'] },
  ];

  for (const section of sections) {
    for (const label of section.labels) {
      const id = `${section.tier.replace(/\s+/g, '-')}-${label}`;
      const isUnavailable = section.unavailable?.includes(label);
      seats.push({
        id,
        label,
        tier: section.tier,
        price: section.price,
        status: isUnavailable ? 'unavailable' : 'available',
        capacity: section.capacity,
      });
    }
  }
  return seats;
};

type BottleOption = { id: string; name: string; price: number }
const BOTTLE_OPTIONS: BottleOption[] = [
  { id: 'vodka-70', name: 'Vodka 70 cl (Grey Goose)', price: 250 },
  { id: 'vodka-magnum-15', name: 'Magnum Vodka 1,5 l (Grey Goose)', price: 500 },
  { id: 'whisky-70', name: 'Whiskies 70 cl (Jack Daniels)', price: 250 },
  { id: 'whisky-15', name: 'Whiskies 1,5 l (Jack Daniels)', price: 500 },
  { id: 'rhum-ambre-70', name: 'Rhum Ambré 70 cl (Trois Rivières Ambre)', price: 250 },
  { id: 'champagne-moet-70', name: 'Champagne 70 cl (Moët & Chandon)', price: 250 },
  { id: 'champagne-veuve-70', name: 'Champagne 70 cl (Veuve Clicquot)', price: 250 },
  { id: 'champagne-ruinart-70', name: 'Champagne 70 cl (Ruinart B.B)', price: 350 },
  { id: 'champagne-belaire-70', name: 'Champagne 70 cl (Belaire B.B)', price: 200 },
  { id: 'champagne-asgarnier-70', name: 'Champagne 70 cl (AS Garnier)', price: 150 },
  { id: 'prosecco-70', name: 'Vin Pétillant 70 cl (Prosecco)', price: 100 },
  { id: 'magnum-mocktail', name: 'Magnum sans alcool (Sex On the Beach)', price: 50 },
];

const content = {
  fr: {
    steps: ['Choix', 'Sélection', 'Options', 'Résumé'],
    noSelection: 'Aucune sélection pour le moment.',
    table: 'Table',
    menEntry: 'Entrée Homme',
    womenEntry: 'Entrée Femme',
    totalPrice: 'Prix Total',
    checkout: 'Passer à la caisse',
    simpleEntries: 'Entrées Simples',
    simpleEntriesDescription: 'Accès sans table réservée. Tarifs sur place : 80€ (Femme) / 120€ (Homme).',
    womenEntriesTitle: 'Entrées Femmes - 50€',
    menEntriesTitle: 'Entrées Hommes - 80€',
    tableReservation: 'Réservation de Tables',
    tableReservationDescription: 'Sélectionnez une ou plusieurs tables sur le plan interactif.',
    djDesk: 'DESK DJ & MC',
    chichaBar: 'CHICHA BAR',
    bar: 'BAR',
    chicha: 'CHICHA',
    available: 'Disponible',
    selected: 'Sélectionné',
    unavailable: 'Indisponible',
    yourSelection: 'Votre Sélection',
    checkOrder: 'Vérifiez votre commande avant de payer.',
    viewSelection: 'Voir la sélection',
    seatDescription: (capacity: number) => `Table pour ${capacity} personnes. Bouteilles au choix dans la limite du budget.`,
    ariaLabel: (label: string, tier: string, price: number, status: string) => `Table ${label}, ${tier}, ${price} euros, ${status}`,
    packsLegendTitle: 'Légende des packs',
    packsLegendItems: [
      { tier: 'STANDARD', text: 'STANDARD : 250€ (2 pers)' },
      { tier: 'PRESTIGE', text: 'PRESTIGE : 350€ (3 pers)' },
      { tier: 'PREMIUM', text: 'PREMIUM : 500€' },
      { tier: 'VIP', text: 'VIP : 800€' },
      { tier: 'PLATINIUM', text: 'PLATINIUM : 1 000€' },
      { tier: 'ULTRA VIP', text: 'ULTRA VIP : 2 000€ (5 pers)' },
    ] as Array<{ tier: SeatTier; text: string }>,
    bottleSelection: 'Choix des Bouteilles (Inclus)',
    bottleSelectionDesc: (count: number, max: number) => `Sélectionnez vos bouteilles ou choisissez "Sur place". (${count}/${max})`,
    bottleLimitReached: 'Limite atteinte',
    chooseOnSite: 'Choisir sur place',
    next: 'Suivant',
    back: 'Retour',
    chooseExperience: 'Choisissez votre expérience',
    experienceDesc: 'Sélectionnez le type de réservation souhaité pour la soirée.',
    bookTable: 'Réserver une Table',
    bookEntry: 'Entrées Simples',
    tableDesc: 'VIP, Bouteilles incluses, Service à table',
    entryDesc: 'Accès standard, Bar, Dancefloor',
    summaryTitle: 'Résumé de la commande',
    summaryDesc: 'Vérifiez les détails avant de procéder au paiement sécurisé.',
    bottleStepTitle: 'Vos Bouteilles',
    bottleStepDesc: 'Une bouteille offerte pour chaque table réservée.',
    upgradeToTable: 'Envie de plus de confort ?',
    upgradeToTableDesc: 'Ajoutez une table VIP pour 4 personnes à votre commande.',
    addTable: 'Ajouter une Table',
    addMoreTables: 'Besoin de plus de place ?',
    addMoreTablesDesc: 'Vous pouvez ajouter une autre table ou des entrées simples.',
    addSimpleEntries: 'Ajouter des Entrées',
    scrollHint: 'Glissez pour voir le plan',
    scrollHintDesc: 'Faites défiler horizontalement pour voir toutes les tables.',
  },
  en: {
    steps: ['Choice', 'Selection', 'Options', 'Summary'],
    noSelection: 'No selection yet.',
    table: 'Table',
    menEntry: "Men's Entry",
    womenEntry: "Women's Entry",
    totalPrice: 'Total Price',
    checkout: 'Checkout',
    simpleEntries: 'Simple Entries',
    simpleEntriesDescription: 'Access without reserved table. On-site rates: €80 (Woman) / €120 (Man).',
    womenEntriesTitle: "Women's Entries - €50",
    menEntriesTitle: "Men's Entries - €80",
    tableReservation: 'Table Reservation',
    tableReservationDescription: 'Select one or more tables on the interactive map.',
    djDesk: 'DJ & MC DESK',
    chichaBar: 'CHICHA BAR',
    bar: 'BAR',
    chicha: 'CHICHA',
    available: 'Available',
    selected: 'Selected',
    unavailable: 'Unavailable',
    yourSelection: 'Your Selection',
    checkOrder: 'Check your order before paying.',
    viewSelection: 'View selection',
    seatDescription: (capacity: number) => `Table for ${capacity} people. Bottles of your choice within budget. `,
    ariaLabel: (label: string, tier: string, price: number, status: string) => `Table ${label}, ${tier}, ${price} euros, ${status}`,
    packsLegendTitle: 'Packs Legend',
    packsLegendItems: [
      { tier: 'STANDARD', text: 'STANDARD: €250 (2 ppl)' },
      { tier: 'PRESTIGE', text: 'PRESTIGE: €350 (3 ppl)' },
      { tier: 'PREMIUM', text: 'PREMIUM: €500' },
      { tier: 'VIP', text: 'VIP: €800' },
      { tier: 'PLATINIUM', text: 'PLATINIUM: €1,000' },
      { tier: 'ULTRA VIP', text: 'ULTRA VIP: €2,000 (5 ppl)' },
    ] as Array<{ tier: SeatTier; text: string }>,
    bottleSelection: 'Bottle Selection (Included)',
    bottleSelectionDesc: (count: number, max: number) => `Select your bottles or choose "On site". (${count}/${max})`,
    bottleLimitReached: 'Limit reached',
    chooseOnSite: 'Choose on site',
    next: 'Next',
    back: 'Back',
    chooseExperience: 'Choose your experience',
    experienceDesc: 'Select the type of reservation you want for the night.',
    bookTable: 'Book a Table',
    bookEntry: 'Simple Entries',
    tableDesc: 'VIP, Bottles included, Table service',
    entryDesc: 'Standard access, Bar, Dancefloor',
    summaryTitle: 'Order Summary',
    summaryDesc: 'Review details before secure payment.',
    bottleStepTitle: 'Your Bottles',
    bottleStepDesc: 'One bottle included for each reserved table.',
    upgradeToTable: 'Want more comfort?',
    upgradeToTableDesc: 'Add a VIP table for 4 people to your order.',
    addTable: 'Add a Table',
    addMoreTables: 'Need more space?',
    addMoreTablesDesc: 'You can add another table or simple entries.',
    addSimpleEntries: 'Add Simple Entries',
    scrollHint: 'Swipe to see the plan',
    scrollHintDesc: 'Scroll horizontally to view all tables.',
  }
}

export function SeatSelection({ lang }: { lang: Locale }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingType, setBookingType] = useState<'table' | 'simple' | null>(null);
  const stepsRef = useRef<HTMLDivElement | null>(null);
  
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [simpleEntries, setSimpleEntries] = useState({ men: 0, women: 0 });
  const [selectedBottlesBySeat, setSelectedBottlesBySeat] = useState<Record<string, Record<string, number>>>({});
  const [onSiteSeat, setOnSiteSeat] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const pageContent = content[lang] || content['fr'];

  useEffect(() => {
    try {
      if (stepsRef.current) {
        stepsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {}
  }, [currentStep])
  useEffect(() => {
    // Reset per-seat bottles when seats change (preserve where possible)
    setSelectedBottlesBySeat(prev => {
      const next: Record<string, Record<string, number>> = {}
      selectedSeats.forEach(seat => { next[seat.id] = prev[seat.id] || {} })
      return next
    })
    setOnSiteSeat(prev => {
      const next: Record<string, boolean> = {}
      selectedSeats.forEach(seat => { next[seat.id] = prev[seat.id] || false })
      return next
    })
  }, [selectedSeats])

  const handleSeatClick = (seatId: string) => {
    const newSeats = [...seats];
    const seatIndex = newSeats.findIndex((s) => s.id === seatId);
    if (seatIndex === -1) return;
    const seat = newSeats[seatIndex];

    if (seat.status === 'unavailable') return;

    if (seat.status === 'selected') {
      seat.status = 'available';
      const newSelected = selectedSeats.filter((s) => s.id !== seatId);
      setSelectedSeats(newSelected);
      
      // Clear per-seat selections for the deselected seat
      setSelectedBottlesBySeat(prev => {
        const next = { ...prev } as Record<string, Record<string, number>>
        delete next[seatId]
        return next
      })
      setOnSiteSeat(prev => {
        const next = { ...prev } as Record<string, boolean>
        delete next[seatId]
        return next
      })
    } else {
      seat.status = 'selected';
      setSelectedSeats([...selectedSeats, seat]);
    }
    setSeats(newSeats);
  };

  const handleTierChange = (tier: SeatTier, delta: number) => {
    if (delta > 0) {
      const seatToSelect = seats.find(s => s.tier === tier && s.status === 'available');
      if (seatToSelect) {
        handleSeatClick(seatToSelect.id);
      }
    } else {
      const seatToDeselect = [...selectedSeats].reverse().find(s => s.tier === tier);
      if (seatToDeselect) {
        handleSeatClick(seatToDeselect.id);
      }
    }
  };
  
  const handleSimpleEntryChange = (type: 'men' | 'women', count: number) => {
    const newCount = Math.max(0, count);
    setSimpleEntries(prev => ({...prev, [type]: newCount}));
  }

  const getSeatBottleSum = (seatId: string) => {
    const map = selectedBottlesBySeat[seatId] || {}
    return Object.entries(map).reduce((sum, [bId, qty]) => {
      const opt = BOTTLE_OPTIONS.find(b => b.id === bId)
      return sum + (opt ? opt.price * qty : 0)
    }, 0)
  }

  const handleSeatBottleChange = (seatId: string, bottleId: string, delta: number, seatPrice: number) => {
    if (onSiteSeat[seatId]) return
    const current = selectedBottlesBySeat[seatId]?.[bottleId] || 0
    const opt = BOTTLE_OPTIONS.find(b => b.id === bottleId)
    if (!opt) return
    const currentSum = getSeatBottleSum(seatId)
    const nextSum = currentSum + (delta > 0 ? opt.price : -opt.price)
    if (delta > 0 && nextSum > seatPrice) return
    const nextCount = Math.max(0, current + delta)
    setSelectedBottlesBySeat(prev => ({
      ...prev,
      [seatId]: { ...(prev[seatId] || {}), [bottleId]: nextCount }
    }))
  }

  const toggleOnSiteForSeat = (seatId: string) => {
    setOnSiteSeat(prev => ({ ...prev, [seatId]: !prev[seatId] }))
    if (!onSiteSeat[seatId]) {
      // When switching to on-site, clear selections
      setSelectedBottlesBySeat(prev => ({ ...prev, [seatId]: {} }))
    }
  }

  const simpleEntriesPrice = useMemo(() => {
    return (simpleEntries.men * 80) + (simpleEntries.women * 50);
  }, [simpleEntries]);

  const tablesPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }, [selectedSeats]);

  const totalPrice = simpleEntriesPrice + tablesPrice;
  const allTablesSatisfied = useMemo(() => selectedSeats.every(seat => onSiteSeat[seat.id] || getSeatBottleSum(seat.id) === seat.price), [selectedSeats, onSiteSeat, selectedBottlesBySeat])

  const handleCheckout = () => {
    const orderType = selectedSeats.length > 0 ? 'table' : 'simple';
    
    const checkoutData = {
      selectedSeats,
      simpleEntries,
      selectedBottlesBySeat,
      onSiteSeat,
      totalPrice
    };
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    router.push(`/${lang}/checkout?orderType=${orderType}`);
  }

  const nextStep = () => {
    if (currentStep === 1 && bookingType === 'simple') {
      setCurrentStep(2); // Go to simple selection
    } else if (currentStep === 1 && bookingType === 'table') {
      setCurrentStep(2); // Go to table selection
    } else if (currentStep === 2 && bookingType === 'simple') {
      setCurrentStep(4); // Skip bottle selection for simple entries
    } else if (currentStep === 2 && bookingType === 'table') {
      setCurrentStep(3); // Go to bottles
    } else if (currentStep === 3) {
      setCurrentStep(4); // Go to summary
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && bookingType === 'simple') {
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  const renderSeat = (label: string) => {
    const seat = seats.find(s => s.label === label);
    if (!seat) return <div className="w-6 h-6 md:w-8 md:h-8" />;

    return (
        <button
        key={seat.id}
        onClick={() => handleSeatClick(seat.id)}
        className={cn(
            'w-6 h-6 md:w-8 md:h-8 rounded-sm border flex items-center justify-center transition-all duration-200 transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-[9px] md:text-xs shadow-sm',
            tierColors[seat.tier],
            seat.status === 'available' && 'bg-background/20 backdrop-blur-sm hover:bg-accent/20',
            seat.status === 'unavailable' && 'bg-muted border-muted cursor-not-allowed text-muted-foreground line-through opacity-50',
            seat.status === 'selected' && 'bg-accent border-accent text-accent-foreground shadow-[0_0_10px_rgba(255,215,0,0.5)] scale-110 z-10'
        )}
        disabled={seat.status === 'unavailable'}
        aria-label={pageContent.ariaLabel(seat.label, seat.tier, seat.price, seat.status)}
        >
        <TableIcon className={cn("w-3 h-3 md:w-4 md:h-4", tierColors[seat.tier])} aria-hidden="true" />
        <span className="sr-only">{seat.label}</span>
        </button>
    );
  };

  // Step Content Renderers
  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
      <button 
        onClick={() => { setBookingType('table'); setCurrentStep(2); }}
        className="group relative h-64 md:h-80 w-full overflow-hidden rounded-3xl border-2 border-accent/20 bg-gradient-to-br from-background/80 to-accent/5 p-6 text-left transition-all hover:border-accent hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] active:scale-98"
      >
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-accent/10 blur-3xl transition-all group-hover:bg-accent/20" />
        <Armchair className="mb-6 h-12 w-12 text-accent" />
        <h3 className="mb-2 text-2xl font-bold font-headline text-foreground">{pageContent.bookTable}</h3>
        <p className="text-muted-foreground">{pageContent.tableDesc}</p>
        <div className="absolute bottom-6 right-6 rounded-full bg-accent p-3 text-accent-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
          <ArrowRight className="h-6 w-6" />
        </div>
      </button>

      <button 
        onClick={() => { setBookingType('simple'); setCurrentStep(2); }}
        className="group relative h-64 md:h-80 w-full overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-background/80 to-white/5 p-6 text-left transition-all hover:border-white/30 hover:shadow-2xl active:scale-98"
      >
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-purple-500/10 blur-3xl transition-all group-hover:bg-purple-500/20" />
        <Ticket className="mb-6 h-12 w-12 text-purple-400" />
        <h3 className="mb-2 text-2xl font-bold font-headline text-foreground">{pageContent.bookEntry}</h3>
        <p className="text-muted-foreground">{pageContent.entryDesc}</p>
        <div className="absolute bottom-6 right-6 rounded-full bg-white/20 p-3 text-white opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
          <ArrowRight className="h-6 w-6" />
        </div>
      </button>
    </div>
  );

  const renderStep2 = () => {
    if (bookingType === 'simple') {
      return (
        <Card className="border-purple-500/20 bg-purple-500/5 animate-in slide-in-from-right-8 duration-500">
          <CardHeader>
            <CardTitle>{pageContent.simpleEntries}</CardTitle>
            <CardDescription>{pageContent.simpleEntriesDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-background/40 border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Ticket className="text-pink-400 w-5 h-5"/> {pageContent.womenEntriesTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6 justify-center pb-8">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-pink-500/30 hover:bg-pink-500/10" onClick={() => handleSimpleEntryChange('women', simpleEntries.women - 1)}>-</Button>
                <span className="text-4xl font-bold w-16 text-center tabular-nums text-pink-500">{simpleEntries.women}</span>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-pink-500/30 hover:bg-pink-500/10" onClick={() => handleSimpleEntryChange('women', simpleEntries.women + 1)}>+</Button>
              </CardContent>
            </Card>
            <Card className="bg-background/40 border-white/5 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Ticket className="text-blue-400 w-5 h-5"/> {pageContent.menEntriesTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6 justify-center pb-8">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-blue-500/30 hover:bg-blue-500/10" onClick={() => handleSimpleEntryChange('men', simpleEntries.men - 1)}>-</Button>
                <span className="text-4xl font-bold w-16 text-center tabular-nums text-blue-500">{simpleEntries.men}</span>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-blue-500/30 hover:bg-blue-500/10" onClick={() => handleSimpleEntryChange('men', simpleEntries.men + 1)}>+</Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      );
    }

    const tiers: SeatTier[] = ['STANDARD', 'PRESTIGE', 'PREMIUM', 'VIP', 'PLATINIUM', 'ULTRA VIP'];

    return (
      <Card className="border-accent/20 bg-accent/5 animate-in slide-in-from-right-8 duration-500 overflow-hidden">
        <CardHeader className="bg-accent/10 border-b border-accent/10">
           <CardTitle className="text-xl md:text-2xl text-accent">{pageContent.tableReservation}</CardTitle>
           <CardDescription className="text-accent/80">{pageContent.tableReservationDescription}</CardDescription>
           <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
             <span className="inline-flex items-center gap-2">
               <Check className="h-4 w-4 text-green-400" />
               {lang === 'en' ? 'Secure card payment' : 'Paiement sécurisé CB'}
             </span>
             <span className="inline-flex items-center gap-1 ml-2">
               <svg viewBox="0 0 24 24" className="h-4 w-7" aria-hidden="true">
                 <rect width="24" height="24" rx="4" fill="#1A1F71" />
                 <path d="M5 15h2.2l1.1-6H6.1L5 15zM9.3 15h2l1.2-6h-2l-1.2 6zM14.5 15h1.9l2.6-6h-1.9l-2.6 6z" fill="#fff"/>
               </svg>
               <svg viewBox="0 0 24 24" className="h-4 w-7" aria-hidden="true">
                 <rect width="24" height="24" rx="4" fill="#261B1B" />
                 <circle cx="10" cy="12" r="5" fill="#EB001B" />
                 <circle cx="14" cy="12" r="5" fill="#F79E1B" opacity="0.85" />
               </svg>
               <svg viewBox="0 0 24 24" className="h-4 w-7" aria-hidden="true">
                 <rect width="24" height="24" rx="4" fill="#003087" />
                 <path d="M7 7h8c2 0 3 1.2 2.6 3l-1 5c-.3 1.2-1.4 2-2.6 2H9.5l-.7 2H6.5l1.2-10c.1-1 .9-2 2.3-2z" fill="#fff"/>
                 <path d="M9 9h7c1.5 0 2.3.8 2 2l-.8 4c-.2.8-.9 1.3-1.8 1.3h-5.6l-.8 2H7.2l1.1-8c.1-.7.7-1.3 1.7-1.3z" fill="#009CDE" opacity="0.9"/>
               </svg>
             </span>
           </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 bg-[#0a0a0a]">
           {/* Plan Image */}
           <div className="relative w-full aspect-[4/3] md:aspect-[16/9] mb-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <Image 
                src="/floor.png" 
                alt="Floor Plan" 
                fill 
                className="object-contain"
              />
           </div>

          {/* Tier Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {tiers.map(tier => {
                 const sampleSeat = seats.find(s => s.tier === tier);
                 if (!sampleSeat) return null;

                 const availableCount = seats.filter(s => s.tier === tier && s.status === 'available').length;
                 const selectedCount = selectedSeats.filter(s => s.tier === tier).length;
                 
                 return (
                    <div key={tier} className={cn(
                        "p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between",
                        selectedCount > 0 ? "bg-accent/10 border-accent shadow-[0_0_15px_rgba(255,215,0,0.1)]" : "bg-white/5 border-white/10 hover:border-white/20"
                    )}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className={cn("font-headline text-lg tracking-wider", tierColors[tier])}>{tier}</h3>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-xl">{sampleSeat.price}€</div>
                                {availableCount === 0 && (
                                  <div className="text-xs mt-1 text-red-500 font-semibold">Complet</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-white">
                                {pageContent.seatDescription(sampleSeat.capacity)}
                            </span>
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10"
                                    onClick={() => handleTierChange(tier, -1)}
                                    disabled={selectedCount === 0}
                                >
                                    -
                                </Button>
                                <span className="font-bold w-6 text-center text-lg">{selectedCount}</span>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full border-white/20 hover:bg-white/10"
                                    onClick={() => handleTierChange(tier, 1)}
                                    disabled={availableCount === 0}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                 )
             })}
          </div>

           
        </CardContent>
      </Card>
    );
  };

  const renderStep3 = () => (
    <Card className="border-blue-500/20 bg-blue-500/5 animate-in slide-in-from-right-8 duration-500">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2"><Martini className="w-6 h-6"/> {pageContent.bottleStepTitle}</CardTitle>
        <CardDescription>
          {lang === 'en'
            ? 'Compose bottles per table: total must equal table price, or choose on site.'
            : 'Composez les bouteilles par table : le total doit être égal au prix de table, ou choisissez sur place.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedSeats.length === 0 && (
          <div className="text-sm text-muted-foreground">{lang === 'en' ? 'No table selected.' : 'Aucune table sélectionnée.'}</div>
        )}
        {selectedSeats.map(seat => {
          const sum = getSeatBottleSum(seat.id)
          const satisfied = onSiteSeat[seat.id] || sum === seat.price
          return (
            <div key={seat.id} className="p-4 border border-white/10 rounded-xl bg-background/40">
              <div className="flex items-center justify-between mb-3">
                <div className="font-headline font-bold">Table {seat.label} ({seat.tier}) — {seat.price}€</div>
                <div className={cn('text-sm', satisfied ? 'text-green-400' : 'text-accent')}>{sum}€ / {seat.price}€</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BOTTLE_OPTIONS.map(bottle => {
                  const count = (selectedBottlesBySeat[seat.id]?.[bottle.id] || 0)
                  return (
                    <div key={bottle.id} className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-background/40">
                      <span className="text-sm font-medium">{bottle.name} — {bottle.price}€</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleSeatBottleChange(seat.id, bottle.id, -1, seat.price)} disabled={onSiteSeat[seat.id] || count === 0}>-</Button>
                        <span className="w-6 text-center font-bold">{count}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleSeatBottleChange(seat.id, bottle.id, 1, seat.price)} disabled={onSiteSeat[seat.id] || (sum + bottle.price > seat.price)}>+</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Checkbox id={`onsite-${seat.id}`} checked={onSiteSeat[seat.id] || false} onCheckedChange={() => toggleOnSiteForSeat(seat.id)} />
                  <label htmlFor={`onsite-${seat.id}`} className="text-sm font-medium cursor-pointer">{pageContent.chooseOnSite}</label>
                </div>
                <div className={cn('text-xs px-2 py-1 rounded', satisfied ? 'bg-green-500/10 text-green-400' : 'bg-accent/10 text-accent')}>{satisfied ? (lang === 'en' ? 'OK' : 'OK') : (lang === 'en' ? 'Adjust to match' : 'Ajustez pour égaler')}</div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="border-green-500/20 bg-green-500/5 animate-in slide-in-from-right-8 duration-500">
      <CardHeader>
        <CardTitle className="text-green-400">{pageContent.summaryTitle}</CardTitle>
        <CardDescription>{pageContent.summaryDesc}</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="space-y-6">
            {/* Tables Summary */}
            {selectedSeats.length > 0 && (
                <div className="bg-background/40 rounded-xl p-4 border border-white/5">
                    <h4 className="font-bold mb-3 flex items-center gap-2"><TableIcon className="w-4 h-4 text-accent"/> {pageContent.tableReservation}</h4>
                    <ul className="space-y-2">
                        {selectedSeats.map(seat => (
                            <li key={seat.id} className="flex justify-between text-sm">
                                <span>Table {seat.label} ({seat.tier})</span>
                                <span className="font-mono">{seat.price}€</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Entries Summary */}
            {(simpleEntries.men > 0 || simpleEntries.women > 0) && (
                <div className="bg-background/40 rounded-xl p-4 border border-white/5">
                    <h4 className="font-bold mb-3 flex items-center gap-2"><Ticket className="w-4 h-4 text-purple-400"/> {pageContent.simpleEntries}</h4>
                    <ul className="space-y-2">
                        {simpleEntries.women > 0 && (
                            <li className="flex justify-between text-sm">
                                <span>{simpleEntries.women} x {pageContent.womenEntry}</span>
                                <span className="font-mono">{simpleEntries.women * 50}€</span>
                            </li>
                        )}
                        {simpleEntries.men > 0 && (
                            <li className="flex justify-between text-sm">
                                <span>{simpleEntries.men} x {pageContent.menEntry}</span>
                                <span className="font-mono">{simpleEntries.men * 80}€</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Bottles Summary */}
            {bookingType === 'table' && (
                <div className="bg-background/40 rounded-xl p-4 border border-white/5">
                    <h4 className="font-bold mb-3 flex items-center gap-2"><Martini className="w-4 h-4 text-blue-400"/> {pageContent.bottleStepTitle}</h4>
                    <ul className="space-y-2 text-sm">
                      {selectedSeats.map(seat => {
                        const map = selectedBottlesBySeat[seat.id] || {}
                        const entries = Object.entries(map).filter(([, qty]) => qty > 0)
                        return (
                          <li key={`sum-${seat.id}`} className="space-y-1">
                            <div className="flex justify-between"><span>Table {seat.label} ({seat.tier})</span><span className="font-mono">{getSeatBottleSum(seat.id)}€ / {seat.price}€</span></div>
                            {onSiteSeat[seat.id] ? (
                              <div className="flex justify-between"><span>{pageContent.chooseOnSite}</span><span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">INCLUS</span></div>
                            ) : entries.length > 0 ? (
                              entries.map(([id, count]) => (
                                <div key={`${seat.id}-${id}`} className="flex justify-between">
                                  <span>{count} x {BOTTLE_OPTIONS.find(b => b.id === id)?.name}</span>
                                  <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">INCLUS</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-muted-foreground italic">{lang === 'en' ? 'No bottles selected' : 'Aucune bouteille sélectionnée'}</div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                </div>
            )}
            
            <Separator className="bg-white/10" />
            
            {/* Upsell / Cross-sell Reminders */}
            {bookingType === 'simple' && (
                <div className="bg-gradient-to-r from-accent/20 to-transparent p-4 rounded-xl border border-accent/20 animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="bg-accent/20 p-2 rounded-full">
                            <Armchair className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-accent mb-1">{pageContent.upgradeToTable}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{pageContent.upgradeToTableDesc}</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                    setBookingType('table');
                                    setCurrentStep(2); // Go to table selection
                                }}
                            >
                                {pageContent.addTable}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {bookingType === 'table' && selectedSeats.length > 0 && (
                 <div className="bg-gradient-to-r from-purple-500/15 to-yellow-500/15 p-4 rounded-xl border border-purple-500/30">
                    <div className="flex items-start gap-4">
                        <div className="bg-purple-500/20 p-2 rounded-full">
                            <Ticket className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent mb-1">{pageContent.addMoreTables}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{pageContent.addMoreTablesDesc}</p>
                            <div className="grid grid-cols-1 gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
                                    onClick={() => {
                                        setCurrentStep(2); 
                                    }}
                                >
                                    {pageContent.addTable}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                                    onClick={() => {
                                        setBookingType('simple');
                                        setCurrentStep(2);
                                    }}
                                >
                                    {pageContent.addSimpleEntries}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center text-xl font-bold pt-2">
                <span>Total</span>
                <span className="text-accent">{totalPrice}€</span>
            </div>
         </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto min-h-screen relative">
      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
        {/* Golden orbs for Table mode */}
        {bookingType !== 'simple' && (
           <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] animate-pulse duration-[4000ms]" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[120px] animate-pulse duration-[7000ms]" />
           </>
        )}
        
        {/* Purple/Blue orbs for Simple mode */}
        {bookingType === 'simple' && (
            <>
             <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse duration-[3000ms]" />
             <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse duration-[5000ms]" />
            </>
        )}
        
        {/* General ambient noise/texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Steps Indicator */}
      <div ref={stepsRef} className="sticky top-16 z-30 mb-8 md:mb-12 bg-background/80 backdrop-blur border-b border-white/10">
        <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -z-10 rounded-full" />
            <div className="absolute top-1/2 left-0 h-0.5 bg-accent -z-10 transition-all duration-500 rounded-full" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
            
            {pageContent.steps.map((step, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                
                return (
                    <div key={stepNum} className="relative flex flex-col items-center gap-2">
                        <div className={cn(
                            "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300 border-2",
                            isActive ? "bg-accent border-accent text-accent-foreground scale-110 shadow-[0_0_15px_rgba(255,215,0,0.5)]" : 
                            isCompleted ? "bg-accent/20 border-accent text-accent" : "bg-background border-muted text-muted-foreground"
                        )}>
                            {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
                        </div>
                        <span className={cn(
                            "text-[10px] md:text-xs font-medium uppercase tracking-wider transition-colors duration-300 absolute -bottom-6 w-20 text-center",
                            isActive ? "text-accent" : "text-muted-foreground"
                        )}>{step}</span>
                    </div>
                )
            })}
        </div>
      </div>

      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-white/10 z-50 md:static md:bg-transparent md:border-0 md:p-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}>
          <div className="flex gap-4 max-w-5xl mx-auto">
            {currentStep > 1 && (
                <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={prevStep}
                    className="flex-1 md:flex-none border-white/10 hover:bg-white/5"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> {pageContent.back}
                </Button>
            )}
            
            {currentStep < 4 ? (
                 currentStep === 1 ? null : (
                    <Button 
                        size="lg" 
                        onClick={nextStep}
                        className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                        disabled={
                            (currentStep === 2 && bookingType === 'table' && selectedSeats.length === 0) ||
                            (currentStep === 2 && bookingType === 'simple' && simpleEntries.men === 0 && simpleEntries.women === 0) ||
                            (currentStep === 3 && bookingType === 'table' && !allTablesSatisfied)
                        }
                    >
                        {pageContent.next} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                 )
            ) : (
                <Button 
                    size="lg" 
                    onClick={handleCheckout}
                    className="flex-1 bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20"
                >
                    {pageContent.checkout} ({totalPrice}€)
                </Button>
            )}
          </div>
      </div>
      
      {/* Spacer for mobile fixed footer */}
      <div className="h-28 md:hidden" />
    </div>
  );
}
