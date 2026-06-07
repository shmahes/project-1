import type { Metadata } from 'next';
import './globals.css';
import { Cormorant_Garamond, Dancing_Script, Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-serif', weight: ['400', '500', '600', '700'], display: 'swap' });
const dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-script', display: 'swap' });

export const metadata: Metadata = {
  title: 'Curatio | Styled for you',
  description: 'A premium styling questionnaire for Curatio event design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${dancing.variable}`}>
      <body>{children}</body>
    </html>
  );
}
