# DeFi Analytics Subgraph

This subgraph indexes and analyzes user interactions with Aave's lending protocol, tracking transactions like borrowing, supplying, withdrawing, repaying, flash loans, and liquidations.

By using The Graph Protocol, this subgraph enables efficient querying and retrieval of historical user data. Moreover, it also provides a daily report of user transaction statistics through time-series data, making it useful for DeFi analytics dashboards, research, and portfolio tracking.

## 📌 Overview of Event Handlers

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

Increases `totalBorrowed` when a user **borrows** funds.

```typescript
export function handleBorrow(event: BorrowEvent): void {
  let user = loadUser(event.params.user);
  user.totalBorrowed = user.totalBorrowed.plus(event.params.amount);
  user.save();

  let tx = new Transaction(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex());
  tx.user = user.id;
  tx.eventType = "Borrow";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**3️⃣ Supply Event**

Increases `totalSupplied` when a user **deposits** funds.

```typescript
export function handleSupply(event: SupplyEvent): void {
  let user = loadUser(event.params.user);
  user.totalSupplied = user.totalSupplied.plus(event.params.amount);
  user.save();

  let tx = new Transaction(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex());
  tx.user = user.id;
  tx.eventType = "Supply";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**4️⃣ Withdraw Event**

Increases `totalWithdrawn` when a user **withdraws** funds.

```typescript
export function handleWithdraw(event: WithdrawEvent): void {
  let user = loadUser(event.params.user);
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount);
  user.save();

  let tx = new Transaction(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex());
  tx.user = user.id;
  tx.eventType = "Withdraw";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**5️⃣ Repay Event**

Increases `totalRepaid` when a user **repays borrowed** funds.

```typescript
export function handleRepay(event: RepayEvent): void {
  let user = loadUser(event.params.user);
  user.totalRepaid = user.totalRepaid.plus(event.params.amount);
  user.save();

  let tx = new Transaction(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex());
  tx.user = user.id;
  tx.eventType = "Repay";
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**6️⃣ Flash Loan Event**
	•	Increases `flashLoanCount` when a user **takes a flash loan**.
	•	Does not affect balances (since flash loans are repaid immediately).
 ```typescript
export function handleFlashLoan(event: FlashLoanEvent): void {
  let user = loadUser(event.params.initiator);
  user.flashLoanCount += 1;
  user.save();

  let tx = new Transaction(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex());
  tx.user = user.id;
  tx.eventType = "FlashLoan";
  tx.amount = event.params.amount;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}
```

**7️⃣ Liquidation Event**

Updates `totalLiquidated` when a user is **liquidated**.
 ```typescript
export function handleLiquidationCall(event: LiquidationCallEvent): void {
  let user = loadUser(event.params.user);
  user.totalLiquidated = user.totalLiquidated.plus(event.params.liquidatedCollateralAmount);
  user.save();

  let tx = new Transaction(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex());
  tx.user = user.id;
  tx.eventType = "Liquidation";
  tx.reserve = event.params.collateralAsset;
  tx.amount = event.params.liquidatedCollateralAmount;
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
## 📊 Time-Series Data & Performance
This subgraph tracks historical data efficiently by:
- Using time-series entities (**Transaction** entity).
- Pre-aggregating user totals (e.g., **totalBorrowed**, **totalRepaid**).
- Reducing query overhead (e.g., **flashLoanCount** as an integer instead of querying all flash loan transactions).

## 🛠 Key Takeaways
1.	User Balances:
- `totalSupplied`, `totalBorrowed`, `totalRepaid`, `totalWithdrawn`, `totalLiquidated`, `flashLoanCount` track cumulative user interactions.

2.	Transactions:
- Every event logs a `Transaction` entity to allow** time-series tracking**.

3.	Performance Optimizations:
- Instead of querying all past transactions, cumulative fields (totalBorrowed, etc.) store aggregated values.

4.	Collateral Usage Tracking:
- A simple `useReserveAsCollateral` boolean tracks collateral enable/disable events.

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

