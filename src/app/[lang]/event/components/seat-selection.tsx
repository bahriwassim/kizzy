'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Ticket, X, ChevronLeft, Check, ArrowRight, Martini, Armchair } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { TableIcon } from '@/components/ui/table-icon';
import { type Locale } from '@/i18n-config';

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
    'STANDARD': 'border-pink-500 text-pink-500',
    'PREMIUM': 'border-blue-500 text-blue-500',
    'VIP': 'border-gray-400 text-gray-400',
    'PLATINIUM': 'border-green-500 text-green-500',
    'ULTRA VIP': 'border-yellow-500 text-yellow-500',
    'PRESTIGE': 'border-purple-500 text-purple-500',
};

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const sections: { tier: SeatTier; price: number; capacity: number; labels: string[], unavailable?: string[] }[] = [
    { tier: 'ULTRA VIP', price: 2000, capacity: 5, labels: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'], unavailable: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'] },
    { tier: 'PLATINIUM', price: 1000, capacity: 4, labels: ['6', '7', '8', '9', '10', '11', '12', '13', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '1', '2', '3', '4', '5', '37', '38', '39', '40'] },
    { tier: 'VIP', price: 800, capacity: 4, labels: ['41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73'] },
    { tier: 'PREMIUM', price: 500, capacity: 4, labels: ['74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '102'] },
    { tier: 'STANDARD', price: 300, capacity: 4, labels: ['103', '104', '105', '106', '107', '108', '109'] }
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

const BOTTLE_OPTIONS = [
  { id: 'vodka', name: 'Vodka (Grey Goose)' },
  { id: 'whisky', name: 'Whisky (Jack Daniels)' },
  { id: 'gin', name: 'Gin (Bombay Sapphire)' },
  { id: 'champagne', name: 'Champagne (Moët & Chandon)' },
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
    seatDescription: (capacity: number) => `Table pour ${capacity} personnes. Une bouteille incluse par table.`,
    ariaLabel: (label: string, tier: string, price: number, status: string) => `Table ${label}, ${tier}, ${price} euros, ${status}`,
    packsLegendTitle: 'Légende des packs',
    packsLegendItems: [
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
    seatDescription: (capacity: number) => `Table for ${capacity} people. One bottle included per table.`,
    ariaLabel: (label: string, tier: string, price: number, status: string) => `Table ${label}, ${tier}, ${price} euros, ${status}`,
    packsLegendTitle: 'Packs Legend',
    packsLegendItems: [
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
  
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [simpleEntries, setSimpleEntries] = useState({ men: 0, women: 0 });
  const [selectedBottles, setSelectedBottles] = useState<Record<string, number>>({});
  const [onSiteBottles, setOnSiteBottles] = useState(0);
  const router = useRouter();

  const pageContent = content[lang] || content['fr'];

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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
      
      // Re-validate bottles count
      const newMax = newSelected.length;
      const currentBottles = Object.values(selectedBottles).reduce((a, b) => a + b, 0) + onSiteBottles;
      if (currentBottles > newMax) {
        setSelectedBottles({}); 
        setOnSiteBottles(0);
      }
    } else {
      seat.status = 'selected';
      setSelectedSeats([...selectedSeats, seat]);
    }
    setSeats(newSeats);
  };
  
  const handleSimpleEntryChange = (type: 'men' | 'women', count: number) => {
    const newCount = Math.max(0, count);
    setSimpleEntries(prev => ({...prev, [type]: newCount}));
  }

  const handleBottleChange = (bottleId: string, delta: number) => {
    const current = selectedBottles[bottleId] || 0;
    const totalSpecific = Object.values(selectedBottles).reduce((a, b) => a + b, 0);
    const total = totalSpecific + onSiteBottles;
    const max = selectedSeats.length;

    if (delta > 0 && total >= max) return;
    
    const newCount = Math.max(0, current + delta);
    setSelectedBottles(prev => ({ ...prev, [bottleId]: newCount }));
  };

  const handleOnSiteBottleChange = (delta: number) => {
    const totalSpecific = Object.values(selectedBottles).reduce((a, b) => a + b, 0);
    const total = totalSpecific + onSiteBottles;
    const max = selectedSeats.length;

    if (delta > 0 && total >= max) return;

    setOnSiteBottles(prev => Math.max(0, prev + delta));
  };

  const simpleEntriesPrice = useMemo(() => {
    return (simpleEntries.men * 80) + (simpleEntries.women * 50);
  }, [simpleEntries]);

  const tablesPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }, [selectedSeats]);

  const totalPrice = simpleEntriesPrice + tablesPrice;
  const totalBottles = Object.values(selectedBottles).reduce((a, b) => a + b, 0) + onSiteBottles;
  const maxBottles = selectedSeats.length;

  const handleCheckout = () => {
    const orderType = selectedSeats.length > 0 ? 'table' : 'simple';
    
    const checkoutData = {
      selectedSeats,
      simpleEntries,
      selectedBottles,
      onSiteBottles,
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

    return (
      <Card className="border-accent/20 bg-accent/5 animate-in slide-in-from-right-8 duration-500 overflow-hidden">
        <CardHeader className="bg-accent/10 border-b border-accent/10">
           <CardTitle className="text-xl md:text-2xl text-accent">{pageContent.tableReservation}</CardTitle>
           <CardDescription className="text-accent/80">{pageContent.tableReservationDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-4 bg-[#0a0a0a] relative">
           {/* Scroll Hint Overlay (Mobile) */}
           <div className="md:hidden absolute top-4 right-4 z-20 pointer-events-none animate-pulse">
               <div className="bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-xl">
                   <ArrowRight className="w-3 h-3" /> {pageContent.scrollHint}
               </div>
           </div>

           <div className="w-full overflow-x-auto touch-pan-x pb-24 md:pb-4">
              <div className="min-w-[700px] md:min-w-[800px] relative p-4 md:p-8 flex flex-col items-center gap-6 select-none mx-auto">
                 
                 <div className="relative z-10 w-full max-w-4xl">
                    {/* Top Section */}
                    <div className="flex justify-between items-start gap-4 mb-8">
                        {/* Bar */}
                        <div className="w-10 h-64 bg-zinc-800/80 rounded-r-xl border-y border-r border-white/10 flex items-center justify-center shadow-lg backdrop-blur-sm">
                            <div className="font-headline text-xs tracking-[0.4em] -rotate-90 text-zinc-500 whitespace-nowrap">{pageContent.bar}</div>
                        </div>

                        {/* Premium Grid */}
                        <div className="flex-1 flex justify-center">
                            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-900/10 backdrop-blur-sm">
                                <h3 className={cn("font-headline text-xs text-center mb-3 tracking-widest", tierColors['PREMIUM'])}>PREMIUM</h3>
                                <div className="flex flex-col gap-4">
                                    {/* Row 1 */}
                                    <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
                                        {['101', '100', '102', '99'].map(renderSeat)}
                                        {['96', '97'].map(renderSeat)}
                                        {['95', '94', '93'].map(renderSeat)}
                                        {['90', '88', '87', '91', '92'].map(renderSeat)}
                                    </div>
                                    {/* Row 2 */}
                                    <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
                                        {['89', '86', '84', '83'].map(renderSeat)}
                                        {['85', '81', '82'].map(renderSeat)}
                                        {['80', '79', '78', '77', '76', '75', '74'].map(renderSeat)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: VIP */}
                    <div className="mb-8 p-4 rounded-2xl border border-gray-500/20 bg-gray-900/10 backdrop-blur-sm">
                        <h3 className={cn("font-headline text-sm text-center mb-4 tracking-widest", tierColors['VIP'])}>VIP</h3>
                        <div className="flex justify-center flex-wrap gap-4 md:gap-6">
                            <div className="flex gap-1"> {['41', '42'].map(renderSeat)} <div className="w-4 md:w-6"></div> {['43', '44'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['47', '48'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['46'].map(renderSeat)} <div className="w-4 md:w-6"></div> {['45', '49', '50'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['51', '52'].map(renderSeat)} <div className="w-4 md:w-6"></div> {['53', '54'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['56', '55'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['58', '57'].map(renderSeat)} <div className="w-4 md:w-6"></div> {['60', '61'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['59', '62'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['63', '65'].map(renderSeat)} <div className="w-4 md:w-6"></div> {['64'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['67', '66'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['73', '72'].map(renderSeat)} <div className="w-4 md:w-6"></div> {['71', '70'].map(renderSeat)} </div>
                            <div className="flex gap-1"> {['68', '69'].map(renderSeat)} </div>
                        </div>
                    </div>

                    {/* Bottom Section: High Tiers */}
                    <div className="flex justify-center items-end gap-2 md:gap-6 mb-8 w-full">
                        {/* PLATINUM LEFT */}
                        <div className="flex flex-col items-center p-2 rounded-xl border border-green-500/20 bg-green-900/10">
                            <h3 className={cn("font-headline text-[10px] md:text-xs text-center mb-2 tracking-widest", tierColors['PLATINIUM'])}>PLATINIUM</h3>
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex gap-2"> {['35', '36'].map(renderSeat)} </div>
                                <div className="flex gap-2"> {['34', '33', '26'].map(renderSeat)} </div>
                                <div className="flex gap-2"> {['31', '32'].map(renderSeat)} </div>
                                <div className="flex gap-2"> {['30', '29', '28'].map(renderSeat)} </div>
                            </div>
                        </div>

                        {/* ULTRA VIP CENTER */}
                        <div className="flex flex-col items-center p-2 rounded-xl border border-yellow-500/20 bg-yellow-900/10 flex-grow max-w-lg">
                             <h3 className={cn("font-headline text-[10px] md:text-xs text-center mb-2 tracking-widest", tierColors['ULTRA VIP'])}>ULTRA VIP</h3>
                             <div className="flex flex-col items-center gap-2 w-full">
                                <div className="flex justify-between w-full px-4"> {['25', '14'].map(renderSeat)} </div>
                                <div className="flex justify-center gap-2"> {['24', '20', '19', '15'].map(renderSeat)} </div>
                                <div className="flex justify-center gap-2"> {['23', '22', '21', '18', '17', '16'].map(renderSeat)} </div>
                             </div>
                        </div>

                        {/* PLATINUM RIGHT */}
                        <div className="flex flex-col items-center p-2 rounded-xl border border-green-500/20 bg-green-900/10">
                            <h3 className={cn("font-headline text-[10px] md:text-xs text-center mb-2 tracking-widest", tierColors['PLATINIUM'])}>PLATINIUM</h3>
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex gap-2"> {['13', '6'].map(renderSeat)} </div>
                                <div className="flex gap-2"> {['12', '7'].map(renderSeat)} </div>
                                <div className="flex gap-2"> {['11', '10', '9', '8'].map(renderSeat)} </div>
                            </div>
                        </div>
                    </div>

                    {/* DJ Booth */}
                    <div className="flex justify-center mt-8">
                        <div className="w-1/2 h-16 bg-gradient-to-t from-zinc-800 to-zinc-700 rounded-t-3xl flex items-center justify-center border-t border-white/10 shadow-[0_-10px_30px_-5px_rgba(255,255,255,0.1)]">
                            <span className="text-white/50 font-bold text-lg font-headline">{pageContent.djDesk}</span>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Legend */}
           <div className="p-4 bg-background/50 border-t border-white/5 backdrop-blur-sm">
                <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm border border-white/30 bg-white/10"></div> {pageContent.available}</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent border border-accent shadow-[0_0_8px_rgba(255,215,0,0.5)]"></div> {pageContent.selected}</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-muted border border-muted opacity-50"></div> {pageContent.unavailable}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {pageContent.packsLegendItems.map((item: { tier: SeatTier; text: string }) => (
                      <div key={`legend-${item.tier}`} className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground bg-black/20 px-2 py-1 rounded">
                        <div className={cn("w-2 h-2 rounded-full", tierColors[item.tier])}></div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                </div>
           </div>
        </CardContent>
      </Card>
    );
  };

  const renderStep3 = () => (
    <Card className="border-blue-500/20 bg-blue-500/5 animate-in slide-in-from-right-8 duration-500">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2"><Martini className="w-6 h-6"/> {pageContent.bottleStepTitle}</CardTitle>
        <CardDescription>{pageContent.bottleSelectionDesc(totalBottles, maxBottles)}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BOTTLE_OPTIONS.map(bottle => {
            const count = selectedBottles[bottle.id] || 0;
            return (
                <div key={bottle.id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-background/40 hover:bg-background/60 transition-colors">
                    <span className="font-medium">{bottle.name}</span>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleBottleChange(bottle.id, -1)} disabled={count === 0}>-</Button>
                        <span className="w-8 text-center font-bold text-lg">{count}</span>
                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleBottleChange(bottle.id, 1)} disabled={totalBottles >= maxBottles}>+</Button>
                    </div>
                </div>
            )
          })}
          <div className="flex items-center justify-between p-4 border rounded-xl bg-accent/5 md:col-span-2 border-accent/30">
            <span className="font-medium text-accent">{pageContent.chooseOnSite}</span>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9 border-accent/30 hover:bg-accent/10" onClick={() => handleOnSiteBottleChange(-1)} disabled={onSiteBottles === 0}>-</Button>
                <span className="w-8 text-center font-bold text-lg text-accent">{onSiteBottles}</span>
                <Button variant="outline" size="icon" className="h-9 w-9 border-accent/30 hover:bg-accent/10" onClick={() => handleOnSiteBottleChange(1)} disabled={totalBottles >= maxBottles}>+</Button>
            </div>
          </div>
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
                        {Object.entries(selectedBottles).map(([id, count]) => count > 0 && (
                            <li key={id} className="flex justify-between">
                                <span>{count} x {BOTTLE_OPTIONS.find(b => b.id === id)?.name}</span>
                                <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">INCLUS</span>
                            </li>
                        ))}
                        {onSiteBottles > 0 && (
                            <li className="flex justify-between">
                                <span>{onSiteBottles} x {pageContent.chooseOnSite}</span>
                                <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded">INCLUS</span>
                            </li>
                        )}
                        {totalBottles === 0 && <li className="text-muted-foreground italic">Aucune bouteille sélectionnée</li>}
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
                 <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-4 rounded-xl border border-blue-500/20">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-500/20 p-2 rounded-full">
                            <Ticket className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-blue-400 mb-1">{pageContent.addMoreTables}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{pageContent.addMoreTablesDesc}</p>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                                    onClick={() => {
                                        // Just go back to step 2 (table selection) but keep current type
                                        setCurrentStep(2); 
                                    }}
                                >
                                    {pageContent.addTable}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                                    onClick={() => {
                                        // Switch view to simple entries but keep existing table selection
                                        // We need to modify state to show simple entries
                                        setBookingType('simple'); // This might reset some views, but data is preserved in state
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
      <div className="mb-8 md:mb-12">
        <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -z-10 rounded-full" />
            <div className="absolute top-1/2 left-0 h-0.5 bg-accent -z-10 transition-all duration-500 rounded-full" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
            
            {pageContent.steps.map((step, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                
                return (
                    <div key={stepNum} className="flex flex-col items-center gap-2">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-white/10 z-50 md:static md:bg-transparent md:border-0 md:p-0">
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
                            (currentStep === 3 && bookingType === 'table' && totalBottles < maxBottles)
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
      <div className="h-24 md:hidden" />
    </div>
  );
}
