"use client";

/**
 * CanvasBackground mounts your uploaded /public/hero/index.html
 * inside an iframe. It:
 *  - honors prefers-reduced-motion (doesn't load the iframe)
 *  - pauses on tab blur (iframe hidden)
 *  - scales responsively
 */

import { useEffect, useMemo, useRef, useState } from "react";

export default function CanvasBackground() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reducedMotion) return;

    const onVis = () => {
      const visible = document.visibilityState === "visible";
      setShouldAnimate(visible);
    };
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/hero-fallback.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Light overlay for contrast under text */}
      <div className="absolute inset-0 bg-white/6" />
      {shouldAnimate && (
        <iframe
          ref={iframeRef}
          src="/Hero/index.html"
          title="MinaPool hero animation"
          className="h-full w-full"
          style={{ border: "0" }}
          aria-hidden
        />
      )}
    </div>
  );
}
