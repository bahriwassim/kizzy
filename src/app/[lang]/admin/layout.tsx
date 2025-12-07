import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroup,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  Armchair,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Mails,
  PartyPopper,
  Percent,
  Ticket,
} from 'lucide-react';
import { Locale } from '@/i18n-config';

const menuItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/admin/events', icon: Ticket, label: 'Événements' },
  { href: '/admin/reservations', icon: ClipboardList, label: 'Réservations' },
  { href: '/admin/seats', icon: Armchair, label: 'Sièges & Salles' },
  { href: '/admin/promos', icon: Percent, label: 'Codes Promo' },
  { href: '/admin/emails', icon: Mails, label: 'E-mails' },
  { href: '/admin/payments', icon: CreditCard, label: 'Paiements' },
];

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <div className="lg:has-[[data-sidebar=sidebar]]">
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-accent" />
            <span className="font-headline text-lg">Panneau Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Gestion</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={`/${lang}${item.href}`}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex items-center">
                <h1 className="font-headline text-2xl">Backoffice</h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}
