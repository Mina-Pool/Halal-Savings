/* eslint-disable @next/next/no-page-custom-font */
import './app/globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "MinaPool — Halal Saving, On-Chain",
  description: "Simple, transparent savings aligned with Sharia principles—your assets stay in your wallet on Base.",
  openGraph: { images: ["/og-image.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white text-[#0A0B0D]">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh font-['Plus_Jakarta_Sans'] antialiased">
        {children}
      </body>
    </html>
  );
}