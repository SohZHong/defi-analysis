import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Borrow as BorrowEvent,
  FlashLoan as FlashLoanEvent,
  LiquidationCall as LiquidationCallEvent,
  Repay as RepayEvent,
  ReserveUsedAsCollateralDisabled as ReserveUsedAsCollateralDisabledEvent,
  ReserveUsedAsCollateralEnabled as ReserveUsedAsCollateralEnabledEvent,
  Supply as SupplyEvent,
  Withdraw as WithdrawEvent,
} from "../generated/PoolImplementation/PoolImplementation";
import {
  BorrowTransaction,
  FlashLoanTransaction,
  LiquidationTransaction,
  RepayTransaction,
  SupplyTransaction,
  User,
  WithdrawTransaction,
} from "../generated/schema";

// Dynamically initialize or retrieve user
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

export function handleReserveUsedAsCollateralDisabled(
  event: ReserveUsedAsCollateralDisabledEvent
): void {
  let user = loadUser(event.params.user);
  // Update status to false
  user.useReserveAsCollateral = false;
  user.save();
}

export function handleReserveUsedAsCollateralEnabled(
  event: ReserveUsedAsCollateralEnabledEvent
): void {
  let user = loadUser(event.params.user);
  // Update status to true
  user.useReserveAsCollateral = true;
  user.save();
}

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
