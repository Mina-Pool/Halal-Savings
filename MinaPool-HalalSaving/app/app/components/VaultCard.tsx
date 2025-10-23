'use client';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import { VAULT_ABI } from '@/lib/abi/vault';

export default function VaultCard({
  title,
  token,
  sharePriceAddr,
  onDepositClick,
  onWithdrawClick,
  price,
}: {
  title: string;
  token: string;
  sharePriceAddr: `0x${string}`;
  onDepositClick: () => void;
  onWithdrawClick: () => void;
  price?: bigint | undefined;
}) {
  const { data: sp } = useReadContract({
    address: sharePriceAddr,
    abi: VAULT_ABI,
    functionName: 'sharePrice',
  });

  const displayed = price ?? (sp as bigint | undefined);

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="badge mb-2">Yield</div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm opacity-70 mt-1">{token}</p>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-60">Share price</div>
          <div className="text-2xl font-bold">
            {displayed ? Number(formatEther(displayed)).toFixed(2) : '—'}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={onDepositClick} className="btn btn-primary">Deposit</button>
        <button onClick={onWithdrawClick} className="btn btn-outline">Withdraw</button>
      </div>
    </div>
  );
}
