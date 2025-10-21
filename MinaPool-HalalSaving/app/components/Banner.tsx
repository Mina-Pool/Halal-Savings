"use client";
import React from "react";

type Props = {
  ctaHref?: string;
  ctaText?: string;
  sticky?: boolean;
  className?: string;
};

export default function Banner({
  ctaHref = "/app/faucet",
  ctaText = "Get Test USDC →",
  sticky = true,
  className = "",
}: Props) {
  return (
    <aside
      role="status"
      aria-live="polite"
      className={`${sticky ? "sticky top-0 z-50" : ""} ${className}`}
    >
      <div className="w-full text-white" style={{ backgroundColor: "#0052FF" }}>
        <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base leading-snug">
            <span className="mr-2">🚧</span>
            <strong className="font-semibold">BETA NOTICE</strong>{" "}
            <span className="opacity-90">
              Currently in beta on Base Sepolia testnet. Try with test tokens first!
            </span>
          </p>

          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-lg bg-white/95 px-3 py-1.5 text-sm font-medium text-[#0052FF] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </aside>
  );
}
