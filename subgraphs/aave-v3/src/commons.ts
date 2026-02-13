import {
    Address,
    BigInt,
    Bytes,
    dataSource,
    ethereum,
} from "@graphprotocol/graph-ts";
import { Erc20 } from "../generated/PoolAddressesProviderRegistry/Erc20";
import { Erc20BytesSymbol } from "../generated/PoolAddressesProviderRegistry/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/PoolAddressesProviderRegistry/Erc20BytesName";
import { Position, Reserve } from "../generated/schema";

export const DATA_SOURCE_CONTEXT_KEY_POOL = "pool";
export const DATA_SOURCE_CONTEXT_KEY_ASSET = "asset";

export const ZERO_ADDRESS = Address.zero();
export const BI_0 = BigInt.zero();

const RAY = BigInt.fromI32(10).pow(27);
const HALF_RAY = BigInt.fromI32(10).pow(27);

function getReserveId(pool: Bytes, asset: Bytes): Bytes {
    return pool.concat(asset);
}

export function getOrCreateReserve(
    pool: Bytes,
    asset: Bytes,
    aToken: Bytes,
    vToken: Bytes,
    sToken: Bytes,
): Reserve {
    const id = getReserveId(pool, asset);
    let reserve = Reserve.load(id);
    if (reserve !== null) return reserve;

    reserve = new Reserve(id);
    reserve.address = asset;
    reserve.symbol = fetchTokenSymbol(changetype<Address>(asset));
    reserve.name = fetchTokenName(changetype<Address>(asset));
    reserve.decimals = fetchTokenDecimals(changetype<Address>(asset));
    reserve.pool = pool;
    reserve.active = true;
    reserve.aToken = aToken;
    reserve.vToken = vToken;
    reserve.sToken = sToken == ZERO_ADDRESS ? null : sToken;
    reserve.scaledSupply = BI_0;
    reserve.scaledVariableDebt = BI_0;
    reserve.stableDebt = BI_0;
    reserve.liquidityIndex = BI_0;
    reserve.variableBorrowIndex = BI_0;
    reserve.save();

    return reserve;
}

export function getReserveOrThrow(pool: Bytes, asset: Bytes): Reserve {
    const id = getReserveId(pool, asset);
    const reserve = Reserve.load(id);
    if (reserve !== null) return reserve;

    throw new Error(
        `Could not find reserve for asset ${asset.toHex()} on pool ${pool.toHex()}`,
    );
}

function getPositionId(pool: Bytes, asset: Bytes, owner: Address): Bytes {
    return pool.concat(asset).concat(owner);
}

export function getOrCreatePosition(
    pool: Bytes,
    asset: Bytes,
    owner: Address,
): Position {
    const id = getPositionId(pool, asset, owner);
    let position = Position.load(id);
    if (position !== null) return position;

    position = new Position(id);
    position.pool = pool;
    position.reserve = getReserveId(pool, asset);
    position.owner = owner;
    position.scaledSupply = BI_0;
    position.scaledVariableDebt = BI_0;
    position.stableDebt = BI_0;
    position.save();

    return position;
}

export function getPositionOrThrow(
    pool: Bytes,
    asset: Bytes,
    owner: Address,
): Position {
    const id = getPositionId(pool, asset, owner);
    const position = Position.load(id);
    if (position !== null) return position;

    throw new Error(
        `Could not find position for asset ${asset.toHex()} on pool ${pool.toHex()} for owner ${owner.toHex()}`,
    );
}

export function fetchTokenSymbol(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_symbol();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesSymbol.bind(address);
    let bytesResult = bytesContract.try_symbol();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(`Could not resolve symbol for token ${address.toHex()}`);
}

export function fetchTokenName(address: Address): string {
    let contract = Erc20.bind(address);
    let result = contract.try_name();
    if (!result.reverted) return result.value;

    let bytesContract = Erc20BytesName.bind(address);
    let bytesResult = bytesContract.try_name();
    if (!bytesResult.reverted) return bytesResult.value.toString();

    throw new Error(`Could not resolve name for token ${address.toHex()}`);
}

export function fetchTokenDecimals(address: Address): i32 {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    if (!result.reverted) return result.value.toI32();

    throw new Error(`Could not resolve decimals for token ${address.toHex()}`);
}

export function rayDiv(a: BigInt, b: BigInt): BigInt {
    let halfB = b.div(BigInt.fromI32(2));
    let result = a.times(RAY);
    result = result.plus(halfB);
    let division = result.div(b);
    return division;
}

export function rayMul(a: BigInt, b: BigInt): BigInt {
    let result = a.times(b);
    result = result.plus(HALF_RAY);
    let mult = result.div(RAY);
    return mult;
}

export function getUpdateBlock(network: string): BigInt {
    if (network === "optimism") {
        return BigInt.fromI32(775471);
    } else if (network === "polygon") {
        return BigInt.fromI32(42535602);
    } else if (network === "arbitrum") {
        return BigInt.fromI32(89267099);
    } else if (network === "avalanche") {
        return BigInt.fromI32(29829396);
    } else {
        return BI_0;
    }
}

export function processRebasingTokenBalanceChange(
    address: Address,
    delta: BigInt,
    balanceIncrease: BigInt,
    index: BigInt | null,
    event: ethereum.Event,
): void {
    const adjustedAbsoluteDelta = delta.abs().plus(balanceIncrease);
    const scaledAbsoluteDelta =
        index === null
            ? adjustedAbsoluteDelta
            : rayDiv(adjustedAbsoluteDelta, index);
    const scaledDelta =
        delta < BI_0 ? scaledAbsoluteDelta.neg() : scaledAbsoluteDelta;

    const context = dataSource.context();
    const pool = context.getBytes(DATA_SOURCE_CONTEXT_KEY_POOL);
    const asset = context.getBytes(DATA_SOURCE_CONTEXT_KEY_ASSET);

    const reserve = getReserveOrThrow(pool, asset);
    const position =
        delta < BI_0
            ? getPositionOrThrow(pool, asset, address)
            : getOrCreatePosition(pool, asset, address);

    if (event.address == reserve.aToken) {
        position.scaledSupply = position.scaledSupply.plus(scaledDelta);
        reserve.scaledSupply = reserve.scaledSupply.plus(scaledDelta);
    } else if (event.address == reserve.vToken) {
        position.scaledVariableDebt =
            position.scaledVariableDebt.plus(scaledDelta);
        reserve.scaledVariableDebt =
            reserve.scaledVariableDebt.plus(scaledDelta);
    } else if (!!reserve.sToken && event.address == reserve.sToken!) {
        position.stableDebt = position.stableDebt.plus(scaledDelta);
        reserve.stableDebt = reserve.stableDebt.plus(scaledDelta);
    } else {
        throw new Error("noop");
    }

    position.save();
    reserve.save();
}
