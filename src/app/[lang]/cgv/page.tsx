import { type Locale } from '@/i18n-config'

const content = {
  fr: {
    title: 'Conditions Générales de Vente (CGV)',
    body: "Ces conditions régissent la vente des billets et services associés. Contenu d'exemple à remplacer par vos CGV officielles.",
  },
  en: {
    title: 'General Terms of Sale (CGV)',
    body: 'These terms govern the sale of tickets and associated services. Placeholder content to be replaced with your official terms.',
  },
}

export default function CGVPage({ params }: { params: { lang: Locale } }) {
  const { lang } = params
  const page = content[lang] || content.fr
  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-6 max-w-3xl">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-4">{page.title}</h1>
      <p className="text-muted-foreground leading-relaxed">{page.body}</p>
    </div>
  )
}

