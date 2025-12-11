import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n-config";
import { SectionVideo } from "./section-video";

type SoireeConfig = {
  hero: { title: string; subtitle: string; videoId: string }
  media: { flyerImageUrl: string; carouselVideoIds: string[] }
  details: {
    title: string
    intro: string
    arrival: { title: string; desc: string; perks: { text: string }[] }
    party: { title: string; desc: string }
    countdown: string
    outro: string
    subOutro: string
    buttonText: string
  }
}

export function EventDetails({ lang, cfg }: { lang: Locale, cfg: SoireeConfig }) {
    const eventImageUrl = cfg.media.flyerImageUrl;

    return (
        <section className="w-full py-20 text-foreground overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20 max-w-3xl mx-auto space-y-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
                        {cfg.details.title}
                    </h2>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                        {cfg.details.intro}
                    </p>
                    <SectionVideo lang={lang} videoId={(cfg.media.carouselVideoIds && cfg.media.carouselVideoIds[0]) || cfg.hero.videoId} />
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    {/* Left Column: Content */}
                    <div className="space-y-12">
                        <div className="relative pl-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                            <h3 className="text-3xl font-headline font-bold text-foreground mb-4">
                                {cfg.details.arrival.title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {cfg.details.arrival.desc}
                            </p>
                            <ul className="mt-6 space-y-4">
                                {cfg.details.arrival.perks.map((perk, index) => (
                                    <li key={index} className="flex items-center gap-4 bg-card p-3 rounded-lg border border-border/50 shadow-sm">
                                        <span className="font-medium">{perk.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative pl-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                             <h3 className="text-3xl font-headline font-bold text-foreground mb-4">
                                {cfg.details.party.title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {cfg.details.party.desc}
                            </p>
                        </div>

                         <div className="relative pl-8 border-l-2 border-accent/30 hover:border-accent transition-colors duration-300">
                             <h3 className="text-3xl font-headline font-bold text-foreground mb-4">
                                Countdown & Show
                            </h3>
                            <p className="text-muted-foreground text-lg italic font-medium">
                                {cfg.details.countdown}
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
                            {cfg.details.outro}
                        </p>
                        <p className="text-muted-foreground text-xl">
                            {cfg.details.subOutro}
                        </p>
                    </div>
                    <Button asChild size="lg" className="w-full sm:w-auto text-lg px-12 py-8 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 hover:scale-105 shadow-xl shadow-accent/20 rounded-full">
                        <Link href={`/${lang}/event`}>
                            {cfg.details.buttonText}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
