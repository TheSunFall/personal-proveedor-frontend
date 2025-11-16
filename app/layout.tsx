import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Navigation } from '@/components/navigation';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Constructora - Sistema de Gestión',
  description: 'Sistema de gestión de personal, proveedores y proyectos de construcción',
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.className} flex bg-background text-foreground`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
