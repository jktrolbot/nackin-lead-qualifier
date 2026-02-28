import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LeadQualifier AI — Qualify Leads Automatically',
  description:
    'AI-powered lead qualification chatbot. Engage visitors, extract key info, score leads automatically with GPT-4o.',
  keywords: ['lead qualification', 'AI chatbot', 'sales automation', 'GPT-4o', 'Next.js'],
  openGraph: {
    title: 'LeadQualifier AI',
    description: 'Qualify leads automatically with conversational AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
