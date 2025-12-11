import { type Locale } from '@/i18n-config'

const content = {
  fr: {
    title: 'Conditions Générales de Vente',
    desc: 'Ces CGV régissent la vente de billets et services proposés.'
  },
  en: {
    title: 'Terms of Sale',
    desc: 'These terms govern the sale of tickets and provided services.'
  }
}

export default async function CGVPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = content[lang] || content.fr
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.title}</h1>
      <p className="text-muted-foreground text-lg">{t.desc}</p>
    </div>
  )
}
