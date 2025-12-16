'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function CookieConsent({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cookieConsent')
      setVisible(!stored)
    } catch {}
  }, [])

  const accept = () => {
    try {
      localStorage.setItem('cookieConsent', 'true')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  const text = lang === 'en'
    ? {
        title: 'Cookies and legal terms',
        desc: 'We use cookies to improve your experience. By accepting, you agree to our terms.',
        accept: 'Accept',
        legal: 'Terms of Sale & Use',
      }
    : {
        title: 'Cookies et mentions légales',
        desc: "Nous utilisons des cookies pour améliorer votre expérience. En acceptant, vous acceptez nos conditions.",
        accept: 'Accepter',
        legal: 'CGV / CGU',
      }

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50')}> 
      <div className="mx-auto max-w-5xl m-4 rounded-xl border border-white/15 bg-background/90 backdrop-blur p-4 md:p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-headline text-sm md:text-base">{text.title}</p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {text.desc} <Link href={`/${lang}/legal`} className="underline">{text.legal}</Link>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-accent text-accent-foreground" onClick={accept}>{text.accept}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
