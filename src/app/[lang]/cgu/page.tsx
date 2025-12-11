import { type Locale } from '@/i18n-config'

const content = {
  fr: {
    title: 'Conditions Générales d’Utilisation',
    desc: 'Ces CGU encadrent l’utilisation du site et de ses services.'
  },
  en: {
    title: 'Terms of Use',
    desc: 'These terms govern the use of the site and its services.'
  }
}

export default async function CGUPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = content[lang] || content.fr
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-4">{t.title}</h1>
      <p className="text-muted-foreground text-lg">{t.desc}</p>
    </div>
  )
}
