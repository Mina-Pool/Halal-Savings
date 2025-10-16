// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";


contract StakingRewards {
using SafeERC20 for IERC20;
IERC20 public immutable stakingToken; // iUSDC
IERC20 public immutable rewardsToken; // MINA
uint256 public rewardRate; // tokens / sec
uint256 public lastUpdateTime;
uint256 public rewardPerTokenStored; // 1e18
uint256 public totalSupply;
mapping(address => uint256) public balanceOf;
mapping(address => uint256) public userRewardPerTokenPaid;
mapping(address => uint256) public rewards;
address public owner;
modifier onlyOwner() { require(msg.sender == owner, "!owner"); _; }
constructor(address _staking, address _rewards, uint256 _rate) {
require(_staking!=address(0)&&_rewards!=address(0),"zero");
stakingToken = IERC20(_staking);
rewardsToken = IERC20(_rewards);
rewardRate = _rate; owner = msg.sender; lastUpdateTime = block.timestamp;
}
function _update() internal { if(totalSupply>0){ uint256 dt=block.timestamp-lastUpdateTime; rewardPerTokenStored += dt*rewardRate*1e18/totalSupply; } lastUpdateTime=block.timestamp; }
function setRate(uint256 r) external onlyOwner { _update(); rewardRate=r; }
function earned(address a) public view returns (uint256) {
uint256 rpt = rewardPerTokenStored + (totalSupply>0 ? (block.timestamp-lastUpdateTime)*rewardRate*1e18/totalSupply : 0);
return (balanceOf[a]*(rpt-userRewardPerTokenPaid[a])/1e18)+rewards[a];
}
function stake(uint256 amt) external { require(amt>0,"zero"); _update(); rewards[msg.sender]=earned(msg.sender); userRewardPerTokenPaid[msg.sender]=rewardPerTokenStored; totalSupply+=amt; balanceOf[msg.sender]+=amt; stakingToken.safeTransferFrom(msg.sender,address(this),amt); }
function withdraw(uint256 amt) external { require(amt>0&&amt<=balanceOf[msg.sender],"amt"); _update(); rewards[msg.sender]=earned(msg.sender); userRewardPerTokenPaid[msg.sender]=rewardPerTokenStored; totalSupply-=amt; balanceOf[msg.sender]-=amt; stakingToken.safeTransfer(msg.sender,amt); }
function getReward() external { _update(); uint256 r=earned(msg.sender); rewards[msg.sender]=0; userRewardPerTokenPaid[msg.sender]=rewardPerTokenStored; rewardsToken.safeTransfer(msg.sender,r); }
function fund(uint256 amt) external onlyOwner { rewardsToken.safeTransferFrom(msg.sender,address(this),amt); }
}