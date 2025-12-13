'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { type Locale } from '@/i18n-config'
import { Instagram, ShieldCheck, Phone, PartyPopper } from 'lucide-react'

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
    cgu: 'Terms of Use', cgv: 'Terms of Sale', instagram: 'Instagram', contact: 'Contact'
  } : {
    cgu: 'CGU', cgv: 'CGV', instagram: 'Instagram', contact: 'Contact'
  }

  return (
    <footer className={cn('border-t border-white/10 bg-background/80 backdrop-blur')}>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <PartyPopper className="h-6 w-6 text-accent" />
              <span className="font-headline font-bold tracking-tight">Touch Of Class NYE 2026</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {lang === 'en'
                ? 'A prestigious, secure and unforgettable New Year’s Eve in Paris.'
                : 'Une soirée de Nouvel An prestigieuse, sécurisée et inoubliable à Paris.'}
            </p>
            <Link
              href={"https://www.instagram.com/la_garden_party_paris?igsh=MXc1cGhlYXZ6OWx5Ng=="}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm rounded-full border px-4 py-2 hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
              {lang === 'en' ? 'Follow us on Instagram' : 'Nous suivre sur Instagram'}
            </Link>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase">{t.contact}</h4>
            <div className="space-y-2">
              <a href={`tel:+33664010736`} className="flex items-center gap-2 text-sm hover:text-foreground/80">
                <Phone className="h-4 w-4 text-muted-foreground" /> HEENCS +33 6 64 01 07 36
              </a>
              <a href={`tel:+33621604369`} className="flex items-center gap-2 text-sm hover:text-foreground/80">
                <Phone className="h-4 w-4 text-muted-foreground" /> JOE +33 6 21 60 43 69
              </a>
              <a href={`tel:+33695132689`} className="flex items-center gap-2 text-sm hover:text-foreground/80">
                <Phone className="h-4 w-4 text-muted-foreground" /> NICK +33 6 95 13 26 89
              </a>
              <a href={`tel:+33651247368`} className="flex items-center gap-2 text-sm hover:text-foreground/80">
                <Phone className="h-4 w-4 text-muted-foreground" /> KIZZY +33 6 51 24 73 68
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase">{lang === 'en' ? 'Legal' : 'Légal'}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={`/${lang}/cgu`} className="hover:text-foreground/80">{t.cgu}</Link>
              <Link href={`/${lang}/cgv`} className="hover:text-foreground/80">{t.cgv}</Link>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              <span>{lang === 'en' ? 'Secure card payment' : 'Paiement sécurisé CB'}</span>
              <div className="flex items-center gap-2 ml-2">
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
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Touch Of Class. {lang === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</span>
          <span className="opacity-70">{lang === 'en' ? 'Paris, France' : 'Paris, France'}</span>
        </div>
      </div>
    </footer>
  )
}
