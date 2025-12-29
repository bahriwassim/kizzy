'use client'
import React, { useEffect, useState } from 'react'
import { type Locale } from '@/i18n-config';

type MarqueeCfg = { text: string; speedSeconds: number; enabled: boolean }

export function HomePopular({ lang }: { lang: Locale }) {
  const [marquee, setMarquee] = useState<MarqueeCfg>({
    text: lang === 'en'
      ? 'Prices will gradually increase starting December 15, 2025.'
      : 'Les prix augmenteront progressivement à partir du 15 décembre 2025.',
    speedSeconds: 45,
    enabled: true,
  })

  useEffect(() => {
    fetch(`/api/soiree?lang=${lang}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d.marquee) setMarquee(d.marquee as MarqueeCfg)
      })
      .catch(() => {})
  }, [lang])

  if (!marquee.enabled) return null;
  const artists = Array(6).fill(marquee.text);

  return (
    <section className="container mx-auto px-4 md:px-6 pointer-events-none">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/80 backdrop-blur-lg shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-10" />
        <div className="whitespace-nowrap flex items-center py-6">
          <div
            className="marquee inline-flex"
            style={{
              animationName: 'marquee',
              animationDuration: `${marquee.speedSeconds}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            {artists.map((name, i) => (
              <span
                key={`a-${i}`}
                className="mx-8 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#ff0033] drop-shadow-[0_0_8px_#ff0044]"
                style={{ fontFamily: 'Monument Extended, var(--font-body)' }}
              >
                {name}
              </span>
            ))}
            {artists.map((name, i) => (
              <span
                key={`b-${i}`}
                className="mx-8 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#ff0033] drop-shadow-[0_0_8px_#ff0044]"
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
