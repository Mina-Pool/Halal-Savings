export default function Mission() {
  const cards = [
    ["Compliance-first", "Designed to align with Sharia principles; no interest products."],
    ["Your custody", "You hold keys; the protocol never takes possession."],
    ["Transparent fees", "Simple, disclosed fees only; no hidden charges."],
  ];
  return (
    <section className="bg-[#0052FF]/5">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Built for clarity, custody, and conscience.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-[#0052FF]/10 bg-white p-5">
              <h3 className="font-medium">{t}</h3>
              <p className="mt-1 text-sm text-[#0A0B0D]/70">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
