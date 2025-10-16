import HalalSavingsV2ABI from './HalalSavingsVaultV2.json'

// Contract Addresses - Base Sepolia
export const CONTRACTS = {
  // V2 - NEW (Multi-goal support)
  HALAL_SAVINGS_V2: '0xc11Bdc4D5625687F1c3d8A7f803adf9AbB5be67e' as const,
  
  // Existing contracts
  IUSDC_VAULT: '0x5B705BA80D27Adead217Ea676A2487a9c8Bc509d' as const,
  MOCK_USDC: '0xbCC114F1903F36637f977B282fBbd490DB7E43eE' as const,
  MINA_TOKEN: '0x4D9744786215a495B38b6EC785F79E5d3EECC1E7' as const,
  
  // V1 - OLD (single goal - deprecated)
  HALAL_SAVINGS_V1: '0xEe81F398021fA1E0EeB97329118265bCBDA97ECC' as const,
} as const

// ABIs
export const HALAL_SAVINGS_V2_ABI = HalalSavingsV2ABI.abi

// Chain Config
export const CHAIN_CONFIG = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
} as const

// Export for easy access
export const {
  HALAL_SAVINGS_V2,
  IUSDC_VAULT,
  MOCK_USDC,
  MINA_TOKEN,
  HALAL_SAVINGS_V1,
} = CONTRACTS