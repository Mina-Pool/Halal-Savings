"use client";

import { useEffect, useRef } from "react";

/**
 * Inline p5 background (Game of Life)
 */
function InlineP5BG({
  opacity = 0.12,
  cellSizeBase = 18,
  fps = 10,
  className = "",
}: {
  opacity?: number;
  cellSizeBase?: number;
  fps?: number;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const ensureP5 = () =>
      new Promise<any>((resolve, reject) => {
        if (typeof window !== "undefined" && (window as any).p5) {
          resolve((window as any).p5);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js";
        script.async = true;
        script.onload = () => resolve((window as any).p5);
        script.onerror = reject;
        document.head.appendChild(script);
      });

    ensureP5()
      .then((p5: any) => {
        if (!mounted || !wrapperRef.current) return;

        const sketch = (s: any) => {
          const BLUE = "#0052FF";
          const GRID = "#E5E7EB";

          let W = 100,
            H = 100;
          let cs = cellSizeBase;
          let cols = 0,
            rows = 0;
          let current: number[][] = [];
          let next: number[][] = [];

          const fit = () => {
            const rect = wrapperRef.current!.getBoundingClientRect();
            W = Math.max(160, Math.floor(rect.width));
            H = Math.max(120, Math.floor(rect.height));
            s.resizeCanvas(W, H);

            const auto = Math.max(12, Math.round((W / 48 + H / 36) / 2));
            cs = Math.round(cellSizeBase * 0.6 + auto * 0.4);

            cols = Math.floor(W / cs);
            rows = Math.floor(H / cs);

            current = Array.from({ length: cols }, () => Array(rows).fill(0));
            next = Array.from({ length: cols }, () => Array(rows).fill(0));

            for (let c = 0; c < cols; c++) {
              for (let r = 0; r < rows; r++) current[c][r] = s.random([0, 1]);
            }
          };

          const evolve = () => {
            for (let c = 0; c < cols; c++) {
              for (let r = 0; r < rows; r++) {
                const L = (c - 1 + cols) % cols;
                const R = (c + 1) % cols;
                const U = (r - 1 + rows) % rows;
                const D = (r + 1) % rows;

                const n =
                  current[L][U] +
                  current[c][U] +
                  current[R][U] +
                  current[L][r] +
                  current[R][r] +
                  current[L][D] +
                  current[c][D] +
                  current[R][D];

                const alive = current[c][r] === 1;

                if (alive && (n < 2 || n > 3)) next[c][r] = 0;
                else if (!alive && n === 3) next[c][r] = 1;
                else next[c][r] = current[c][r];
              }
            }
            const tmp = current;
            current = next;
            next = tmp;
          };

          s.setup = () => {
            const cnv = s.createCanvas(10, 10);
            cnv.parent(wrapperRef.current!);
            (cnv.elt as HTMLCanvasElement).style.position = "absolute";
            (cnv.elt as HTMLCanvasElement).style.inset = "0";
            (cnv.elt as HTMLCanvasElement).style.pointerEvents = "none";

            s.frameRate(fps);
            s.noStroke();
            fit();
          };

          s.windowResized = fit;

          s.draw = () => {
            const g = s.drawingContext.createLinearGradient(0, 0, 0, H);
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(1, "rgba(0,82,255,0.05)");
            s.drawingContext.fillStyle = g;
            s.rect(0, 0, W, H);

            evolve();

            s.stroke(GRID);
            s.strokeWeight(1);
            for (let c = 0; c < cols; c++) {
              for (let r = 0; r < rows; r++) {
                s.fill(current[c][r] ? BLUE : 255);
                s.rect(c * cs, r * cs, cs, cs);
              }
            }
          };
        };

        const instance = new p5(sketch);
        p5InstanceRef.current = instance;
      })
      .catch(() => {
        /* ignore load errors */
      });

    return () => {
      mounted = false;
      try {
        p5InstanceRef.current?.remove?.();
        p5InstanceRef.current = null;
      } catch {}
    };
  }, [cellSizeBase, fps]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

export default function About() {
  return (
    <section id="About" className="relative isolate w-full bg-white">
      <div className="relative isolate overflow-hidden mx-auto max-w-6xl px-4 py-14 md:py-20">
        {/* Cool animated background */}
        <InlineP5BG opacity={0.12} cellSizeBase={18} fps={10} />

        {/* Content */}
        <div className="relative z-10">
          {/* Heading */}
          <div className="mb-10">
            <div className="h-1 w-24 rounded-full bg-[#0052FF]" />
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A0B0D]">
              What is MinaPool?
            </h2>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
            {/* LEFT: Features */}
            <div>
              <p className="text-lg leading-relaxed text-[#0A0B0D]">
                <span className="font-semibold text-[#0052FF]">MinaPool</span>{" "}
                lets you save on Base without giving up custody—your funds never leave your wallet unless you send them. 
                We don’t lend and we don’t pay interest. 
                <span className="block mt-2 font-medium">
                  Instead, we follow a Sharia-aligned model that distributes clearly reported profits from halal business activities back to you.
                </span>
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { title: "No lending", desc: "Your money stays yours" },
                  { title: "No interest", desc: "Sharia-compliant approach" },
                  {
                    title: "Transparent profit-sharing",
                    desc: "From halal business activities",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 group"
                  >
                    <span
                      aria-hidden
                      className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0052FF]/10 border border-[#0052FF]/20 group-hover:bg-[#0052FF]/20 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 text-[#0052FF]"
                      >
                        <path
                          fill="currentColor"
                          d="M9.55 17.3a1 1 0 0 1-.73-.32l-3.5-3.77a1 1 0 1 1 1.46-1.36l2.75 2.96 7.31-7.49a1 1 0 1 1 1.44 1.38l-8.04 8.22a1 1 0 0 1-.72.38h-.0z"
                        />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium text-[#0A0B0D]">
                        {item.title}
                      </div>
                      <div className="text-sm text-[#0A0B0D]/70">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Non-custodial",
                  "Sharia-aligned",
                  "Open-source",
                  "On Base",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#0052FF]/30 bg-[#0052FF]/5 px-4 py-2 text-sm font-medium text-[#0A0B0D]/90 hover:bg-[#0052FF]/10 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT: Diagram Video */}
            <div className="relative">
              {/*heading */}
              <h1 className="mt-4 text-3xl md:text-4xl font-semibold text-[#0A0B0D]">
                How It Works
              </h1>

              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white/50 backdrop-blur-sm"></div>
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white/50 backdrop-blur-sm">
                <video
                  className="w-full h-auto"
                  src="/media/MinaPoolDiagramv1.mov"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="MinaPool flow: wallet deposits → vault → allocations and profit sharing"
                />
              </div>

              {/* Optional: How it works label */}
              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-[#0A0B0D]/70">
                  Save in 3 simple steps:{" "}
                  <span className="text-[#0052FF]">
                    Deposit → Earn → Withdraw
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center md:text-left">
            <a
              href="/app/savings"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2"
            >
              Try It Now →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
