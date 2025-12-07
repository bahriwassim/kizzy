import React from 'react'
import { type Locale } from '@/i18n-config';

const content = {
  fr: 'Les prix augmenteront progressivement à partir du 15 décembre 2025.',
  en: 'Prices will gradually increase starting December 15, 2025.'
};

export function HomePopular({ lang }: { lang: Locale }) {
  const text = content[lang] || content['fr'];
  const artists = Array(6).fill(text);

  return (
    <section className="container mx-auto px-4 md:px-6 pointer-events-none">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/80 backdrop-blur-lg shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-10" />
        <div className="whitespace-nowrap flex items-center py-6">
          <div className="marquee inline-flex animate-[marquee_45s_linear_infinite]">
            {artists.map((name, i) => (
              <span
                key={`a-${i}`}
                className="mx-8 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground/90"
                style={{ fontFamily: 'Monument Extended, var(--font-body)' }}
              >
                {name}
              </span>
            ))}
            {artists.map((name, i) => (
              <span
                key={`b-${i}`}
                className="mx-8 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground/90"
                style={{ fontFamily: 'Monument Extended, var(--font-body)' }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
