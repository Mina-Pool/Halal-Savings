// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {MINA} from "src/RewardToken.sol";
import {StakingRewards} from "src/StakingRewards.sol";

contract DeployStake is Script {
    function run() external {
        // read env
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);                 
        address IUSDC = vm.envAddress("IUSDC");

        vm.startBroadcast(pk);

        // set token owner to EOA (not DefaultSender)
        MINA rt = new MINA(deployer);

        StakingRewards sr = new StakingRewards(IUSDC, address(rt), 1e17); // 0.1 MINA/sec

        // fund rewards from EOA (owner)
        rt.mint(deployer, 100_000e18);
        rt.approve(address(sr), type(uint256).max);
        sr.fund(50_000e18);

        console2.log("MINA:", address(rt));
        console2.log("StakingRewards:", address(sr));

        vm.stopBroadcast();
    }
}
