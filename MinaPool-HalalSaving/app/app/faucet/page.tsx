"use client";

import { useMemo, useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Abi } from "viem";
import Header from "@/app/app/components/Header";

const FAUCET = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;
const TOKEN = process.env.NEXT_PUBLIC_ASSET_ADDRESS as `0x${string}`;

const FAUCET_ABI = [
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "claimAmount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "walletLimit",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalClaimed",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const satisfies Abi;

const ERC20_ABI = [
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const satisfies Abi;

export default function FaucetPage() {
  const [mounted, setMounted] = useState(false);

  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  useEffect(() => {
    setMounted(true); 
  }, []);

  const { data: claimAmount } = useReadContract({
    address: FAUCET,
    abi: FAUCET_ABI,
    functionName: "claimAmount",
  });
  const { data: walletLimit } = useReadContract({
    address: FAUCET,
    abi: FAUCET_ABI,
    functionName: "walletLimit",
  });
  const { data: claimed } = useReadContract({
    address: FAUCET,
    abi: FAUCET_ABI,
    functionName: "totalClaimed",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const { data: tokenDecimals } = useReadContract({
    address: TOKEN,
    abi: ERC20_ABI,
    functionName: "decimals",
  });
  const { data: tokenSymbol } = useReadContract({
    address: TOKEN,
    abi: ERC20_ABI,
    functionName: "symbol",
  });
  const { data: faucetBal } = useReadContract({
    address: TOKEN,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [FAUCET],
  });
  const { data: userBalance } = useReadContract({
    address: TOKEN,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const dec = Number(tokenDecimals ?? 6);
  const fmt = (v?: bigint) =>
    v == null
      ? "0"
      : (Number(v) / 10 ** dec).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const remaining = useMemo(() => {
    if (walletLimit == null || claimed == null) return 0n;
    const rem = (walletLimit as bigint) - (claimed as bigint);
    return rem > 0n ? rem : 0n;
  }, [walletLimit, claimed]);

  const progressPercentage = useMemo(() => {
    if (walletLimit == null || claimed == null) return 0;
    return Math.min(
      (Number(claimed as bigint) / Number(walletLimit as bigint)) * 100,
      100
    );
  }, [walletLimit, claimed]);

  async function onClaim() {
    try {
      await writeContractAsync({
        address: FAUCET,
        abi: FAUCET_ABI,
        functionName: "claim",
      });
      alert("✅ Claim submitted! Check your wallet for confirmation.");
    } catch (e: any) {
      console.error(e);
      alert(
        e?.shortMessage ?? e?.message ?? "❌ Claim failed. Please try again."
      );
    }
  }

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-5 py-10">
          <div className="animate-pulse text-center py-20">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blueribbon/10 rounded-full mb-2">
            <span className="text-3xl">💧</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Test USDC Faucet
          </h1>
          <p className="text-sm opacity-70 max-w-md mx-auto">
            Get free test USDC to try out Halal Savings on Base Sepolia testnet
          </p>
        </section>

        {isConnected ? (
          <>
            {/* Stats Grid */}
            <section className="grid gap-4 md:grid-cols-2">
              {/* Your Balance */}
              <div className="card p-6">
                <div className="text-xs opacity-60 mb-1">Your Balance</div>
                <div className="text-3xl font-bold mb-1">
                  {fmt(userBalance as bigint | undefined)}
                </div>
                <div className="text-sm opacity-70">
                  {tokenSymbol ?? "mUSDC"}
                </div>
              </div>

              {/* Faucet Balance */}
              <div className="card p-6">
                <div className="text-xs opacity-60 mb-1">Faucet Balance</div>
                <div className="text-3xl font-bold mb-1">{fmt(faucetBal)}</div>
                <div className="text-sm opacity-70">
                  {tokenSymbol ?? "mUSDC"} available
                </div>
              </div>
            </section>

            {/* Main Claim Card */}
            <section className="card p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Claim Test Tokens
                </h2>
                <p className="text-sm opacity-70">
                  Each wallet can claim up to{" "}
                  {fmt(walletLimit as bigint | undefined)}{" "}
                  {tokenSymbol ?? "mUSDC"} total
                </p>
              </div>

              {/* Claim Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 bg-mist rounded-lg">
                  <div className="text-xs opacity-60 mb-1">Claim Amount</div>
                  <div className="text-xl font-bold text-blueribbon">
                    {fmt(claimAmount)}
                  </div>
                  <div className="text-xs opacity-70">
                    {tokenSymbol ?? "mUSDC"} per claim
                  </div>
                </div>

                <div className="p-4 bg-mist rounded-lg">
                  <div className="text-xs opacity-60 mb-1">Already Claimed</div>
                  <div className="text-xl font-bold">
                    {fmt(claimed as bigint | undefined)}
                  </div>
                  <div className="text-xs opacity-70">
                    {tokenSymbol ?? "mUSDC"}
                  </div>
                </div>

                <div className="p-4 bg-mist rounded-lg">
                  <div className="text-xs opacity-60 mb-1">Remaining</div>
                  <div className="text-xl font-bold text-blueribbon">
                    {fmt(remaining)}
                  </div>
                  <div className="text-xs opacity-70">
                    {tokenSymbol ?? "mUSDC"} left
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="opacity-70">Claim Progress</span>
                  <span className="font-semibold">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-slate rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blueribbon transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Claim Button */}
              <button
                onClick={onClaim}
                disabled={isPending || remaining === 0n || !isConnected}
                className="btn btn-primary w-full py-3 text-base"
              >
                {remaining === 0n
                  ? "🚫 Maximum Reached"
                  : isPending
                  ? "⏳ Processing..."
                  : `💧 Claim ${fmt(claimAmount)} ${tokenSymbol ?? "mUSDC"}`}
              </button>

              {remaining === 0n && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ You have reached the maximum claim limit for this wallet.
                    Try with another wallet to get more test tokens.
                  </p>
                </div>
              )}
            </section>

            {/* Info Cards */}
            <section className="grid gap-4 md:grid-cols-2">
              <div className="card p-6">
                <div className="w-10 h-10 bg-blueribbon/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">ℹ️</span>
                </div>
                <h3 className="font-semibold mb-2">What is this?</h3>
                <p className="text-sm opacity-70">
                  This faucet provides test USDC tokens for the Base Sepolia
                  testnet. These tokens have no real value and are only for
                  testing purposes.
                </p>
              </div>

              <div className="card p-6">
                <div className="w-10 h-10 bg-blueribbon/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <p className="text-sm opacity-70 mb-3">
                  After claiming, you can use these tokens to test our Halal
                  Savings features:
                </p>
                <div className="space-y-1">
                  <a
                    href="/app"
                    className="text-xs text-blueribbon hover:underline block"
                  >
                    → Deposit into iUSDC Vault
                  </a>
                  <a
                    href="/app/savings"
                    className="text-xs text-blueribbon hover:underline block"
                  >
                    → Create Savings Goals
                  </a>
                  <a
                    href="/app/reports"
                    className="text-xs text-blueribbon hover:underline block"
                  >
                    → Track Your Progress
                  </a>
                </div>
              </div>
            </section>

            {/* Contract Info */}
            <section className="card p-6">
              <h3 className="font-semibold mb-3 text-sm">
                Contract Information
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center p-2 bg-mist rounded">
                  <span className="opacity-60">Faucet:</span>
                  <span className="text-blueribbon break-all">{FAUCET}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-mist rounded">
                  <span className="opacity-60">Token:</span>
                  <span className="text-blueribbon break-all">{TOKEN}</span>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="card p-12 text-center">
            <div className="text-5xl mb-4">🔌</div>
            <h3 className="text-xl font-semibold mb-3">Connect Your Wallet</h3>
            <p className="text-sm opacity-70 mb-6 max-w-md mx-auto">
              Please connect your wallet to claim test USDC tokens. Make sure
              you are on Base Sepolia testnet.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
