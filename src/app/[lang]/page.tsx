import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { EventDetails } from '@/components/layout/event-details';
import { PhotoGallery } from '@/components/layout/photo-gallery';
import { type Locale } from '@/i18n-config';
import { HomePopular } from '@/components/layout/home-popular';
import { ArrowRight } from 'lucide-react';
import { HeroVideo } from '@/components/layout/hero-video';
import { headers } from 'next/headers'

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
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3600'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base = `${proto}://${host}`
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
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]">
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
      <section className="relative z-10 pb-20">
        <PhotoGallery lang={lang} />
      </section>
    </main>
  );
}
