'use client'

import { type Locale } from '@/i18n-config'

const fr = {
  title: "CONDITIONS GÉNÉRALES DE VENTE & D’UTILISATION (CGV / CGU)",
  sections: [
    {
      heading: "1. Identification de l’organisateur",
      content: [
        "L’événement est organisé par :",
        "Dénomination sociale : KIZZY SERVICES",
        "SIRET : 932 867 138 00012",
        "Adresse du siège social : 3 rue Félix Chopin, 94230 Cachan",
        "Représentant légal : Cédrick Dja Djedje",
        "Email de contact : contact@startindev.com",
      ],
    },
    {
      heading: "2. Objet",
      content: [
        "Les présentes Conditions Générales de Vente et d’Utilisation (ci-après « CGV/CGU ») régissent la vente en ligne de billets d’entrée et de réservations de tables pour l’événement se déroulant le 31 décembre 2025, ainsi que les conditions d’accès et de participation à celui-ci.",
        "Toute commande effectuée sur le site implique l’acceptation pleine et entière des présentes CGV/CGU.",
      ],
    },
    {
      heading: "3. Conditions d’accès à l’événement",
      content: [
        "L’événement est strictement réservé aux personnes majeures (+18 ans).",
        "Un dress code est obligatoire.",
        "La direction se réserve le droit d’entrée, notamment en cas de non-respect du dress code, de comportement inapproprié ou pour des raisons de sécurité.",
        "En cas de refus d’entrée, aucun remboursement ne pourra être exigé.",
      ],
    },
    {
      heading: "4. Billetterie & tarifs",
      content: [
        "Préventes en ligne",
        "Les billets sont proposés exclusivement en prévente en ligne, dans la limite des places disponibles :",
        "Billet Femme : 50 €",
        "Billet Homme : 80 €",
        "Le billet donne accès à l’événement du 31 décembre 2025 et inclut un cocktail dînatoire de 22h00 à 00h00, sous réserve d’arrivée dans les horaires impartis.",
        "Billetterie sur place",
        "Des billets pourront être proposés sur place, sous réserve de disponibilité, avec une majoration tarifaire, quel que soit l’horaire d’achat :",
        "Billet Femme sur place : 80 €",
        "Billet Homme sur place : 120 €",
      ],
    },
    {
      heading: "5. Réservation de tables & bouteilles",
      content: [
        "Les clients ont la possibilité de réserver une table directement sur le site internet.",
        "La sélection des bouteilles peut être effectuée à l’avance lors de la réservation ou directement sur place, selon disponibilité.",
        "Les bouteilles réservées à l’avance sont modifiables et échangeables le jour de l’événement.",
        "Le cocktail dînatoire est inclus pour les réservations de tables dans les mêmes conditions que les billets simples, sous réserve d’arrivée dans les horaires prévus.",
        "Tables & bouteilles sur place",
        "Le soir de l’événement, il est également possible de :",
        "commander des bouteilles,",
        "obtenir une table sur place,",
        "selon les disponibilités restantes, sans garantie préalable.",
      ],
    },
    {
      heading: "6. Consommations",
      content: [
        "Avant minuit : seules les consommations incluses dans l’offre (cocktail dînatoire et bulles) sont gratuites ; toute autre consommation est payante.",
        "Après minuit : aucune consommation n’est incluse ; toutes les consommations, qu’il s’agisse de verres au bar ou de commandes de bouteilles, sont payantes.",
      ],
    },
    {
      heading: "7. Paiement",
      content: [
        "Le paiement s’effectue exclusivement par carte bancaire, via une solution de paiement sécurisée.",
        "Le paiement est exigible en une seule fois.",
        "Les transactions sont réalisées en euros (€).",
      ],
    },
    {
      heading: "8. Billet nominatif & contrôle",
      content: [
        "Les billets sont nominatifs et valables uniquement pour la personne ayant effectué la réservation.",
        "En cas d’invités rattachés à une réservation, ceux-ci doivent :",
        "soit se présenter avec la personne ayant réservé,",
        "soit disposer de leur pièce d’identité et du QR code associé à la réservation.",
        "L’accès à l’événement est conditionné à la présentation :",
        "du QR code de réservation,",
        "d’une pièce d’identité valide.",
      ],
    },
    {
      heading: "9. Annulation, remboursement & force majeure",
      content: [
        "Les billets et réservations sont non remboursables.",
        "Aucun report n’est possible, l’événement étant lié à une date unique : 31 décembre 2025.",
        "En cas d’annulation pour force majeure (décision administrative, événement exceptionnel indépendant de la volonté de l’organisateur), un remboursement sera effectué.",
      ],
    },
    {
      heading: "10. Sécurité & règlement intérieur",
      content: [
        "Il est strictement interdit d’introduire dans l’établissement tout objet dangereux, substance illicite ou produit prohibé.",
        "Toute personne ne respectant pas ces règles pourra se voir refuser l’accès ou être exclue de l’événement sans remboursement.",
      ],
    },
    {
      heading: "11. Droit à l’image",
      content: [
        "En participant à l’événement, le client autorise expressément l’organisateur à utiliser son image (photos et vidéos) captée durant la soirée à des fins de communication, de promotion et d’archives, sur tout support, sans limitation de durée et sans contrepartie financière.",
      ],
    },
    {
      heading: "12. Données personnelles",
      content: [
        "Les données personnelles collectées sont utilisées uniquement pour la gestion des réservations, le contrôle des accès et la communication liée à l’événement, conformément à la réglementation en vigueur (RGPD).",
      ],
    },
    {
      heading: "13. Responsabilité",
      content: [
        "L’organisateur décline toute responsabilité en cas de perte, vol ou détérioration des effets personnels des participants durant l’événement.",
      ],
    },
    {
      heading: "14. Droit applicable",
      content: [
        "Les présentes CGV/CGU sont soumises au droit français.",
        "Tout litige relève de la compétence exclusive des tribunaux français.",
      ],
    },
  ],
}

const en = {
  title: "GENERAL TERMS OF SALE & USE (CGV / CGU)",
  sections: [
    {
      heading: "1. Organizer Identification",
      content: [
        "The event is organized by:",
        "Company name: KIZZY SERVICES",
        "SIRET: 932 867 138 00012",
        "Registered address: 3 rue Félix Chopin, 94230 Cachan",
        "Legal representative: Cédrick Dja Djedje",
        "Contact email: contact@startindev.com",
      ],
    },
    {
      heading: "2. Purpose",
      content: [
        "These General Terms of Sale and Use (hereinafter “CGV/CGU”) govern the online sale of entry tickets and table reservations for the event taking place on December 31, 2025, as well as the conditions of access and participation.",
        "Any order placed on the site implies full and complete acceptance of these CGV/CGU.",
      ],
    },
    {
      heading: "3. Conditions of Access",
      content: [
        "The event is strictly reserved for adults (18+).",
        "A dress code is mandatory.",
        "Management reserves the right of admission, notably in the event of non-compliance with the dress code, inappropriate behavior or for safety reasons.",
        "In case of refusal of entry, no refund can be claimed.",
      ],
    },
    {
      heading: "4. Ticketing & Prices",
      content: [
        "Online presales",
        "Tickets are offered exclusively in online presale, subject to availability:",
        "Women’s ticket: €50",
        "Men’s ticket: €80",
        "The ticket grants access to the event on December 31, 2025 and includes a dinner cocktail from 10:00 pm to 12:00 am, subject to arrival within the allotted time.",
        "On-site ticketing",
        "Tickets may be offered on site, subject to availability, with a price increase, regardless of the time of purchase:",
        "Women’s on-site ticket: €80",
        "Men’s on-site ticket: €120",
      ],
    },
    {
      heading: "5. Table & Bottle Reservations",
      content: [
        "Customers may reserve a table directly on the website.",
        "Bottle selection may be made in advance when booking or directly on site, subject to availability.",
        "Bottles reserved in advance may be modified and exchanged on the day of the event.",
        "The dinner cocktail is included for table reservations under the same conditions as simple tickets, subject to timely arrival.",
        "Tables & bottles on site",
        "On the night of the event, it is also possible to:",
        "order bottles,",
        "obtain a table on site,",
        "depending on remaining availability, with no prior guarantee.",
      ],
    },
    {
      heading: "6. Consumptions",
      content: [
        "Before midnight: only consumptions included in the offer (dinner cocktail and bubbles) are free; any other consumption is payable.",
        "After midnight: no consumption is included; all consumptions, whether at the bar or bottle orders, are payable.",
      ],
    },
    {
      heading: "7. Payment",
      content: [
        "Payment is made exclusively by bank card, via a secure payment solution.",
        "Payment is due in a single installment.",
        "Transactions are carried out in euros (€).",
      ],
    },
    {
      heading: "8. Named Tickets & Control",
      content: [
        "Tickets are nominative and valid only for the person who made the reservation.",
        "For guests attached to a reservation, they must:",
        "either arrive with the person who booked,",
        "or present their ID and the QR code associated with the reservation.",
        "Access to the event is subject to presentation of:",
        "the reservation QR code,",
        "a valid ID document.",
      ],
    },
    {
      heading: "9. Cancellation, Refund & Force Majeure",
      content: [
        "Tickets and reservations are non-refundable.",
        "No postponement is possible, the event being linked to a single date: December 31, 2025.",
        "In case of cancellation due to force majeure (administrative decision, exceptional event beyond the organizer’s control), a refund will be made.",
      ],
    },
    {
      heading: "10. Security & House Rules",
      content: [
        "It is strictly forbidden to bring any dangerous object, illicit substance or prohibited product into the establishment.",
        "Anyone not respecting these rules may be refused access or excluded from the event without refund.",
      ],
    },
    {
      heading: "11. Image Rights",
      content: [
        "By participating in the event, the customer expressly authorizes the organizer to use their image (photos and videos) captured during the evening for communication, promotion and archiving purposes, on any medium, without time limitation and without financial compensation.",
      ],
    },
    {
      heading: "12. Personal Data",
      content: [
        "Personal data collected are used solely for reservation management, access control and communication related to the event, in accordance with applicable regulations (GDPR).",
      ],
    },
    {
      heading: "13. Liability",
      content: [
        "The organizer declines all responsibility in the event of loss, theft or deterioration of participants’ personal belongings during the event.",
      ],
    },
    {
      heading: "14. Applicable Law",
      content: [
        "These CGV/CGU are governed by French law.",
        "Any dispute is subject to the exclusive jurisdiction of French courts.",
      ],
    },
  ],
}

export default async function LegalPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = lang === 'en' ? en : fr
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-8">{t.title}</h1>
      <div className="space-y-8">
        {t.sections.map((s) => (
          <section key={s.heading} className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold">{s.heading}</h2>
            <div className="space-y-2 text-muted-foreground">
              {s.content.map((line, i) => (
                <p key={`${s.heading}-${i}`} className="leading-relaxed">{line}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
