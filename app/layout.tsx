import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SkipToContent } from "@/components/skip-to-content";
import { CursorTrail } from "@/components/cursor-trail";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Ambitious Gent | Luxury Men\'s Image Consulting',
  description: 'Elevate your presence with The Ambitious Gent. Premium image consulting, grooming, and lifestyle services for the modern professional.',
  keywords: ['image consulting', 'men\'s style', 'luxury lifestyle', 'grooming', 'personal development'],
  authors: [{ name: 'The Ambitious Gent' }],
  openGraph: {
    title: 'The Ambitious Gent',
    description: 'Premium men\'s image consulting and lifestyle services',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-body antialiased`}
      >
        <Analytics/>
        <SpeedInsights/>
        <SkipToContent />
        <CursorTrail />
        {children}
      </body>
    </html>
  );
}
