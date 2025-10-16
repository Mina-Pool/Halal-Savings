// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title HalalSavingsVaultV2 - Multi-goal Shariah-compliant savings (DEMO VERSION)
/// @notice V2: Fixed to support multiple active goals simultaneously
/// @dev ⚠️ DEMO NOTICE: Profit mechanism is SIMULATED for testing purposes only.
///      Production version will use profit-sharing from real halal business activities.
contract HalalSavingsVaultV2 {
    using SafeERC20 for IERC20;
    
    enum GoalType { HAJJ, UMRAH, QURBAN, EDUCATION, WEDDING, GENERAL }
    
    struct SavingGoal {
        uint256 goalId;              // Unique goal ID
        GoalType goalType;
        uint256 targetAmount;
        uint256 targetDate;
        uint256 monthlyCommitment;
        uint256 totalSaved;
        uint256 startDate;
        bool isActive;
        bool isCompleted;            // Track completion separately
        string customName;
    }
    
    struct UserStats {
        uint256 totalDeposited;
        uint256 totalWithdrawn;
        uint256 streakMonths;
        uint256 lastDepositTime;
        uint256 profitShareClaimed;
        uint256 goalsCreated;        // Total goals created
        uint256 goalsCompleted;      // Goals completed
    }
    
    // State variables
    IERC20 public immutable depositToken;
    IERC20 public immutable profitToken;
    
    mapping(address => SavingGoal[]) public userGoals;
    mapping(address => UserStats) public userStats;
    mapping(address => uint256) public nextGoalId;  // Auto-increment goal IDs
    
    // Profit-sharing (DEMO - simulated mechanism)
    uint256 public totalDeposited;
    uint256 public profitPool;
    uint256 public profitPerTokenStored;
    uint256 public lastUpdateTime;
    
    mapping(address => uint256) public userProfitPerTokenPaid;
    mapping(address => uint256) public userProfitBalance;
    
    uint256 public constant MIN_DEPOSIT = 1e17;
    
    // 🔧 MODIFIED: Reduced rate 1000x for more realistic demo
    // Previous: 5e15 (260 MINA in 14 hours)
    // New: 5e12 (0.26 MINA in 14 hours - more realistic)
    uint256 public profitShareRate = 5e12;  // 0.000005 MINA per second per token
    
    address public owner;
    uint256 public totalUsers;
    
    // Events
    event GoalCreated(address indexed user, uint256 indexed goalId, GoalType goalType, uint256 targetAmount, string name);
    event Deposited(address indexed user, uint256 indexed goalId, uint256 amount);
    event Withdrawn(address indexed user, uint256 indexed goalId, uint256 amount, uint256 remainingBalance);
    event GoalCompleted(address indexed user, uint256 indexed goalId, GoalType goalType, uint256 totalSaved);
    event GoalPaused(address indexed user, uint256 indexed goalId);
    event GoalResumed(address indexed user, uint256 indexed goalId);
    event ProfitClaimed(address indexed user, uint256 amount);
    event ProfitPoolFunded(uint256 amount);
    event ProfitShareRateUpdated(uint256 oldRate, uint256 newRate);
    
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
    
    // ============ PROFIT-SHARING (DEMO - SIMULATED) ============
    
    /// @dev DEMO ONLY: Time-based profit simulation
    ///      Production: Replace with real business profit distribution
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
            if (userGoals[user][i].isActive) {
                total += userGoals[user][i].totalSaved;
            }
        }
        return total;
    }
    
    function _updateUserProfit(address user) internal {
        _updateProfit();
        userProfitBalance[user] = earned(user);
        userProfitPerTokenPaid[user] = profitPerTokenStored;
    }
    
    // ============ GOAL MANAGEMENT ============
    
    function createGoal(
        GoalType _type,
        uint256 _targetAmount,
        uint256 _targetDate,
        uint256 _monthlyCommitment,
        string memory _customName
    ) external returns (uint256 goalId) {
        require(_targetAmount > 0, "Zero target");
        require(_targetDate > block.timestamp, "Invalid date");
        require(_monthlyCommitment >= MIN_DEPOSIT, "Below minimum");
        
        if (userGoals[msg.sender].length == 0) {
            totalUsers++;
        }
        
        goalId = nextGoalId[msg.sender]++;
        
        SavingGoal memory newGoal = SavingGoal({
            goalId: goalId,
            goalType: _type,
            targetAmount: _targetAmount,
            targetDate: _targetDate,
            monthlyCommitment: _monthlyCommitment,
            totalSaved: 0,
            startDate: block.timestamp,
            isActive: true,
            isCompleted: false,
            customName: _customName
        });
        
        userGoals[msg.sender].push(newGoal);
        userStats[msg.sender].goalsCreated++;
        
        emit GoalCreated(msg.sender, goalId, _type, _targetAmount, _customName);
    }
    
    /// @notice Pause a goal (stops earning profit but keeps funds locked)
    function pauseGoal(uint256 goalId) external {
        uint256 index = _findGoalIndex(msg.sender, goalId);
        require(index < userGoals[msg.sender].length, "Goal not found");
        
        SavingGoal storage goal = userGoals[msg.sender][index];
        require(goal.isActive, "Already paused");
        require(!goal.isCompleted, "Goal completed");
        
        _updateUserProfit(msg.sender);
        goal.isActive = false;
        
        emit GoalPaused(msg.sender, goalId);
    }
    
    /// @notice Resume a paused goal
    function resumeGoal(uint256 goalId) external {
        uint256 index = _findGoalIndex(msg.sender, goalId);
        require(index < userGoals[msg.sender].length, "Goal not found");
        
        SavingGoal storage goal = userGoals[msg.sender][index];
        require(!goal.isActive, "Already active");
        require(!goal.isCompleted, "Goal completed");
        
        _updateUserProfit(msg.sender);
        goal.isActive = true;
        
        emit GoalResumed(msg.sender, goalId);
    }
    
    // ============ DEPOSIT ============
    
    /// @notice Deposit to a specific goal
    /// @param goalId The ID of the goal to deposit to
    /// @param amount Amount of deposit token to deposit
    function deposit(uint256 goalId, uint256 amount) external {
        require(amount > 0, "Zero amount");
        
        uint256 index = _findGoalIndex(msg.sender, goalId);
        require(index < userGoals[msg.sender].length, "Goal not found");
        
        SavingGoal storage goal = userGoals[msg.sender][index];
        require(goal.isActive, "Goal not active");
        require(!goal.isCompleted, "Goal completed");
        
        _updateUserProfit(msg.sender);
        
        depositToken.safeTransferFrom(msg.sender, address(this), amount);
        
        goal.totalSaved += amount;
        totalDeposited += amount;
        
        UserStats storage stats = userStats[msg.sender];
        stats.totalDeposited += amount;
        
        // Update streak (monthly deposits)
        if (stats.lastDepositTime > 0) {
            uint256 daysSince = (block.timestamp - stats.lastDepositTime) / 1 days;
            if (daysSince <= 32) {  // Allow 32 days for monthly streak
                stats.streakMonths++;
            } else {
                stats.streakMonths = 1;
            }
        } else {
            stats.streakMonths = 1;
        }
        stats.lastDepositTime = block.timestamp;
        
        // Check if goal completed
        if (goal.totalSaved >= goal.targetAmount) {
            goal.isCompleted = true;
            stats.goalsCompleted++;
            emit GoalCompleted(msg.sender, goalId, goal.goalType, goal.totalSaved);
            
            // 5% completion bonus
            uint256 bonus = (goal.totalSaved * 50) / 1000;
            if (profitToken.balanceOf(address(this)) >= bonus) {
                profitToken.safeTransfer(msg.sender, bonus);
                stats.profitShareClaimed += bonus;
            }
        }
        
        emit Deposited(msg.sender, goalId, amount);
    }
    
    // ============ WITHDRAW ============
    
    /**
 * @dev Withdraw funds from a goal (partial or full)
 * @param goalId The goal ID to withdraw from
 * @param amount Amount of iUSDC to withdraw (0 = withdraw all)
 */
function withdraw(uint256 goalId, uint256 amount) external {
    require(goalId < userGoals[msg.sender].length, "Invalid goal ID");
    
    SavingGoal storage goal = userGoals[msg.sender][goalId];
    
    require(goal.totalSaved > 0, "No funds to withdraw");
    require(!goal.isCompleted, "Goal already completed");
    
    // Update profit before withdrawal
    _updateProfit();
    _updateUserProfit(msg.sender);
    
    // If amount is 0, withdraw everything
    uint256 withdrawAmount = amount == 0 ? goal.totalSaved : amount;
    
    require(withdrawAmount <= goal.totalSaved, "Insufficient balance in goal");
    require(withdrawAmount > 0, "Amount must be greater than 0");
    
    // Deduct from goal
    goal.totalSaved -= withdrawAmount;
    
    // Update global total
    totalDeposited -= withdrawAmount;
    
    // Update user stats
    userStats[msg.sender].totalWithdrawn += withdrawAmount;
    
    // If goal is now empty, mark as completed
    if (goal.totalSaved == 0) {
        goal.isActive = false;
        goal.isCompleted = true;
        userStats[msg.sender].goalsCompleted += 1;
        
        emit GoalCompleted(msg.sender, goalId, goal.goalType, withdrawAmount);
    }
    
    // Transfer using SafeERC20
    depositToken.safeTransfer(msg.sender, withdrawAmount);
    
    emit Withdrawn(msg.sender, goalId, withdrawAmount, goal.totalSaved);
}

    
    // ============ CLAIM PROFIT ============
    
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
    
    function _findGoalIndex(address user, uint256 goalId) internal view returns (uint256) {
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            if (userGoals[user][i].goalId == goalId) {
                return i;
            }
        }
        return type(uint256).max;
    }
    
    /// @notice Get a specific goal by ID
    function getGoal(address user, uint256 goalId) external view returns (SavingGoal memory) {
        uint256 index = _findGoalIndex(user, goalId);
        require(index < userGoals[user].length, "Goal not found");
        return userGoals[user][index];
    }
    
    /// @notice Get all goals for a user
    function getUserGoals(address user) external view returns (SavingGoal[] memory) {
        return userGoals[user];
    }
    
    /// @notice Get all active (non-completed) goals for a user
    function getActiveGoals(address user) external view returns (SavingGoal[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            if (userGoals[user][i].isActive && !userGoals[user][i].isCompleted) {
                activeCount++;
            }
        }
        
        SavingGoal[] memory active = new SavingGoal[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            if (userGoals[user][i].isActive && !userGoals[user][i].isCompleted) {
                active[index++] = userGoals[user][i];
            }
        }
        
        return active;
    }
    
    /// @notice Get all completed goals for a user
    function getCompletedGoals(address user) external view returns (SavingGoal[] memory) {
        uint256 completedCount = 0;
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            if (userGoals[user][i].isCompleted) {
                completedCount++;
            }
        }
        
        SavingGoal[] memory completed = new SavingGoal[](completedCount);
        uint256 index = 0;
        for (uint256 i = 0; i < userGoals[user].length; i++) {
            if (userGoals[user][i].isCompleted) {
                completed[index++] = userGoals[user][i];
            }
        }
        
        return completed;
    }
    
    /// @notice Get total value locked (TVL)
    function getTVL() external view returns (uint256) {
        return totalDeposited;
    }
    
    /// @notice Get total number of users
    function getTotalUsers() external view returns (uint256) {
        return totalUsers;
    }
    
    /// @notice Get current profit share rate (DEMO simulation rate)
    function getProfitShareRate() external view returns (uint256) {
        return profitShareRate;
    }
    
    // ============ OWNER FUNCTIONS ============
    
    /// @notice Update profit share rate (DEMO only)
    function setProfitShareRate(uint256 newRate) external onlyOwner {
        _updateProfit();
        uint256 oldRate = profitShareRate;
        profitShareRate = newRate;
        emit ProfitShareRateUpdated(oldRate, newRate);
    }
    
    /// @notice Fund the profit pool with profit tokens
    function fundProfitPool(uint256 amount) external onlyOwner {
        profitToken.safeTransferFrom(msg.sender, address(this), amount);
        profitPool += amount;
        emit ProfitPoolFunded(amount);
    }
    
    /// @notice Transfer ownership to new owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
    
    /// @notice Emergency withdraw tokens (only owner, for recovery)
    function emergencyWithdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner, amount);
    }
}