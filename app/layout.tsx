
// @ts-expect-error - Next.js handles global CSS imports during build
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Travelia - Agence de voyage en Tunisie',
  description: "Travelia, votre agence de voyage spécialisée dans les voyages organisés, Omra, assistance visa, billets d'avion et séjours personnalisés.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
