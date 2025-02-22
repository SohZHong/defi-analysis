import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  Borrow as AaveBorrowEvent,
  LiquidationCall as AaveLiquidationCallEvent,
  Repay as AaveRepayEvent,
  ReserveUsedAsCollateralDisabled as AaveReserveUsedAsCollateralDisabledEvent,
  ReserveUsedAsCollateralEnabled as AaveReserveUsedAsCollateralEnabledEvent,
  Supply as AaveSupplyEvent,
  Withdraw as AaveWithdrawEvent,
} from '../generated/PoolImplementation/PoolImplementation';
import {
  AbsorbCollateral as CompoundAbsorbCollateralEvent,
  AbsorbDebt as CompoundAbsorbDebtEvent,
  Supply as CompoundSupplyEvent,
  Withdraw as CompoundWithdrawEvent,
  WithdrawCollateral as CompoundWithdrawCollateralEvent,
  Comet,
} from '../generated/Comet/Comet';
import {
  AaveUserStats,
  BorrowTransaction,
  CompoundUserStats,
  LiquidationTransaction,
  RepayTransaction,
  SupplyTransaction,
  User,
  WithdrawTransaction,
} from '../generated/schema';

function getUnderlyingAsset(cometAddress: Address): Bytes {
  let comet = Comet.bind(cometAddress);
  let tryUnderlying = comet.try_baseToken(); // baseToken() returns the underlying asset

  if (!tryUnderlying.reverted) {
    return tryUnderlying.value;
  }

  return Bytes.empty(); // Return empty if call fails
}

// Initialize AaveUserStats
function loadAaveUserStats(user: User): AaveUserStats {
  let aaveStats = AaveUserStats.load(user.id);
  if (!aaveStats) {
    aaveStats = new AaveUserStats(user.id);
    aaveStats.user = user.id;
    aaveStats.totalSupplied = BigInt.zero();
    aaveStats.totalBorrowed = BigInt.zero();
    aaveStats.totalRepaid = BigInt.zero();
    aaveStats.totalWithdrawn = BigInt.zero();
    aaveStats.totalLiquidated = BigInt.zero();
    aaveStats.useReserveAsCollateral = false;
    aaveStats.save();
  }
  return aaveStats;
}

// Initialize CompoundUserStats
function loadCompoundUserStats(user: User): CompoundUserStats {
  let compoundStats = CompoundUserStats.load(user.id);
  if (!compoundStats) {
    compoundStats = new CompoundUserStats(user.id);
    compoundStats.user = user.id;
    compoundStats.totalSupplied = BigInt.zero();
    compoundStats.totalBorrowed = BigInt.zero();
    compoundStats.totalRepaid = BigInt.zero();
    compoundStats.totalWithdrawn = BigInt.zero();
    compoundStats.totalLiquidated = BigInt.zero();
    compoundStats.save();
  }
  return compoundStats;
}

// Dynamically initialize or retrieve user
function loadUser(id: Bytes): User {
  let user = User.load(id);
  if (!user) {
    user = new User(id);
    user.save();

    // Initialize Aave stats
    let aaveStats = new AaveUserStats(id);
    aaveStats.user = id;
    aaveStats.totalTransactions = BigInt.zero();
    aaveStats.totalSupplied = BigInt.zero();
    aaveStats.totalBorrowed = BigInt.zero();
    aaveStats.totalRepaid = BigInt.zero();
    aaveStats.totalWithdrawn = BigInt.zero();
    aaveStats.totalLiquidated = BigInt.zero();
    aaveStats.useReserveAsCollateral = false;
    aaveStats.save();

    // Initialize Compound stats
    let compoundStats = new CompoundUserStats(id);
    compoundStats.user = id;
    compoundStats.totalTransactions = BigInt.zero();
    compoundStats.totalSupplied = BigInt.zero();
    compoundStats.totalBorrowed = BigInt.zero();
    compoundStats.totalRepaid = BigInt.zero();
    compoundStats.totalWithdrawn = BigInt.zero();
    compoundStats.totalLiquidated = BigInt.zero();
    compoundStats.save();
  }
  return user;
}

export function handleAaveBorrow(event: AaveBorrowEvent): void {
  let user = loadUser(event.params.user);
  // Update total borrowed
  let aaveStats = loadAaveUserStats(user);

  aaveStats.totalTransactions = aaveStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  aaveStats.totalBorrowed = aaveStats.totalBorrowed.plus(event.params.amount);
  aaveStats.save();

  // Save Transaction
  let tx = new BorrowTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = 'Borrow';
  tx.protocol = 'Aave';
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

export function handleAaveLiquidationCall(
  event: AaveLiquidationCallEvent
): void {
  // Update total liquidated
  let user = loadUser(event.params.user);

  let aaveStats = loadAaveUserStats(user);
  aaveStats.totalLiquidated = aaveStats.totalLiquidated.plus(
    event.params.liquidatedCollateralAmount
  );
  aaveStats.totalTransactions = aaveStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  aaveStats.save();

  let tx = new LiquidationTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = 'Liquidation';
  tx.protocol = 'Aave';
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

export function handleAaveRepay(event: AaveRepayEvent): void {
  let user = loadUser(event.params.user);

  let aaveStats = loadAaveUserStats(user);
  // Update total repaid
  aaveStats.totalRepaid = aaveStats.totalRepaid.plus(event.params.amount);
  aaveStats.totalTransactions = aaveStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  aaveStats.save();

  let tx = new RepayTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = 'Repay';
  tx.protocol = 'Aave';
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.repayer = event.params.repayer;
  tx.useATokens = event.params.useATokens;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}

export function handleAaveReserveUsedAsCollateralDisabled(
  event: AaveReserveUsedAsCollateralDisabledEvent
): void {
  let user = loadUser(event.params.user);

  let aaveStats = loadAaveUserStats(user);
  // Update status to false
  aaveStats.useReserveAsCollateral = false;
  aaveStats.save();
}

export function handleAaveReserveUsedAsCollateralEnabled(
  event: AaveReserveUsedAsCollateralEnabledEvent
): void {
  let user = loadUser(event.params.user);

  let aaveStats = loadAaveUserStats(user);
  // Update status to true
  aaveStats.useReserveAsCollateral = true;
  aaveStats.save();
}

export function handleAaveSupply(event: AaveSupplyEvent): void {
  let user = loadUser(event.params.user);

  let aaveStats = loadAaveUserStats(user);
  // Update total supplied
  aaveStats.totalSupplied = aaveStats.totalSupplied.plus(event.params.amount);
  aaveStats.totalTransactions = aaveStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  aaveStats.save();

  let tx = new SupplyTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = 'Supply';
  tx.protocol = 'Aave';
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.onBehalfOf = event.params.onBehalfOf;
  tx.referralCode = event.params.referralCode;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}

export function handleAaveWithdraw(event: AaveWithdrawEvent): void {
  let user = loadUser(event.params.user);

  let aaveStats = loadAaveUserStats(user);
  // Update total withdrawn
  aaveStats.totalWithdrawn = aaveStats.totalWithdrawn.plus(event.params.amount);
  aaveStats.totalTransactions = aaveStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  aaveStats.save();

  let tx = new WithdrawTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  tx.user = user.id;
  tx.eventType = 'Withdraw';
  tx.protocol = 'Aave';
  tx.reserve = event.params.reserve;
  tx.amount = event.params.amount;
  tx.to = event.params.to;
  tx.blockNumber = event.block.number;
  tx.timestamp = event.block.timestamp.toI64();
  tx.transactionHash = event.transaction.hash;
  tx.save();
}

export function handleCompoundAbsorbCollateral(
  event: CompoundAbsorbCollateralEvent
): void {
  let user = loadUser(event.params.borrower);
  // Update total liquidated
  let compoundStats = loadCompoundUserStats(user);

  compoundStats.totalLiquidated = compoundStats.totalLiquidated.plus(
    event.params.collateralAbsorbed
  );
  compoundStats.totalTransactions = compoundStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  compoundStats.save();

  let entity = new LiquidationTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  entity.user = user.id;
  entity.eventType = 'Liquidation';
  entity.protocol = 'Compound';
  entity.amount = event.params.collateralAbsorbed;
  entity.reserve = getUnderlyingAsset(event.address);
  entity.liquidator = event.params.absorber;
  entity.usdValue = event.params.usdValue;
  // Compound does not use ATokens, so set to false
  entity.receiveAToken = false;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp.toI64();
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleCompoundAbsorbDebt(event: CompoundAbsorbDebtEvent): void {
  let user = loadUser(event.params.borrower);
  let compoundStats = loadCompoundUserStats(user);
  // Update total repaid (debt paid off during liquidation)
  compoundStats.totalRepaid = compoundStats.totalRepaid.plus(
    event.params.basePaidOut
  );

  // Update total liquidated (because liquidators take collateral from the borrower)
  compoundStats.totalLiquidated = compoundStats.totalLiquidated.plus(
    event.params.basePaidOut
  );

  compoundStats.totalTransactions = compoundStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );

  compoundStats.save();
  let entity = new RepayTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  entity.user = user.id;
  entity.eventType = 'Repay';
  entity.protocol = 'Compound';
  entity.amount = event.params.basePaidOut; // Debt repaid
  entity.reserve = getUnderlyingAsset(event.address); // Reserve token
  entity.repayer = event.params.absorber; // The absorber repaid the debt
  entity.useATokens = false;
  entity.usdValue = event.params.usdValue;

  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp.toI64();
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCompoundSupply(event: CompoundSupplyEvent): void {
  let user = loadUser(event.params.from);
  // Update total supplied
  let compoundStats = loadCompoundUserStats(user);

  compoundStats.totalSupplied = compoundStats.totalSupplied.plus(
    event.params.amount
  );

  compoundStats.totalTransactions = compoundStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );

  compoundStats.save();
  let entity = new SupplyTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  entity.user = user.id;
  entity.eventType = 'Supply';
  entity.protocol = 'Compound';
  entity.dst = event.params.dst;
  entity.amount = event.params.amount;
  entity.reserve = getUnderlyingAsset(event.address);
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp.toI64();
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCompoundWithdraw(event: CompoundWithdrawEvent): void {
  let user = loadUser(event.params.src);
  // Update total withdraw
  let compoundStats = loadCompoundUserStats(user);

  compoundStats.totalBorrowed = compoundStats.totalBorrowed.plus(
    event.params.amount
  );
  compoundStats.totalTransactions = compoundStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  compoundStats.save();

  let entity = new BorrowTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  entity.user = user.id;
  entity.eventType = 'Borrow';
  entity.protocol = 'Compound';
  entity.reserve = getUnderlyingAsset(event.address);
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp.toI64();
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCompoundWithdrawCollateral(
  event: CompoundWithdrawCollateralEvent
): void {
  let user = loadUser(event.params.src);
  let compoundStats = loadCompoundUserStats(user);

  // Update total withdrawn (User withdrawing collateral they supplied)
  compoundStats.totalWithdrawn = compoundStats.totalWithdrawn.plus(
    event.params.amount
  );
  compoundStats.totalTransactions = compoundStats.totalTransactions.plus(
    BigInt.fromI32(1)
  );
  compoundStats.save();

  let entity = new WithdrawTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHex()
  );
  entity.user = user.id;
  entity.eventType = 'Withdraw';
  entity.protocol = 'Compound';
  entity.amount = event.params.amount;

  // The underlying asset being withdrawn
  entity.reserve = getUnderlyingAsset(event.address);

  entity.to = event.params.to;
  entity.blockNumber = event.block.number;
  entity.timestamp = event.block.timestamp.toI64();
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
