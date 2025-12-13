
'use client';

import Link from 'next/link';
import { Languages } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from 'next/navigation';
import { i18n, type Locale } from '@/i18n-config';

const content = {
  fr: {
    event: "Événement",
    admin: "Admin",
    title: "Touch Of Class NYE 2026"
  },
  en: {
    event: "Event",
    admin: "Admin",
    title: "Touch Of Class NYE 2026"
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as Locale || 'fr';
  const headerContent = content[lang] || content['fr'];

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
          <img src="/favicon.ico" alt="Logo" className="h-6 w-6" />
          <span className="inline-block font-bold font-headline truncate max-w-[200px] sm:max-w-none">
            {headerContent.title}
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4" />
        <div className="flex items-center justify-end space-x-2 md:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-3">
                  <Languages className="h-5 w-5" />
                  {lang === 'fr' ? (
                    <img src="https://flagcdn.com/w20/fr.png" alt="FR" width={20} height={14} />
                  ) : (
                    <img src="https://flagcdn.com/w20/gb.png" alt="EN" width={20} height={14} />
                  )}
                  <span className="sr-only">Changer la langue</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={redirectedPathName('fr')} className="flex items-center gap-2">
                    <img src="https://flagcdn.com/w20/fr.png" alt="FR" width={20} height={14} />
                    Français
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={redirectedPathName('en')} className="flex items-center gap-2">
                    <img src="https://flagcdn.com/w20/gb.png" alt="EN" width={20} height={14} />
                    English
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 
