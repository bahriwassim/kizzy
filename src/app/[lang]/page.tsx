import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { EventDetails } from '@/components/layout/event-details';
import { PhotoGallery } from '@/components/layout/photo-gallery';
import { type Locale } from '@/i18n-config';
import { HomePopular } from '@/components/layout/home-popular';
import { ArrowRight, Instagram } from 'lucide-react';
import { HeroVideo } from '@/components/layout/hero-video';

type SoireeConfig = {
  hero: { title: string; subtitle: string; videoId: string }
  media: { flyerImageUrl: string; carouselVideoIds: string[] }
  details: {
    title: string
    intro: string
    arrival: { title: string; desc: string; perks: { text: string }[] }
    party: { title: string; desc: string }
    countdown: string
    outro: string
    subOutro: string
    buttonText: string
  }
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3600').replace(/\/+$/, '')
  const res = await fetch(`${base}/api/soiree?lang=${lang}`, { cache: 'no-store' })
  const cfg: SoireeConfig = await res.json()

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section - Immersive & Modern */}
      <section className="relative h-screen w-full overflow-hidden">
        <HeroVideo videoId={cfg.hero.videoId} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/10" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
          <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <h1 className={
              `font-headline font-black tracking-tighter text-white drop-shadow-2xl ` +
              (lang === 'en' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-5xl sm:text-6xl md:text-7xl')
            }>
              {cfg.hero.title}
            </h1>
            
            <div className="pt-4">
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg font-bold bg-yellow-500 text-black hover:bg-yellow-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <Link href={`/${lang}/event`} className="flex items-center gap-2">
                  {cfg.details.buttonText}
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
        <EventDetails lang={lang} cfg={cfg} />
      </section>

      {/* Photo Gallery Section */}
      <section className="relative z-10 pb-12">
        <PhotoGallery lang={lang} />
      </section>

      {/* Instagram CTA */}
      <section className="relative z-10 pb-8">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 bg-card shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#FDCB58" />
                  <stop offset="50%" stop-color="#F56040" />
                  <stop offset="100%" stop-color="#833AB4" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad)"/>
              <circle cx="12" cy="12" r="4.5" fill="#fff"/>
              <circle cx="17" cy="7" r="1.5" fill="#fff"/>
            </svg>
            <Link
              href={"https://www.instagram.com/la_garden_party_paris"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              {lang === 'fr' ? 'Voir nos évènements et nous suivre sur Instagram' : 'See our events and follow us on Instagram'}
            </Link>
          </div>
        </div>
      </section>

      {/* Extra CTA */}
      <section className="relative z-10 pb-24">
        <div className="container px-4 md:px-6 mx-auto text-center space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold">
            {lang === 'fr' ? 'Réservez votre table maintenant' : 'Book your table now'}
          </h3>
        
          <Button asChild size="lg" className="rounded-full px-8 bg-yellow-500 text-black hover:bg-yellow-600 shadow-lg shadow-yellow-500/30">
            <Link href={`/${lang}/event`}>
              {lang === 'fr' ? 'Réserver' : 'Book Now'}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
