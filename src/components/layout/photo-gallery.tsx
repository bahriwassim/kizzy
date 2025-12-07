import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { type Locale } from "@/i18n-config";

const content = {
    fr: {
        title: "Galerie d'Inspiration",
        description: "Plongez dans l'ambiance de nos événements passés."
    },
    en: {
        title: "Inspiration Gallery",
        description: "Immerse yourself in the atmosphere of our past events."
    }
}

export function PhotoGallery({ lang }: { lang: Locale }) {
    const galleryImages = PlaceHolderImages.filter(p => p.id.startsWith('gallery-'));
    const pageContent = content[lang] || content['fr'];

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">{pageContent.title}</h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">{pageContent.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                    {galleryImages.map((image, index) => (
                        <div 
                            key={image.id} 
                            className={`relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer ${
                                index === 0 ? 'md:col-span-2 md:row-span-2' : 
                                index === 3 ? 'md:col-span-2' : ''
                            }`}
                        >
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                data-ai-hint={image.imageHint}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    View
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
