# DeFi Analytics Subgraph

This subgraph indexes and analyzes user interactions with Aave's lending protocol, tracking transactions like borrowing, supplying, withdrawing, repaying, flash loans, and liquidations.

By using The Graph Protocol, this subgraph enables efficient querying and retrieval of historical user data. Moreover, it also provides a daily report of user transaction statistics through time-series data, making it useful for DeFi analytics dashboards, research, and portfolio tracking.

[Subgraph Link](https://thegraph.com/studio/subgraph/defi-analysis/playground)

## 🚀 Features ## 
- Time-Series Tracking: Captures historical events (`BorrowTransaction`, `RepayTransaction`, etc.) for accurate insights.
- Aggregated User Metrics: Tracks `totalBorrowed`, `totalRepaid`, `totalSupplied`, etc., reducing the need for repeated calculations.
- Optimized Performance: Uses pre-aggregated statistics to minimize query load.
- Daily Summaries: Provides `DailyBorrowStats`, `DailySupplyStats`, etc., to track lending activity trends.
- Collateral Tracking: A simple `useReserveAsCollateral` flag tracks whether users are using assets as collateral.

## 🔍 Schema Overview [Schema](/subgraph/schema.graphql) ##

1️⃣ **User Balances & Metrics**

The `User` entity tracks cumulative balances to optimize queries:
| Field  | Description |
| ------------- | ------------- |
| `totalSupplied`  | Total amount deposited by the user |
| `totalBorrowed`  | Total amount borrowed |
| `totalRepaid`  | Total amount repaid |
| `totalWithdrawn`  | Total amount withdrawn |
| `totalLiquidated`  | Total amount liquidated |
| `flashLoanCount`  | Number of flash loans taken |


2️⃣ **Transaction Entities**

Each **financial event** (borrow, supply, repay, etc.) is logged as an entity for detailed historical tracking.
| Transaction Type  | Purpose |
| ------------- | ------------- |
| `BorrowTransaction`  | Tracks user borrow events |
| `RepayTransaction`  | Logs repayment activities |
| `SupplyTransaction`  | Captures asset deposits into the protocol |
| `WithdrawTransaction`  | Records user withdrawals |
| `LiquidationTransaction`  | Tracks liquidations and their impact |
| `FlashLoanTransaction`  | Monitors flash loans and fees|

Each transaction includes:
- Amount, Timestamp, Block Number, Transaction Hash
- Additional details (e.g., borrowRate, onBehalfOf, liquidator, etc.)


3️⃣ **Daily Aggregations**

To analyze trends over time, **daily aggregated statistics** are stored:
|  Aggregation Type  | Source Entity | Function |
| ------------- | ------------- | ------------- |
| `DailyBorrowStats`  | `BorrowTransaction` | Sum of borrow amounts per day |
| `DailySupplyStats`  | `SupplyTransaction` | Sum of supplied amounts per day |
| `DailyWithdrawStats`  | `WithdrawTransaction` | Sum of withdrawals per day |
| `DailyLiquidationStats`  | `LiquidationTransaction` | Sum of liquidated amounts per day |
| `DailyRepayStats`  | `RepayTransaction` | Sum of repayments per day |

These daily summaries make it easier to track trends (e.g., total borrow volume in the last 30 days).

## 📌 Event Handlers Overview

Each event updates **user balances** and logs a **transaction record**.

1️⃣ **User Entity Management**

The `loadUser` function ensures that a user entity exists before updating it.
```typescript
function loadUser(id: Bytes): User {
  let user = User.load(id);
  if (!user) {
    user = new User(id);
    user.totalSupplied = BigInt.zero();
    user.totalBorrowed = BigInt.zero();
    user.totalRepaid = BigInt.zero();
    user.totalWithdrawn = BigInt.zero();
    user.totalLiquidated = BigInt.zero();
    user.flashLoanCount = 0;
    user.useReserveAsCollateral = false;
  }
  return user;
}
```

2️⃣ **Borrow Event**

- Increases `totalBorrowed` when a user **borrows** funds.
- Registers a `BorrowTransaction` entity.

```typescript
export function handleBorrow(event: BorrowEvent): void {
  let user = loadUser(event.params.user);
  // Update total borrowed
  user.totalBorrowed = user.totalBorrowed.plus(event.params.amount);
  user.save();

  // Save Transaction
  let tx = new BorrowTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = "Borrow";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.onBehalfOf = event.params.onBehalfOf;
  tx.interestRateMode = event.params.interestRateMode;
  tx.borrowRate = event.params.borrowRate;
  tx.referralCode = event.params.referralCode;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;

  tx.save();
}
```

**3️⃣ Supply Event**
- Increases `totalSupplied` when a user **deposits** funds.
- Registers a `SupplyTransaction` entity.

```typescript
export function handleSupply(event: SupplyEvent): void {
  let user = loadUser(event.params.user);
  // Update total supplied
  user.totalSupplied = user.totalSupplied.plus(event.params.amount);
  user.save();

  let tx = new SupplyTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = "Supply";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.onBehalfOf = event.params.onBehalfOf;
  tx.referralCode = event.params.referralCode;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**4️⃣ Withdraw Event**
- Increases `totalWithdrawn` when a user **withdraws** funds.
- Registers a `WithdrawTransaction` entity.

```typescript
export function handleWithdraw(event: WithdrawEvent): void {
  let user = loadUser(event.params.user);
  // Update total withdrawn
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount);
  user.save();

  let tx = new WithdrawTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = "Withdraw";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.to = event.params.to;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**5️⃣ Repay Event**
- Increases `totalRepaid` when a user **repays borrowed** funds.
- Registers a `RepayTransaction` entity.

```typescript
export function handleRepay(event: RepayEvent): void {
  let user = loadUser(event.params.user);
  // Update total repaid
  user.totalRepaid = user.totalRepaid.plus(event.params.amount);
  user.save();

  let tx = new RepayTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = "Repay";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.repayer = event.params.repayer;
  tx.useATokens = event.params.useATokens;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**6️⃣ Flash Loan Event**
- Increases `flashLoanCount` when a user **takes a flash loan**.
- Does not affect balances (since flash loans are repaid immediately).
- Registers a `FlashLoanTransaction` entity.
 ```typescript
export function handleFlashLoan(event: FlashLoanEvent): void {
  let user = loadUser(event.params.initiator);
  // Increment flash loan by 1
  user.flashLoanCount += 1;
  user.save();

  let tx = new FlashLoanTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = "FlashLoan";
  tx.amount = event.params.amount;
  tx.reserve = event.params.asset;
  tx.target = event.params.target;
  tx.interestRateMode = event.params.interestRateMode;
  tx.premium = event.params.premium;
  tx.referralCode = event.params.referralCode;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**7️⃣ Liquidation Event**
- Updates `totalLiquidated` when a user is **liquidated**.
- Registers a `LiquidationTransaction` entity.
 ```typescript
export function handleLiquidationCall(event: LiquidationCallEvent): void {
  let user = loadUser(event.params.user);
  // Update total liquidated
  user.totalLiquidated = user.totalLiquidated.plus(
    event.params.liquidatedCollateralAmount
  );

  let tx = new LiquidationTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = "Liquidation";
  tx.amount = event.params.liquidatedCollateralAmount;
  tx.reserve = event.params.collateralAsset;
  tx.debtAsset = event.params.debtAsset;
  tx.debtToCover = event.params.debtToCover;
  tx.liquidator = event.params.liquidator;
  tx.receiveAToken = event.params.receiveAToken;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**8️⃣ Collateral Usage Events**
**Enabling Collateral**: Marks `useReserveAsCollateral` = true.
 ```typescript
export function handleReserveUsedAsCollateralEnabled(event: ReserveUsedAsCollateralEnabledEvent): void {
  let user = loadUser(event.params.user);
  user.useReserveAsCollateral = true;
  user.save();
}
```
**Disabling Collateral**: Marks `useReserveAsCollateral` = false.
 ```typescript
export function handleReserveUsedAsCollateralDisabled(event: ReserveUsedAsCollateralDisabledEvent): void {
  let user = loadUser(event.params.user);
  user.useReserveAsCollateral = false;
  user.save();
}
```

## 📌 Usage Examples ##

**Query: Get a User’s Total Borrowed & Repaid**
```graphql
{
  user(id: "0x123...") {
    totalBorrowed
    totalRepaid
    useReserveAsCollateral
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
**Solution:** I manually traced the proxy contract and find the correct implementation address (PoolInstance) using Etherscan.

2. Optimizing Subgraph with Time-Series Data
**Challenge:** Handling large amounts of historical transaction data efficiently was a challenge, as querying raw events in bulk could lead to performance bottlenecks
**Solution:** I referred to [The Graph's documentation](https://thegraph.com/docs/en/subgraphs/cookbook/timeseries/) and experimented on another subgraph to familiar myself with time-series aggregation. The key metrics can then be pre-computed by the database and improve query performance.

3. Identifying Relevant Events
**Challenge:** Aave's pool contract emits too many events and I had a hard time trying to identify which is useful.
**Solution:** I conducted research through ChatGPT and online sources to determine which is useful for a user-focused analysis. This helped me modify the subgraph's schema accordingly and avoid unnecessary data processing.

