"use client";

import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="h-16 w-16 rounded-full bg-[#0052FF]" />
          </div>
          <Image 
            src="/MinaPoolLogo.svg" 
            alt="MinaPool" 
            width={64} 
            height={64}
            className="relative z-10 animate-pulse"
            priority
          />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-[#0A0B0D]">Loading...</h2>
          <p className="text-sm text-[#0A0B0D]/60">Please wait</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#0052FF] animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 50%;
            margin-left: 25%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
