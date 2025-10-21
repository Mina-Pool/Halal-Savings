// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {MUSDCFaucet} from "src/MUSDCFaucet.sol";

contract DeployMUSDCFaucet is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address owner = vm.addr(pk);

        // Read your existing token (MockUSDC) from env
        address token = vm.envAddress("ASSET_ADDRESS"); // set to your mUSDC contract (6 decimals)

        vm.startBroadcast(pk);
        MUSDCFaucet faucet = new MUSDCFaucet(token, owner);
        vm.stopBroadcast();

        console2.log("MUSDCFaucet:", address(faucet));
        console2.log("Owner:", owner);
        console2.log("Token:", token);
    }
}
