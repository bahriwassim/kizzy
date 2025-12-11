import { SeatSelection } from './components/seat-selection';
import Image from 'next/image';
import { type Locale } from '@/i18n-config';
import { HomePopular } from '@/components/layout/home-popular';

const content = {
  fr: {
    title: "Sélectionnez Vos Sièges",
    description: "Choisissez vos sièges préférés pour une nuit inoubliable. Les sections ont des prix différents."
  },
  en: {
    title: "Select Your Seats",
    description: "Choose your favorite seats for an unforgettable night. Sections have different prices."
  }
}

export default async function EventPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const pageContent = content[lang] || content['fr'];
  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">{pageContent.title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {pageContent.description}
        </p>
      </div>
      <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden rounded-2xl border border-white/10 shadow-2xl group">
        <Image
          src="/WhatsApp%20Image%202025-12-02%20at%2022.22.39.jpeg"
          alt="Event flier"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">Touch Of Class NYE 2026</h2>
          <p className="text-gray-200 text-sm md:text-base max-w-xl drop-shadow-md">
             {lang === 'en' ? 'Experience the most exclusive New Year\'s Eve party in Paris.' : 'Vivez la soirée du Nouvel An la plus exclusive de Paris.'}
          </p>
        </div>
      </div>

      <div className="mb-12">
        <HomePopular lang={lang} />
      </div>
      
      <SeatSelection lang={lang} />
    </div>
  );
}
