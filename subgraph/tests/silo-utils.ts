import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AssetStatusUpdate,
  Borrow,
  Deposit,
  Liquidate,
  Repay,
  Withdraw
} from "../generated/Silo/Silo"

export function createAssetStatusUpdateEvent(
  asset: Address,
  status: i32
): AssetStatusUpdate {
  let assetStatusUpdateEvent = changetype<AssetStatusUpdate>(newMockEvent())

  assetStatusUpdateEvent.parameters = new Array()

  assetStatusUpdateEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  assetStatusUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return assetStatusUpdateEvent
}

export function createBorrowEvent(
  asset: Address,
  user: Address,
  amount: BigInt
): Borrow {
  let borrowEvent = changetype<Borrow>(newMockEvent())

  borrowEvent.parameters = new Array()

  borrowEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return borrowEvent
}

export function createDepositEvent(
  asset: Address,
  depositor: Address,
  amount: BigInt,
  collateralOnly: boolean
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "collateralOnly",
      ethereum.Value.fromBoolean(collateralOnly)
    )
  )

  return depositEvent
}

export function createLiquidateEvent(
  asset: Address,
  user: Address,
  shareAmountRepaid: BigInt,
  seizedCollateral: BigInt
): Liquidate {
  let liquidateEvent = changetype<Liquidate>(newMockEvent())

  liquidateEvent.parameters = new Array()

  liquidateEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "shareAmountRepaid",
      ethereum.Value.fromUnsignedBigInt(shareAmountRepaid)
    )
  )
  liquidateEvent.parameters.push(
    new ethereum.EventParam(
      "seizedCollateral",
      ethereum.Value.fromUnsignedBigInt(seizedCollateral)
    )
  )

  return liquidateEvent
}

export function createRepayEvent(
  asset: Address,
  user: Address,
  amount: BigInt
): Repay {
  let repayEvent = changetype<Repay>(newMockEvent())

  repayEvent.parameters = new Array()

  repayEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return repayEvent
}

export function createWithdrawEvent(
  asset: Address,
  depositor: Address,
  receiver: Address,
  amount: BigInt,
  collateralOnly: boolean
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "collateralOnly",
      ethereum.Value.fromBoolean(collateralOnly)
    )
  )

  return withdrawEvent
}
