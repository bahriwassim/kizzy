import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

const dataPath = path.join(process.cwd(), 'data', 'soiree.json')

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const lang = url.searchParams.get('lang') || 'fr'
    const raw = await fs.readFile(dataPath, 'utf-8')
    const cfg = JSON.parse(raw)
    const response = {
      hero: {
        title: cfg.hero.title?.[lang] ?? cfg.hero.title?.fr,
        subtitle: cfg.hero.subtitle?.[lang] ?? cfg.hero.subtitle?.fr,
        videoId: cfg.hero.videoId
      },
      media: cfg.media,
      contact: cfg.contact ?? { phone: '', instagram: '' },
      details: {
        title: cfg.details.title?.[lang] ?? cfg.details.title?.fr,
        intro: cfg.details.intro?.[lang] ?? cfg.details.intro?.fr,
        arrival: {
          title: cfg.details.arrival.title?.[lang] ?? cfg.details.arrival.title?.fr,
          desc: cfg.details.arrival.desc?.[lang] ?? cfg.details.arrival.desc?.fr,
          perks: cfg.details.arrival.perks?.[lang] ?? cfg.details.arrival.perks?.fr
        },
        party: {
          title: cfg.details.party.title?.[lang] ?? cfg.details.party.title?.fr,
          desc: cfg.details.party.desc?.[lang] ?? cfg.details.party.desc?.fr
        },
        countdown: cfg.details.countdown?.[lang] ?? cfg.details.countdown?.fr,
        outro: cfg.details.outro?.[lang] ?? cfg.details.outro?.fr,
        subOutro: cfg.details.subOutro?.[lang] ?? cfg.details.subOutro?.fr,
        buttonText: cfg.details.buttonText?.[lang] ?? cfg.details.buttonText?.fr
      }
    }
    return NextResponse.json(response, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read soirée config' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await fs.writeFile(dataPath, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write soirée config' }, { status: 500 })
  }
}
