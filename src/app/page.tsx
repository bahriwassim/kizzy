import { redirect } from 'next/navigation';

// This is the root page, which redirects to the default language
export default function RootPage() {
  redirect('/fr');
}
