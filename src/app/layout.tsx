import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { cn } from '@/lib/utils';
import { i18n } from '@/i18n-config';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { CookieConsent } from '@/components/ui/cookie-consent';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-headline',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-body',
});


export const metadata: Metadata = {
  title: 'Golden Paris NYE 2026',
  description: "Réservez vos billets pour l'événement le plus exclusif du nouvel an !",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang ?? 'fr'} className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          montserrat.variable,
          playfair.variable
        )}
      >
        <div className="fixed inset-0 -z-10 h-full w-full bg-background">
            {/* Ambient lighting effects */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="absolute top-[40%] left-[50%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-[120px]" />
        </div>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </div>
        <CookieConsent lang={(params.lang as 'fr' | 'en') ?? 'fr'} />
        <Toaster />
      </body>
    </html>
  );
}
