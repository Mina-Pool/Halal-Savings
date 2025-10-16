export const VAULT_ABI = [
  { type: 'function', name: 'sharePrice', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'deposit',    stateMutability: 'nonpayable', inputs: [{ name: 'assets', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'withdraw',   stateMutability: 'nonpayable', inputs: [{ name: 'shares', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'balanceOf',  stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  // (the ERC20 bits you already import from ERC20_ABI: decimals/allowance/approve/transfer etc.)
  { type: 'event', name: 'Deposit',  inputs: [{ indexed: true, name: 'user', type: 'address' }, { indexed: false, name: 'assets', type: 'uint256' }, { indexed: false, name: 'shares', type: 'uint256' }], anonymous: false },
  { type: 'event', name: 'Withdraw', inputs: [{ indexed: true, name: 'user', type: 'address' }, { indexed: false, name: 'shares', type: 'uint256' }, { indexed: false, name: 'assets', type: 'uint256' }], anonymous: false },
] as const