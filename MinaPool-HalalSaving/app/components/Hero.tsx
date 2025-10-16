"use client";

import Link from "next/link";

const CONTRACT = "0x4D9744786215a495B38b6EC785F79E5d3EECC1E7";
const BASESCAN = `https://basescan.org/address/${CONTRACT}`;

export default function Hero() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
    } catch {}
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Animasi dari HTML */}
      <div className="absolute inset-0 -z-10">
        <iframe 
          src="/Hero/index.html"
          className="w-full h-full border-0"
          title="Background Animation"
        />
      </div>

      {/* Gradient overlay agar text lebih terbaca */}
      <div className="absolute inset-0 -z-5 bg-gradient-to-b from-transparent via-white/30 to-white/80" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
            Halal Saving, On-Chain.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#0A0B0D]/80 md:text-lg">
            Simple, transparent savings aligned with Sharia principles—your assets stay in your wallet on Base.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-xl bg-[#0052FF] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052FF]"
            >
              Launch App
            </Link>

            <button
              aria-disabled
              className="inline-flex items-center justify-center rounded-xl border border-[#0052FF]/30 bg-white px-5 py-3 text-sm font-semibold text-[#0052FF]/70 cursor-not-allowed"
              title="Whitepaper (coming soon)"
            >
              Whitepaper (coming soon)
            </button>
          </div>

          {/* Contract chip */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <button
              onClick={copy}
              className="rounded-full border border-[#0052FF]/20 bg-white/80 px-3 py-1.5 text-[#0A0B0D]/80 hover:bg-white transition"
              title="Copy contract address"
            >
              Base Contract: {CONTRACT.slice(0, 6)}…{CONTRACT.slice(-4)}
            </button>
            <a
              href={BASESCAN}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#0052FF]/20 bg-white/80 px-3 py-1.5 text-[#0052FF] hover:bg-white transition"
            >
              View on BaseScan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}