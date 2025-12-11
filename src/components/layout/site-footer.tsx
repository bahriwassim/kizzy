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
        <div className="text-sm text-muted-foreground flex items-center gap-4">
          <Link href={contact.instagram || '#'} className="hover:text-foreground/80 underline" target="_blank" rel="noopener noreferrer">{t.instagram}</Link>
          <span>•</span>
          <a href={contact.phone ? `tel:${contact.phone}` : '#'} className="hover:text-foreground/80 underline">{t.phone}: {contact.phone || '—'}</a>
        </div>
      </div>
    </footer>
  )
}
