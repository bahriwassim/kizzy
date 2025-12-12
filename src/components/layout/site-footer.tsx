'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { type Locale } from '@/i18n-config'

type Contact = { phone: string; instagram: string }

export function SiteFooter({ lang }: { lang: Locale }) {
  const [contact, setContact] = useState<Contact>({ phone: '', instagram: '' })
  useEffect(() => {
    fetch(`/api/soiree?lang=${lang}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setContact(d.contact ?? { phone: '', instagram: '' }))
      .catch(() => {})
  }, [lang])

  const t = lang === 'en' ? {
    cgu: 'Terms of Use', cgv: 'Terms of Sale', instagram: 'Instagram', phone: 'Phone'
  } : {
    cgu: 'CGU', cgv: 'CGV', instagram: 'Instagram', phone: 'Téléphone'
  }

  return (
    <footer className={cn('border-t border-white/10 bg-background/80 backdrop-blur')}> 
      <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground flex items-center gap-4">
          <Link href={`/${lang}/cgu`} className="hover:text-foreground/80 underline">{t.cgu}</Link>
          <span>•</span>
          <Link href={`/${lang}/cgv`} className="hover:text-foreground/80 underline">{t.cgv}</Link>
        </div>
        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
          <Link href={"https://www.instagram.com/la_garden_party_paris?igsh=MXc1cGhlYXZ6OWx5Ng=="} className="hover:text-foreground/80 underline" target="_blank" rel="noopener noreferrer">Instagram</Link>
          <span>•</span>
          <a href={`tel:+33664010736`} className="hover:text-foreground/80 underline">HEENCS +33 6 64 01 07 36</a>
          <span>•</span>
          <a href={`tel:+33621604369`} className="hover:text-foreground/80 underline">JOE +33 6 21 60 43 69</a>
          <span>•</span>
          <a href={`tel:+33695132689`} className="hover:text-foreground/80 underline">NICK +33 6 95 13 26 89</a>
          <span>•</span>
          <a href={`tel:+33651247368`} className="hover:text-foreground/80 underline">KIZZY +33 6 51 24 73 68</a>
        </div>
      </div>
    </footer>
  )
}
