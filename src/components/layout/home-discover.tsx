import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export function HomeDiscover({ lang = 'fr' }: { lang?: 'fr' | 'en' }) {
  const phoneImage = PlaceHolderImages.find(p => p.id === 'gallery-people-dancing')
  const ticketImage = PlaceHolderImages.find(p => p.id === 'gallery-champagne')

  const t = {
    fr: {
      heading: "Tu cherches un événement ? On a ce qu’il te faut",
      discover: "Découvre les événements",
      refund: "Changement de plan ? Rembourse ton billet",
      explore: "Explorer",
      learn: "En savoir plus",
    },
    en: {
      heading: "Looking for an event? We’ve got you covered",
      discover: "Discover events",
      refund: "Change of plans? Refund your ticket",
      explore: "Explore",
      learn: "Learn more",
    }
  }[lang]

  return (
    <section className="container px-4 md:px-6 py-20">
      <div className="text-center mb-10">
        <h2 className="text-sm tracking-widest text-muted-foreground mb-2">
          {t.heading}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="relative h-56">
            {phoneImage && (
              <Image
                src={phoneImage.imageUrl}
                alt={phoneImage.description}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t.discover}</h3>
            <p className="text-muted-foreground mb-4">
              Parcours les événements populaires, trouve des artistes près de toi et réserve en quelques clics.
            </p>
            <Button variant="outline">{t.explore}</Button>
          </div>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="relative h-56">
            {ticketImage && (
              <Image
                src={ticketImage.imageUrl}
                alt={ticketImage.description}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{t.refund}</h3>
            <p className="text-muted-foreground mb-4">
              Des options flexibles quand tes plans changent. Nos politiques de remboursement sont transparentes.
            </p>
            <Button variant="outline">{t.learn}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}