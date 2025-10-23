# MinaPool - Halal Savings Protocol

<div align="center">

*MINAPOOL: HALAL-SAVING*

**Shariah-Compliant Savings Protocol on Base**

*Small Steps, Big Journey*

[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://halal-savings.vercel.app)
[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue)](https://sepolia.basescan.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live App](https://halal-savings.vercel.app) • [Documentation](https://docs.minapool.com) • [Twitter](https://twitter.com/MinaPoolHQ)

</div>

---

## 🕌 What is MinaPool?

MinaPool is the first fully on-chain, Shariah-compliant savings protocol that enables **1.8 billion Muslims** worldwide to grow their wealth through halal investments—without interest (riba), speculation, or prohibited activities.

Built on **Base** (Ethereum Layer 2) for ultra-low fees and powered by the **Mudarabah** (profit-sharing) contract structure from classical Islamic finance.

### The Problem We Solve

- **Traditional banks** → Interest-based (haram)
- **Most DeFi protocols** → Lending/speculation (haram)
- **Keeping cash at home** → Lose to inflation
- **Islamic banks** → High fees, limited access, opaque

### Our Solution

✅ **Profit-sharing** instead of interest (Mudarabah: 90% users, 10% managers)  
✅ **Asset-backed investments** (sukuk, property tokens, gold)  
✅ **Full transparency** (all allocations on-chain)  
✅ **Non-custodial** (you control your funds)  
✅ **Goal-based savings** (Hajj, Umrah, Education, Wedding, Qurban, General)

---

## ✨ Features

### Core Functionality
- 💰 **Deposit & Earn** - Deposit USDC, receive iUSDC shares (ERC-4626)
- 🎯 **Goal-Based Savings** - Track progress toward life milestones
- 📈 **Share Price Accrual** - Profits increase your share value automatically
- 🔓 **Withdraw Anytime** - Non-custodial, no lock periods
- 🎁 **Staking Rewards** - Stake iUSDC to earn bonus REWARD tokens

### Shariah Compliance
- 🕌 **No Riba** - Zero interest, only profit from real assets
- 📊 **Transparent Allocation** - 60-70% RWA (sukuk, property, gold) + 30-40% DeFi (staking, AMM)
- 🔍 **Verifiable On-Chain** - All transactions publicly auditable
- 📜 **Seeking Certification** - Formal Shariah board review in progress

---

## 🚀 Quick Start

### Try the Live App

**1. Visit:** [https://halal-savings.vercel.app](https://halal-savings.vercel.app)

**2. Get Test Tokens:**
- Click the "Faucet" button to receive free MockUSDC
- You'll also need Base Sepolia ETH for gas ([get here](https://www.alchemy.com/faucets/base-sepolia))

**3. Start Saving:**
- Choose a goal (Hajj, Umrah, Education, etc.)
- Deposit MockUSDC
- Watch your savings grow!

---

## 🏗️ Architecture
```
┌─────────┐
│  User   │
└────┬────┘
     │ Deposit USDC
     ↓
┌────────────────────────────────┐
│  HalalSavingsVaultV2 (ERC-4626)│
│  Mints iUSDC shares            │
└────────┬───────────────────────┘
         │
         ↓ Allocate Capital
    ┌────┴────┐
    ↓         ↓
┌───────┐  ┌──────┐
│ DeFi  │  │ RWA  │
│30-40% │  │60-70%│
│       │  │      │
│Staking│  │Sukuk │
│AMM LP │  │Props │
│       │  │Gold  │
└───┬───┘  └───┬──┘
    │          │
    └────┬─────┘
         ↓ Monthly Harvest
    ┌──────────┐
    │ Profits  │
    │ 90% Users│
    │ 10% Team │
    └──────────┘
         ↓
   Price Per Share ↑
```

---

## 📦 Smart Contracts

### Deployed Contracts (Base Sepolia)

| Contract | Address | Description |
|----------|---------|-------------|
| **HalalSavingsVaultV2** | [`0xc11Bdc4D5625687F1c3d8A7f803adf9AbB5be67e`](https://sepolia.basescan.org/address/0xc11Bdc4D5625687F1c3d8A7f803adf9AbB5be67e) | Main ERC-4626 vault(ongoing) |
| **MockUSDC** | `0xbCC114F1903F36637f977B282fBbd490DB7E43eE` | Test USDC for testnet |
| **MUSDCFaucet** | `0x5ad2726c321727a80846bf89D7CA5D5183Beb50f` | Faucet for test tokens |
| **StakingRewards** | `0xEe81F398021fA1E0EeB97329118265bCBDA97ECC` | Stake iUSDC, earn REWARD | (ongoing)
| **RewardToken** | `0x4D9744786215a495B38b6EC785F79E5d3EECC1E7` | Bonus rewards token |

### Contract Overview

**HalalSavingsVaultV2.sol** - Core vault implementing ERC-4626 standard
- Handles deposits (mint shares) and withdrawals (burn shares)
- Manages profit distribution via Price Per Share (PPS) increase
- Enforces Mudarabah profit split (90/10)

**StakingRewards.sol** - Staking mechanism for bonus rewards
- Users stake iUSDC shares to earn REWARD tokens
- Maintains vault profit participation while earning extra

**MockUSDC.sol** - Test stablecoin for development
- Mintable test token simulating USDC
- Includes faucet for easy testnet access

---

## 💻 Local Development

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask or Web3 wallet

### Installation
```bash
# Clone the repository
git clone https://github.com/Mina-Pool/Halal-Savings.git
cd Halal-Savings

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys
```

### Running Locally

**Frontend:**
```bash
cd minapool-client
npm install
npm run dev
# Open http://localhost:3000
```

**Smart Contracts:**
```bash
cd minapool-contracts

# Install Foundry dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Deploy to local Anvil network
anvil
# In another terminal:
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Deploy to Base Sepolia
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast --verify
```

### Project Structure
```
Halal-Savings/
├── minapool-client/          # Next.js frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Next.js pages
│   │   ├── styles/           # TailwindCSS styles
│   │   └── utils/            # Helper functions
│   └── public/               # Static assets
│
├── minapool-contracts/       # Smart contracts
│   ├── contracts/
│   │   ├── HalalSavingsVaultV2.sol
│   │   ├── StakingRewards.sol
│   │   ├── MockUSDC.sol
│   │   └── ...
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   └── hardhat.config.js
│
└── docs/                     # Documentation
```

---

## 🧪 Testing
```bash
cd minapool-contracts

# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run tests with detailed traces
forge test -vvv

# Run specific test contract
forge test --match-contract HalalSavingsVaultV2Test

# Run specific test function
forge test --match-test testDeposit

# Check coverage
forge coverage

# Generate coverage report
forge coverage --report lcov

# Run tests on forked Base Sepolia
forge test --fork-url https://sepolia.base.org
```

### Test Structure
```
minapool-contracts/
├── test/
│   ├── HalalSavingsVaultV2.t.sol    # Main vault tests
│   ├── StakingRewards.t.sol         # Staking tests
│   └── MockUSDC.t.sol               # Token tests
```

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.20
- **OpenZeppelin** (ERC-4626, AccessControl, ReentrancyGuard)
- **Foundry** (Development framework)
- **Base Sepolia** (Testnet deployment)

### Frontend
- **Next.js** 14 (React framework)
- **TailwindCSS** (Styling)
- **ethers.js** v6 (Web3 library)
- **Web3Modal** (Wallet connection)
- **Vercel** (Deployment)

### Infrastructure
- **Base** (Ethereum Layer 2)
- **IPFS** (Document storage - planned)
- **The Graph** (Event indexing - planned)

---

## 📚 How It Works

### 1. Deposit Flow
```javascript
User deposits 1,000 USDC
    ↓
Vault mints ~1,000 iUSDC shares (at PPS = 1.0)
    ↓
User's balance: 1,000 iUSDC
```

### 2. Profit Distribution (Monthly Harvest)
```javascript
Month starts: Vault has 1,000,000 USDC
    ↓
DeFi earns: 5,000 USDC (staking, LP fees)
RWA earns: 8,000 USDC (sukuk coupons, rent)
Total profit: 13,000 USDC
    ↓
Split: 90% users (11,700), 10% managers (1,300)
    ↓
New vault total: 1,011,700 USDC
New PPS: 1,011,700 / 1,000,000 = 1.0117
    ↓
Your 1,000 shares now worth: 1,011.7 USDC
Profit: 11.7 USDC (1.17% monthly)
```

### 3. Withdrawal
```javascript
User redeems 1,000 iUSDC shares
    ↓
Vault calculates: 1,000 × 1.0117 = 1,011.7 USDC
    ↓
Burns shares, sends 1,011.7 USDC to user
```

---

## 🗺️ Roadmap

### ✅ V1: Beta (Current - Q4 2025)
- [x] ERC-4626 vault implementation(ongoing)
- [x] Goal-based savings UI
- [x] Staking mechanism
- [x] Base Sepolia testnet deployment
- [x] Web app (https://halal-savings.vercel.app)

### 🚧 V2: Mainnet Launch (Q2 2026)
- [ ] Smart contract audit (CertiK/OpenZeppelin)
- [ ] Formal Shariah board certification
- [ ] Real RWA integration (sukuk, property tokens)
- [ ] Multi-strategy allocation automation
- [ ] Base mainnet deployment
- [ ] USDC (real) support

### 📋 V3: Expansion (Q3 2026)
- [ ] Multi-asset support (IDRX, ETH, BTC)
- [ ] Mobile app (iOS/Android)
- [ ] DAO governance with MINA token
- [ ] Cross-chain (Polygon, Arbitrum)
- [ ] Institutional features (multi-sig, reporting)

---

## 🤝 Contributing

We welcome contributions from developers, Islamic finance experts, and community members!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Areas We Need Help

- 🔐 **Security auditing** - Review smart contracts
- 🕌 **Shariah compliance** - Islamic finance expertise
- 🌍 **Localization** - Translations (Arabic, Bahasa, Urdu, Malay)
- 📝 **Documentation** - Improve guides and tutorials
- 🎨 **Design** - UI/UX improvements
- 🧪 **Testing** - Write more comprehensive tests

---

## ⚠️ Disclaimer

**Current Status:** Beta testnet deployment

- ⚠️ **Use testnet only** - Do NOT send real funds to testnet contracts
- ⚠️ **Not audited** - Smart contracts have not been professionally audited
- ⚠️ **Not certified** - Seeking formal Shariah board certification
- ⚠️ **Experimental** - Beta software may contain bugs

**Important:**
- We are developers, not Islamic scholars
- Users should verify Shariah compliance with their own scholars
- Never invest more than you can afford to lose
- Always do your own research (DYOR)

---

## 📖 Documentation

- **GitBook:** [https://docs.minapool.com](https://minapool.gitbook.io/minapool-docs)
- **Architecture:** See `docs/architecture.md`
- **Shariah Compliance:** See `docs/shariah-compliance.md`
- **Integration Guide:** See `docs/integration-guide.md`

---

## 🔗 Links

- **Live App:** https://halal-savings.vercel.app
- **Website:** https://minapool.com (coming soon)
- **Twitter:** 
- **Discord:** 
- **Email:** 

---

## 👥 Team

Built with ❤️ by the MinaPool team for the global Muslim community.

**Core Contributors:**
- Galih Mohammad 
- Muhammad Ichwan 

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Base** - For providing scalable L2 infrastructure
- **OpenZeppelin** - For secure smart contract libraries
- **Islamic Finance Community** - For guidance on Shariah principles
- **Muslim Tech Community** - For feedback and support

---

## 📧 Contact

**Questions? Feedback? Want to contribute?**

- 📧 Email: 
- 🐦 Twitter: 
- 💬 Discord: 
- 🐛 Issues: 
---

<div align="center">

**Made with 🤲 for the Ummah**

*"The best of people are those who bring the most benefit to others."*  
— Prophet Muhammad (PBUH)

⭐ **Star this repo if you believe in ethical finance!** ⭐

</div>
