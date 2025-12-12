import Image from "next/image";
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
    const pageContent = content[lang] || content['fr'];
    const fileNames = [
        "1.jpeg",
        "2.jpeg",
        "WhatsApp Image 2025-12-11 at 08.51.15.jpeg",
        "WhatsApp Image 2025-12-11 at 08.51.25.jpeg",
        "WhatsApp Image 2025-12-11 at 08.51.45.jpeg",
        "WhatsApp Image 2025-12-11 at 08.52.02.jpeg",
        "WhatsApp Image 2025-12-11 at 08.54.12.jpeg",
        "WhatsApp Image 2025-12-11 at 08.54.25.jpeg",
    ];
    const galleryImages = fileNames.map((name) => ({
        src: `/1/${encodeURIComponent(name)}`,
        alt: name,
    }));

    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">{pageContent.title}</h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light">{pageContent.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {galleryImages.map((image, index) => (
                        <div 
                            key={image.src} 
                            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer aspect-square"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                            
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
