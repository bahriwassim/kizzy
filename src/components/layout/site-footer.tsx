'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { type Locale } from '@/i18n-config'
import { Instagram, ShieldCheck, PartyPopper } from 'lucide-react'

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
              href={"https://www.instagram.com/la_garden_party_paris"}
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
              <a href={`https://wa.me/${(contact.phone || '+33651247368').replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-foreground/80">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.84 14.93L2 22l5.2-1.36A10 10 0 1 0 12 2Zm5.34 14.4c-.27.76-1.6 1.49-2.23 1.58c-.6.1-1.37.1-2.24-.14a9.91 9.91 0 0 1-3.26-1.96a11.47 11.47 0 0 1-3.42-4.37c-.35-.84-.35-1.55-.25-2.11c.1-.5.47-1.2.93-1.44c.25-.12.57-.08.74.12c.2.24.67.83.73 1c.1.2.1.36 0 .57c-.1.2-.2.46-.32.6c-.15.16-.3.35-.13.67c.17.35.76 1.26 1.63 2.05c1.12 1 2.05 1.32 2.4 1.47c.26.1.43.08.58-.05c.18-.17.4-.44.5-.69c.12-.25.26-.3.44-.24c.15.06.98.46 1.15.54c.16.08.28.12.32.18c.1.15.1.83-.17 1.58Z"/></svg>
                {lang === 'en' ? 'Contact on WhatsApp' : 'Contact sur WhatsApp'}
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase">{lang === 'en' ? 'Legal' : 'Légal'}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={`/${lang}/legal`} className="hover:text-foreground/80">{lang === 'en' ? 'Terms of Sale & Use' : 'CGV / CGU'}</Link>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              <span>{lang === 'en' ? 'Secure card payment' : 'Paiement sécurisé CB'}</span>
              <div className="flex items-center gap-2 ml-2">
                <Image src="/visa.jpg" alt="Visa" width={90} height={26} className="rounded" />
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
