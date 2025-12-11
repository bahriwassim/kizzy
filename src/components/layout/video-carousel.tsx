'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export function VideoCarousel({ videoIds }: { videoIds: string[] }) {
  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {videoIds.map((id) => (
            <CarouselItem key={id} className="">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-xl border border-white/10"
                  src={`https://www.youtube.com/embed/${id}?controls=1&rel=0&modestbranding=1&playsinline=1`}
                  title={`video-${id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-background/70" />
        <CarouselNext className="bg-background/70" />
      </Carousel>
    </div>
  )
}

