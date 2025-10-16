'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-10 border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-blueribbon" />
            <div className="text-lg font-semibold tracking-tight">MinaPools</div>
            <div className="hidden sm:block ml-2 px-2 py-0.5 text-xs font-medium bg-blueribbon/10 text-blueribbon rounded">
              Halal
            </div>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a className="opacity-70 hover:opacity-100 transition-opacity" href="/">
              Vaults
            </a>
            <a className="opacity-70 hover:opacity-100 transition-opacity" href="/savings">
              Savings Goals
            </a>
            <a className="opacity-70 hover:opacity-100 transition-opacity" href="/reports">
              Reports
            </a>
          </nav>
          <div className="w-32 h-10" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-blueribbon" />
          <div className="text-lg font-semibold tracking-tight">MinaPools</div>
          <div className="hidden sm:block ml-2 px-2 py-0.5 text-xs font-medium bg-blueribbon/10 text-blueribbon rounded">
            Halal
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden gap-6 text-sm md:flex">
          <a 
            className="opacity-70 hover:opacity-100 transition-opacity" 
            href="/"
          >
            Vaults
          </a>
          <a 
            className="opacity-70 hover:opacity-100 transition-opacity" 
            href="/savings"
          >
            Savings Goals
          </a>
          <a 
            className="opacity-70 hover:opacity-100 transition-opacity" 
            href="/reports"
          >
            Reports
          </a>
        </nav>
        
        {/* RainbowKit Connect Button */}
        <ConnectButton 
          chainStatus="icon"
          showBalance={false}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </div>
    </header>
  );
}