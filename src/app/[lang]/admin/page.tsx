import { redirect } from 'next/navigation';
import { Locale } from '@/i18n-config';

export default async function AdminRootPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  redirect(`/${lang}/admin/dashboard`);
}
