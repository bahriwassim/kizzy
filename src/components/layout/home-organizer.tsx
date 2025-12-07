import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export function HomeOrganizer({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  const adminImage = PlaceHolderImages.find(p => p.id === 'venue-interior')

  const t = {
    fr: {
      heading: 'Vous organisez un événement ? Trouvez votre public',
      cta: 'Accéder au tableau de bord',
    },
    en: {
      heading: 'Organizing an event? Find your audience',
      cta: 'Go to dashboard',
    },
  }[lang]

  return (
    <section className="container px-4 md:px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.heading}
          </h2>
          <p className="text-muted-foreground mb-6">
            Gérez vos événements, vos ventes et vos campagnes depuis un panneau moderne. Des statistiques en temps réel pour prendre les bonnes décisions.
          </p>
          <Button asChild>
            <Link href="/login">{t.cta}</Link>
          </Button>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden shadow-xl">
          <div className="relative h-72">
            {adminImage && (
              <Image
                src={adminImage.imageUrl}
                alt={adminImage.description}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}