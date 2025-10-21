// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract MUSDCFaucet is Ownable {
    IERC20 public immutable token;

    // Defaults: 200 mUSDC per claim, 200 mUSDC lifetime (i.e., one-time claim).
    uint256 public claimAmount = 200 * 1e6;  // 200 with 6 decimals
    uint256 public walletLimit = 200 * 1e6;  // lifetime cap per wallet
    uint256 public cooldown;                 // 0 = no cooldown (one-time claim when walletLimit == claimAmount)

    mapping(address => uint256) public totalClaimed;
    mapping(address => uint256) public lastClaimAt;

    event Claimed(address indexed user, uint256 amount);
    event ParamsUpdated(uint256 claimAmount, uint256 walletLimit, uint256 cooldown);

    constructor(address _token, address _owner) Ownable(_owner) {
        token = IERC20(_token);
    }

    function claim() external {
        // Enforce lifetime cap
        uint256 claimed = totalClaimed[msg.sender];
        require(claimed + claimAmount <= walletLimit, "Wallet limit");

        // Optional cooldown if you set it later
        if (cooldown > 0 && claimed > 0) {
            require(block.timestamp >= lastClaimAt[msg.sender] + cooldown, "Cooldown");
        }

        totalClaimed[msg.sender] = claimed + claimAmount;
        lastClaimAt[msg.sender] = block.timestamp;

        require(token.transfer(msg.sender, claimAmount), "Transfer failed");
        emit Claimed(msg.sender, claimAmount);
    }

    // --- Admin controls ---
    function setParams(uint256 _claimAmount, uint256 _walletLimit, uint256 _cooldown) external onlyOwner {
        require(_claimAmount > 0 && _walletLimit >= _claimAmount, "Bad params");
        claimAmount = _claimAmount;
        walletLimit = _walletLimit;
        cooldown = _cooldown;
        emit ParamsUpdated(_claimAmount, _walletLimit, _cooldown);
    }

    // Rescue any tokens (including mUSDC) back to owner
    function rescue(address token_, uint256 amount) external onlyOwner {
        require(IERC20(token_).transfer(owner(), amount), "Rescue failed");
    }
}
