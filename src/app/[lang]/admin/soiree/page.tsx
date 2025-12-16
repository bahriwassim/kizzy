'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Locale } from '@/i18n-config'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseBrowser } from '@/lib/supabase'

const perkSchema = z.object({ text: z.string().min(1) })
const schema = z.object({
  heroTitleFr: z.string().min(1),
  heroTitleEn: z.string().min(1),
  heroSubtitleFr: z.string().min(1),
  heroSubtitleEn: z.string().min(1),
  heroVideoId: z.string().min(1),
  flyerImageUrl: z.string().min(1),
  carouselVideoIds: z.string().min(1),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  marqueeTextFr: z.string().min(1),
  marqueeTextEn: z.string().min(1),
  marqueeSpeedSeconds: z.coerce.number().int().min(5).max(120),
  marqueeEnabled: z.boolean().default(true),
  detailsTitleFr: z.string().min(1),
  detailsTitleEn: z.string().min(1),
  introFr: z.string().min(1),
  introEn: z.string().min(1),
  arrivalTitleFr: z.string().min(1),
  arrivalTitleEn: z.string().min(1),
  arrivalDescFr: z.string().min(1),
  arrivalDescEn: z.string().min(1),
  perksFr: z.array(perkSchema),
  perksEn: z.array(perkSchema),
  partyTitleFr: z.string().min(1),
  partyTitleEn: z.string().min(1),
  partyDescFr: z.string().min(1),
  partyDescEn: z.string().min(1),
  countdownTitleFr: z.string().min(1),
  countdownTitleEn: z.string().min(1),
  countdownFr: z.string().min(1),
  countdownEn: z.string().min(1),
  outroFr: z.string().min(1),
  outroEn: z.string().min(1),
  subOutroFr: z.string().min(1),
  subOutroEn: z.string().min(1),
  buttonTextFr: z.string().min(1),
  buttonTextEn: z.string().min(1)
})

export default function AdminSoireePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { toast } = useToast()
  const [langState, setLangState] = useState<Locale>('fr')
  useEffect(() => { params.then(p => setLangState(p.lang)) }, [params])
  const [flyerFile, setFlyerFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      heroTitleFr: '', heroTitleEn: '',
      heroSubtitleFr: '', heroSubtitleEn: '',
      heroVideoId: '', flyerImageUrl: '',
      carouselVideoIds: '',
      phone: '', instagram: '',
      marqueeTextFr: '',
      marqueeTextEn: '',
      marqueeSpeedSeconds: 45,
      marqueeEnabled: true,
      detailsTitleFr: '', detailsTitleEn: '',
      introFr: '', introEn: '',
      arrivalTitleFr: '', arrivalTitleEn: '',
      arrivalDescFr: '', arrivalDescEn: '',
      perksFr: [{ text: '' }], perksEn: [{ text: '' }],
      partyTitleFr: '', partyTitleEn: '',
      partyDescFr: '', partyDescEn: '',
      countdownTitleFr: '', countdownTitleEn: '',
      countdownFr: '', countdownEn: '',
      outroFr: '', outroEn: '',
      subOutroFr: '', subOutroEn: '',
      buttonTextFr: '', buttonTextEn: ''
    }
  })

  useEffect(() => {
    fetch(`/api/soiree?lang=${langState}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(cfg => {
        form.reset({
          heroTitleFr: cfg.hero.title,
          heroTitleEn: cfg.hero.title,
          heroSubtitleFr: cfg.hero.subtitle,
          heroSubtitleEn: cfg.hero.subtitle,
          heroVideoId: cfg.hero.videoId,
          flyerImageUrl: cfg.media.flyerImageUrl,
          carouselVideoIds: cfg.media.carouselVideoIds.join(','),
          phone: cfg.contact?.phone || '',
          instagram: cfg.contact?.instagram || '',
          marqueeTextFr: cfg.marquee?.text || '',
          marqueeTextEn: cfg.marquee?.text || '',
          marqueeSpeedSeconds: cfg.marquee?.speedSeconds ?? 45,
          marqueeEnabled: cfg.marquee?.enabled ?? true,
          detailsTitleFr: cfg.details.title,
          detailsTitleEn: cfg.details.title,
          introFr: cfg.details.intro,
          introEn: cfg.details.intro,
          arrivalTitleFr: cfg.details.arrival.title,
          arrivalTitleEn: cfg.details.arrival.title,
          arrivalDescFr: cfg.details.arrival.desc,
          arrivalDescEn: cfg.details.arrival.desc,
          perksFr: cfg.details.arrival.perks,
          perksEn: cfg.details.arrival.perks,
          partyTitleFr: cfg.details.party.title,
          partyTitleEn: cfg.details.party.title,
          partyDescFr: cfg.details.party.desc,
          partyDescEn: cfg.details.party.desc,
          countdownTitleFr: cfg.details.countdownTitle || '',
          countdownTitleEn: cfg.details.countdownTitle || '',
          countdownFr: cfg.details.countdown,
          countdownEn: cfg.details.countdown,
          outroFr: cfg.details.outro,
          outroEn: cfg.details.outro,
          subOutroFr: cfg.details.subOutro,
          subOutroEn: cfg.details.subOutro,
          buttonTextFr: cfg.details.buttonText,
          buttonTextEn: cfg.details.buttonText
        })
      })
  }, [langState])

  const onSubmit = (values: z.infer<typeof schema>) => {
    const normalizePublicPath = (p: string) => {
      if (!p) return p
      const s = p.replace(/\\/g, '/')
      if (s.startsWith('/d:/') || s.includes('/public/')) {
        const idx = s.indexOf('/public/')
        if (idx >= 0) {
          const rest = s.slice(idx + '/public/'.length)
          return `/${rest}`
        }
        const base = s.split('/').pop() || s
        return `/${base}`
      }
      return s
    }
    const payload = {
      hero: {
        title: { fr: values.heroTitleFr, en: values.heroTitleEn },
        subtitle: { fr: values.heroSubtitleFr, en: values.heroSubtitleEn },
        videoId: values.heroVideoId
      },
      media: {
        flyerImageUrl: normalizePublicPath(values.flyerImageUrl),
        carouselVideoIds: values.carouselVideoIds.split(',').map(s => s.trim()).filter(Boolean)
      },
      contact: { phone: values.phone || '', instagram: values.instagram || '' },
      marquee: {
        text: { fr: values.marqueeTextFr, en: values.marqueeTextEn },
        speedSeconds: values.marqueeSpeedSeconds,
        enabled: values.marqueeEnabled
      },
      details: {
        title: { fr: values.detailsTitleFr, en: values.detailsTitleEn },
        intro: { fr: values.introFr, en: values.introEn },
        arrival: {
          title: { fr: values.arrivalTitleFr, en: values.arrivalTitleEn },
          desc: { fr: values.arrivalDescFr, en: values.arrivalDescEn },
          perks: { fr: values.perksFr, en: values.perksEn }
        },
        party: {
          title: { fr: values.partyTitleFr, en: values.partyTitleEn },
          desc: { fr: values.partyDescFr, en: values.partyDescEn }
        },
        countdownTitle: { fr: values.countdownTitleFr, en: values.countdownTitleEn },
        countdown: { fr: values.countdownFr, en: values.countdownEn },
        outro: { fr: values.outroFr, en: values.outroEn },
        subOutro: { fr: values.subOutroFr, en: values.subOutroEn },
        buttonText: { fr: values.buttonTextFr, en: values.buttonTextEn }
      }
    }
    import('@/lib/supabase').then(async ({ getSupabaseBrowser }) => {
      const supabase = getSupabaseBrowser()
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token || (typeof window !== 'undefined' && window.localStorage.getItem('adminOverride') === 'true' ? 'OVERRIDE' : undefined)
      const res = await fetch('/api/soiree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        toast({ title: 'Configuration enregistrée', description: 'Les changements ont été sauvegardés.' })
      } else {
        const j = await res.json().catch(() => ({} as any))
        toast({ variant: 'destructive', title: 'Échec de l’enregistrement', description: j?.error || 'Veuillez réessayer.' })
      }
    })
  }

  async function uploadFlyer() {
    if (!flyerFile) return
    setUploading(true)
    try {
      const { getSupabaseBrowser } = await import('@/lib/supabase')
      const supabase = getSupabaseBrowser()
      try {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token || (typeof window !== 'undefined' && window.localStorage.getItem('adminOverride') === 'true' ? 'OVERRIDE' : undefined)
        if (token) {
          await fetch('/api/storage/setup', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
        }
      } catch {}
      const path = `flyers/${Date.now()}-${flyerFile.name}`
      const { error } = await supabase.storage.from('media').upload(path, flyerFile, { upsert: false })
      if (error) throw error
      const { data: pub } = supabase.storage.from('media').getPublicUrl(path)
      form.setValue('flyerImageUrl', pub.publicUrl || '')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-headline text-3xl font-bold">Configurer la Soirée</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Héros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="heroTitleFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre (FR)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="heroTitleEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre (EN)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="heroSubtitleFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sous-titre (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="heroSubtitleEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sous-titre (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="heroVideoId" render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Video ID</FormLabel>
                  <FormControl><Input placeholder="cn9b98DHOBk" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Médias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="flyerImageUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du flyer</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                  <div className="mt-2 flex items-center gap-2">
                    <Input type="file" accept="image/*" onChange={(e) => setFlyerFile(e.target.files?.[0] || null)} />
                    <Button type="button" onClick={uploadFlyer} disabled={uploading || !flyerFile}>
                      {uploading ? 'Upload...' : 'Uploader'}
                    </Button>
                  </div>
                </FormItem>
              )} />
          <FormField control={form.control} name="carouselVideoIds" render={({ field }) => (
            <FormItem>
              <FormLabel>IDs vidéos carrousel (séparés par des virgules)</FormLabel>
              <FormControl><Input placeholder="cn9b98DHOBk,vwHpVAov4A4" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="instagram" render={({ field }) => (
              <FormItem>
                <FormLabel>Lien Instagram</FormLabel>
                <FormControl><Input placeholder="https://www.instagram.com/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl><Input placeholder="+33 6 12 34 56 78" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barre qui tourne (Marquee)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField control={form.control} name="marqueeTextFr" render={({ field }) => (
            <FormItem>
              <FormLabel>Texte (FR)</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="marqueeTextEn" render={({ field }) => (
            <FormItem>
              <FormLabel>Texte (EN)</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="marqueeSpeedSeconds" render={({ field }) => (
              <FormItem>
                <FormLabel>Vitesse (secondes)</FormLabel>
                <FormControl><Input type="number" min={5} max={120} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="marqueeEnabled" render={({ field }) => (
              <FormItem>
                <FormLabel>Activé</FormLabel>
                <FormControl><Input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails de la soirée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="detailsTitleFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre section (FR)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="detailsTitleEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre section (EN)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="introFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Intro (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="introEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Intro (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="arrivalTitleFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre accueil (FR)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="arrivalTitleEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre accueil (EN)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="arrivalDescFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description accueil (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="arrivalDescEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description accueil (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="perksFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Avantages (FR) JSON</FormLabel>
                  <FormControl><Textarea placeholder='[]' value={JSON.stringify(field.value)} onChange={(e) => field.onChange(JSON.parse(e.target.value || '[]'))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="perksEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Perks (EN) JSON</FormLabel>
                  <FormControl><Textarea placeholder='[]' value={JSON.stringify(field.value)} onChange={(e) => field.onChange(JSON.parse(e.target.value || '[]'))} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="partyTitleFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre party (FR)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="partyTitleEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre party (EN)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="partyDescFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description party (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="partyDescEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description party (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="countdownFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Countdown (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="countdownEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Countdown (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="countdownTitleFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre Countdown (FR)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="countdownTitleEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre Countdown (EN)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="outroFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Outro (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="outroEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Outro (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="subOutroFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>SubOutro (FR)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="subOutroEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>SubOutro (EN)</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="buttonTextFr" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bouton (FR)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="buttonTextEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bouton (EN)</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
