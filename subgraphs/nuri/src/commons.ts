import {
    Address,
    BigDecimal,
    BigInt,
    ByteArray,
    Bytes,
    crypto,
    ethereum,
} from "@graphprotocol/graph-ts";
import { FullRangePool, Tick, Token } from "../generated/schema";
import { Erc20 } from "../generated/FullRangeFactory/Erc20";
import { Erc20BytesSymbol } from "../generated/FullRangeFactory/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/FullRangeFactory/Erc20BytesName";

export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_1_000_000 = BigInt.fromI32(1_000_000);

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

export const ERC20_TRANSFER_EVENT_SIGNATURE = crypto.keccak256(
    ByteArray.fromUTF8("Transfer(address,address,uint256)"),
);

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getFullRangePoolOrThrow(address: Address): FullRangePool {
    let pool = FullRangePool.load(address);
    if (pool != null) return pool;

    throw new Error(
        `Could not find full range pool with address ${address.toHex()}`,
    );
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

export function fetchTokenDecimals(address: Address): i32 {
    let contract = Erc20.bind(address);
    let result = contract.try_decimals();
    return result.reverted ? -1 : result.value.toI32();
}

export function getOrCreateToken(address: Address): Token | null {
    let token = Token.load(address);
    if (token !== null) return token;

    let symbol = fetchTokenSymbol(address);
    if (symbol === null) return null;

    let name = fetchTokenName(address);
    if (name === null) return null;

    let decimals = fetchTokenDecimals(address);
    if (decimals < 0) return null;

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
    tick.idx = idx;
    tick.pool = poolAddress;
    tick.liquidityGross = BI_0;
    tick.liquidityNet = BI_0;
    tick.save();

    return tick;
}

export function getFeeAdjustedAmount(amount: BigInt, fee: i32): BigInt {
    // fees are taken from the input amount, so if the given amount
    // is negative (i.e. removing from pool, we just leave the
    // amount unchanged)
    return amount.lt(BI_0)
        ? amount
        : amount
              .times(BI_1_000_000.minus(BigInt.fromI32(fee)))
              .div(BI_1_000_000);
}

export function exponentToBigDecimal(decimals: i32): BigDecimal {
    let result = "1";

    for (let i = 0; i < decimals; i++) {
        result += "0";
    }

    return BigDecimal.fromString(result);
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
