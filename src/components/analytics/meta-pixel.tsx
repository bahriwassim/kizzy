'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function MetaPixel() {
  const [consent, setConsent] = useState(true)
  const [pixelId, setPixelId] = useState<string>('1231682541699993')
  const [enabled, setEnabled] = useState<boolean>(true)

  useEffect(() => {
    setConsent(true)
  }, [])

  useEffect(() => {
    const loadCfg = async () => {
      try {
        const res = await fetch('/api/soiree?lang=fr', { cache: 'no-store' })
        const j = await res.json()
        if (j?.analytics?.facebookPixelId) {
          setPixelId(j.analytics.facebookPixelId)
        }
        if (typeof j?.analytics?.facebookPixelEnabled === 'boolean') {
          setEnabled(!!j.analytics.facebookPixelEnabled)
        }
      } catch {}
    }
    loadCfg()
  }, [])

  if (!enabled || !pixelId) return null

  const initCode = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
`

  return (
    <>
      <Script id="fb-pixel-init" strategy="afterInteractive">
        {initCode}
      </Script>
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  )
}
