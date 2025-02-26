# DeFi Analytics Subgraph

This [subgraph](https://api.studio.thegraph.com/query/90479/defi-analysis/version/latest) indexes lending and borrowing activities across Aave, Compound, and Silo protocols. It provides aggregated transaction data, user statistics, and daily analytics for each protocol.

By using The Graph Protocol, this subgraph enables efficient querying and retrieval of historical user data. Moreover, it also provides a daily report of user transaction statistics through time-series data, making it useful for DeFi analytics dashboards, research, and portfolio tracking.

## 🚀 Features ## 
- Time-Series Tracking: Captures historical events (`BorrowTransaction`, `RepayTransaction`, etc.) for accurate insights.
- Aggregated User Metrics: Tracks `totalBorrowed`, `totalRepaid`, `totalSupplied`, etc., reducing the need for repeated calculations.
- Optimized Performance: Uses pre-aggregated statistics to minimize query load.
- Daily Summaries: Provides `DailyBorrowStats`, `DailySupplyStats`, etc., to track lending activity trends.

## 📌 Implementation Overview
### Aave Integration
For Aave, the subgraph first determines the underlying implementation contract of the Aave Pool through Etherscan. It generates the required handlers based on the implementation contract’s ABI before switching the tracked address and start block to the proxy contract. This method guarantees that all core lending and borrowing interactions are properly indexed while maintaining compatibility with future upgrades.

### Compound Integration
For Compound, each asset is represented by its own smart contract rather than a unified proxy. As a result, I manually identified and added each asset contract to the subgraph YAML file. The subgraph then listens to on-chain events emitted by these contracts and maps them to corresponding entities, ensuring real-time indexing of lending and borrowing activities.

### Silo Integration
The implementation is slightly different due to its modular architecture. The subgraph first tracks the `SiloRepository` contract, which acts as a registry for all deployed `Silo` contracts. When a new Silo contract is created, it emits a `NewSiloCreated` event and is dynamically tracked using subgraph templates. This allows the subgraph to scale efficiently and index new Silo deployments without manual updates.

Each event updates **user balances** and logs a **transaction record**.

## 🔍  [Schema](/subgraph/schema.graphql)  Overview ##

### 1️⃣ **Common Enums**

**Event Types**
| Event Type  | Description |
| ------------- | ------------- |
| `Borrow`  | User borrows assets |
| `Liquidation`  | Repayment of borrowed assets |
| `Repay`  | Repayment of borrowed assets |
| `Supply`  | Supplying assets to protocol |
| `Withdraw`  | Withdrawing supplied assets |

**Protocol Types**
| Protocol Type  | Description |
| ------------- | ------------- |
| `Aave`  | Aave Protocol |
| `Compound`  | Compound Finance Protocol |
| `Silo`  | Silo Finance Protocol |

### 2️⃣ **User Balances & Metrics**

The `User` entity will hold the user's balance & metrics across all protocols:
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `aave`  | AaveUserStats | Aave-specific user statistics |
| `compound`  | CompoundUserStats | Compound Finance-specific user statistics |
| `silo`  | SilouserStats | Silo Finance-specific user statistics |
| `transactions`  | [BaseTransactions!]! | List of transactions related to the user |

### 3️⃣ **Protocol-Specific User Entities**
To improve scalability, each protocol has its own entity
#### **Aave** - `AaveUserStats`
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `user` | User! | Reference to the user |
| `totalTransactions` | BigInt! | Total number of transactions |
| `totalSupplied` | BigInt! | Total assets supplied |
| `totalBorrowed` | BigInt! | Total assets borrowed |
| `totalRepaid` | BigInt! | Total assets repaid |
| `totalWithdrawn` | BigInt! | Total assets withdrawn |
| `totalLiquidated` | BigInt! |Total liquidated assets |
| `useReserveAsCollateral` | Boolean! | Indicates if collateral is used |

#### **Compound & Silo (Same Structure)** - `CompoundUserStats` & `SiloUSerStats`
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `user` | User! | Reference to the user |
| `totalTransactions` | BigInt! | Total number of transactions |
| `totalSupplied` | BigInt! | Total assets supplied |
| `totalBorrowed` | BigInt! | Total assets borrowed |
| `totalRepaid` | BigInt! | Total assets repaid |
| `totalWithdrawn` | BigInt! | Total assets withdrawn |
| `totalLiquidated` | BigInt! |Total liquidated assets |

### 4️⃣ **Transaction Entities**

All transaction entities implement the `BaseTransaction` interface for scalability

#### BaseTransaction
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `user` | User! | Reference to the user |
| `protocol` | ProtocolType! | DeFi protocol type |
| `eventType` | EventType! | Type of transaction event |
| `amount` | BigInt! | Transaction amount |
| `reserve` | BigInt! | Asset being transacted |
| `blockNumber` | BigInt! | Block number of transaction |
| `timestamp` | Timestamp! | Timestamp of transaction |
| `transactionHash` | Bytes! | Hash of the transaction |

Each **financial event** (borrow, supply, repay, etc.) is logged as an entity for detailed historical tracking.

| Transaction Type  | Purpose |
| ------------- | ------------- |
| `BorrowTransaction`  | Tracks user borrow events |
| `RepayTransaction`  | Logs repayment activities |
| `SupplyTransaction`  | Captures asset deposits into the protocol |
| `WithdrawTransaction`  | Records user withdrawals |
| `LiquidationTransaction`  | Tracks liquidations and their impact |

#### BorrowTransaction
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `onBehalfOf` | Bytes | Address on whose behalf borrowing occurs |
| `interestRateMode` | Int | Interest rate type |
| `borrowRate` | BigInt | Rate at which borrowing happens |
| `referralCode` | Int | Referral identifier |

#### RepayTransaction
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `repayer` | Bytes! | Address of the repayer |
| `useATokens` | Boolean! | Whether aTokens were used for repayment |
| `usdValue` | BigInt | USD value of the repayment |

#### SupplyTransaction
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `dst` | Bytes | Destination address |
| `onBehalfOf` | Bytes | Address on whose behalf supply occurs |
| `referralCode` | Int | Referral identifier |

#### WithdrawTransaction
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `to` | Bytes~ | Address receiving funds |

#### LiquidationTransaction
| Field  | Type | Description |
| ------------- | ------------- | ------------- |
| `debtAsset` | Bytes | Asset used for debt repayment |
| `debtToCover` | BigInt | Amount of debt covered |
| `liquidator` | Bytes! | Liquidator's address |
| `receiveAToken` | Boolean | Whether aToken is received in liquidationr |
| `usdValue` | BigInt | USD value of the liquidation |

### 5️⃣**Daily Aggregations**

To analyze trends over time, **daily aggregated statistics** are stored:
|  Aggregation Type  | Source Entity | Function |
| ------------- | ------------- | ------------- |
| `DailyBorrowStats`  | `BorrowTransaction` | Sum of borrow amounts per day |
| `DailySupplyStats`  | `SupplyTransaction` | Sum of supplied amounts per day |
| `DailyWithdrawStats`  | `WithdrawTransaction` | Sum of withdrawals per day |
| `DailyLiquidationStats`  | `LiquidationTransaction` | Sum of liquidated amounts per day |
| `DailyRepayStats`  | `RepayTransaction` | Sum of repayments per day |

These daily summaries make it easier to track trends (e.g., total borrow volume in the last 30 days).

## 📌 Usage Examples [(Playground)](https://api.studio.thegraph.com/query/90479/defi-analysis/version/latest) ##

**Query: Get a User’s Statistics on various protocols**
```graphql
{
  user(id: "0x123...") {
    aave {
      totalBorrowed
      totalLiquidated
      totalSupplied
      totalRepaid
    }
    compound {
      totalBorrowed
      totalLiquidated
      totalWithdrawn
    }
    silo {
      totalLiquidated
      totalSupplied
      totalTransactions
    }
  }
}
```
**Query: Fetch All Borrow Transactions for a User**
```graphql
{
  borrowTransactions(where: {user: "0x123..."}) {
    amount
    borrowRate
    timestamp
    transactionHash
  }
}
```

**Query: Get Daily Borrow Volume**
```graphql
{
  dailyBorrowStats(first: 5, orderBy: timestamp, orderDirection: desc) {
    total
    timestamp
  }
}
```

## 🚧 Challenges and Solutions
1. Finding the ABI of the Actual Contract

**Challenge:** Aave’s website primarily provides the proxy contract address, making it difficult to retrieve the actual implementation contract’s ABI.

**Solution:** I manually traced the proxy contract and find the correct the protocol's implementation address (PoolInstance) using Etherscan.

2. Optimizing Subgraph with Time-Series Data

**Challenge:** Handling large amounts of historical transaction data efficiently was a challenge, as querying raw events in bulk could lead to performance bottlenecks

**Solution:** I referred to [The Graph's documentation](https://thegraph.com/docs/en/subgraphs/cookbook/timeseries/) and experimented on another subgraph to familiar myself with time-series aggregation. The key metrics can then be pre-computed by the database and improve query performance.

3. Identifying Relevant Events

**Challenge:** The proxy, implementation contracts from Aave, Compound and Silo emits too many events and I had a hard time trying to identify which is useful.

**Solution:** I conducted research through ChatGPT and online sources to determine which is useful for a user-focused analysis. This helped me modify the subgraph's schema accordingly and avoid unnecessary data processing.

4. Templating the Silo Factory

**Challenge**: Silo dynamically deploys new contracts, requiring an efficient way to track each instance without manually updating the subgraph.

**Solution**: I used The Graph's templating feature to transform `Silo` contracts systematically deployed by the `SiloRepository` contract to automatically register them they are deployed, ensuring scalability and efficiency.

