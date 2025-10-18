const CONTRACT = "0x4D9744786215a495B38b6EC785F79E5d3EECC1E7";
const BASESCAN = `https://sepolia.basescan.org/address/${CONTRACT}`;
const GITHUB = "https://github.com/Mina-Pool";

export default function Security() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Security & Transparency</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#0052FF]/10 bg-[#0052FF]/3 p-5">
            <h3 className="font-medium">Contracts</h3>
            <p className="mt-1 text-sm text-[#0A0B0D]/70 break-words">
              {CONTRACT}
            </p>
            <a
              href={BASESCAN}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm text-[#0052FF] underline"
            >
              View on BaseScan
            </a>
          </div>

          <div className="rounded-2xl border border-[#0052FF]/10 bg-white p-5">
            <h3 className="font-medium">Audits & Roadmap</h3>
            <p className="mt-1 text-sm text-[#0A0B0D]/70">
              Independent audit planned; tracked on GitHub Roadmap.
            </p>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm text-[#0052FF] underline">
              GitHub
            </a>
          </div>

          <div className="rounded-2xl border border-[#0052FF]/10 bg-white p-5">
            <h3 className="font-medium">Disclosure</h3>
            <p className="mt-1 text-sm text-[#0A0B0D]/70">
              Responsible disclosure welcome. Blockchain carries risk; no returns are promised.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
