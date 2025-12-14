import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { DataProvider } from '@/context/DataContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Math Performance Analysis | Data Visualization Portfolio',
  description: 'An interactive data story exploring factors that influence Portuguese high school student math performance. Built with Next.js, D3, and Recharts.',
  keywords: ['data visualization', 'education analytics', 'student performance', 'D3.js', 'Next.js'],
  authors: [{ name: 'Data Analyst Portfolio' }],
  openGraph: {
    title: 'Portuguese High School Math Performance Analysis',
    description: 'An interactive exploration of academic, demographic, and lifestyle factors affecting student success.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body bg-slate-925 text-gray-100 antialiased">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}

