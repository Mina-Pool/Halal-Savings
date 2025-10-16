// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HalalSavingsVault} from "../src/HalalSavingsVault.sol";
import {MINA} from "../src/RewardToken.sol";

contract DeployHalalSavings is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("==================================================");
        console.log("Deploying Halal Savings Platform");
        console.log("Deployer:", deployer);
        console.log("==================================================\n");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Get existing addresses
        address iusdc = vm.envAddress("IUSDC");
        address mina = vm.envAddress("NEXT_PUBLIC_REWARD_TOKEN");
        
        require(iusdc != address(0), "IUSDC not set");
        require(mina != address(0), "MINA not set");
        
        console.log("Using existing contracts:");
        console.log("- iUSDC (deposit token):", iusdc);
        console.log("- MINA (profit token):", mina);
        
        // Deploy HalalSavingsVault (replaces StakingRewards)
        HalalSavingsVault halalVault = new HalalSavingsVault(iusdc, mina);
        console.log("\nHalalSavingsVault deployed at:", address(halalVault));
        
        // Fund the profit pool with MINA
        MINA minaToken = MINA(mina);
        uint256 profitPoolAmount = 1_000_000 * 1e18; // 1M MINA for profit-sharing
        
        // Mint MINA to deployer first if needed
        try minaToken.mint(deployer, profitPoolAmount) {
            console.log("Minted", profitPoolAmount / 1e18, "MINA to deployer");
        } catch {
            console.log("MINA already minted or deployer not owner");
        }
        
        // Approve and fund profit pool
        minaToken.approve(address(halalVault), profitPoolAmount);
        halalVault.fundProfitPool(profitPoolAmount);
        console.log("Funded profit pool with 1M MINA");
        
        vm.stopBroadcast();
        
        console.log("\n==================================================");
        console.log("DEPLOYMENT COMPLETE");
        console.log("==================================================");
        console.log("\nUpdate your .env.local with:");
        console.log("NEXT_PUBLIC_STAKING_ADDRESS=%s", address(halalVault));
        console.log("\nKeep existing:");
        console.log("NEXT_PUBLIC_IASSET_ADDRESS=%s", iusdc);
        console.log("NEXT_PUBLIC_REWARD_TOKEN=%s", mina);
        
        console.log("\n==================================================");
        console.log("CONVERSION TO HALAL DEFI COMPLETE");
        console.log("==================================================");
        console.log("\nChanges:");
        console.log("- StakingRewards -> HalalSavingsVault");
        console.log("- Interest-based APY -> Profit-sharing");
        console.log("- Staking -> Goal-based savings");
        console.log("- Rewards -> Profit-share from halal activities");
        console.log("\nFeatures:");
        console.log("- 6 Goal Types: Hajj, Umrah, Qurban, Education, Wedding, General");
        console.log("- Progress tracking with milestones");
        console.log("- Streak monitoring for consistent savers");
        console.log("- 5%% completion bonus");
        console.log("- Shariah-compliant profit-sharing");
        console.log("- Transparent on-chain accounting");
        console.log("\n==================================================");
    }
}