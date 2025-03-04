import './globals.css';
import ScaffoldWithProvider from '../components/ScaffoldWithProvider';
import { getMetadata } from '@/utils/getMetaData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DM_Sans } from 'next/font/google';

export const metadata = getMetadata({
  title: 'Defi Analytics App',
  description: 'Built with The Graph',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${dmSans.variable} 'antialiased'`}>
        <ThemeProvider defaultTheme="dark" forcedTheme="dark">
          <ScaffoldWithProvider>{children}</ScaffoldWithProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
