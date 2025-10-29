import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guia do Guerreiro AppSec',
  description: 'Portal bilíngue de segurança de aplicações'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="min-h-screen bg-brand-dark text-slate-50">{children}</body>
    </html>
  );
}
