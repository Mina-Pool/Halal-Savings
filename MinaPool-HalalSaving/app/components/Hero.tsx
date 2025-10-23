"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONTRACT = "0x4D9744786215a495B38b6EC785F79E5d3EECC1E7";
const BASESCAN = `https://sepolia.basescan.org/address/${CONTRACT}`;

// softer blue border for chips
const BLUE = "#0052FF";
const INK = "#0A0B0D";
const WHITE = "#FFFFFF";
const BLUE_SOFT = "rgba(0, 82, 255, 0.20)";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundColor: WHITE,
        color: INK,
        fontFamily:
          "'Plus Jakarta Sans', ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      {/* Background animation */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <iframe
          src="/Hero/index.html"
          className="w-full h-full border-0"
          title="Background Animation"
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          <p
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ color: BLUE, border: `1px solid ${BLUE_SOFT}`, backgroundColor: WHITE }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: BLUE }} />
            Built on Base Sepolia (Testnet)
          </p>

          <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl" style={{ color: INK }}>
            Halal Saving, On-Chain.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: INK }}>
            Simple, transparent savings aligned with Sharia principles—your assets stay in your wallet on Base.
          </p>

          {/* Feature pills (blue icon, ink text, white bg) */}
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {["No Interest (Riba)", "Asset-Backed", "Profit-Sharing"].map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{ backgroundColor: WHITE, color: INK, border: `1px solid ${BLUE_SOFT}` }}
              >
                <CheckIcon className="h-4 w-4" style={{ color: BLUE }} />
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-50"
              style={{ backgroundColor: BLUE, color: WHITE, border: `1px solid ${BLUE}` }}
            >
              Launch App
            </Link>

            <Link
              href="/#About"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold"
              style={{ backgroundColor: WHITE, color: BLUE, border: `1px solid ${BLUE}` }}
            >
              How It Works ↓
            </Link>

            <Link
              href="https://minapool.gitbook.io/minapool-docs/"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-50"
              style={{ backgroundColor: WHITE, color: BLUE, border: `1px solid ${BLUE}` }}
            >
              Learn More
            </Link>
          </div>

          {/* Contract chip */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <button
              onClick={copy}
              className="rounded-full px-3 py-1.5 transition"
              style={{ backgroundColor: WHITE, color: INK, border: `1px solid ${BLUE_SOFT}` }}
              title="Copy contract address"
              aria-live="polite"
            >
              {copied ? "Copied!" : `Contract: ${CONTRACT.slice(0, 6)}…${CONTRACT.slice(-4)}`}
            </button>

            <a
              href={BASESCAN}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 transition"
              style={{ backgroundColor: WHITE, color: BLUE, border: `1px solid ${BLUE_SOFT}` }}
              title="View on BaseScan"
            >
              View on BaseScan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— Icons ——— */
function CheckIcon(
  props: React.SVGProps<SVGSVGElement> & { style?: React.CSSProperties }
) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
