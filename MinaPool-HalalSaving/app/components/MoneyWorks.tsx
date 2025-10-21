"use client";

import Image from "next/image";

const CARDS = [
  {
    src: "/moneyWorks/card1.png",
    title: "Real-World Assets (60–70%)",
    body:
      "Tokenized sukuk, gold, and property-backed assets. Focus on transparent, low-volatility yield.",
    // If you want this card to link somewhere, add: href: "/reports"
  },
  {
    src: "/moneyWorks/card2.png",
    title: "DeFi Activities (30–40%)",
    body:
      "Validator staking and AMM LP positions with risk controls and on-chain reporting.",
  },
  {
    src: "/moneyWorks/card3.png",
    title: "Mudarabah Profit-Sharing",
    body:
      "No fixed returns. Monthly profit split (e.g., 90% you / 10% manager) with clear attestations.",
  },
];

export default function MoneyWorks() {
  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0A0B0D]">
            Where Your Money Works
          </h2>
          <p className="mt-2 text-neutral-600">
            Clear allocation, transparent reporting, and Sharia-compliant structure.
          </p>
        </header>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => {
            const CardContent = (
              <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                  {/* Subtle badge */}
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center rounded-full border border-blue-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#0052FF] backdrop-blur">
                    {i === 0 ? "RWA" : i === 1 ? "DeFi" : "Sharia"}
                  </span>
                </div>

                <div className="px-5 py-5">
                  <h3 className="text-lg font-semibold text-[#0A0B0D]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-neutral-600">
                    {card.body}
                  </p>
                </div>
              </article>
            );

            // If later you decide to add links per card, wrap CardContent with <Link href={card.href}>...</Link>
            return <div key={card.src}>{CardContent}</div>;
          })}
        </div>

        {/* Small footnote row (kept understated) */}
        <div className="mt-8 flex flex-col gap-2 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>
            Allocation targets are indicative and may vary based on market conditions.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-medium text-[#0052FF] underline-offset-4 hover:underline"
          >
            Read Shariah attestation
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
