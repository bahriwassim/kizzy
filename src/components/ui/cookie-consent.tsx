'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function CookieConsent({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  const [visible, setVisible] = useState(true)
  const [detectedLang, setDetectedLang] = useState<'fr' | 'en'>('fr')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('legalBannerDismissed')
      setVisible(!stored)
    } catch {}
    try {
      const seg = (typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '') || ''
      setDetectedLang(seg === 'en' ? 'en' : 'fr')
    } catch {}
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem('legalBannerDismissed', 'true')
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  const effectiveLang = detectedLang
  const text = effectiveLang === 'en'
    ? {
        title: 'Cookies and legal terms',
        desc: 'We use cookies to improve your experience. By accepting, you agree to our terms.',
        legal: 'Terms of Sale & Use',
      }
    : {
        title: 'Cookies et mentions légales',
        desc: "Nous utilisons des cookies pour améliorer votre expérience. En acceptant, vous acceptez nos conditions.",
        legal: 'CGV / CGU',
      }

  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50')}> 
      <div className="mx-auto max-w-5xl m-4 rounded-xl border border-white/15 bg-background/90 backdrop-blur p-4 md:p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-headline text-sm md:text-base">{text.title}</p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {text.desc} <Link href={`/${effectiveLang}/legal`} className="underline">{text.legal}</Link>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={dismiss}>{effectiveLang === 'en' ? 'Close' : 'Fermer'}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
