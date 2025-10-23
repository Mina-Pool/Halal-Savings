import LoadingLink from "./LoadingLink";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#0052FF]/10 bg-[#0A0B0D] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Image src="/MinaPoolLogo.svg" alt="MinaPool" width={24} height={24} />
            <span className="text-base font-semibold">MinaPool</span>
          </div>
          <p className="text-sm text-white/70">Small deposits. Big journeys.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://minapool.gitbook.io/minapool-docs/"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white hover:opacity-80 underline-offset-4 hover:underline"
            >
              Documentation
            </a>
            <a
              href="https://github.com/Mina-Pool"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white hover:opacity-80 underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://minapool.gitbook.io/minapool-docs/legal-disclaimer"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white hover:opacity-80 underline-offset-4 hover:underline"
            >
              Disclaimer
            </a>
            <LoadingLink
              href="/app"
              className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0A0B0D] hover:opacity-90"
            >
              Launch App
            </LoadingLink>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/60">
          © 2025 MinaPool • Made on Base
        </div>
      </div>
    </footer>
  );
}
