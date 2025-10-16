"use client";
import { useState, useEffect } from "react";
import { useAccount, useConfig, useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { formatEther, formatUnits } from "viem";
import Header from "@/app/app/components/Header";
import { ERC20_ABI } from "@/lib/abi/erc20";
import { VAULT_ABI } from "@/lib/abi/vault";
import { HALAL_SAVINGS_V2_ABI, CONTRACTS } from "@/contracts/config";

const vault = CONTRACTS.IUSDC_VAULT;
const asset = CONTRACTS.MOCK_USDC;
const savings = CONTRACTS.HALAL_SAVINGS_V2;
const mina = CONTRACTS.MINA_TOKEN;

const GOAL_TYPES = [
  "Hajj",
  "Umrah",
  "Qurban",
  "Education",
  "Wedding",
  "General",
];

type UserStats = {
  totalDeposited: bigint;
  totalWithdrawn: bigint;
  streakMonths: bigint;
  lastDepositTime: bigint;
  profitShareClaimed: bigint;
  goalsCreated: bigint;
  goalsCompleted: bigint;
};

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected } = useAccount();
  const wagmiConfig = useConfig();

  const [goalData, setGoalData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [decimals, setDecimals] = useState({ asset: 6, iAsset: 18 });

  // Vault data
  const { data: sharePrice } = useReadContract({
    address: vault,
    abi: VAULT_ABI,
    functionName: "sharePrice",
  });

  const { data: usdcBalance } = useReadContract({
    address: asset,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const { data: iusdcBalance } = useReadContract({
    address: vault,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const { data: minaBalance } = useReadContract({
    address: mina,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  // Savings data
  const { data: tvl } = useReadContract({
    address: savings,
    abi: HALAL_SAVINGS_V2_ABI, // ← Change to V2
    functionName: "getTVL",
  });

  const { data: totalUsers } = useReadContract({
    address: savings,
    abi: HALAL_SAVINGS_V2_ABI, // ← Change to V2
    functionName: "getTotalUsers",
  });

  const { data: userStats } = useReadContract({
    address: savings,
    abi: HALAL_SAVINGS_V2_ABI,
    functionName: "userStats",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const refreshAllData = async () => {
    console.log("Refreshing all data...");
    if (address) {
      await loadGoalData();
    }
    // Force re-render by updating a dummy state
    setMounted(false);
    setTimeout(() => setMounted(true), 100);
  };

  const { data: profitEarned } = useReadContract({
    address: savings,
    abi: HALAL_SAVINGS_V2_ABI, // ← Change to V2
    functionName: "earned",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  // Format values
  const formattedSharePrice = sharePrice
    ? Number(formatEther(sharePrice as bigint)).toFixed(6)
    : "0";
  const formattedUsdcBalance = usdcBalance
    ? Number(formatUnits(usdcBalance as bigint, 6)).toFixed(2)
    : "0";
  const formattedIusdcBalance = iusdcBalance
    ? Number(formatEther(iusdcBalance as bigint)).toFixed(4)
    : "0";
  const formattedMinaBalance = minaBalance
    ? Number(formatEther(minaBalance as bigint)).toFixed(2)
    : "0";
  const formattedTVL = tvl
    ? Number(formatEther(tvl as bigint)).toFixed(2)
    : "0";
  const totalUsersCount = totalUsers ? Number(totalUsers) : 0;

  // Calculate iUSDC value in USDC
  const iusdcValueInUsdc =
    iusdcBalance && sharePrice
      ? (
          Number(formatEther(iusdcBalance as bigint)) *
          Number(formatEther(sharePrice as bigint))
        ).toFixed(2)
      : "0";

  // Active goal progress
  const hasGoal =
    goalData &&
    typeof goalData === "object" &&
    "targetAmount" in goalData &&
    goalData.targetAmount > 0n;

  // Calculate progress using object properties
  const progress =
    hasGoal && goalData
      ? {
          goalType: Number(goalData.goalType || 0),
          name: goalData.customName || "My Goal",
          saved: Number(
            formatUnits(goalData.totalSaved || 0n, decimals.iAsset)
          ),
          target: Number(
            formatUnits(goalData.targetAmount || 0n, decimals.iAsset)
          ),
          percentage: Math.min(
            Math.round(
              (Number(formatUnits(goalData.totalSaved || 0n, decimals.iAsset)) /
                Number(
                  formatUnits(goalData.targetAmount || 0n, decimals.iAsset)
                )) *
                100
            ),
            100
          ),
        }
      : null;

  // Load goal data when address changes

  useEffect(() => {
    if (address) {
      loadGoalData();
    }
  }, [address]);
  const loadGoalData = async () => {
    if (!address) return;

    try {
      // V2: Get all active goals (returns array)
      const goals = (await readContract(wagmiConfig, {
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI, // ← V2 ABI
        functionName: "getActiveGoals", // ← V2 (plural)
        args: [address],
      })) as any[];

      console.log("Active goals loaded:", goals);

      // Set first active goal as the "active goal" for reports
      setGoalData(goals && goals.length > 0 ? goals[0] : null);
    } catch (err) {
      console.error("Error loading goals:", err);
    }
  };

  const stats =
    userStats && typeof userStats === "object"
      ? {
          deposited: Number(
            formatUnits(
              (userStats as UserStats).totalDeposited || 0n,
              decimals.iAsset
            )
          ).toFixed(2),
          withdrawn: Number(
            formatUnits(
              (userStats as UserStats).totalWithdrawn || 0n,
              decimals.iAsset
            )
          ).toFixed(2),
          streak: Number((userStats as UserStats).streakMonths || 0),
          claimed: Number(
            formatUnits(
              (userStats as UserStats).profitShareClaimed || 0n,
              decimals.iAsset
            )
          ).toFixed(2),
        }
      : { deposited: "0.00", withdrawn: "0.00", streak: 0, claimed: "0.00" };

  const unclaimedProfit = profitEarned
    ? Number(formatEther(profitEarned as bigint)).toFixed(4)
    : "0";

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-10">
          <div className="animate-pulse">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Reports & Analytics</h1>
            <p className="text-sm opacity-70">
              Track your halal savings journey and platform metrics
            </p>
          </div>
          <button
            onClick={refreshAllData}
            className="btn btn-outline"
            disabled={!address}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Protocol Overview */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Protocol Overview</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Total Value Locked</div>
              <div className="text-2xl font-bold">{formattedTVL}</div>
              <div className="text-xs opacity-60 mt-1">iUSDC in savings</div>
            </div>

            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Total Savers</div>
              <div className="text-2xl font-bold">{totalUsersCount}</div>
              <div className="text-xs opacity-60 mt-1">Active users</div>
            </div>

            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Share Price</div>
              <div className="text-2xl font-bold">{formattedSharePrice}</div>
              <div className="text-xs opacity-60 mt-1">USDC per iUSDC</div>
            </div>

            <div className="card p-5">
              <div className="text-xs opacity-60 mb-1">Halal Yield</div>
              <div className="text-2xl font-bold text-blueribbon">Active</div>
              <div className="text-xs opacity-60 mt-1">Profit-sharing</div>
            </div>
          </div>
        </section>

        {isConnected ? (
          <>
            {/* Personal Portfolio */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="card p-5">
                  <div className="text-xs opacity-60 mb-1">USDC Balance</div>
                  <div className="text-2xl font-bold">
                    {formattedUsdcBalance}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    Available to deposit
                  </div>
                </div>

                <div className="card p-5">
                  <div className="text-xs opacity-60 mb-1">iUSDC Balance</div>
                  <div className="text-2xl font-bold">
                    {formattedIusdcBalance}
                  </div>
                  <div className="text-xs text-blueribbon mt-1">
                    ≈ ${iusdcValueInUsdc} USDC
                  </div>
                </div>

                <div className="card p-5">
                  <div className="text-xs opacity-60 mb-1">MINA Balance</div>
                  <div className="text-2xl font-bold">
                    {formattedMinaBalance}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    Profit-share tokens
                  </div>
                </div>
              </div>
            </section>

            {/* Savings Goals Summary */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Savings Goals</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Active Goal */}
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">Active Goal</h3>
                  {progress ? (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="opacity-70">Goal Type</span>
                          <span className="font-semibold">
                            {progress.goalType}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="opacity-70">Goal Name</span>
                          <span className="font-semibold">{progress.name}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="opacity-70">Progress</span>
                          <span className="font-semibold">
                            {progress.percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blueribbon transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-line">
                        <div>
                          <div className="text-xs opacity-60">Saved</div>
                          <div className="text-lg font-bold">
                            {progress.saved.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs opacity-60">Target</div>
                          <div className="text-lg font-bold">
                            {progress.target.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm opacity-70 mb-3">No active goal</p>
                      <a href="/savings" className="btn btn-primary btn-sm">
                        Create Goal
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats Card */}
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">Statistics</h3>
                  {stats ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Total Deposited</span>
                        <span className="font-semibold">
                          {stats.deposited} iUSDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Total Withdrawn</span>
                        <span className="font-semibold">
                          {stats.withdrawn} iUSDC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Saving Streak</span>
                        <span className="font-semibold">
                          {stats.streak} months
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Profit Claimed</span>
                        <span className="font-semibold">
                          {stats.claimed} MINA
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-line">
                        <div className="bg-blueribbon/5 p-3 rounded-lg">
                          <div className="text-xs opacity-70 mb-1">
                            Unclaimed Profit
                          </div>
                          <div className="text-xl font-bold text-blueribbon">
                            {unclaimedProfit} MINA
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm opacity-70">No activity yet</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Performance Breakdown */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Performance</h2>
              <div className="card p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Vault Performance */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">
                      Vault Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Share Price Growth</span>
                        <span className="font-semibold text-blueribbon">
                          {sharePrice
                            ? (
                                (Number(formatEther(sharePrice as bigint)) -
                                  1) *
                                100
                              ).toFixed(2)
                            : "0"}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Your Holdings Value</span>
                        <span className="font-semibold">
                          ${iusdcValueInUsdc}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Yield Type</span>
                        <span className="font-semibold text-blueribbon">
                          Halal ✓
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Performance */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">
                      Savings Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Goal Completion</span>
                        <span className="font-semibold">
                          {progress ? `${progress.percentage}%` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Profit-Share Earned</span>
                        <span className="font-semibold text-blueribbon">
                          {unclaimedProfit} MINA
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-70">Consistency</span>
                        <span className="font-semibold">
                          {stats?.streak || 0} month streak
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/"
                  className="card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl mb-2">💵</div>
                  <div className="font-semibold mb-1">Deposit USDC</div>
                  <div className="text-xs opacity-70">Convert to iUSDC</div>
                </a>

                <a
                  href="/savings"
                  className="card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold mb-1">Set Goal</div>
                  <div className="text-xs opacity-70">Create savings goal</div>
                </a>

                <a
                  href="/savings"
                  className="card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-semibold mb-1">Make Deposit</div>
                  <div className="text-xs opacity-70">Add to your goal</div>
                </a>

                <a
                  href="/savings"
                  className="card p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl mb-2">🎁</div>
                  <div className="font-semibold mb-1">Claim Profit</div>
                  <div className="text-xs opacity-70">
                    {unclaimedProfit} MINA available
                  </div>
                </a>
              </div>
            </section>
          </>
        ) : (
          <div className="card p-12 text-center">
            <h3 className="text-xl font-semibold mb-3">Connect Your Wallet</h3>
            <p className="text-sm opacity-70 mb-6">
              Connect your wallet to view your personalized reports and
              analytics
            </p>
          </div>
        )}
      </main>
    </>
  );
}
