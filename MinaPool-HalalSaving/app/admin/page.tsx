'use client';

import { useState } from 'react';
import { useAccount, useConfig, useWriteContract } from 'wagmi';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';
import { parseUnits, formatUnits } from 'viem';
import Header from '@/app/components/Header';
import { ERC20_ABI } from '@/lib/abi/erc20';
import { HALAL_SAVINGS_ABI } from '@/lib/abi/halal-savings';

const savings = process.env.NEXT_PUBLIC_SAVINGS_ADDRESS as `0x${string}`;
const mina = process.env.NEXT_PUBLIC_REWARD_TOKEN as `0x${string}`;

export default function AdminPage() {
  const { address } = useAccount();
  const wagmiConfig = useConfig();
  const { writeContractAsync } = useWriteContract();

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [fundAmount, setFundAmount] = useState('10000');
  const [balances, setBalances] = useState({ userMina: 0n, contractMina: 0n });

  const loadBalances = async () => {
    if (!address) return;

    try {
      const [userBal, contractBal] = await Promise.all([
        readContract(wagmiConfig, {
          address: mina,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [address],
        }),
        readContract(wagmiConfig, {
          address: mina,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [savings],
        }),
      ]);

      setBalances({ userMina: userBal as bigint, contractMina: contractBal as bigint });
    } catch (err) {
      console.error('Error loading balances:', err);
    }
  };

  const handleFundPool = async () => {
    if (!address || !fundAmount) return;

    setBusy(true);
    setMessage(null);

    try {
      const amount = parseUnits(fundAmount, 18);

      // Check user balance
      if (balances.userMina < amount) {
        setMessage({ type: 'error', text: 'Insufficient MINA balance' });
        setBusy(false);
        return;
      }

      // Approve MINA → Contract
      const allowance = (await readContract(wagmiConfig, {
        address: mina,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, savings],
      })) as bigint;

      if (allowance < amount) {
        const approveHash = await writeContractAsync({
          address: mina,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [savings, amount],
        });
        await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
        setMessage({ type: 'success', text: 'Approved! Now funding...' });
      }

      // Fund the pool
      const fundHash = await writeContractAsync({
        address: savings,
        abi: HALAL_SAVINGS_ABI,
        functionName: 'fundProfitPool',
        args: [amount],
      });

      const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: fundHash });

      if (receipt.status === 'success') {
        setMessage({ type: 'success', text: `Successfully funded ${fundAmount} MINA! 🎉` });
        setFundAmount('');
        setTimeout(() => {
          loadBalances();
          setMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Fund error:', err);
      setMessage({ type: 'error', text: err?.shortMessage || err?.message || 'Funding failed' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="card p-6">
          <h1 className="text-2xl font-semibold mb-6">Admin: Fund Profit Pool</h1>

          {message && (
            <div
              className={`p-3 rounded-md border text-sm mb-4 ${
                message.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button onClick={loadBalances} className="btn btn-outline mb-4">
            Refresh Balances
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-mist p-4 rounded-lg">
              <div className="text-sm opacity-70">Your MINA Balance</div>
              <div className="text-2xl font-bold">
                {Number(formatUnits(balances.userMina, 18)).toFixed(2)}
              </div>
            </div>
            <div className="bg-mist p-4 rounded-lg">
              <div className="text-sm opacity-70">Contract MINA Balance</div>
              <div className="text-2xl font-bold">
                {Number(formatUnits(balances.contractMina, 18)).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount to Fund (MINA)</label>
              <input
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="10000"
                className="input w-full"
                type="number"
              />
              <p className="text-xs opacity-70 mt-1">
                Recommended: 10,000+ MINA to cover profit claims
              </p>
            </div>

            <button
              onClick={handleFundPool}
              disabled={busy || !fundAmount || !address}
              className="w-full btn btn-primary"
            >
              {busy ? 'Processing...' : 'Fund Profit Pool'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm">
            <strong>ℹ️ What does this do?</strong>
            <p className="mt-2 opacity-80">
              This sends MINA tokens to the contract so it can pay out profit-share to users.
              Without MINA in the contract, users can't claim their earned profits.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}