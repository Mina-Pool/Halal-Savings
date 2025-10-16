// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HalalSavingsVaultV2} from "../src/HalalSavingsVaultV2.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract DeployHalalSavingsV2 is Script {
    // Base Sepolia addresses (from your previous deployment)
    address constant IUSDC_VAULT = 0x5B705BA80D27Adead217Ea676A2487a9c8Bc509d;
    address constant MINA_TOKEN = 0x4D9744786215a495B38b6EC785F79E5d3EECC1E7;
    
    // Funding amounts
    uint256 constant PROFIT_POOL_FUNDING = 1_000_000 * 1e18; // 1M MINA for profit pool
    
    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("==============================================");
        console.log("Deploying HalalSavingsVaultV2 to Base Sepolia");
        console.log("==============================================");
        console.log("Deployer:", deployer);
        console.log("iUSDC Vault:", IUSDC_VAULT);
        console.log("MINA Token:", MINA_TOKEN);
        console.log("");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy HalalSavingsVaultV2
        console.log("1. Deploying HalalSavingsVaultV2...");
        HalalSavingsVaultV2 savingsVault = new HalalSavingsVaultV2(
            IUSDC_VAULT,  // depositToken (iUSDC)
            MINA_TOKEN    // profitToken (MINA)
        );
        console.log("   HalalSavingsVaultV2 deployed at:", address(savingsVault));
        console.log("");
        
        // 2. Check MINA balance
        IERC20 minaToken = IERC20(MINA_TOKEN);
        uint256 minaBalance = minaToken.balanceOf(deployer);
        console.log("2. Checking MINA balance...");
        console.log("   Deployer MINA balance:", minaBalance / 1e18, "MINA");
        console.log("");
        
        // 3. Fund profit pool if we have enough MINA
        if (minaBalance >= PROFIT_POOL_FUNDING) {
            console.log("3. Funding profit pool...");
            
            // Approve MINA to savings contract
            minaToken.approve(address(savingsVault), PROFIT_POOL_FUNDING);
            console.log("   Approved MINA to contract");
            
            // Fund profit pool
            savingsVault.fundProfitPool(PROFIT_POOL_FUNDING);
            console.log("   Funded profit pool with:", PROFIT_POOL_FUNDING / 1e18, "MINA");
            console.log("");
        } else {
            console.log(" Insufficient MINA balance for funding");
            console.log("   Required:", PROFIT_POOL_FUNDING / 1e18, "MINA");
            console.log("   Available:", minaBalance / 1e18, "MINA");
            console.log("   You can fund manually later with fundProfitPool()");
            console.log("");
        }
        
        // 4. Verify deployment
        console.log("4. Verifying deployment...");
        console.log("   Owner:", savingsVault.owner());
        console.log("   Deposit Token:", address(savingsVault.depositToken()));
        console.log("   Profit Token:", address(savingsVault.profitToken()));
        console.log("   Profit Share Rate:", savingsVault.getProfitShareRate());
        console.log("   MIN_DEPOSIT:", savingsVault.MIN_DEPOSIT() / 1e18, "tokens");
        console.log("");
        
        vm.stopBroadcast();
        
        // 5. Summary
        console.log("==============================================");
        console.log("DEPLOYMENT SUCCESSFUL!");
        console.log("==============================================");
        console.log("");
        console.log("Contract Addresses:");
        console.log("   HalalSavingsVaultV2:", address(savingsVault));
        console.log("   iUSDC Vault:", IUSDC_VAULT);
        console.log("   MINA Token:", MINA_TOKEN);
        console.log("");
        console.log("Next Steps:");
        console.log("   1. Verify contract on BaseScan:");
        console.log("      forge verify-contract \\");
        console.log("        --chain base-sepolia \\");
        console.log("        --watch \\");
        console.log("        ", address(savingsVault), " \\");
        console.log("        src/HalalSavingsVaultV2.sol:HalalSavingsVaultV2");
        console.log("");
        console.log("   2. Update .env.local with new address:");
        console.log("      NEXT_PUBLIC_HALAL_SAVINGS_V2=", address(savingsVault));
        console.log("");
        console.log("   3. Update frontend ABI from:");
        console.log("      out/HalalSavingsVaultV2.sol/HalalSavingsVaultV2.json");
        console.log("");
        console.log("==============================================");
    }
}