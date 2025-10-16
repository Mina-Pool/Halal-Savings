"use client";

import { useEffect, useState } from "react";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";
import { formatUnits, parseUnits } from "viem";
import Header from "@/app/app/components/Header";
import { ERC20_ABI } from "@/lib/abi/erc20";
import { HALAL_SAVINGS_V2_ABI, CONTRACTS } from "@/contracts/config";
import { VAULT_ABI } from "@/lib/abi/vault";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

const savings = CONTRACTS.HALAL_SAVINGS_V2;
const asset = CONTRACTS.MOCK_USDC;
const vault = CONTRACTS.IUSDC_VAULT;
const iAsset = vault;

const GOAL_TYPES = [
  { id: 0, name: "Hajj", desc: "Save for pilgrimage", min: 7000, icon: "🕋" },
  { id: 1, name: "Umrah", desc: "Visit the holy land", min: 2500, icon: "🕌" },
  { id: 2, name: "Qurban", desc: "Annual sacrifice", min: 500, icon: "🐑" },
  {
    id: 3,
    name: "Education",
    desc: "Islamic education",
    min: 1000,
    icon: "📚",
  },
  { id: 4, name: "Wedding", desc: "Halal wedding", min: 3000, icon: "💍" },
  { id: 5, name: "General", desc: "General savings", min: 100, icon: "💰" },
];

// Type definitions
type GoalData = {
  goalId: number;
  goalType: number;
  targetAmount: bigint;
  totalSaved: bigint;
  targetDate: bigint;
  monthlyCommitment: bigint;
  startDate: bigint;
  isActive: boolean;
  isPaused: boolean;
  customName: string;
};

type ContractGoal = {
  goalId: bigint;
  goalType: number;
  targetAmount: bigint;
  totalSaved: bigint;
  targetDate: bigint;
  monthlyCommitment: bigint;
  startDate: bigint;
  isActive: boolean;
  isCompleted: boolean;
  customName: string;
};

// Helper to format goal from contract
const formatGoalData = (
  goal: ContractGoal,
  goalId: number
): GoalData | null => {
  if (!goal || goal.targetAmount === 0n) return null;

  return {
    goalId,
    goalType: Number(goal.goalType),
    targetAmount: goal.targetAmount,
    totalSaved: goal.totalSaved,
    targetDate: goal.targetDate,
    monthlyCommitment: goal.monthlyCommitment,
    startDate: goal.startDate,
    isActive: goal.isActive,
    isPaused: false,
    customName: goal.customName || "",
  };
};

export default function SavingsPageV2() {
  const { address } = useAccount();
  const wagmiConfig = useConfig();
  const { writeContractAsync } = useWriteContract();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [view, setView] = useState<"dashboard" | "create" | "deposit">(
    "dashboard"
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Form states
  const [selectedGoalType, setSelectedGoalType] = useState(0);
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlyCommit, setMonthlyCommit] = useState("");
  const [goalName, setGoalName] = useState("");
  const [depositUSDC, setDepositUSDC] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<number>(0);

  // Data states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawGoalId, setWithdrawGoalId] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawType, setWithdrawType] = useState<"partial" | "all">("all");
  const [activeGoals, setActiveGoals] = useState<GoalData[]>([]);
  const [completedGoals, setCompletedGoals] = useState<GoalData[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [profitData, setProfitData] = useState<bigint>(0n);
  const [balances, setBalances] = useState({ usdc: 0n, iusdc: 0n });
  const [decimals, setDecimals] = useState({ asset: 6, iAsset: 18 });
  const [sharePrice, setSharePrice] = useState<bigint>(1_000000000000000000n);

  // Load all data
  const loadData = async () => {
    if (!address) return;

    try {
      const [assetDec, iAssetDec, sp] = await Promise.all([
        readContract(wagmiConfig, {
          address: asset,
          abi: ERC20_ABI,
          functionName: "decimals",
        }),
        readContract(wagmiConfig, {
          address: iAsset,
          abi: ERC20_ABI,
          functionName: "decimals",
        }),
        readContract(wagmiConfig, {
          address: vault,
          abi: VAULT_ABI,
          functionName: "sharePrice",
        }),
      ]);

      setDecimals({ asset: Number(assetDec), iAsset: Number(iAssetDec) });
      setSharePrice(sp as bigint);

      // Get active goals
      const activeGoalsData = (await readContract(wagmiConfig, {
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "getActiveGoals",
        args: [address],
      })) as ContractGoal[];

      // Get completed goals
      const completedGoalsData = (await readContract(wagmiConfig, {
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "getCompletedGoals",
        args: [address],
      })) as ContractGoal[];

      // Fetch full goal data for active goals
      const activeGoalsDetails = activeGoalsData.map((goal) =>
        formatGoalData(goal, Number(goal.goalId))
      );

      // Fetch full goal data for completed goals
      const completedGoalsDetails = completedGoalsData.map((goal) =>
        formatGoalData(goal, Number(goal.goalId))
      );

      setActiveGoals(
        activeGoalsDetails.filter((g): g is GoalData => g !== null)
      );
      setCompletedGoals(
        completedGoalsDetails.filter((g): g is GoalData => g !== null)
      );

      // Set default selected goal if exists
      if (activeGoalsDetails.length > 0 && activeGoalsDetails[0]) {
        setSelectedGoalId(activeGoalsDetails[0].goalId);
      }

      // Get other data
      const [userStatsData, profit, usdcBal, iusdcBal] = await Promise.all([
        readContract(wagmiConfig, {
          address: savings,
          abi: HALAL_SAVINGS_V2_ABI,
          functionName: "userStats",
          args: [address],
        }),
        readContract(wagmiConfig, {
          address: savings,
          abi: HALAL_SAVINGS_V2_ABI,
          functionName: "earned",
          args: [address],
        }),
        readContract(wagmiConfig, {
          address: asset,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
        readContract(wagmiConfig, {
          address: iAsset,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        }),
      ]);

      // console.log("📊 Raw stats from contract:", userStatsData);
      // console.log("📊 Stats type:", typeof userStatsData);
      // console.log(
      //   "📊 Stats keys:",
      //   userStatsData ? Object.keys(userStatsData) : "null"
      // );

      setStatsData(userStatsData);
      setProfitData(profit as bigint);
      setBalances({ usdc: usdcBal as bigint, iusdc: iusdcBal as bigint });
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [address]);

  // Get selected goal details
  const selectedGoal = activeGoals.find((g) => g.goalId === selectedGoalId);

  // Stats display

  const stats =
    statsData && Array.isArray(statsData) && statsData.length >= 5
      ? {
          deposited: Number(
            formatUnits(statsData[0] || 0n, decimals.iAsset)
          ).toFixed(2),
          withdrawn: Number(
            formatUnits(statsData[1] || 0n, decimals.iAsset)
          ).toFixed(2),
          streak: Number(statsData[2] || 0),
          claimed: Number(
            formatUnits(statsData[4] || 0n, decimals.iAsset)
          ).toFixed(2),
        }
      : { deposited: "0.00", withdrawn: "0.00", streak: 0, claimed: "0.00" };

  // Balances display
  const displayBalances = {
    usdc: Number(formatUnits(balances.usdc, decimals.asset)).toFixed(4),
    iusdc: Number(formatUnits(balances.iusdc, decimals.iAsset)).toFixed(4),
    profit: Number(formatUnits(profitData, decimals.iAsset)).toFixed(4),
  };

  // CREATE GOAL
  const handleCreateGoal = async () => {
    if (!address || !targetAmount || !monthlyCommit) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    // Validation
    const minTarget = GOAL_TYPES[selectedGoalType].min;
    if (Number(targetAmount) < minTarget) {
      setMessage({
        type: "error",
        text: `Minimum target for ${GOAL_TYPES[selectedGoalType].name} is ${minTarget} iUSDC`,
      });
      return;
    }

    if (Number(monthlyCommit) < 0.1) {
      setMessage({
        type: "error",
        text: "Minimum monthly commitment is 0.1 iUSDC",
      });
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const targetDate = Math.floor(Date.now() / 1000) + 2 * 365 * 24 * 60 * 60;

      // Use iUSDC decimals (18) for amounts
      const targetBN = parseUnits(targetAmount, decimals.iAsset);
      const monthlyBN = parseUnits(monthlyCommit, decimals.iAsset);

      const name =
        goalName ||
        `${GOAL_TYPES[selectedGoalType].name} ${new Date().getFullYear()}`;

      console.log("Creating goal with params:", {
        goalType: selectedGoalType,
        targetAmount: targetBN.toString(),
        targetDate,
        monthlyCommitment: monthlyBN.toString(),
        customName: name,
      });

      const hash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "createGoal",
        args: [selectedGoalType, targetBN, BigInt(targetDate), monthlyBN, name],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

      if (receipt.status === "success") {
        setMessage({ type: "success", text: "Goal created successfully! 🎉" });
        setTargetAmount("");
        setMonthlyCommit("");
        setGoalName("");

        setTimeout(async () => {
          await loadData();
          setView("dashboard");
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: "error", text: "Transaction failed" });
      }
    } catch (err: any) {
      console.error("Create goal error:", err);

      let errorMsg = "Failed to create goal";

      if (err.message?.includes("insufficient funds")) {
        errorMsg =
          "Insufficient funds for gas fee. Get Base Sepolia ETH from faucet.";
      } else if (err.message?.includes("user rejected")) {
        errorMsg = "Transaction cancelled by user";
      } else if (err.shortMessage) {
        errorMsg = err.shortMessage;
      }

      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setBusy(false);
    }
  };

  // DEPOSIT
  const handleDeposit = async () => {
    if (!address || !depositUSDC || !selectedGoal) {
      setMessage({
        type: "error",
        text: "Please select a goal and enter amount",
      });
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const amount = parseUnits(depositUSDC, decimals.iAsset);

      if (balances.iusdc < amount) {
        setMessage({ type: "error", text: "Insufficient iUSDC balance" });
        setBusy(false);
        return;
      }

      // Approve iUSDC
      const iAllowance = (await readContract(wagmiConfig, {
        address: iAsset,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, savings],
      })) as bigint;

      if (iAllowance < amount) {
        const hash = await writeContractAsync({
          address: iAsset,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [savings, amount],
        });
        await waitForTransactionReceipt(wagmiConfig, { hash });
      }

      // Deposit to specific goal
      const savingsHash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "deposit",
        args: [selectedGoalId, amount],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: savingsHash,
      });

      if (receipt.status === "success") {
        setMessage({ type: "success", text: "Deposit successful! ✅" });
        setDepositUSDC("");

        setTimeout(async () => {
          await loadData();
          setMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Deposit error:", err);
      setMessage({
        type: "error",
        text: err?.shortMessage || err?.message || "Deposit failed",
      });
    } finally {
      setBusy(false);
    }
  };

  // PAUSE GOAL
  const handlePauseGoal = async (goalId: number) => {
    if (!address) return;

    setBusy(true);
    setMessage(null);

    try {
      const hash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "pauseGoal",
        args: [goalId],
      });

      await waitForTransactionReceipt(wagmiConfig, { hash });

      setMessage({ type: "success", text: "Goal paused" });
      setTimeout(async () => {
        await loadData();
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.shortMessage || err?.message || "Failed to pause goal",
      });
    } finally {
      setBusy(false);
    }
  };

  // RESUME GOAL
  const handleResumeGoal = async (goalId: number) => {
    if (!address) return;

    setBusy(true);
    setMessage(null);

    try {
      const hash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "resumeGoal",
        args: [goalId],
      });

      await waitForTransactionReceipt(wagmiConfig, { hash });

      setMessage({ type: "success", text: "Goal resumed" });
      setTimeout(async () => {
        await loadData();
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.shortMessage || err?.message || "Failed to resume goal",
      });
    } finally {
      setBusy(false);
    }
  };

  // CLAIM PROFIT
  const handleClaimProfit = async () => {
    if (!address) return;

    setBusy(true);
    setMessage(null);

    try {
      const hash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "claimProfit",
        args: [],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash,
        timeout: 60_000,
      });

      if (receipt.status === "success") {
        setMessage({
          type: "success",
          text: `Claimed ${displayBalances.profit} MINA successfully! 🎉`,
        });
        setTimeout(async () => {
          await loadData();
          setMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Claim error:", err);
      setMessage({
        type: "error",
        text: err?.shortMessage || err?.message || "Claim failed",
      });
    } finally {
      setBusy(false);
    }
  };

  // WITHDRAW (Updated for partial withdrawal)
  const handleWithdraw = async (goalId: number, amount?: string) => {
    if (!address) return;

    setBusy(true);
    setMessage(null);

    try {
      const goal = activeGoals.find((g) => g.goalId === goalId);
      if (!goal) {
        setMessage({ type: "error", text: "Goal not found" });
        setBusy(false);
        return;
      }

      // Determine withdraw amount
      let withdrawAmountBN: bigint;

      if (!amount || amount === "") {
        // Withdraw ALL
        withdrawAmountBN = goal.totalSaved;
      } else {
        // Withdraw specific amount
        withdrawAmountBN = parseUnits(amount, decimals.iAsset);

        if (withdrawAmountBN > goal.totalSaved) {
          setMessage({ type: "error", text: "Amount exceeds goal balance" });
          setBusy(false);
          return;
        }
      }

      // Call contract withdraw
      const withdrawHash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_V2_ABI,
        functionName: "withdraw",
        args: [goalId, withdrawAmountBN],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: withdrawHash,
      });

      if (receipt.status !== "success") {
        setMessage({ type: "error", text: "Withdrawal failed" });
        setBusy(false);
        return;
      }

      // Wait for state update
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get updated iUSDC balance
      const iUsdcBalance = (await readContract(wagmiConfig, {
        address: iAsset,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      })) as bigint;

      // If user wants to convert to USDC (optional step)
      if (iUsdcBalance > 0n && withdrawAmountBN === goal.totalSaved) {
        // Only auto-convert if withdrawing all from goal
        const redeemHash = await writeContractAsync({
          address: vault,
          abi: VAULT_ABI,
          functionName: "withdraw",
          args: [withdrawAmountBN],
        });

        await waitForTransactionReceipt(wagmiConfig, { hash: redeemHash });

        setMessage({
          type: "success",
          text: "🎉 Withdrawal complete! Converted to USDC!",
        });
      } else {
        setMessage({
          type: "success",
          text: `✅ Withdrew ${formatUnits(
            withdrawAmountBN,
            decimals.iAsset
          )} iUSDC successfully!`,
        });
      }

      // Close modal and refresh
      setShowWithdrawModal(false);
      setWithdrawAmount("");

      setTimeout(async () => {
        await loadData();
        setMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error("Withdraw error:", err);
      setMessage({
        type: "error",
        text: err?.shortMessage || err?.message || "Withdrawal failed",
      });
    } finally {
      setBusy(false);
    }
  };

  // Calculate progress for a goal
  const calculateProgress = (goal: GoalData | null) => {
    if (!goal) return null;

    const saved = Number(formatUnits(goal.totalSaved, decimals.iAsset));
    const target = Number(formatUnits(goal.targetAmount, decimals.iAsset));
    const percentage = Math.min(Math.round((saved / target) * 100), 100);

    return { saved, target, percentage };
  };

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
      <main className="mx-auto max-w-6xl px-5 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Halal Savings Goals V2</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView("dashboard")}
              className={
                view === "dashboard" ? "btn btn-primary" : "btn btn-outline"
              }
            >
              Dashboard
            </button>
            <button
              onClick={() => setView("deposit")}
              className={
                view === "deposit" ? "btn btn-primary" : "btn btn-outline"
              }
              disabled={activeGoals.length === 0}
            >
              Deposit
            </button>
            <button
              onClick={() => setView("create")}
              className={
                view === "create" ? "btn btn-primary" : "btn btn-outline"
              }
            >
              Create Goal
            </button>
            <button
              onClick={loadData}
              className="btn btn-outline"
              disabled={busy}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`p-3 rounded-md border text-sm ${
              message.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Balances */}
        {address && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card p-4 bg-mist">
              <div className="text-sm">
                <span className="opacity-70">USDC:</span>{" "}
                <span className="font-semibold">{displayBalances.usdc}</span>
              </div>
            </div>
            <div className="card p-4 bg-mist">
              <div className="text-sm">
                <span className="opacity-70">iUSDC:</span>{" "}
                <span className="font-semibold">{displayBalances.iusdc}</span>
              </div>
            </div>
            <div className="card p-4 bg-mist">
              <div className="text-sm">
                <span className="opacity-70">Active Goals:</span>{" "}
                <span className="font-semibold">{activeGoals.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <div className="space-y-6">
            {/* Active Goals */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Active Goals</h3>
              {activeGoals.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.map((goal) => {
                    const progress = calculateProgress(goal);
                    const goalTypeInfo = GOAL_TYPES[goal.goalType];

                    return (
                      <div key={goal.goalId} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-2xl mb-1">
                              {goalTypeInfo.icon}
                            </div>
                            <h4 className="font-semibold">
                              {goal.customName || goalTypeInfo.name}
                            </h4>
                            <p className="text-xs opacity-70">
                              {goalTypeInfo.desc}
                            </p>
                          </div>
                          {goal.isPaused && (
                            <span className="badge bg-yellow-100 text-yellow-700">
                              Paused
                            </span>
                          )}
                        </div>

                        {progress && (
                          <>
                            <div className="mb-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="opacity-70">Progress</span>
                                <span className="font-semibold text-blueribbon">
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

                            <div className="space-y-2 text-xs mb-4">
                              <div className="flex justify-between">
                                <span className="opacity-70">Saved</span>
                                <span className="font-semibold">
                                  {progress.saved.toFixed(2)} iUSDC
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-70">Target</span>
                                <span className="font-semibold">
                                  {progress.target.toFixed(2)} iUSDC
                                </span>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          {goal.isPaused ? (
                            <button
                              onClick={() => handleResumeGoal(goal.goalId)}
                              disabled={busy}
                              className="btn btn-outline text-xs flex-1"
                            >
                              Resume
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePauseGoal(goal.goalId)}
                              disabled={busy}
                              className="btn btn-outline text-xs flex-1"
                            >
                              Pause
                            </button>
                          )}
                          {/*Early withdrawal button */}
                          {progress && progress.saved > 0 && (
                            <button
                              onClick={() => {
                                setWithdrawGoalId(goal.goalId);
                                setShowWithdrawModal(true);
                              }}
                              disabled={busy}
                              className="btn btn-primary text-xs flex-1"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-sm opacity-70 mb-4">No active goals yet</p>
                  <button
                    onClick={() => setView("create")}
                    className="btn btn-primary"
                  >
                    Create Your First Goal
                  </button>
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Total Deposited</span>
                  <span className="font-semibold">{stats.deposited} iUSDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Total Withdrawn</span>
                  <span className="font-semibold">{stats.withdrawn} iUSDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Saving Streak</span>
                  <span className="font-semibold">{stats.streak} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Profit Claimed</span>
                  <span className="font-semibold">{stats.claimed} MINA</span>
                </div>
              </div>

              <div className="bg-mist p-4 rounded-lg mb-4">
                <div className="text-xs opacity-60 mb-1">
                  Unclaimed Profit-Share
                </div>
                <div className="text-2xl font-bold text-blueribbon">
                  {displayBalances.profit} MINA
                </div>
                <div className="text-xs opacity-70 mt-1">
                  From halal business activities
                </div>
              </div>

              <button
                onClick={handleClaimProfit}
                disabled={busy || Number(displayBalances.profit) === 0}
                className="w-full btn btn-primary"
              >
                {busy ? "Processing…" : "Claim Profit-Share"}
              </button>
            </div>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Completed Goals 🎉
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedGoals.map((goal) => {
                    const goalTypeInfo = GOAL_TYPES[goal.goalType];
                    const saved = Number(
                      formatUnits(goal.totalSaved, decimals.iAsset)
                    );

                    return (
                      <div
                        key={goal.goalId}
                        className="card p-5 bg-green-50 border-green-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-2xl mb-1">
                              {goalTypeInfo.icon}
                            </div>
                            <h4 className="font-semibold">
                              {goal.customName || goalTypeInfo.name}
                            </h4>
                            <p className="text-xs opacity-70">Completed ✅</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="opacity-70">Total Saved: </span>
                          <span className="font-semibold text-green-700">
                            {saved.toFixed(2)} iUSDC
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DEPOSIT VIEW */}
        {view === "deposit" && (
          <div className="max-w-xl mx-auto card p-6">
            <h3 className="text-lg font-semibold mb-4">Make a Deposit</h3>
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {/* Goal Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Goal
                  </label>
                  <select
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(Number(e.target.value))}
                    className="input w-full"
                  >
                    {activeGoals.map((goal) => {
                      const goalTypeInfo = GOAL_TYPES[goal.goalType];
                      const progress = calculateProgress(goal);
                      return (
                        <option key={goal.goalId} value={goal.goalId}>
                          {goalTypeInfo.icon}{" "}
                          {goal.customName || goalTypeInfo.name} -{" "}
                          {progress?.percentage}% complete
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Selected Goal Info */}
                {selectedGoal && (
                  <div className="bg-mist p-4 rounded-lg">
                    <div className="text-sm opacity-70 mb-1">Current Goal</div>
                    <div className="font-semibold">
                      {selectedGoal.customName ||
                        GOAL_TYPES[selectedGoal.goalType].name}
                    </div>
                    <div className="text-sm opacity-70 mt-1">
                      {calculateProgress(selectedGoal)?.percentage}% complete
                    </div>
                    {selectedGoal.isPaused && (
                      <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                        ⚠️ This goal is currently paused
                      </div>
                    )}
                  </div>
                )}

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (iUSDC)
                  </label>
                  <input
                    value={depositUSDC}
                    onChange={(e) => setDepositUSDC(e.target.value)}
                    placeholder="Enter amount in iUSDC"
                    className="input w-full"
                    type="number"
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Available: {displayBalances.iusdc} iUSDC
                  </p>
                </div>

                {/* Deposit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={
                    busy || !depositUSDC || (selectedGoal?.isPaused ?? false)
                  }
                  className="w-full btn btn-primary"
                >
                  {busy ? "Processing…" : "Deposit to Goal"}
                </button>

                {selectedGoal?.isPaused && (
                  <p className="text-xs text-center opacity-70">
                    Resume the goal first to make deposits
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm opacity-70 mb-4">
                  Create a goal first to start depositing
                </p>
                <button
                  onClick={() => setView("create")}
                  className="btn btn-primary"
                >
                  Create Goal
                </button>
              </div>
            )}
          </div>
        )}

        {/* CREATE VIEW */}
        {view === "create" && (
          <div className="max-w-2xl mx-auto card p-6">
            <h3 className="text-lg font-semibold mb-4">
              Create New Savings Goal
            </h3>
            <div className="space-y-6">
              {/* Goal Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Goal Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GOAL_TYPES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoalType(g.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedGoalType === g.id
                          ? "border-blueribbon bg-blueribbon/5"
                          : "border-line hover:border-slate"
                      }`}
                    >
                      <div className="text-2xl mb-1">{g.icon}</div>
                      <div className="font-semibold text-sm">{g.name}</div>
                      <div className="text-xs opacity-70">
                        Min: {g.min} iUSDC
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Goal Name (Optional)
                </label>
                <input
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Hajj 2026"
                  className="input w-full"
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Amount (iUSDC)
                </label>
                <input
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder={GOAL_TYPES[selectedGoalType].min.toString()}
                  className="input w-full"
                  type="number"
                />
                <p className="text-xs opacity-70 mt-1">
                  Minimum: {GOAL_TYPES[selectedGoalType].min} iUSDC
                </p>
              </div>

              {/* Monthly Commitment */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Commitment (iUSDC)
                </label>
                <input
                  value={monthlyCommit}
                  onChange={(e) => setMonthlyCommit(e.target.value)}
                  placeholder="50"
                  className="input w-full"
                  type="number"
                />
                <p className="text-xs opacity-70 mt-1">
                  Minimum: 0.1 iUSDC/month
                </p>
              </div>

              {/* Timeline Calculator */}
              {targetAmount && monthlyCommit && Number(monthlyCommit) > 0 && (
                <div className="bg-blueribbon/5 border border-blueribbon/20 rounded-lg p-4">
                  <div className="text-sm font-medium mb-1">
                    Projected Timeline
                  </div>
                  <div className="text-sm opacity-70">
                    You'll reach {Number(targetAmount).toLocaleString()} iUSDC
                    in approximately{" "}
                    <span className="font-semibold text-blueribbon">
                      {Math.ceil(Number(targetAmount) / Number(monthlyCommit))}{" "}
                      months
                    </span>
                  </div>
                </div>
              )}

              {/* Shariah Info */}
              <div className="bg-mist p-4 rounded-lg">
                <p className="text-xs font-semibold text-blueribbon mb-1">
                  Shariah-Compliant ✅
                </p>
                <p className="text-xs opacity-70">
                  Your savings earn profit-share from halal business activities,
                  not interest (riba).
                </p>
              </div>

              {/* Debug Info for Troubleshooting */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-xs">
                <p className="font-semibold text-yellow-800 mb-2">
                  📋 Transaction Details:
                </p>
                <div className="space-y-1 font-mono text-yellow-700">
                  <div>
                    Contract: {savings.slice(0, 10)}...{savings.slice(-8)}
                  </div>
                  <div>Network: Base Sepolia (Chain ID: 84532)</div>
                  <div>Your ETH Balance: Check wallet for gas</div>
                  {targetAmount && (
                    <div>
                      Target:{" "}
                      {parseUnits(targetAmount, decimals.iAsset).toString()} wei
                    </div>
                  )}
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateGoal}
                disabled={busy || !targetAmount || !monthlyCommit}
                className="w-full btn btn-primary"
              >
                {busy ? "Processing…" : "Create Goal"}
              </button>
            </div>
          </div>
        )}
        {/* WITHDRAW MODAL */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Withdraw from Goal</h3>
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount("");
                  }}
                  className="text-2xl hover:opacity-70"
                >
                  ×
                </button>
              </div>

              {/* Goal Info */}
              {(() => {
                const goal = activeGoals.find(
                  (g) => g.goalId === withdrawGoalId
                );
                const progress = goal ? calculateProgress(goal) : null;

                if (!goal || !progress) return null;

                return (
                  <>
                    <div className="bg-mist p-4 rounded-lg">
                      <div className="text-sm opacity-70 mb-1">
                        {GOAL_TYPES[goal.goalType].icon}{" "}
                        {goal.customName || GOAL_TYPES[goal.goalType].name}
                      </div>
                      <div className="text-xl font-bold text-blueribbon">
                        {progress.saved.toFixed(2)} iUSDC
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        Available to withdraw
                      </div>
                    </div>

                    {/* Withdrawal Type Selection */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">
                        Choose withdrawal amount
                      </label>

                      {/* Quick Option: Withdraw All */}
                      <button
                        onClick={() => {
                          setWithdrawType("all");
                          setWithdrawAmount("");
                        }}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          withdrawType === "all"
                            ? "border-blueribbon bg-blueribbon/5"
                            : "border-line hover:border-slate"
                        }`}
                      >
                        <div className="font-semibold">Withdraw All</div>
                        <div className="text-sm opacity-70">
                          Get all {progress.saved.toFixed(2)} iUSDC (converts to
                          USDC)
                        </div>
                      </button>

                      {/* Custom Amount Option */}
                      <button
                        onClick={() => setWithdrawType("partial")}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          withdrawType === "partial"
                            ? "border-blueribbon bg-blueribbon/5"
                            : "border-line hover:border-slate"
                        }`}
                      >
                        <div className="font-semibold">Custom Amount</div>
                        <div className="text-sm opacity-70">
                          Withdraw specific amount (goal stays active)
                        </div>
                      </button>

                      {/* Amount Input for Partial */}
                      {withdrawType === "partial" && (
                        <div className="pt-2">
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="input w-full"
                            max={progress.saved}
                            step="0.01"
                          />
                          <p className="text-xs opacity-70 mt-1">
                            Max: {progress.saved.toFixed(2)} iUSDC
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Warning for partial withdrawal */}
                    {withdrawType === "partial" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs">
                        ⚠️ Partial withdrawals keep your goal active. You'll
                        receive iUSDC (not USDC). Convert manually if needed.
                      </div>
                    )}

                    {/* Confirm Button */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setShowWithdrawModal(false);
                          setWithdrawAmount("");
                        }}
                        className="btn btn-outline flex-1"
                        disabled={busy}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (withdrawType === "all") {
                            handleWithdraw(withdrawGoalId);
                          } else {
                            if (
                              !withdrawAmount ||
                              Number(withdrawAmount) <= 0
                            ) {
                              setMessage({
                                type: "error",
                                text: "Please enter valid amount",
                              });
                              return;
                            }
                            handleWithdraw(withdrawGoalId, withdrawAmount);
                          }
                        }}
                        disabled={
                          busy ||
                          (withdrawType === "partial" &&
                            (!withdrawAmount || Number(withdrawAmount) <= 0))
                        }
                        className="btn btn-primary flex-1"
                      >
                        {busy ? "Processing..." : "Confirm Withdrawal"}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
