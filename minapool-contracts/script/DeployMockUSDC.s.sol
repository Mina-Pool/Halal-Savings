// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Script.sol";
import {MockUSDC} from "src/MockUSDC.sol";
contract DeployMockUSDC is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);
        MockUSDC token = new MockUSDC();
        console2.log("MockUSDC:", address(token));
        vm.stopBroadcast();
    }
}
