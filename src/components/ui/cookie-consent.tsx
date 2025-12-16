'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function CookieConsent({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('legalBannerDismissed')
      setVisible(!stored)
    } catch {}
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem('legalBannerDismissed', 'true')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  const text = lang === 'en'
    ? {
        title: 'Legal',
        cgv: 'Terms of Sale',
        cgu: 'Terms of Use',
      }
    : {
        title: 'Mentions légales',
        cgv: 'CGV',
        cgu: 'CGU',
      }

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50')}> 
      <div className="mx-auto max-w-5xl m-4 rounded-xl border border-white/15 bg-background/90 backdrop-blur p-4 md:p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-headline text-sm md:text-base">{text.title}</p>
            <div className="text-xs md:text-sm text-muted-foreground flex gap-3">
              <Link href={`/${lang}/legal`} className="underline">{text.cgv}</Link>
              <Link href={`/${lang}/legal`} className="underline">{text.cgu}</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={dismiss}>{lang === 'en' ? 'Close' : 'Fermer'}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
