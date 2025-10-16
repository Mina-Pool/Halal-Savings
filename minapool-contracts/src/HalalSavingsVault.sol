// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title HalalSavingsVault - Shariah-compliant goal-based savings
/// @notice Replaces StakingRewards with halal profit-sharing mechanism
contract HalalSavingsVault {
    using SafeERC20 for IERC20;
    
    // Goal types for purposeful saving
    enum GoalType { HAJJ, UMRAH, QURBAN, EDUCATION, WEDDING, GENERAL }
    
    struct SavingGoal {
        GoalType goalType;
        uint256 targetAmount;        // in USDC (6 decimals)
        uint256 targetDate;          // unix timestamp
        uint256 monthlyCommitment;   // suggested monthly amount
        uint256 totalSaved;          // current saved amount
        uint256 startDate;
        bool isActive;
        string customName;
    }
    
    struct UserStats {
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 streakMonths;
        uint256 lastDepositTime;
        uint256 profitShareClaimed;  // Total profit-share claimed (not interest!)
    }
    
    // State variables
    IERC20 public immutable depositToken;  // iUSDC (from Vault)
    IERC20 public immutable profitToken;   // MINA (profit-sharing token)
    
    mapping(address => SavingGoal[]) public userGoals;
    mapping(address => uint256) public activeGoalIndex;
    mapping(address => UserStats) public userStats;
    
    // Profit-sharing pool (NOT interest-based)
    uint256 public totalDeposited;
    uint256 public profitPool;              // Accumulated halal profits
    uint256 public profitPerTokenStored;    // 1e18 precision
    uint256 public lastUpdateTime;
    
    mapping(address => uint256) public userProfitPerTokenPaid;
    mapping(address => uint256) public userProfitBalance;
    
    // Constants
    uint256 public constant MIN_DEPOSIT = 50 * 1e18;  // 50 iUSDC minimum
    uint256 public profitShareRate = 5e15;  // 0.005 MINA per second per token (adjustable)
    
    address public owner;
    uint256 public totalUsers;
    
    // Events
    event GoalCreated(address indexed user, GoalType goalType, uint256 targetAmount, string name);
    event Deposited(address indexed user, uint256 amount, uint256 goalIndex);
    event Withdrawn(address indexed user, uint256 amount);
    event GoalCompleted(address indexed user, GoalType goalType, uint256 totalSaved);
    event ProfitClaimed(address indexed user, uint256 amount);
    event ProfitPoolFunded(uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "!owner");
        _;
    }
    
    constructor(address _depositToken, address _profitToken) {
        require(_depositToken != address(0) && _profitToken != address(0), "zero address");
        depositToken = IERC20(_depositToken);
        profitToken = IERC20(_profitToken);
        owner = msg.sender;
        lastUpdateTime = block.timestamp;
    }
    
    // ============ PROFIT-SHARING MECHANISM (HALAL) ============
    // This is NOT interest. It's profit-sharing from halal business activities.
    
    function _updateProfit() internal {
        if (totalDeposited > 0) {
            uint256 timeDelta = block.timestamp - lastUpdateTime;
            uint256 profitGenerated = timeDelta * profitShareRate;
            profitPerTokenStored += (profitGenerated * 1e18) / totalDeposited;
        }
        lastUpdateTime = block.timestamp;
    }
    
    function earned(address user) public view returns (uint256) {
        uint256 userBalance = _getUserTotalDeposited(user);
        if (userBalance == 0) return userProfitBalance[user];
        
        uint256 currentProfitPerToken = profitPerTokenStored;
        if (totalDeposited > 0) {
            uint256 timeDelta = block.timestamp - lastUpdateTime;
            uint256 profitGenerated = timeDelta * profitShareRate;
            currentProfitPerToken += (profitGenerated * 1e18) / totalDeposited;
        }
        
        uint256 profitDelta = (userBalance * (currentProfitPerToken - userProfitPerTokenPaid[user])) / 1e18;
        return userProfitBalance[user] + profitDelta;
    }
    
    function _getUserTotalDeposited(address user) internal view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            total += userGoals[user][i].totalSaved;
        }
        return total;
    }
    
    function _updateUserProfit(address user) internal {
        _updateProfit();
        userProfitBalance[user] = earned(user);
        userProfitPerTokenPaid[user] = profitPerTokenStored;
    }
    
    // ============ GOAL CREATION ============
    
    function createGoal(
        GoalType _type,
        uint256 _targetAmount,
        uint256 _targetDate,
        uint256 _monthlyCommitment,
        string memory _customName
    ) external {
        require(_targetAmount > 0, "Zero target");
        require(_targetDate > block.timestamp, "Invalid date");
        require(_monthlyCommitment >= MIN_DEPOSIT, "Below minimum");
        
        if (userGoals[msg.sender].length == 0) {
            totalUsers++;
        }
        
        SavingGoal memory newGoal = SavingGoal({
            goalType: _type,
            targetAmount: _targetAmount,
            targetDate: _targetDate,
            monthlyCommitment: _monthlyCommitment,
            totalSaved: 0,
            startDate: block.timestamp,
            isActive: true,
            customName: _customName
        });
        
        userGoals[msg.sender].push(newGoal);
        activeGoalIndex[msg.sender] = userGoals[msg.sender].length - 1;
        
        emit GoalCreated(msg.sender, _type, _targetAmount, _customName);
    }
    
    // ============ DEPOSIT (Replaces "Stake") ============
    
    function deposit(uint256 amount) external {
        require(amount > 0, "Zero amount");
        
        uint256 goalIndex = activeGoalIndex[msg.sender];
        require(goalIndex < userGoals[msg.sender].length, "No active goal");
        
        SavingGoal storage goal = userGoals[msg.sender][goalIndex];
        require(goal.isActive, "Goal not active");
        
        // Update profit before changing balance
        _updateUserProfit(msg.sender);
        
        // Transfer iUSDC from user
        depositToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update balances
        goal.totalSaved += amount;
        totalDeposited += amount;
        
        UserStats storage stats = userStats[msg.sender];
        stats.totalDeposited += amount;
        stats.lastDepositTime = block.timestamp;
        
        // Update streak
        if (stats.lastDepositTime > 0) {
            uint256 daysSinceLastDeposit = (block.timestamp - stats.lastDepositTime) / 1 days;
            if (daysSinceLastDeposit <= 32) { // Within a month
                stats.streakMonths++;
            } else {
                stats.streakMonths = 1;
            }
        }
        
        // Check if goal completed
        if (goal.totalSaved >= goal.targetAmount) {
            goal.isActive = false;
            emit GoalCompleted(msg.sender, goal.goalType, goal.totalSaved);
            
            // Give completion bonus (from profit pool)
            uint256 bonus = (goal.totalSaved * 50) / 1000; // 5% bonus
            if (profitToken.balanceOf(address(this)) >= bonus) {
                profitToken.safeTransfer(msg.sender, bonus);
                stats.profitShareClaimed += bonus;
            }
        }
        
        emit Deposited(msg.sender, amount, goalIndex);
    }
    
    // ============ WITHDRAW (Replaces "Unstake") ============
    
    function withdraw(uint256 goalIndex) external {
        require(goalIndex < userGoals[msg.sender].length, "Invalid goal");
        
        SavingGoal storage goal = userGoals[msg.sender][goalIndex];
        require(goal.totalSaved > 0, "No savings");
        
        // Can only withdraw if:
        // 1. Goal is completed (reached target)
        // 2. OR target date has passed
        require(
            !goal.isActive || block.timestamp >= goal.targetDate,
            "Goal not complete"
        );
        
        _updateUserProfit(msg.sender);
        
        uint256 withdrawAmount = goal.totalSaved;
        
        // Update state
        totalDeposited -= withdrawAmount;
        userStats[msg.sender].totalWithdrawn += withdrawAmount;
        goal.totalSaved = 0;
        goal.isActive = false;
        
        // Transfer iUSDC back to user
        depositToken.safeTransfer(msg.sender, withdrawAmount);
        
        emit Withdrawn(msg.sender, withdrawAmount);
    }
    
    // ============ CLAIM PROFIT-SHARE (Replaces "getReward") ============
    
    function claimProfit() external {
        _updateUserProfit(msg.sender);
        
        uint256 profit = userProfitBalance[msg.sender];
        require(profit > 0, "No profit");
        
        userProfitBalance[msg.sender] = 0;
        userStats[msg.sender].profitShareClaimed += profit;
        
        profitToken.safeTransfer(msg.sender, profit);
        
        emit ProfitClaimed(msg.sender, profit);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getActiveGoal(address user) external view returns (SavingGoal memory) {
        uint256 index = activeGoalIndex[user];
        if (index >= userGoals[user].length) {
            return SavingGoal({
                goalType: GoalType.GENERAL,
                targetAmount: 0,
                targetDate: 0,
                monthlyCommitment: 0,
                totalSaved: 0,
                startDate: 0,
                isActive: false,
                customName: ""
            });
        }
        return userGoals[user][index];
    }
    
    function getUserGoals(address user) external view returns (SavingGoal[] memory) {
        return userGoals[user];
    }
    
    function getTVL() external view returns (uint256) {
        return totalDeposited;
    }
    
    function getTotalUsers() external view returns (uint256) {
        return totalUsers;
    }
    
    // ============ OWNER FUNCTIONS ============
    
    function setProfitShareRate(uint256 newRate) external onlyOwner {
        _updateProfit();
        profitShareRate = newRate;
    }
    
    function fundProfitPool(uint256 amount) external onlyOwner {
        profitToken.safeTransferFrom(msg.sender, address(this), amount);
        profitPool += amount;
        emit ProfitPoolFunded(amount);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}