import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    ethereum,
} from "@graphprotocol/graph-ts";
import { Order, Pool, Position, Tick, Token } from "../generated/schema";
import { Erc20 } from "../generated/Controller/Erc20";
import { Erc20BytesSymbol } from "../generated/Controller/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Controller/Erc20BytesName";

export const FEE_ID = Bytes.fromHexString("0x01");

export const BI_0 = BigInt.zero();
export const BI_1 = BigInt.fromI32(1);
export const BI_2 = BigInt.fromI32(2);
export const BI_U256_MAX = BI_2.pow(256 as u8).minus(BI_1);
export const CARBON_UNIT = BigInt.fromI32(2).pow(48);

export const BD_0 = BigDecimal.zero();
export const BD_TICK_BASE = BigDecimal.fromString("1.0001");

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getPoolId(token0: Bytes, token1: Bytes): Bytes {
    return token0.concat(token1);
}

export function getPoolOrThrow(token0: Address, token1: Address): Pool {
    let id = getPoolId(
        changetype<Address>(token0),
        changetype<Address>(token1),
    );
    let pool = Pool.load(id);
    if (pool != null) return pool;

    throw new Error(`Could not find pool with id ${id.toHex()}`);
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

export function getOrCreatePosition(
    id: BigInt,
    poolId: Bytes,
    owner: Address,
    order0LowerTickIdx: i32,
    order0UpperTickIdx: i32,
    y0: BigInt,
    order1LowerTickIdx: i32,
    order1UpperTickIdx: i32,
    y1: BigInt,
): Position {
    let bytesId = Bytes.fromByteArray(Bytes.fromBigInt(id));
    let position = Position.load(bytesId);
    if (position !== null) return position;

    let order0 = new Order(bytesId.concat(Bytes.fromI32(0)));
    order0.lowerTick = order0LowerTickIdx;
    order0.upperTick = order0UpperTickIdx;
    order0.liquidity = y0;
    order0.save();

    let order1 = new Order(bytesId.concat(Bytes.fromI32(1)));
    order1.lowerTick = order1LowerTickIdx;
    order1.upperTick = order1UpperTickIdx;
    order1.liquidity = y1;
    order1.save();

    position = new Position(bytesId);
    position.owner = owner;
    position.order0 = order0.id;
    position.order1 = order1.id;
    position.pool = poolId;
    position.save();

    return position;
}

export function getPositionOrThrow(id: BigInt): Position {
    let bytesId = Bytes.fromByteArray(Bytes.fromBigInt(id));
    let position = Position.load(bytesId);
    if (position === null)
        throw new Error(
            `Could not find position on pool with id ${bytesId.toHex()}`,
        );

    return position;
}

export function getOrderOrThrow(id: Bytes): Order {
    let order = Order.load(id);
    if (order === null)
        throw new Error(`Could not find order with id ${id.toHex()}`);

    return order;
}

function getOrCreateTick(poolId: Bytes, idx: i32): Tick {
    let id = poolId.concat(Bytes.fromI32(idx));
    let tick = Tick.load(id);
    if (tick !== null) return tick;

    tick = new Tick(id);
    tick.idx = idx;
    tick.pool = poolId;
    tick.liquidityGross = BI_0;
    tick.liquidityNet = BI_0;
    tick.save();

    return tick;
}

export function updateTicks(
    poolId: Bytes,
    lowerIdx: i32,
    upperIdx: i32,
    y: BigInt,
): void {
    let lowerTick = getOrCreateTick(poolId, lowerIdx);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(y);
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(y);
    lowerTick.save();

    let upperTick = getOrCreateTick(poolId, upperIdx);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(y);
    upperTick.liquidityNet = upperTick.liquidityNet.minus(y);
    upperTick.save();
}

function decodeFloat(value: BigInt): BigDecimal {
    let numerator = BigDecimal.fromString(value.mod(CARBON_UNIT).toString());
    let denominator = BigDecimal.fromString(
        BI_2.pow(value.div(CARBON_UNIT).toI32() as u8).toString(),
    );

    return numerator.div(denominator);
}

export function getTickFromEncodedRate(rate: BigInt): i32 {
    let price = decodeFloat(rate);
    return getTickFromPrice(price);
}

export function getTickFromPrice(price: BigDecimal): i32 {
    return NativeMath.round(
        NativeMath.log10(parseFloat(price.toString())) /
            NativeMath.log10(1.0001),
    ) as i32;
}
