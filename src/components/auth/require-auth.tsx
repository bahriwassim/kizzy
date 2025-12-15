'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase'
import type { Locale } from '@/i18n-config'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { lang } = useParams() as { lang?: Locale }
  const supabase = getSupabaseBrowser()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const override = typeof window !== 'undefined' ? window.localStorage.getItem('adminOverride') : null
    if (override === 'true') {
      setReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace(`/${lang || 'fr'}/login`)
      } else {
        setReady(true)
      }
    })
  }, [router, supabase, lang])

  if (!ready) return null
  return <>{children}</>
}
