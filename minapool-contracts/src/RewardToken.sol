// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20}  from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

// MINA reward token — OZ v5 Ownable needs initialOwner in constructor
contract MINA is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("MINA", "MINA")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amt) external onlyOwner {
        _mint(to, amt);
    }
}