import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="container px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-semibold mb-3">Golden Paris NYE 2026</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">À propos</Link></li>
            <li><Link href="#">Équipe</Link></li>
            <li><Link href="#">Carrières</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Billetterie</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">Acheter un billet</Link></li>
            <li><Link href="#">Remboursements</Link></li>
            <li><Link href="#">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Organisateurs</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">Tarifs</Link></li>
            <li><Link href="#">Outils</Link></li>
            <li><Link href="#">API</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Légal</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="#">Conditions</Link></li>
            <li><Link href="#">Confidentialité</Link></li>
            <li><Link href="#">Cookies</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container px-4 md:px-6 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} Golden Paris NYE 2026. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="#">Twitter</Link>
            <Link href="#">Instagram</Link>
            <Link href="#">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}