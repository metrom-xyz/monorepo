import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
    Collateral,
    StabilityPool,
    StabilityPoolPosition,
    Trove,
} from "../generated/schema";
import { TroveNFT as TroveNFTContract } from "../generated/templates/TroveManager/TroveNFT";
import { Erc20 } from "../generated/DebtToken/Erc20";
import { Erc20BytesSymbol } from "../generated/DebtToken/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/DebtToken/Erc20BytesName";

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
    trove.debt = BI_0;
    trove.deposit = BI_0;
    trove.interestRate = BI_0;
    trove.save();

    return trove;
}

export function getOrCreateStabilityPool(collateralId: Bytes): StabilityPool {
    let pool = StabilityPool.load(collateralId);
    if (pool != null) return pool;

    pool = new StabilityPool(collateralId);
    pool.collateral = collateralId;
    pool.deposited = BI_0;
    pool.save();

    return pool;
}

export function getOrCreateStabilityPoolPosition(
    poolId: Bytes,
    account: Bytes,
): StabilityPoolPosition {
    let id = poolId.concat(account);
    let position = StabilityPoolPosition.load(id);
    if (position != null) return position;

    position = new StabilityPoolPosition(id);
    position.pool = poolId;
    position.owner = account;
    position.deposited = BI_0;
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
