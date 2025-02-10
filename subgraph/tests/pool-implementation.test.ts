import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { User, Transaction } from "../generated/schema"
import { Borrow as BorrowEvent } from "../generated/PoolImplementation/PoolImplementation"
import { handleBorrow } from "../src/mapping"
import { createBorrowEvent } from "./pool-implementation-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let reserve = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let user = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let onBehalfOf = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let interestRateMode = 1
    let borrowRate = BigInt.fromI32(10)
    let referralCode = 1234
    let newBorrowEvent = createBorrowEvent(
      reserve,
      user,
      onBehalfOf,
      amount,
      interestRateMode,
      borrowRate,
      referralCode
    )
    handleBorrow(newBorrowEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("User created and stored", () => {
    assert.entityCount("User", 1)
    assert.entityCount("Transaction", 1)
    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "User",
      "0x0000000000000000000000000000000000000001",
      "totalBorrowed",
      "234"
    )
    assert.fieldEquals(
      "Transaction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
