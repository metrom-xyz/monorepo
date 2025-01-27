import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
import { Pool, Tick, Token } from "../generated/schema";
import { NonFungiblePositionManager } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager";
import { Factory } from "../generated/Factory/Factory";
import {
    FACTORY_ADDRESS,
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS,
} from "./addresses";
import { Erc20 } from "../generated/Factory/Erc20";
import { Erc20BytesSymbol } from "../generated/Factory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Factory/Erc20BytesName";

export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_1_000_000 = BigInt.fromI32(1_000_000);

export const BD_0 = BigDecimal.zero();
export const BD_1 = BigDecimal.fromString("1");
export const BD_10 = BigDecimal.fromString("10");
export const BD_TICK_BASE = BigDecimal.fromString("1.0001");
export const BD_Q192 = BigDecimal.fromString(
    BigInt.fromI32(2)
        .pow(192 as u8)
        .toString(),
);

export const NonFungiblePositionManagerContract =
    NonFungiblePositionManager.bind(NON_FUNGIBLE_POSITION_MANAGER_ADDRESS);
export const FactoryContract = Factory.bind(FACTORY_ADDRESS);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getPoolOrThrow(address: Address): Pool {
    let pool = Pool.load(address);
    if (pool != null) return pool;

    throw new Error(`Could not find pool with address ${address.toHex()}`);
}

export function getTokenOrThrow(address: Address): Token {
    let token = Token.load(address);
    if (token != null) return token;

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
    token.decimals = decimals;
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
    tick.idx = BigInt.fromI32(idx);
    tick.pool = poolAddress;
    tick.liquidityGross = BI_0;
    tick.liquidityNet = BI_0;
    tick.save();

    return tick;
}

export function getFeeAdjustedAmount(amount: BigInt, fee: BigInt): BigInt {
    // fees are taken from the input amount, so if the given amount
    // is negative (i.e. removing from pool, we just leave the
    // amount unchanged)
    return amount.lt(BI_0)
        ? amount
        : amount.times(BI_1_000_000.minus(fee)).div(BI_1_000_000);
}

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let result = "1";

    for (let i = 0; i < decimals.toI32(); i++) {
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
