import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AbsorbCollateral } from "../generated/schema"
import { AbsorbCollateral as AbsorbCollateralEvent } from "../generated/Comet/Comet"
import { handleAbsorbCollateral } from "../src/comet"
import { createAbsorbCollateralEvent } from "./comet-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let absorber = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let borrower = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let asset = Address.fromString("0x0000000000000000000000000000000000000001")
    let collateralAbsorbed = BigInt.fromI32(234)
    let usdValue = BigInt.fromI32(234)
    let newAbsorbCollateralEvent = createAbsorbCollateralEvent(
      absorber,
      borrower,
      asset,
      collateralAbsorbed,
      usdValue
    )
    handleAbsorbCollateral(newAbsorbCollateralEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AbsorbCollateral created and stored", () => {
    assert.entityCount("AbsorbCollateral", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AbsorbCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "absorber",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AbsorbCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "borrower",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AbsorbCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "asset",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AbsorbCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "collateralAbsorbed",
      "234"
    )
    assert.fieldEquals(
      "AbsorbCollateral",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "usdValue",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
