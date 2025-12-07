import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n-config";

const content = {
    fr: {
        title: "L’Événement VIP de l’Année",
        intro: "Préparez-vous à entrer dans un univers où luxe, ambiance survoltée et expériences inédites se rencontrent.",
        locationInfo: "Situé dans un emplacement stratégique – à proximité immédiate de l’autoroute, près des principales stations de métro et avec un parking sécurisé et spacieux – le lieu a été pensé pour accueillir chaque invité dans les meilleures conditions.",
        arrivalTitle: "L'Accueil de Gala",
        arrivalDesc: "Dès votre arrivée, une équipe dédiée vous accueille dans un espace entièrement privatisé et minutieusement décoré pour l’occasion. L’atmosphère est sophistiquée : jeux de lumière élégants, ambiance lounge et musique chill créent une première impression irrésistible.",
        perks: [
            { text: "Buffet généreux et boissons à volonté" },
            { text: "Photowall, photographe pro et 360° photobooth" },
        ],
        partyTitle: "Le Grand Turn Up",
        partyDesc: "À mesure que la soirée avance, l’ambiance monte en intensité. Les éclairages se transforment, les basses s’intensifient, et la fête prend une toute autre dimension. Danseurs et performers exclusifs montent sur scène pour offrir un véritable show : chorégraphies, animations immersives, jeux visuels… Le rythme ne redescend jamais.",
        countdown: "Le moment fort de la nuit : un compte à rebours spectaculaire accompagné d’effets visuels, de performances live et d’une mise en scène pensée pour vous faire vivre un pic d’émotion inoubliable. La fête continue ensuite jusqu’à 6h du matin, portée par un mix explosif, une ambiance enflammée et une énergie collective unique.",
        outro: "Une soirée prestigieuse, accessible, sécurisée et inoubliable.",
        subOutro: "Une expérience VIP conçue pour ceux qui veulent vivre non pas une soirée… mais LA soirée de l’année.",
        buttonText: "Réservez Votre Expérience VIP",
    },
    en: {
        title: "The VIP Event of the Year",
        intro: "Get ready to enter a world where luxury, a supercharged atmosphere, and unique experiences meet.",
        locationInfo: "Strategically located – immediately next to the highway, near major metro stations, and with spacious, secure parking – the venue is designed to welcome every guest in the best conditions.",
        arrivalTitle: "The Gala Welcome",
        arrivalDesc: "Upon arrival, a dedicated team welcomes you to a fully privatized space, meticulously decorated for the occasion. The atmosphere is sophisticated: elegant lighting, a lounge ambiance, and chill music create an irresistible first impression.",
        perks: [
            { text: "Generous buffet and unlimited drinks" },
            { text: "Photowall, pro photographer, and 360° photobooth" },
        ],
        partyTitle: "The Grand Turn Up",
        partyDesc: "As the evening progresses, the atmosphere intensifies. The lighting transforms, the bass deepens, and the party takes on a whole new dimension. Exclusive dancers and performers take the stage to put on a real show: choreography, immersive entertainment, visual displays... The pace never drops.",
        countdown: "The highlight of the night: a spectacular countdown with visual effects, live performances, and staging designed to give you an unforgettable emotional peak. The party then continues until 6 AM, driven by an explosive mix, a fiery atmosphere, and a unique collective energy.",
        outro: "A prestigious, accessible, secure, and unforgettable evening.",
        subOutro: "A VIP experience designed for those who don't just want a night out... but THE night of the year.",
        buttonText: "Book Your VIP Experience",
    }
};

export function EventDetails({ lang }: { lang: Locale }) {
    const eventImageUrl = "/WhatsApp%20Image%202025-12-02%20at%2022.22.39.jpeg";
    const pageContent = content[lang] || content['fr'];

    return (
        <section className="w-full py-20 text-foreground overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
                        {pageContent.title}
                    </h2>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                        {pageContent.intro}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/80 mt-4 bg-secondary/50 py-2 px-4 rounded-lg inline-block">
                        {pageContent.locationInfo}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    {/* Left Column: Content */}
                    <div className="space-y-12">
                        <div className="relative pl-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                            <h3 className="text-3xl font-headline font-bold text-foreground mb-4">
                                {pageContent.arrivalTitle}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {pageContent.arrivalDesc}
                            </p>
                            <ul className="mt-6 space-y-4">
                                {pageContent.perks.map((perk, index) => (
                                    <li key={index} className="flex items-center gap-4 bg-card p-3 rounded-lg border border-border/50 shadow-sm">
                                        <span className="font-medium">{perk.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative pl-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                             <h3 className="text-3xl font-headline font-bold text-foreground mb-4">
                                {pageContent.partyTitle}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {pageContent.partyDesc}
                            </p>
                        </div>

                         <div className="relative pl-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                             <h3 className="text-3xl font-headline font-bold text-foreground mb-4">
                                Countdown & Show
                            </h3>
                            <p className="text-muted-foreground text-lg italic font-medium">
                                {pageContent.countdown}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative h-full min-h-[500px] w-full group perspective-1000">
                        <div className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 ease-out" />
                        <div className="absolute inset-0 bg-black rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 ease-out opacity-20" />
                        <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                            <Image
                                src={eventImageUrl}
                                alt="Event Flyer"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>
                </div>

                {/* Outro & CTA */}
                <div className="text-center space-y-8 max-w-4xl mx-auto bg-accent/5 p-10 rounded-3xl border border-accent/10">
                    <div className="space-y-4">
                        <p className="text-2xl md:text-3xl font-headline font-bold text-foreground">
                            {pageContent.outro}
                        </p>
                        <p className="text-muted-foreground text-xl">
                            {pageContent.subOutro}
                        </p>
                    </div>
                    <Button asChild size="lg" className="w-full sm:w-auto text-lg px-12 py-8 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-xl shadow-accent/20 rounded-full">
                        <Link href={`/${lang}/event`}>
                            {pageContent.buttonText}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
