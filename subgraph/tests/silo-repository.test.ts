import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AssetConfigUpdate } from "../generated/schema"
import { AssetConfigUpdate as AssetConfigUpdateEvent } from "../generated/SiloRepository/SiloRepository"
import { handleAssetConfigUpdate } from "../src/silo-repository"
import { createAssetConfigUpdateEvent } from "./silo-repository-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let silo = Address.fromString("0x0000000000000000000000000000000000000001")
    let asset = Address.fromString("0x0000000000000000000000000000000000000001")
    let assetConfig = "ethereum.Tuple Not implemented"
    let newAssetConfigUpdateEvent = createAssetConfigUpdateEvent(
      silo,
      asset,
      assetConfig
    )
    handleAssetConfigUpdate(newAssetConfigUpdateEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AssetConfigUpdate created and stored", () => {
    assert.entityCount("AssetConfigUpdate", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AssetConfigUpdate",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "silo",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AssetConfigUpdate",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "asset",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AssetConfigUpdate",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assetConfig",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
