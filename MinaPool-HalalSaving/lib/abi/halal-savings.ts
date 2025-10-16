export const HALAL_SAVINGS_ABI = [
  {
    name: 'createGoal',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_type', type: 'uint8' },
      { name: '_targetAmount', type: 'uint256' },
      { name: '_targetDate', type: 'uint256' },
      { name: '_monthlyCommitment', type: 'uint256' },
      { name: '_customName', type: 'string' }
    ],
    outputs: []
  },
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'goalIndex', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'claimProfit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    name: 'getActiveGoal',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'goalType', type: 'uint8' },
          { name: 'targetAmount', type: 'uint256' },
          { name: 'targetDate', type: 'uint256' },
          { name: 'monthlyCommitment', type: 'uint256' },
          { name: 'totalSaved', type: 'uint256' },
          { name: 'startDate', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
          { name: 'customName', type: 'string' }
        ]
      }
    ]
  },
  {
    name: 'getUserGoals',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'goalType', type: 'uint8' },
          { name: 'targetAmount', type: 'uint256' },
          { name: 'targetDate', type: 'uint256' },
          { name: 'monthlyCommitment', type: 'uint256' },
          { name: 'totalSaved', type: 'uint256' },
          { name: 'startDate', type: 'uint256' },
          { name: 'isActive', type: 'bool' },
          { name: 'customName', type: 'string' }
        ]
      }
    ]
  },
  {
    name: 'userStats',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'totalDeposited', type: 'uint256' },
          { name: 'totalWithdrawn', type: 'uint256' },
          { name: 'streakMonths', type: 'uint256' },
          { name: 'lastDepositTime', type: 'uint256' },
          { name: 'profitShareClaimed', type: 'uint256' }
        ]
      }
    ]
  },
  {
    name: 'earned',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'getTVL',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'getTotalUsers',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'totalDeposited',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'profitShareRate',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    name: 'activeGoalIndex',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },

  {
    name: 'lastUpdateTime',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'profitPerTokenStored',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }]
  },
  // Events
  {
    name: 'GoalCreated',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'goalType', type: 'uint8', indexed: false },
      { name: 'targetAmount', type: 'uint256', indexed: false },
      { name: 'name', type: 'string', indexed: false }
    ]
  },
  {
    name: 'Deposited',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'goalIndex', type: 'uint256', indexed: false }
    ]
  },
  {
    name: 'Withdrawn',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  },
  {
    name: 'GoalCompleted',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'goalType', type: 'uint8', indexed: false },
      { name: 'totalSaved', type: 'uint256', indexed: false }
    ]
  },
  {
    name: 'ProfitClaimed',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  },
  {
    name: 'ProfitPoolFunded',
    type: 'event',
    inputs: [
      { name: 'amount', type: 'uint256', indexed: false }
    ]
  },
  {
  name: 'fundProfitPool',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [{ name: 'amount', type: 'uint256' }],
  outputs: []
}
] as const;