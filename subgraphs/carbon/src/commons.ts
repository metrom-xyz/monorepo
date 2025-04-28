import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    crypto,
    ethereum,
} from "@graphprotocol/graph-ts";
import {
    Order,
    Pool,
    Strategy,
    StrategyChange,
    Tick,
    Token,
} from "../generated/schema";
import { Erc20 } from "../generated/Controller/Erc20";
import { Erc20BytesSymbol } from "../generated/Controller/Erc20BytesSymbol";
import { Erc20BytesName } from "../generated/Controller/Erc20BytesName";
import {
    NATIVE_TOKEN_ADDRESS,
    NATIVE_TOKEN_DECIMALS,
    NATIVE_TOKEN_NAME,
    NATIVE_TOKEN_SYMBOL,
} from "./addresses";
import { UniV3Order } from "./conversion";

export const BI_0 = BigInt.zero();

export const BD_0 = BigDecimal.zero();
export const BD_TICK_BASE = BigDecimal.fromString("1.0001");

export const BYTES_0 = Bytes.fromHexString("0x00");
export const BYTES_1 = Bytes.fromHexString("0x01");

export function getEventId(event: ethereum.Event): Bytes {
    return changetype<Bytes>(
        event.block.number.leftShift(40).plus(event.logIndex).reverse(),
    );
}

export function getPoolId(tokenA: Bytes, tokenB: Bytes): Bytes {
    let token0 = tokenA;
    let token1 = tokenB;
    if (tokenA.toHex() > tokenB.toHex()) {
        token0 = tokenB;
        token1 = tokenA;
    }
    return Bytes.fromByteArray(
        crypto.keccak256(
            ethereum.encode(
                ethereum.Value.fromTuple(
                    changetype<ethereum.Tuple>([
                        ethereum.Value.fromAddress(changetype<Address>(token0)),
                        ethereum.Value.fromAddress(changetype<Address>(token1)),
                    ]),
                ),
            )!,
        ),
    );
}

export function getPoolOrThrow(token0: Address, token1: Address): Pool {
    let id = getPoolId(token0, token1);
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

    if (address == NATIVE_TOKEN_ADDRESS) {
        token = new Token(NATIVE_TOKEN_ADDRESS);
        token.symbol = NATIVE_TOKEN_SYMBOL;
        token.name = NATIVE_TOKEN_NAME;
        token.decimals = NATIVE_TOKEN_DECIMALS;
        token.save();
        return token;
    }

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

export function getOrderId(strategyId: Bytes, zero: bool): Bytes {
    return strategyId.concat(zero ? BYTES_0 : BYTES_1);
}

export function updateOrCreateOrder(
    id: Bytes,
    poolId: Bytes,
    uniV3Order: UniV3Order,
): Order {
    let order = Order.load(id);
    if (order === null) order = new Order(id);

    order.y = uniV3Order.y;
    order.z = uniV3Order.z;
    order.A = uniV3Order.A;
    order.B = uniV3Order.B;
    order.lowerTick = uniV3Order.lowerTick;
    order.upperTick = uniV3Order.upperTick;
    order.liquidity = uniV3Order.liquidity;
    order.tokenTvl = uniV3Order.tokenTvl;
    order.pool = poolId;
    order.active = uniV3Order.active;
    order.save();

    return order;
}

export function getOrderOrThrow(id: Bytes): Order {
    let order = Order.load(id);
    if (order !== null) return order;

    throw new Error(`Could not find order with id ${id.toHex()}`);
}

export function getStrategyOrThrow(id: BigInt): Strategy {
    let bytesId = Bytes.fromByteArray(Bytes.fromBigInt(id));
    let strategy = Strategy.load(bytesId);
    if (strategy === null)
        throw new Error(
            `Could not find strategy on pool with id ${bytesId.toHex()}`,
        );

    return strategy;
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
    order: UniV3Order,
    removing: bool,
): void {
    const liquidityDelta = removing ? order.liquidity.neg() : order.liquidity;

    let lowerTick = getOrCreateTick(poolId, order.lowerTick);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(liquidityDelta);
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(liquidityDelta);
    lowerTick.save();

    let upperTick = getOrCreateTick(poolId, order.upperTick);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(liquidityDelta);
    upperTick.liquidityNet = upperTick.liquidityNet.minus(liquidityDelta);
    upperTick.save();
}

export function createStrategyChange(
    event: ethereum.Event,
    changedStrategy: Strategy,
    order0: UniV3Order,
    order1: UniV3Order,
): StrategyChange {
    const eventId = getEventId(event);

    const strategyChange = new StrategyChange(eventId);
    strategyChange.timestamp = event.block.timestamp;
    strategyChange.strategyId = changedStrategy.id;
    strategyChange.owner = changedStrategy.owner;

    // no update will ever happen here, just creation
    strategyChange.order0 = updateOrCreateOrder(
        eventId.concat(BYTES_0),
        changedStrategy.pool,
        order0,
    ).id;

    // no update will ever happen here, just creation
    strategyChange.order1 = updateOrCreateOrder(
        eventId.concat(BYTES_1),
        changedStrategy.pool,
        order1,
    ).id;

    strategyChange.pool = changedStrategy.pool;
    strategyChange.save();

    return strategyChange;
}
