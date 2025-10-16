import type { Abi } from 'viem';

export const ERC20_ABI = [
  // read
  { type: 'function', name: 'name',      stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'symbol',    stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'decimals',  stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8'  }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'allowance', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },

  // write
  { type: 'function', name: 'approve',   stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'transfer',  stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' },      { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'transferFrom', stateMutability: 'nonpayable', inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },

  // (optional) EIP-2612 permit — only works if your token implements it
  { type: 'function', name: 'nonces',            stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'DOMAIN_SEPARATOR',  stateMutability: 'view', inputs: [], outputs: [{ type: 'bytes32' }] },
  { type: 'function', name: 'permit',            stateMutability: 'nonpayable',
    inputs: [
      { name: 'owner',   type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value',   type: 'uint256' },
      { name: 'deadline',type: 'uint256' },
      { name: 'v',       type: 'uint8' },
      { name: 'r',       type: 'bytes32' },
      { name: 's',       type: 'bytes32' },
    ],
    outputs: [] },
] as const satisfies Abi;