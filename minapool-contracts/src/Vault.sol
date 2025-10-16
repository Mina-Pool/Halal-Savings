// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";


/// @title iUSDC Vault — decimals-aware demo vault for Base Sepolia
/// @notice Underlying can be 6d USDC; share token (iUSDC) uses 18 decimals.
contract Vault is ERC20 {
using SafeERC20 for IERC20;


IERC20 public immutable asset; // USDC (mock or test)
uint8 public immutable assetDecimals; // 6 for USDC


uint256 public sharePrice = 1e18; // 1.0 (18d fixed point)
address public owner;


event Deposit(address indexed user, uint256 assets, uint256 shares);
event Withdraw(address indexed user, uint256 shares, uint256 assets);
event Reprice(uint256 oldPrice, uint256 newPrice);


constructor(address _asset) ERC20("iUSDC", "iUSDC") {
require(_asset != address(0), "asset");
asset = IERC20(_asset);
try ERC20(_asset).decimals() returns (uint8 d) { assetDecimals = d; } catch { assetDecimals = 18; }
owner = msg.sender;
}


function decimals() public pure override returns (uint8) { return 18; }


modifier onlyOwner() { require(msg.sender == owner, "!owner"); _; }


function _toWad(uint256 amt) internal view returns (uint256) {
if (assetDecimals == 18) return amt;
return amt * (10 ** (18 - assetDecimals));
}
function _fromWad(uint256 wad) internal view returns (uint256) {
if (assetDecimals == 18) return wad;
return wad / (10 ** (18 - assetDecimals));
}


function deposit(uint256 assets) external returns (uint256 shares) {
require(assets > 0, "zero");
asset.safeTransferFrom(msg.sender, address(this), assets);
uint256 wadAssets = _toWad(assets);
shares = wadAssets * 1e18 / sharePrice;
_mint(msg.sender, shares);
emit Deposit(msg.sender, assets, shares);
}


function withdraw(uint256 shares) external returns (uint256 assets) {
require(shares > 0, "zero");
_burn(msg.sender, shares);
uint256 wadAssets = shares * sharePrice / 1e18;
assets = _fromWad(wadAssets);
asset.safeTransfer(msg.sender, assets);
emit Withdraw(msg.sender, shares, assets);
}


/// @notice DEMO ONLY: simulate yield
function reprice(uint256 newSharePrice) external onlyOwner {
require(newSharePrice >= sharePrice, "down-only");
uint256 old = sharePrice;
sharePrice = newSharePrice;
emit Reprice(old, newSharePrice);
}
}