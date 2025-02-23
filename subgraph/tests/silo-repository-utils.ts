import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AssetConfigUpdate,
  BridgeAssetAdded,
  BridgeAssetRemoved,
  BridgePool,
  DefaultSiloMaxDepositsLimitUpdate,
  FeeUpdate,
  GlobalPause,
  InterestRateModel,
  LimitedMaxLiquidityToggled,
  ManagerChanged,
  NewDefaultLiquidationThreshold,
  NewDefaultMaximumLTV,
  NewSilo,
  NotificationReceiverUpdate,
  OwnershipPending,
  OwnershipTransferred,
  PriceProvidersRepositoryUpdate,
  RegisterSiloVersion,
  RouterUpdate,
  SiloDefaultVersion,
  SiloMaxDepositsLimitsUpdate,
  SiloPause,
  TokensFactoryUpdate,
  UnregisterSiloVersion,
  VersionForAsset
} from "../generated/SiloRepository/SiloRepository"

export function createAssetConfigUpdateEvent(
  silo: Address,
  asset: Address,
  assetConfig: ethereum.Tuple
): AssetConfigUpdate {
  let assetConfigUpdateEvent = changetype<AssetConfigUpdate>(newMockEvent())

  assetConfigUpdateEvent.parameters = new Array()

  assetConfigUpdateEvent.parameters.push(
    new ethereum.EventParam("silo", ethereum.Value.fromAddress(silo))
  )
  assetConfigUpdateEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  assetConfigUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "assetConfig",
      ethereum.Value.fromTuple(assetConfig)
    )
  )

  return assetConfigUpdateEvent
}

export function createBridgeAssetAddedEvent(
  newBridgeAsset: Address
): BridgeAssetAdded {
  let bridgeAssetAddedEvent = changetype<BridgeAssetAdded>(newMockEvent())

  bridgeAssetAddedEvent.parameters = new Array()

  bridgeAssetAddedEvent.parameters.push(
    new ethereum.EventParam(
      "newBridgeAsset",
      ethereum.Value.fromAddress(newBridgeAsset)
    )
  )

  return bridgeAssetAddedEvent
}

export function createBridgeAssetRemovedEvent(
  bridgeAssetRemoved: Address
): BridgeAssetRemoved {
  let bridgeAssetRemovedEvent = changetype<BridgeAssetRemoved>(newMockEvent())

  bridgeAssetRemovedEvent.parameters = new Array()

  bridgeAssetRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "bridgeAssetRemoved",
      ethereum.Value.fromAddress(bridgeAssetRemoved)
    )
  )

  return bridgeAssetRemovedEvent
}

export function createBridgePoolEvent(pool: Address): BridgePool {
  let bridgePoolEvent = changetype<BridgePool>(newMockEvent())

  bridgePoolEvent.parameters = new Array()

  bridgePoolEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )

  return bridgePoolEvent
}

export function createDefaultSiloMaxDepositsLimitUpdateEvent(
  newMaxDeposits: BigInt
): DefaultSiloMaxDepositsLimitUpdate {
  let defaultSiloMaxDepositsLimitUpdateEvent =
    changetype<DefaultSiloMaxDepositsLimitUpdate>(newMockEvent())

  defaultSiloMaxDepositsLimitUpdateEvent.parameters = new Array()

  defaultSiloMaxDepositsLimitUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newMaxDeposits",
      ethereum.Value.fromUnsignedBigInt(newMaxDeposits)
    )
  )

  return defaultSiloMaxDepositsLimitUpdateEvent
}

export function createFeeUpdateEvent(
  newEntryFee: BigInt,
  newProtocolShareFee: BigInt,
  newProtocolLiquidationFee: BigInt
): FeeUpdate {
  let feeUpdateEvent = changetype<FeeUpdate>(newMockEvent())

  feeUpdateEvent.parameters = new Array()

  feeUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newEntryFee",
      ethereum.Value.fromUnsignedBigInt(newEntryFee)
    )
  )
  feeUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newProtocolShareFee",
      ethereum.Value.fromUnsignedBigInt(newProtocolShareFee)
    )
  )
  feeUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newProtocolLiquidationFee",
      ethereum.Value.fromUnsignedBigInt(newProtocolLiquidationFee)
    )
  )

  return feeUpdateEvent
}

export function createGlobalPauseEvent(globalPause: boolean): GlobalPause {
  let globalPauseEvent = changetype<GlobalPause>(newMockEvent())

  globalPauseEvent.parameters = new Array()

  globalPauseEvent.parameters.push(
    new ethereum.EventParam(
      "globalPause",
      ethereum.Value.fromBoolean(globalPause)
    )
  )

  return globalPauseEvent
}

export function createInterestRateModelEvent(
  newModel: Address
): InterestRateModel {
  let interestRateModelEvent = changetype<InterestRateModel>(newMockEvent())

  interestRateModelEvent.parameters = new Array()

  interestRateModelEvent.parameters.push(
    new ethereum.EventParam("newModel", ethereum.Value.fromAddress(newModel))
  )

  return interestRateModelEvent
}

export function createLimitedMaxLiquidityToggledEvent(
  newLimitedMaxLiquidityState: boolean
): LimitedMaxLiquidityToggled {
  let limitedMaxLiquidityToggledEvent =
    changetype<LimitedMaxLiquidityToggled>(newMockEvent())

  limitedMaxLiquidityToggledEvent.parameters = new Array()

  limitedMaxLiquidityToggledEvent.parameters.push(
    new ethereum.EventParam(
      "newLimitedMaxLiquidityState",
      ethereum.Value.fromBoolean(newLimitedMaxLiquidityState)
    )
  )

  return limitedMaxLiquidityToggledEvent
}

export function createManagerChangedEvent(manager: Address): ManagerChanged {
  let managerChangedEvent = changetype<ManagerChanged>(newMockEvent())

  managerChangedEvent.parameters = new Array()

  managerChangedEvent.parameters.push(
    new ethereum.EventParam("manager", ethereum.Value.fromAddress(manager))
  )

  return managerChangedEvent
}

export function createNewDefaultLiquidationThresholdEvent(
  defaultLiquidationThreshold: BigInt
): NewDefaultLiquidationThreshold {
  let newDefaultLiquidationThresholdEvent =
    changetype<NewDefaultLiquidationThreshold>(newMockEvent())

  newDefaultLiquidationThresholdEvent.parameters = new Array()

  newDefaultLiquidationThresholdEvent.parameters.push(
    new ethereum.EventParam(
      "defaultLiquidationThreshold",
      ethereum.Value.fromUnsignedBigInt(defaultLiquidationThreshold)
    )
  )

  return newDefaultLiquidationThresholdEvent
}

export function createNewDefaultMaximumLTVEvent(
  defaultMaximumLTV: BigInt
): NewDefaultMaximumLTV {
  let newDefaultMaximumLtvEvent =
    changetype<NewDefaultMaximumLTV>(newMockEvent())

  newDefaultMaximumLtvEvent.parameters = new Array()

  newDefaultMaximumLtvEvent.parameters.push(
    new ethereum.EventParam(
      "defaultMaximumLTV",
      ethereum.Value.fromUnsignedBigInt(defaultMaximumLTV)
    )
  )

  return newDefaultMaximumLtvEvent
}

export function createNewSiloEvent(
  silo: Address,
  asset: Address,
  siloVersion: BigInt
): NewSilo {
  let newSiloEvent = changetype<NewSilo>(newMockEvent())

  newSiloEvent.parameters = new Array()

  newSiloEvent.parameters.push(
    new ethereum.EventParam("silo", ethereum.Value.fromAddress(silo))
  )
  newSiloEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  newSiloEvent.parameters.push(
    new ethereum.EventParam(
      "siloVersion",
      ethereum.Value.fromUnsignedBigInt(siloVersion)
    )
  )

  return newSiloEvent
}

export function createNotificationReceiverUpdateEvent(
  newIncentiveContract: Address
): NotificationReceiverUpdate {
  let notificationReceiverUpdateEvent =
    changetype<NotificationReceiverUpdate>(newMockEvent())

  notificationReceiverUpdateEvent.parameters = new Array()

  notificationReceiverUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newIncentiveContract",
      ethereum.Value.fromAddress(newIncentiveContract)
    )
  )

  return notificationReceiverUpdateEvent
}

export function createOwnershipPendingEvent(
  newPendingOwner: Address
): OwnershipPending {
  let ownershipPendingEvent = changetype<OwnershipPending>(newMockEvent())

  ownershipPendingEvent.parameters = new Array()

  ownershipPendingEvent.parameters.push(
    new ethereum.EventParam(
      "newPendingOwner",
      ethereum.Value.fromAddress(newPendingOwner)
    )
  )

  return ownershipPendingEvent
}

export function createOwnershipTransferredEvent(
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPriceProvidersRepositoryUpdateEvent(
  newProvider: Address
): PriceProvidersRepositoryUpdate {
  let priceProvidersRepositoryUpdateEvent =
    changetype<PriceProvidersRepositoryUpdate>(newMockEvent())

  priceProvidersRepositoryUpdateEvent.parameters = new Array()

  priceProvidersRepositoryUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newProvider",
      ethereum.Value.fromAddress(newProvider)
    )
  )

  return priceProvidersRepositoryUpdateEvent
}

export function createRegisterSiloVersionEvent(
  factory: Address,
  siloLatestVersion: BigInt,
  siloDefaultVersion: BigInt
): RegisterSiloVersion {
  let registerSiloVersionEvent = changetype<RegisterSiloVersion>(newMockEvent())

  registerSiloVersionEvent.parameters = new Array()

  registerSiloVersionEvent.parameters.push(
    new ethereum.EventParam("factory", ethereum.Value.fromAddress(factory))
  )
  registerSiloVersionEvent.parameters.push(
    new ethereum.EventParam(
      "siloLatestVersion",
      ethereum.Value.fromUnsignedBigInt(siloLatestVersion)
    )
  )
  registerSiloVersionEvent.parameters.push(
    new ethereum.EventParam(
      "siloDefaultVersion",
      ethereum.Value.fromUnsignedBigInt(siloDefaultVersion)
    )
  )

  return registerSiloVersionEvent
}

export function createRouterUpdateEvent(newRouter: Address): RouterUpdate {
  let routerUpdateEvent = changetype<RouterUpdate>(newMockEvent())

  routerUpdateEvent.parameters = new Array()

  routerUpdateEvent.parameters.push(
    new ethereum.EventParam("newRouter", ethereum.Value.fromAddress(newRouter))
  )

  return routerUpdateEvent
}

export function createSiloDefaultVersionEvent(
  newDefaultVersion: BigInt
): SiloDefaultVersion {
  let siloDefaultVersionEvent = changetype<SiloDefaultVersion>(newMockEvent())

  siloDefaultVersionEvent.parameters = new Array()

  siloDefaultVersionEvent.parameters.push(
    new ethereum.EventParam(
      "newDefaultVersion",
      ethereum.Value.fromUnsignedBigInt(newDefaultVersion)
    )
  )

  return siloDefaultVersionEvent
}

export function createSiloMaxDepositsLimitsUpdateEvent(
  silo: Address,
  asset: Address,
  newMaxDeposits: BigInt
): SiloMaxDepositsLimitsUpdate {
  let siloMaxDepositsLimitsUpdateEvent =
    changetype<SiloMaxDepositsLimitsUpdate>(newMockEvent())

  siloMaxDepositsLimitsUpdateEvent.parameters = new Array()

  siloMaxDepositsLimitsUpdateEvent.parameters.push(
    new ethereum.EventParam("silo", ethereum.Value.fromAddress(silo))
  )
  siloMaxDepositsLimitsUpdateEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  siloMaxDepositsLimitsUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newMaxDeposits",
      ethereum.Value.fromUnsignedBigInt(newMaxDeposits)
    )
  )

  return siloMaxDepositsLimitsUpdateEvent
}

export function createSiloPauseEvent(
  silo: Address,
  asset: Address,
  pauseValue: boolean
): SiloPause {
  let siloPauseEvent = changetype<SiloPause>(newMockEvent())

  siloPauseEvent.parameters = new Array()

  siloPauseEvent.parameters.push(
    new ethereum.EventParam("silo", ethereum.Value.fromAddress(silo))
  )
  siloPauseEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  siloPauseEvent.parameters.push(
    new ethereum.EventParam(
      "pauseValue",
      ethereum.Value.fromBoolean(pauseValue)
    )
  )

  return siloPauseEvent
}

export function createTokensFactoryUpdateEvent(
  newTokensFactory: Address
): TokensFactoryUpdate {
  let tokensFactoryUpdateEvent = changetype<TokensFactoryUpdate>(newMockEvent())

  tokensFactoryUpdateEvent.parameters = new Array()

  tokensFactoryUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newTokensFactory",
      ethereum.Value.fromAddress(newTokensFactory)
    )
  )

  return tokensFactoryUpdateEvent
}

export function createUnregisterSiloVersionEvent(
  factory: Address,
  siloVersion: BigInt
): UnregisterSiloVersion {
  let unregisterSiloVersionEvent =
    changetype<UnregisterSiloVersion>(newMockEvent())

  unregisterSiloVersionEvent.parameters = new Array()

  unregisterSiloVersionEvent.parameters.push(
    new ethereum.EventParam("factory", ethereum.Value.fromAddress(factory))
  )
  unregisterSiloVersionEvent.parameters.push(
    new ethereum.EventParam(
      "siloVersion",
      ethereum.Value.fromUnsignedBigInt(siloVersion)
    )
  )

  return unregisterSiloVersionEvent
}

export function createVersionForAssetEvent(
  asset: Address,
  version: BigInt
): VersionForAsset {
  let versionForAssetEvent = changetype<VersionForAsset>(newMockEvent())

  versionForAssetEvent.parameters = new Array()

  versionForAssetEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  versionForAssetEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return versionForAssetEvent
}
