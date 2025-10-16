// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {Vault} from "../src/Vault.sol";

contract Deploy is Script {
    function run() external {
        address USDC = vm.envAddress("USDC");
        uint256 pk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(pk);
        Vault v = new Vault(USDC);
        console2.log("Vault (iUSDC):", address(v));
        vm.stopBroadcast();
    }
}
