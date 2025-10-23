"use client";

import LoadingLink from "./LoadingLink";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DOCS_URL = "https://minapool.gitbook.io/minapool-docs/";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const close = () => setOpen(false);

  const NavLinks = () => (
    <>
      {/* External docs */}
      <Link
        href={DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#0A0B0D]/80 hover:text-[#0A0B0D]"
        onClick={close}
      >
        Documentation
      </Link>

      {/* Landing page sections – force navigation to home then hash */}
      <Link
        href="/#about"
        onClick={close}
        className="text-sm text-[#0A0B0D]/80 hover:text-[#0A0B0D]"
      >
        About
      </Link>
      <Link
        href="/#goals"
        onClick={close}
        className="text-sm text-[#0A0B0D]/80 hover:text-[#0A0B0D]"
      >
        Goals
      </Link>
      <Link
        href="/#moneyworks"
        onClick={close}
        className="text-sm text-[#0A0B0D]/80 hover:text-[#0A0B0D]"
      >
        Where Your Money Works
      </Link>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur transition-all ${
        scrolled
          ? "bg-white/80 border-b border-[#0052FF]/10 shadow-sm"
          : "bg-white/70"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <LoadingLink href="/" className="flex items-center gap-2" onClick={close}>
          <Image
            src="/MinaPoolLogo.svg"
            alt="MinaPool"
            width={28}
            height={28}
            priority
          />
          <span className="text-lg md:text-xl font-semibold tracking-tight">
            MinaPool
          </span>
          <span className="text-xs md:text-sm opacity-70">(Beta Sepolia)</span>
        </LoadingLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLinks />

          <LoadingLink
            href="/app"
            className="inline-flex items-center rounded-xl bg-[#0052FF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0052FF]/90"
          >
            Launch App
          </LoadingLink>
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0052FF]/20"
          onClick={() => setOpen(true)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile drawer */}
        {open && (
          <>
            <button
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/50"
              onClick={close}
            />
            <div className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85%] bg-white shadow-xl">
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex items-center gap-2">
                  <Image
                    src="/MinaPoolLogo.svg"
                    alt="MinaPool"
                    width={24}
                    height={24}
                  />
                  <span className="font-semibold">MinaPool</span>
                </div>
                <button
                  aria-label="Close menu"
                  className="h-9 w-9 rounded-lg border"
                  onClick={close}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mx-auto h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeWidth="2" d="M6 6l12 12M18 6l-12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer content */}
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-6">
                  Halal savings platform aligned with Sharia principles on Base
                  blockchain.
                </p>

                {/* Render same links but as blocks for touch targets */}
                <div className="space-y-3 mb-6">
                  <Link
                    href={DOCS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                    onClick={close}
                  >
                    Documentation
                  </Link>
                  <Link
                    href="/#about"
                    onClick={close}
                    className="block p-3 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white hover:border-blue-500"
                  >
                    About
                  </Link>
                  <Link
                    href="/#goals"
                    onClick={close}
                    className="block p-3 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white hover:border-blue-500"
                  >
                    Goals
                  </Link>
                  <Link
                    href="/#moneyworks"
                    onClick={close}
                    className="block p-3 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white hover:border-blue-500"
                  >
                    Where Your Money Works
                  </Link>
                </div>

                {/* CTA */}
                <LoadingLink
                  href="/app"
                  onClick={close}
                  className="block w-full text-center p-4 bg-[#0052FF] text-white rounded-xl font-semibold"
                >
                  Launch App →
                </LoadingLink>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500">
                    🕌 100% Shariah-Compliant
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
