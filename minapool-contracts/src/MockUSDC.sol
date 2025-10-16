// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") { _mint(msg.sender, 1_000_000_000_000); } // 1,000,000 mUSDC (6 decimals)
    function decimals() public pure override returns (uint8) { return 6; }
}
