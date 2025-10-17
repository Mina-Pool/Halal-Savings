'use client';

import { useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Abi } from 'viem';

const FAUCET = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`;
const TOKEN  = process.env.NEXT_PUBLIC_ASSET_ADDRESS as `0x${string}`; // <-- must be the ERC20 token address

const FAUCET_ABI = [
  { type:'function', name:'claim', stateMutability:'nonpayable', inputs:[], outputs:[] },
  { type:'function', name:'claimAmount', stateMutability:'view', inputs:[], outputs:[{type:'uint256'}] },
  { type:'function', name:'walletLimit', stateMutability:'view', inputs:[], outputs:[{type:'uint256'}] },
  { type:'function', name:'totalClaimed', stateMutability:'view', inputs:[{name:'',type:'address'}], outputs:[{type:'uint256'}] },
] as const satisfies Abi;

const ERC20_ABI = [
  { type:'function', name:'decimals', stateMutability:'view', inputs:[], outputs:[{type:'uint8'}] },
  { type:'function', name:'symbol',   stateMutability:'view', inputs:[], outputs:[{type:'string'}] },
  { type:'function', name:'balanceOf',stateMutability:'view', inputs:[{type:'address'}], outputs:[{type:'uint256'}] },
] as const satisfies Abi;

export default function FaucetPage() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const { data: claimAmount } = useReadContract({ address: FAUCET, abi: FAUCET_ABI, functionName: 'claimAmount' });
  const { data: walletLimit } = useReadContract({ address: FAUCET, abi: FAUCET_ABI, functionName: 'walletLimit' });
  const { data: claimed     } = useReadContract({
    address: FAUCET, abi: FAUCET_ABI, functionName: 'totalClaimed',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address }
  });

  const { data: tokenDecimals } = useReadContract({ address: TOKEN, abi: ERC20_ABI, functionName: 'decimals' });
  const { data: tokenSymbol   } = useReadContract({ address: TOKEN, abi: ERC20_ABI, functionName: 'symbol' });
  const { data: faucetBal     } = useReadContract({ address: TOKEN, abi: ERC20_ABI, functionName: 'balanceOf', args: [FAUCET] });

  const dec = Number(tokenDecimals ?? 6);
  const fmt = (v?: bigint) => (v == null ? '0' : (Number(v) / 10 ** dec).toLocaleString());

  const remaining = useMemo(() => {
    if (walletLimit == null || claimed == null) return 0n;
    const rem = (walletLimit as bigint) - (claimed as bigint);
    return rem > 0n ? rem : 0n;
  }, [walletLimit, claimed]);

  async function onClaim() {
    try {
      await writeContractAsync({ address: FAUCET, abi: FAUCET_ABI, functionName: 'claim' });
      alert('Claim sent! Wait for confirmation in your wallet.');
    } catch (e: any) {
      console.error(e);
      alert(e?.shortMessage ?? e?.message ?? 'Claim failed');
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">mUSDC Faucet</h1>
        <p className="text-xs text-gray-500 break-all">Faucet: {FAUCET}</p>
      </header>

      <section className="rounded-2xl border p-4 space-y-2">
        <div className="text-sm">Faucet Balance: <b>{fmt(faucetBal)} {tokenSymbol ?? 'mUSDC'}</b></div>
        <div className="text-sm">Claim Amount: <b>{fmt(claimAmount)} {tokenSymbol ?? 'mUSDC'}</b></div>
        <div className="text-sm">Your Claimed: <b>{fmt(claimed as bigint | undefined)} {tokenSymbol ?? 'mUSDC'}</b></div>
        <div className="text-sm">Remaining Allowance: <b>{fmt(remaining)} {tokenSymbol ?? 'mUSDC'}</b></div>

        <button
          onClick={onClaim}
          disabled={isPending || remaining === 0n}
          className="w-full rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          {remaining === 0n ? 'Max Reached' : (isPending ? 'Claiming…' : 'Claim 200')}
        </button>
        <p className="text-[11px] text-gray-500">Each wallet can claim up to {fmt(walletLimit as bigint | undefined)} total.</p>
      </section>
    </main>
  );
}
