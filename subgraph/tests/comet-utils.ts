import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AbsorbCollateral,
  AbsorbDebt,
  BuyCollateral,
  PauseAction,
  Supply,
  SupplyCollateral,
  Transfer,
  TransferCollateral,
  Withdraw,
  WithdrawCollateral,
  WithdrawReserves
} from "../generated/Comet/Comet"

export function createAbsorbCollateralEvent(
  absorber: Address,
  borrower: Address,
  asset: Address,
  collateralAbsorbed: BigInt,
  usdValue: BigInt
): AbsorbCollateral {
  let absorbCollateralEvent = changetype<AbsorbCollateral>(newMockEvent())

  absorbCollateralEvent.parameters = new Array()

  absorbCollateralEvent.parameters.push(
    new ethereum.EventParam("absorber", ethereum.Value.fromAddress(absorber))
  )
  absorbCollateralEvent.parameters.push(
    new ethereum.EventParam("borrower", ethereum.Value.fromAddress(borrower))
  )
  absorbCollateralEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  absorbCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAbsorbed",
      ethereum.Value.fromUnsignedBigInt(collateralAbsorbed)
    )
  )
  absorbCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "usdValue",
      ethereum.Value.fromUnsignedBigInt(usdValue)
    )
  )

  return absorbCollateralEvent
}

export function createAbsorbDebtEvent(
  absorber: Address,
  borrower: Address,
  basePaidOut: BigInt,
  usdValue: BigInt
): AbsorbDebt {
  let absorbDebtEvent = changetype<AbsorbDebt>(newMockEvent())

  absorbDebtEvent.parameters = new Array()

  absorbDebtEvent.parameters.push(
    new ethereum.EventParam("absorber", ethereum.Value.fromAddress(absorber))
  )
  absorbDebtEvent.parameters.push(
    new ethereum.EventParam("borrower", ethereum.Value.fromAddress(borrower))
  )
  absorbDebtEvent.parameters.push(
    new ethereum.EventParam(
      "basePaidOut",
      ethereum.Value.fromUnsignedBigInt(basePaidOut)
    )
  )
  absorbDebtEvent.parameters.push(
    new ethereum.EventParam(
      "usdValue",
      ethereum.Value.fromUnsignedBigInt(usdValue)
    )
  )

  return absorbDebtEvent
}

export function createBuyCollateralEvent(
  buyer: Address,
  asset: Address,
  baseAmount: BigInt,
  collateralAmount: BigInt
): BuyCollateral {
  let buyCollateralEvent = changetype<BuyCollateral>(newMockEvent())

  buyCollateralEvent.parameters = new Array()

  buyCollateralEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyCollateralEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  buyCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "baseAmount",
      ethereum.Value.fromUnsignedBigInt(baseAmount)
    )
  )
  buyCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "collateralAmount",
      ethereum.Value.fromUnsignedBigInt(collateralAmount)
    )
  )

  return buyCollateralEvent
}

export function createPauseActionEvent(
  supplyPaused: boolean,
  transferPaused: boolean,
  withdrawPaused: boolean,
  absorbPaused: boolean,
  buyPaused: boolean
): PauseAction {
  let pauseActionEvent = changetype<PauseAction>(newMockEvent())

  pauseActionEvent.parameters = new Array()

  pauseActionEvent.parameters.push(
    new ethereum.EventParam(
      "supplyPaused",
      ethereum.Value.fromBoolean(supplyPaused)
    )
  )
  pauseActionEvent.parameters.push(
    new ethereum.EventParam(
      "transferPaused",
      ethereum.Value.fromBoolean(transferPaused)
    )
  )
  pauseActionEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawPaused",
      ethereum.Value.fromBoolean(withdrawPaused)
    )
  )
  pauseActionEvent.parameters.push(
    new ethereum.EventParam(
      "absorbPaused",
      ethereum.Value.fromBoolean(absorbPaused)
    )
  )
  pauseActionEvent.parameters.push(
    new ethereum.EventParam("buyPaused", ethereum.Value.fromBoolean(buyPaused))
  )

  return pauseActionEvent
}

export function createSupplyEvent(
  from: Address,
  dst: Address,
  amount: BigInt
): Supply {
  let supplyEvent = changetype<Supply>(newMockEvent())

  supplyEvent.parameters = new Array()

  supplyEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return supplyEvent
}

export function createSupplyCollateralEvent(
  from: Address,
  dst: Address,
  asset: Address,
  amount: BigInt
): SupplyCollateral {
  let supplyCollateralEvent = changetype<SupplyCollateral>(newMockEvent())

  supplyCollateralEvent.parameters = new Array()

  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return supplyCollateralEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return transferEvent
}

export function createTransferCollateralEvent(
  from: Address,
  to: Address,
  asset: Address,
  amount: BigInt
): TransferCollateral {
  let transferCollateralEvent = changetype<TransferCollateral>(newMockEvent())

  transferCollateralEvent.parameters = new Array()

  transferCollateralEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferCollateralEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferCollateralEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  transferCollateralEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return transferCollateralEvent
}

export function createWithdrawEvent(
  src: Address,
  to: Address,
  amount: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawEvent
}

export function createWithdrawCollateralEvent(
  src: Address,
  to: Address,
  asset: Address,
  amount: BigInt
): WithdrawCollateral {
  let withdrawCollateralEvent = changetype<WithdrawCollateral>(newMockEvent())

  withdrawCollateralEvent.parameters = new Array()

  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawCollateralEvent
}

export function createWithdrawReservesEvent(
  to: Address,
  amount: BigInt
): WithdrawReserves {
  let withdrawReservesEvent = changetype<WithdrawReserves>(newMockEvent())

  withdrawReservesEvent.parameters = new Array()

  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawReservesEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawReservesEvent
}
