export default function About() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What is MinaPool?</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#0A0B0D]/80">
          MinaPool is a non-custodial savings protocol on Base. Funds never leave your wallet unless you send them.
          No lending, no interest—just transparent coordination and clear, predictable withdrawals.
          Start small, track progress, and move at your pace.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Non-custodial", "Sharia-aligned", "Open-source", "On Base"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-[#0052FF]/20 bg-white px-3 py-1.5 text-sm text-[#0A0B0D]/80"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Deposit", "Deposit stablecoin → receive shares"],
            ["Earnings", "Only from permitted flows (no interest)"],
            ["Withdraw", "Redeem anytime at current NAV"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#0052FF]/10 bg-[#0052FF]/3 p-5"
            >
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1 text-sm text-[#0A0B0D]/70">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
