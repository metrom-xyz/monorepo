import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    AlmStrategy,
    AlmStrategyPosition,
    ConcentratedPool,
    ConcentratedPosition,
    FullRangePool,
    Tick,
    Token,
} from "../generated/schema";
import { NonFungiblePositionManager } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { AlmCore } from "../generated/AlmCore/AlmCore";
import { PoolFactory } from "../generated/PoolFactory/PoolFactory";
import { ClFactory } from "../generated/ClFactory/ClFactory";
import {
    POOL_FACTORY_ADDRESS,
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
    CL_FACTORY_ADDRESS,
    ALM_CORE_ADDRESS,
} from "./addresses";
import { Erc20 } from "../generated/PoolFactory/Erc20";
import { Erc20BytesSymbol } from "../generated/PoolFactory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/PoolFactory/Erc20BytesName";

export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_10_000 = BigInt.fromI32(10_000);

export const BD_0 = BigDecimal.zero();
export const BD_1 = BigDecimal.fromString("1");
export const BD_2 = BigDecimal.fromString("2");
export const BD_10 = BigDecimal.fromString("10");
export const BD_SQRT_PRECISION = BigDecimal.fromString("0.0000001");
export const BD_TICK_BASE = BigDecimal.fromString("1.0001");
export const BD_Q192 = BigDecimal.fromString(
    BigInt.fromI32(2)
        .pow(192 as u8)
        .toString(),
);

export const NonFungiblePositionManagerContract =
    NonFungiblePositionManager.bind(NON_FUNGIBLE_POSITION_MANAGER_ADDRESS);
export const PoolFactoryContract = PoolFactory.bind(POOL_FACTORY_ADDRESS);
export const ClFactoryContract = ClFactory.bind(CL_FACTORY_ADDRESS);
export const AlmCoreContract = AlmCore.bind(ALM_CORE_ADDRESS);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getFullRangePoolOrThrow(address: Address): FullRangePool {
    let pool = FullRangePool.load(address);
    if (pool !== null) return pool;

    throw new Error(
        `Could not find full range pool with address ${address.toHex()}`,
    );
}

export function getConcentratedPoolOrThrow(address: Address): ConcentratedPool {
    let pool = ConcentratedPool.load(address);
    if (pool !== null) return pool;

    throw new Error(
        `Could not find concentrated pool with address ${address.toHex()}`,
    );
}

export function getAlmStrategyOrThrow(address: Address): AlmStrategy {
    let wrapper = AlmStrategy.load(address);
    if (wrapper !== null) return wrapper;

    throw new Error(
        `Could not find ALM strategy at address ${address.toHex()}`,
    );
}

function getAlmStrategyPositionId(address: Address, owner: Address): Bytes {
    return address.concat(owner);
}

export function getOrCreateAlmStrategyPosition(
    address: Address,
    owner: Address,
    pool: Address,
): AlmStrategyPosition {
    let id = getAlmStrategyPositionId(address, owner);
    let position = AlmStrategyPosition.load(id);
    if (position !== null) return position;

    position = new AlmStrategyPosition(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.strategy = address;
    position.pool = pool;
    position.save();

    return position;
}

export function getAlmStrategyPositionOrThrow(
    address: Address,
    owner: Address,
): AlmStrategyPosition {
    let position = AlmStrategyPosition.load(
        getAlmStrategyPositionId(address, owner),
    );
    if (position !== null) return position;

    throw new Error(
        `Could not find position for owner ${owner.toHex()} on ALM strategy ${address.toHex()}`,
    );
}

export function getConcentratedPositionId(tokenId: BigInt): Bytes {
    return Bytes.fromByteArray(Bytes.fromBigInt(tokenId));
}

export function getConcentratedPositionOrThrow(
    tokenId: BigInt,
): ConcentratedPosition {
    let position = ConcentratedPosition.load(
        getConcentratedPositionId(tokenId),
    );
    if (position !== null) return position;

    throw new Error(
        `Could not find concentrated position with token id ${tokenId.toString()}`,
    );
}

export function getTokenOrThrow(address: Address): Token {
    let token = Token.load(address);
    if (token !== null) return token;

    throw new Error(`Could not find token with address ${address.toHex()}`);
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

export function getOrCreateToken(address: Address): Token | null {
    let token = Token.load(address);
    if (token !== null) return token;

    let symbol = fetchTokenSymbol(address);
    if (symbol === null) return null;

    let name = fetchTokenName(address);
    if (name === null) return null;

    let decimals = fetchTokenDecimals(address);
    if (decimals === null) return null;

    token = new Token(address);
    token.symbol = symbol;
    token.name = name;
    token.decimals = decimals.toI32();
    token.save();

    return token;
}

export function getOrCreateTick(poolAddress: Bytes, idx: i32): Tick {
    let id = poolAddress.concat(Bytes.fromI32(idx));
    let tick = Tick.load(id);
    if (tick !== null) {
        return tick;
    }

    tick = new Tick(id);
    tick.idx = idx;
    tick.pool = poolAddress;
    tick.liquidityGross = BI_0;
    tick.liquidityNet = BI_0;
    tick.save();

    return tick;
}

export function exponentToBigDecimal(decimals: i32): BigDecimal {
    let result = "1";

    for (let i = 0; i < decimals; i++) {
        result += "0";
    }

    return BigDecimal.fromString(result);
}

export function getPrice(
    sqrtPriceX96: BigInt,
    token0Id: Bytes,
    token1Id: Bytes,
): BigDecimal {
    let token0 = getTokenOrThrow(changetype<Address>(token0Id));
    let token1 = getTokenOrThrow(changetype<Address>(token1Id));

    return sqrtPriceX96
        .times(sqrtPriceX96)
        .toBigDecimal()
        .div(BD_Q192)
        .times(exponentToBigDecimal(token0.decimals))
        .div(exponentToBigDecimal(token1.decimals));
}

export function abs(value: BigDecimal): BigDecimal {
    return value.lt(BD_0) ? value.neg() : value;
}

export function sqrt(value: BigDecimal): BigDecimal {
    if (value.le(BD_0)) {
        return BD_0; // No negative sqrt
    }

    let x = value.div(BD_2); // Initial guess: value / 2
    let prev = BD_0;
    while (abs(x.minus(prev)).gt(BD_SQRT_PRECISION)) {
        prev = x;
        x = x.plus(value.div(x)).div(BD_2); // Newton’s iteration
    }

    return x;
}
