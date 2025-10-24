"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { parseUnits, parseEther, formatEther, formatUnits } from "viem";
import Header from "./components/Header";
import VaultCard from "@/app/app/components/VaultCard";
import { ERC20_ABI } from "@/lib/abi/erc20";
import { VAULT_ABI } from "@/lib/abi/vault";

const vault = process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;
const asset = process.env.NEXT_PUBLIC_ASSET_ADDRESS as `0x${string}`;

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [shares, setShares] = useState("");

  const { data: decimalsData } = useReadContract({
    address: asset,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: !!asset },
  });
  const d = (decimalsData as number | undefined) ?? 6;

  const { data: sp } = useReadContract({
    address: vault,
    abi: VAULT_ABI,
    functionName: "sharePrice",
    query: { enabled: !!vault },
  });

  // Get user's USDC balance
  const { data: usdcBalance, refetch: refetchUsdc } = useReadContract({
    address: asset,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  // Get user's iUSDC balance
  const { data: iusdcBalance, refetch: refetchIusdc } = useReadContract({
    address: vault,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: pending } = useWaitForTransactionReceipt({ hash: txHash });

  const approve = () => {
    if (!amount) return;
    writeContract({
      address: asset,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [vault, parseUnits(amount, d)],
    });
  };

  const deposit = () => {
    if (!amount) return;
    writeContract({
      address: vault,
      abi: VAULT_ABI,
      functionName: "deposit",
      args: [parseUnits(amount, d)],
    });
  };

  const withdraw = () => {
    if (!shares) return;
    writeContract({
      address: vault,
      abi: VAULT_ABI,
      functionName: "withdraw",
      args: [parseEther(shares)],
    });
  };

  const formattedUsdcBalance = usdcBalance
    ? Number(formatUnits(usdcBalance as bigint, d)).toFixed(2)
    : "0";

  const formattedIusdcBalance = iusdcBalance
    ? Number(formatEther(iusdcBalance as bigint)).toFixed(2)
    : "0";

  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  if (isSuccess) {
    refetchUsdc();
    refetchIusdc();
    console.log("Refetched balances after transaction success.");
  }
}, [isSuccess, refetchUsdc, refetchIusdc]);
  if (!mounted) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10">
          <div className="animate-pulse text-center py-20">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 space-y-10">
        {/* Wallet Balance Display */}
        {isConnected && (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Your USDC Balance</div>
              <div className="text-2xl font-bold">{formattedUsdcBalance}</div>
              <div className="text-xs opacity-60 mt-1">
                Available to deposit
              </div>
            </div>
            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Your iUSDC Balance</div>
              <div className="text-2xl font-bold">{formattedIusdcBalance}</div>
              <div className="text-xs opacity-60 mt-1">
                Earning halal yields
              </div>
            </div>
            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Share Price</div>
              <div className="text-2xl font-bold">
                {sp ? Number(formatEther(sp as bigint)).toFixed(2) : "—"}
              </div>
              <div className="text-xs opacity-60 mt-1">USDC per iUSDC</div>
            </div>
          </section>
        )}

        {/* Hero section */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2 card p-7">
            <h1 className="text-3xl font-semibold tracking-tight">
              Halal Savings with iUSDC
            </h1>
            <p className="mt-2 text-sm opacity-70 max-w-[52ch]">
              Deposit USDC to receive iUSDC. Your savings grow through
              shariah-compliant profit-sharing, not interest.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <input
                className="input max-w-xs"
                placeholder="Amount (USDC)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
              <button onClick={approve} className="btn btn-outline">
                Approve
              </button>
              <button
                onClick={deposit}
                className="btn btn-primary"
                disabled={pending}
              >
                {pending ? "Processing…" : "Deposit"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                className="input max-w-xs"
                placeholder="Shares (iUSDC)"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                type="number"
              />
              <button
                onClick={withdraw}
                className="btn btn-outline"
                disabled={pending}
              >
                Withdraw
              </button>
            </div>

            {isConnected && (
              <div className="mt-4 text-xs opacity-60">
                Available: {formattedUsdcBalance} USDC • {formattedIusdcBalance}{" "}
                iUSDC
              </div>
            )}

            <div className="mt-6 p-4 bg-mist rounded-lg border border-line">
              <p className="text-xs font-semibold text-blueribbon mb-1">
                100% Shariah-Compliant
              </p>
              <p className="text-sm opacity-70">
                No riba (interest). Profits come from halal business activities
                and are shared transparently with savers.
              </p>
            </div>
          </div>

          {/* Share price widget */}
          <div className="card p-7">
            <div className="text-xs opacity-60">Current share price</div>
            <div className="mt-2 text-4xl font-bold">
              {sp ? Number(formatEther(sp as bigint)).toFixed(2) : "—"}
            </div>
            <div className="mt-4 text-sm opacity-70">
              1 iUSDC × SharePrice = redeemable USDC.
            </div>
            <div className="mt-4 p-3 bg-blueribbon/5 rounded-lg">
              <p className="text-xs font-medium text-blueribbon">Halal Yield</p>
              <p className="text-xs opacity-70 mt-1">
                Profit-sharing from permissible investments
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Halal Vaults</h2>
            <a href="/app/savings" className="btn btn-primary">
              Set Savings Goals →
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <VaultCard
              title="iUSDC (Halal)"
              token="Shariah-compliant • Profit-sharing"
              sharePriceAddr={vault}
              onDepositClick={() =>
                document
                  .querySelector<HTMLInputElement>(
                    'input[placeholder="Amount (USDC)"]'
                  )
                  ?.focus()
              }
              onWithdrawClick={() =>
                document
                  .querySelector<HTMLInputElement>(
                    'input[placeholder="Shares (iUSDC)"]'
                  )
                  ?.focus()
              }
              price={sp as bigint | undefined}
            />

            {/* Coming soon cards */}
            <div className="card p-5 opacity-60">
              <div className="badge mb-2">Coming soon</div>
              <div className="text-xl font-semibold">iBTC</div>
              <p className="text-sm opacity-70 mt-1">Bitcoin halal savings</p>
            </div>
            <div className="card p-5 opacity-60">
              <div className="badge mb-2">Coming soon</div>
              <div className="text-xl font-semibold">iIDRX</div>
              <p className="text-sm opacity-70 mt-1">Rupiah halal savings</p>
            </div>
            <div className="card p-5 opacity-60">
              <div className="badge mb-2">Coming soon</div>
              <div className="text-xl font-semibold">iETH</div>
              <p className="text-sm opacity-70 mt-1">Ethereum halal savings</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="card p-6">
            <div className="w-10 h-10 bg-blueribbon/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">🕌</span>
            </div>
            <h3 className="font-semibold mb-2">Shariah-Compliant</h3>
            <p className="text-sm opacity-70">
              No interest, only profit-sharing from halal sources
            </p>
          </div>

          <div className="card p-6">
            <div className="w-10 h-10 bg-blueribbon/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">Goal-Based Savings</h3>
            <p className="text-sm opacity-70">
              Save for Hajj, Umrah, education, and more
            </p>
          </div>

          <div className="card p-6">
            <div className="w-10 h-10 bg-blueribbon/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="font-semibold mb-2">Transparent</h3>
            <p className="text-sm opacity-70">
              All funds and profits tracked on-chain
            </p>
          </div>
        </section>
      </main>
      <footer className="mx-auto max-w-6xl px-5 py-10 text-xs opacity-60">
        © {new Date().getFullYear()} MinaPools — Halal DeFi on Base
      </footer>
    </>
  );
}
