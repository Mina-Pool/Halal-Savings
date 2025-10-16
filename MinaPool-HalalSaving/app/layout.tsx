import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400','500','600','700'],
  display: 'swap',
});

export const metadata = { title: 'MinaPools Demo' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-jakarta min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}