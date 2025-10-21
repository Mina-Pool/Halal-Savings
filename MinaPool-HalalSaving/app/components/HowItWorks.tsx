'use client';

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Inline p5 background (Game of Life) — no separate files.
 * - Loads p5 from window if available, otherwise injects CDN script.
 * - Canvas is absolutely positioned inside its wrapper only.
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

    ensureP5().then((p5: any) => {
      if (!mounted || !wrapperRef.current) return;

      const sketch = (s: any) => {
        const BLUE = "#0052FF";
        const GRID = "#E5E7EB";

        let W = 100, H = 100;
        let cs = cellSizeBase;
        let cols = 0, rows = 0;
        let current: number[][] = [];
        let next: number[][] = [];

        const fit = () => {
          const rect = wrapperRef.current!.getBoundingClientRect();
          W = Math.max(160, Math.floor(rect.width));
          H = Math.max(120, Math.floor(rect.height));
          s.resizeCanvas(W, H);

          // blend fixed size with auto for responsiveness
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
                current[L][U] + current[c][U] + current[R][U] +
                current[L][r] +                 current[R][r] +
                current[L][D] + current[c][D] + current[R][D];

              const alive = current[c][r] === 1;

              if (alive && (n < 2 || n > 3)) next[c][r] = 0;
              else if (!alive && n === 3)   next[c][r] = 1;
              else                          next[c][r] = current[c][r];
            }
          }
          const tmp = current; current = next; next = tmp;
        };

        s.setup = () => {
          const cnv = s.createCanvas(10, 10);
          cnv.parent(wrapperRef.current!);
          // make sure canvas is scoped to this wrapper
          (cnv.elt as HTMLCanvasElement).style.position = "absolute";
          (cnv.elt as HTMLCanvasElement).style.inset = "0";
          (cnv.elt as HTMLCanvasElement).style.pointerEvents = "none";

          s.frameRate(fps);
          s.noStroke();
          fit();
        };

        s.windowResized = fit;

        s.draw = () => {
          // soft white -> very light blue gradient
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
    }).catch(() => { /* ignore load errors */ });

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

export default function HowItWorks() {
  const items = [
    { src: "/How/deposit.png", alt: "Deposit" },
    { src: "/How/earn.png", alt: "Earn" },
    { src: "/How/withdraw.png", alt: "Withdraw" },
  ];

  return (
    // isolate ensures this section makes its own stacking context
    <section id="HowItWorks" className="relative isolate w-full bg-white">
      {/* scoped container */}
      <div className="relative isolate overflow-hidden mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        {/* p5 background (locked to this box) */}
        <InlineP5BG opacity={0.12} cellSizeBase={18} fps={10} />

        {/* foreground */}
        <div className="relative z-10">
          {/* header */}
          <div className="mb-10">
            <div className="h-1 w-24 rounded-full bg-[#0052FF]" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A0B0D]">
              How It Works
            </h2>
            <p className="mt-2 text-[#0A0B0D]/70">Save in 3 simple steps.</p>
          </div>

          {/* cards */}
          <div className="md:grid md:grid-cols-3 md:gap-6 flex md:flex-none overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4">
            {items.map((it) => (
              <div
                key={it.alt}
                className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white flex-shrink-0 w-[85vw] md:w-auto snap-center"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    className="object-contain p-4"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    priority={it.alt === "Deposit"}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="/app/savings"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-5 py-3 text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2"
            >
              Try It Now →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
