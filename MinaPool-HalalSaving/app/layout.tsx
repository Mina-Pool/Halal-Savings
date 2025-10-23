/* eslint-disable @next/next/no-page-custom-font */
import './app/globals.css';
import { minikitConfig } from "../minikit.config";
import { Metadata } from "next";
import { NavigationLoaderProvider } from "./components/NavigationLoader";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    other: {
      "fc:miniapp": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Launch ${minikitConfig.miniapp.name}`,
          action: {
            name: `Launch ${minikitConfig.miniapp.name}`,
            type: "launch_miniapp",
          },
        },
      }),
    },
  };
}

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
          <NavigationLoaderProvider>
            {children}
          </NavigationLoaderProvider>
        </body>
      </html>
  );
}