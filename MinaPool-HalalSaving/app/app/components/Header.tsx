'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const isActive = (path: string) => pathname === path;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-blueribbon" />
            <div className="text-lg font-semibold tracking-tight">MinaPools</div>
          </div>
          <div className="w-32 h-10" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <Image src="/MinaPoolLogo.svg" alt="MinaPool" width={28} height={28} priority />
          <div className="text-lg font-semibold tracking-tight">MinaPools</div>
          <div className="hidden sm:block ml-2 px-2 py-0.5 text-xs font-medium bg-blueribbon/10 text-blueribbon rounded">
            Halal
          </div>
          <h3>(Beta Sepolia)</h3>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 text-sm md:flex">
          <Link 
            className={`transition-opacity ${isActive('/app') ? 'opacity-100 font-semibold text-blueribbon' : 'opacity-70 hover:opacity-100'}`}
            href="/app"
          >
            Vaults
          </Link>
          <Link 
            className={`transition-opacity ${isActive('/app/savings') ? 'opacity-100 font-semibold text-blueribbon' : 'opacity-70 hover:opacity-100'}`}
            href="/app/savings"
          >
            Savings Goals
          </Link>
          <Link 
            className={`transition-opacity ${isActive('/app/reports') ? 'opacity-100 font-semibold text-blueribbon' : 'opacity-70 hover:opacity-100'}`}
            href="/app/reports"
          >
            Reports
          </Link>
          <Link 
            className={`transition-opacity ${isActive('/app/faucet') ? 'opacity-100 font-semibold text-blueribbon' : 'opacity-70 hover:opacity-100'}`}
            href="/app/faucet"
          >
            Faucet
          </Link>
        </nav>
        
        {/* Desktop Connect Button */}
        <div className="hidden md:block">
          <ConnectButton 
            chainStatus="icon"
            showBalance={false}
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-line hover:bg-slate transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-white">
          <nav className="mx-auto max-w-6xl px-5 py-4 space-y-3">
            <Link 
              href="/app"
              className={`block px-4 py-2.5 rounded-lg text-sm transition ${isActive('/app') ? 'bg-blueribbon text-white font-semibold' : 'hover:bg-slate'}`}
            >
              Vaults
            </Link>
            <Link 
              href="/app/savings"
              className={`block px-4 py-2.5 rounded-lg text-sm transition ${isActive('/app/savings') ? 'bg-blueribbon text-white font-semibold' : 'hover:bg-slate'}`}
            >
              Savings Goals
            </Link>
            <Link 
              href="/app/reports"
              className={`block px-4 py-2.5 rounded-lg text-sm transition ${isActive('/app/reports') ? 'bg-blueribbon text-white font-semibold' : 'hover:bg-slate'}`}
            >
              Reports
            </Link>
            <Link 
              href="/app/faucet"
              className={`block px-4 py-2.5 rounded-lg text-sm transition ${isActive('/app/faucet') ? 'bg-blueribbon text-white font-semibold' : 'hover:bg-slate'}`}
            >
              Faucet
            </Link>

            {/* Mobile Connect Button */}
            <div className="pt-3 border-t border-line">
              <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
