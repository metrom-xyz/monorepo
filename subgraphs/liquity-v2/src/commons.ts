import {
    Address,
    BigInt,
    Bytes,
    DataSourceContext,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    Collateral,
    CollateralRegistry,
    StabilityPoolPosition,
    Trove,
} from "../generated/schema";
import { TroveNFT as TroveNFTContract } from "../generated/templates/TroveManager/TroveNFT";
import { Erc20 } from "../generated/DebtToken/Erc20";
import { Erc20BytesSymbol } from "../generated/DebtToken/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/DebtToken/Erc20BytesName";
import { TroveManager as TroveManagerContract } from "../generated/DebtToken/TroveManager";
import {
    StabilityPool as StabilityPoolTemplate,
    TroveManager as TroveManagerTemplate,
    TroveNFT as TroveNFTTemplate,
} from "../generated/templates";

export const ZERO_ADDRESS = Address.zero();
export const BI_0 = BigInt.zero();

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getTroveId(collateralId: Bytes, onChainTroveId: BigInt): Bytes {
    return collateralId.concat(
        Bytes.fromByteArray(Bytes.fromBigInt(onChainTroveId)),
    );
}

export function getOrCreateTrove(
    collateralId: Bytes,
    onChainTroveId: BigInt,
    troveNftContractAddress: Address,
): Trove {
    let id = collateralId.concat(
        Bytes.fromByteArray(Bytes.fromBigInt(onChainTroveId)),
    );
    let trove = Trove.load(id);
    if (trove != null) return trove;

    let owner = TroveNFTContract.bind(troveNftContractAddress).ownerOf(
        onChainTroveId,
    );

    trove = new Trove(id);
    trove.owner = owner;
    trove.collateral = collateralId;
    trove.interestRate = BI_0;
    trove.tvl = BI_0;
    trove.mintedDebt = BI_0;
    trove.save();

    return trove;
}

export function getTroveOrThrow(
    collateralId: Bytes,
    onChainTroveId: BigInt,
): Trove {
    let id = collateralId.concat(
        Bytes.fromByteArray(Bytes.fromBigInt(onChainTroveId)),
    );
    let trove = Trove.load(id);
    if (trove != null) return trove;

    throw new Error(
        `Cannot find trove with id ${onChainTroveId} for collateral ${collateralId}`,
    );
}

export function getOrCreateStabilityPoolPosition(
    collateralId: Bytes,
    account: Bytes,
): StabilityPoolPosition {
    let id = collateralId.concat(account);
    let position = StabilityPoolPosition.load(id);
    if (position != null) return position;

    position = new StabilityPoolPosition(id);
    position.collateral = collateralId;
    position.owner = account;
    position.tvl = BI_0;
    position.save();

    return position;
}

export function getCollateralOrThrow(id: Bytes): Collateral {
    let collateral = Collateral.load(id);
    if (collateral != null) return collateral;

    throw new Error(`Could not find collateral with id ${id.toHex()}:`);
}

export function fetchTokenSymbol(address: Address): string | null {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return null;
}

export function fetchTokenName(address: Address): string | null {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    return null;
}

export function fetchTokenDecimals(address: Address): BigInt | null {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    return result.reverted ? null : result.value;
}

export function getOrCreateRegistry(address: Address): CollateralRegistry {
    let registry = CollateralRegistry.load(address);
    if (registry !== null) return registry;

    registry = new CollateralRegistry(address);
    registry.collateralsAmount = 0;
    registry.save();

    return registry;
}

export function getRegistryOrThrow(address: Address): CollateralRegistry {
    let registry = CollateralRegistry.load(address);
    if (registry !== null) return registry;

    throw new Error(`Could not find registry with address ${address}`);
}

export function getOrCreateCollateral(
    index: i32,
    tokenAddress: Address,
    troveManagerAddress: Address,
    registryAddress: Address,
): Collateral {
    let collateral = Collateral.load(tokenAddress);
    if (collateral !== null) return collateral;

    let tokenSymbol = fetchTokenSymbol(tokenAddress);
    if (tokenSymbol === null)
        throw new Error(
            `Could not correctly resolve ERC20 collateral token symbol at address ${tokenAddress}`,
        );

    let tokenName = fetchTokenName(tokenAddress);
    if (tokenName === null)
        throw new Error(
            `Could not correctly resolve ERC20 collateral token name at address ${tokenAddress}, skipping indexing`,
        );

    let tokenDecimals = fetchTokenDecimals(tokenAddress);
    if (tokenDecimals === null)
        throw new Error(
            `Could not correctly resolve ERC20 collateral token decimals at address ${tokenAddress}, skipping indexing`,
        );

    let troveManagerContract = TroveManagerContract.bind(troveManagerAddress);
    let troveNftAddress = troveManagerContract.troveNFT();
    let stabilityPoolAddress = troveManagerContract.stabilityPool();

    collateral = new Collateral(tokenAddress);
    collateral.registry = registryAddress;
    collateral.name = tokenName;
    collateral.symbol = tokenSymbol;
    collateral.decimals = tokenDecimals;
    collateral.index = index;
    collateral.tvl = BI_0;
    collateral.mintedDebt = BI_0;
    collateral.stabilityPoolDebt = BI_0;
    collateral.stabilityPool = stabilityPoolAddress;
    collateral.troveManager = troveManagerAddress;
    collateral.save();

    let troveManagerContext = new DataSourceContext();
    troveManagerContext.setBytes("troveNftAddress", troveNftAddress);
    troveManagerContext.setBytes("collateralId", collateral.id);
    TroveManagerTemplate.createWithContext(
        troveManagerAddress,
        troveManagerContext,
    );

    let stabilityPoolContext = new DataSourceContext();
    stabilityPoolContext.setBytes("collateralId", collateral.id);
    StabilityPoolTemplate.createWithContext(
        stabilityPoolAddress,
        stabilityPoolContext,
    );

    let troveNftContext = new DataSourceContext();
    troveNftContext.setBytes("collateralId", collateral.id);
    TroveNFTTemplate.createWithContext(troveNftAddress, troveNftContext);

    return collateral;
}
