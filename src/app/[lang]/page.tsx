import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { EventDetails } from '@/components/layout/event-details';
import { PhotoGallery } from '@/components/layout/photo-gallery';
import { type Locale } from '@/i18n-config';
import { HomePopular } from '@/components/layout/home-popular';
import { ArrowRight, Sparkles } from 'lucide-react';

const content = {
  fr: {
    title: "Touch Of Class NYE 2026",
    subtitle: "Rejoignez-nous pour une soirée de gala inoubliable. Dress code : smoking & robes de soirée pour une ambiance vraiment VIP.",
    button: "Réservez votre table ou entrée",
    pricing: "Les prix augmenteront progressivement à partir du 15 décembre 2025."
  },
  en: {
    title: "Touch Of Class NYE 2026",
    subtitle: "Join us for an unforgettable gala evening. Dress code: tuxedo & evening gowns for a truly VIP atmosphere.",
    button: "Book your table or ticket",
    pricing: "Prices will gradually increase starting December 15, 2025."
  }
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const heroImageUrl = '/WhatsApp%20Image%202025-12-02%20at%2022.22.39.jpeg';
  const pageContent = content[lang] || content['fr'];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Immersive & Modern */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <iframe
            className="absolute"
            src="https://www.youtube.com/embed/cn9b98DHOBk?autoplay=1&mute=1&controls=0&loop=1&playlist=cn9b98DHOBk&modestbranding=1&rel=0&playsinline=1"
            title="Garden - Annonce Nouvel An I"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              width: '100vw',
              height: '56.25vw',
              minWidth: '177.78vh',
              minHeight: '100vh',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/10" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000">
             {/* Pricing Badge */}
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white/90">
                {pageContent.pricing}
              </span>
            </div>

            <h1 className="font-headline text-6xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-2xl">
              {pageContent.title}
            </h1>
            
            <p className="max-w-2xl text-lg text-gray-200 md:text-2xl font-light leading-relaxed drop-shadow-lg">
              {pageContent.subtitle}
            </p>
            
            <div className="pt-4">
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <Link href={`/${lang}/event`} className="flex items-center gap-2">
                  {pageContent.button}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            
          </div>
        </div>
      </section>

      {/* Marquee Section - Pricing/Popular */}
      <div className="-mt-20 relative z-10">
         <HomePopular lang={lang} />
      </div>

      {/* Event Details Section */}
      <section className="relative z-10 pt-10">
        <EventDetails lang={lang} />
      </section>

      {/* Photo Gallery Section */}
      <section className="relative z-10 pb-20">
        <PhotoGallery lang={lang} />
      </section>
    </main>
  );
}
