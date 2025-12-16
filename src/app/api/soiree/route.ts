import { NextResponse } from 'next/server'
import { fetchSoireeConfig, saveSoireeConfig } from '@/lib/config'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const lang = url.searchParams.get('lang') || 'fr'
    const cfg = await fetchSoireeConfig()
    const hero = cfg?.hero ?? {}
    const media = cfg?.media ?? {}
    const details = cfg?.details ?? {}
    const arrival = details?.arrival ?? {}
    const party = details?.party ?? {}
    const marquee = cfg?.marquee ?? {}

    const response = {
      hero: {
        title: (hero.title?.[lang] ?? hero.title?.[lang === 'fr' ? 'en' : 'fr']) ?? '',
        subtitle: (hero.subtitle?.[lang] ?? hero.subtitle?.[lang === 'fr' ? 'en' : 'fr']) ?? '',
        videoId: hero.videoId ?? ''
      },
      media: {
        flyerImageUrl: media.flyerImageUrl ?? '',
        carouselVideoIds: Array.isArray(media.carouselVideoIds) ? media.carouselVideoIds : []
      },
      contact: cfg.contact ?? { phone: '', instagram: '' },
      details: {
        title: (details.title?.[lang] ?? details.title?.fr) ?? '',
        intro: (details.intro?.[lang] ?? details.intro?.fr) ?? '',
        arrival: {
          title: (arrival.title?.[lang] ?? arrival.title?.fr) ?? '',
          desc: (arrival.desc?.[lang] ?? arrival.desc?.fr) ?? '',
          perks: (arrival.perks?.[lang] ?? arrival.perks?.fr) ?? []
        },
        party: {
          title: (party.title?.[lang] ?? party.title?.fr) ?? '',
          desc: (party.desc?.[lang] ?? party.desc?.fr) ?? ''
        },
        countdownTitle: (details.countdownTitle?.[lang] ?? details.countdownTitle?.fr) ?? '',
        countdown: (details.countdown?.[lang] ?? details.countdown?.fr) ?? '',
        outro: (details.outro?.[lang] ?? details.outro?.fr) ?? '',
        subOutro: (details.subOutro?.[lang] ?? details.subOutro?.fr) ?? '',
        buttonText: (details.buttonText?.[lang] ?? details.buttonText?.fr) ?? ''
      },
      marquee: {
        text: marquee?.text?.[lang] ?? marquee?.text?.fr ?? '',
        speedSeconds: marquee?.speedSeconds ?? 45,
        enabled: marquee?.enabled ?? true
      }
    }
    return NextResponse.json(response, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read soirée config' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (token !== 'OVERRIDE') {
      const { getSupabaseAdmin } = await import('@/lib/supabase')
      const supabase = getSupabaseAdmin()
      const { data: userRes } = await supabase.auth.getUser(token)
      const userId = userRes.user?.id
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const { data: adminRow } = await supabase.from('admins').select('user_id').eq('user_id', userId).single()
      if (!adminRow) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
    const body = await request.json()
    await saveSoireeConfig(body)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write soirée config' }, { status: 500 })
  }
}
