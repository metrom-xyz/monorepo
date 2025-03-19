import {
    Address,
    BigDecimal,
    BigInt,
    Bytes,
    log,
} from "@graphprotocol/graph-ts";
import {
    Swap,
    Mint,
    Burn,
    Transfer,
} from "../../../generated/templates/FullRangePool/FullRangePool";
import {
    FullRangePosition,
    FullRangePool,
    FullRangeLiquidityChange,
    FullRangeLiquidityTransfer,
    Gauge,
} from "../../../generated/schema";
import {
    BD_0,
    BI_0,
    exponentToBigDecimal,
    getEventId,
    getFeeAdjustedAmount,
    getFullRangePoolOrThrow,
    getTokenOrThrow,
    sqrt,
} from "../../commons";

function toBigDecimal(value: BigInt, decimals: i32): BigDecimal {
    return value.toBigDecimal().div(exponentToBigDecimal(decimals));
}

function getPrice(pool: FullRangePool): BigDecimal {
    if (pool.token0Tvl.isZero() || pool.token1Tvl.isZero()) return BD_0;

    let token0 = getTokenOrThrow(changetype<Address>(pool.token0));
    let token1 = getTokenOrThrow(changetype<Address>(pool.token1));

    return toBigDecimal(pool.token1Tvl, token1.decimals).div(
        toBigDecimal(pool.token0Tvl, token0.decimals),
    );
}

export function handleSwap(event: Swap): void {
    let amount0Delta = event.params.amount0In.gt(BI_0)
        ? event.params.amount0In
        : event.params.amount0Out.neg();
    let amount1Delta = event.params.amount1In.gt(BI_0)
        ? event.params.amount1In
        : event.params.amount1Out.neg();

    let pool = getFullRangePoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.plus(
        getFeeAdjustedAmount(amount0Delta, pool.fee),
    );
    pool.token1Tvl = pool.token1Tvl.plus(
        getFeeAdjustedAmount(amount1Delta, pool.fee),
    );
    pool.price = getPrice(pool);
    pool.save();
}

function getPositionId(poolAddress: Address, owner: Address): Bytes {
    return poolAddress.concat(owner);
}

function getOrCreatePosition(
    poolAddress: Address,
    owner: Address,
): FullRangePosition {
    let id = getPositionId(poolAddress, owner);
    let position = FullRangePosition.load(id);
    if (position != null) return position;

    let pool = getFullRangePoolOrThrow(poolAddress);

    position = new FullRangePosition(id);
    position.owner = owner;
    position.liquidity = BI_0;
    position.pool = pool.id;
    position.save();

    return position;
}

function getPositionOrThrow(
    poolAddress: Address,
    owner: Address,
): FullRangePosition {
    let id = getPositionId(poolAddress, owner);
    let position = FullRangePosition.load(id);
    if (position != null) return position;

    throw new Error(
        `Could not find position on pool ${poolAddress.toHex()} for owner ${owner.toHex()}`,
    );
}

function getLiquidityDelta(
    pool: FullRangePool,
    amount0Delta: BigInt,
    amount1Delta: BigInt,
): BigInt {
    if (pool.liquidity.isZero()) {
        return BigInt.fromString(
            sqrt(amount0Delta.toBigDecimal().times(amount1Delta.toBigDecimal()))
                .truncate(0)
                .toString(),
        );
    }

    let amount0Based = amount0Delta.times(pool.liquidity).div(pool.token0Tvl);
    let amount1Based = amount1Delta.times(pool.liquidity).div(pool.token1Tvl);
    return amount0Based.lt(amount1Based) ? amount0Based : amount1Based;
}

export function handleMint(event: Mint): void {
    let pool = getFullRangePoolOrThrow(event.address);

    let liquidityDelta = getLiquidityDelta(
        pool,
        event.params.amount0,
        event.params.amount1,
    );
    if (liquidityDelta.isZero()) return;

    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.liquidity = pool.liquidity.plus(liquidityDelta);
    pool.save();
}

export function handleBurn(event: Burn): void {
    let pool = getFullRangePoolOrThrow(event.address);
    let liquidityDelta = getLiquidityDelta(
        pool,
        event.params.amount0,
        event.params.amount1,
    );
    log.warning("Burning {} on pool {} for owner {}", [
        liquidityDelta.toString(),
        event.address.toHex(),
        event.params.sender.toHex(),
    ]);
    if (liquidityDelta.isZero()) return;

    pool.token0Tvl = pool.token0Tvl.minus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.amount1);
    pool.liquidity = pool.liquidity.plus(liquidityDelta);
    pool.save();
}

export function handleTransfer(event: Transfer): void {
    if (
        event.params.to == Address.zero() ||
        event.params.amount.isZero() ||
        Gauge.load(event.params.from) !== null ||
        Gauge.load(event.params.to) !== null
    )
        return;

    if (event.params.from == Address.zero()) {
        // mint scenario
        let position = getOrCreatePosition(event.address, event.params.to);
        position.liquidity = position.liquidity.plus(event.params.amount);
        position.save();

        let liquidityChange = new FullRangeLiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.amount;
        liquidityChange.position = position.id;
        liquidityChange.pool = position.pool;
        liquidityChange.save();
    } else if (event.params.to == Address.zero()) {
        // burn scenario
        let position = getPositionOrThrow(event.address, event.params.from);
        position.liquidity = position.liquidity.plus(event.params.amount);
        position.save();

        let liquidityChange = new FullRangeLiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.amount;
        liquidityChange.pool = position.pool;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else {
        let transfer = new FullRangeLiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.amount;
        transfer.pool = event.address;
        transfer.save();

        let fromPosition = getPositionOrThrow(event.address, event.params.from);
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.amount,
        );
        fromPosition.save();

        let toPosition = getOrCreatePosition(event.address, event.params.to);
        toPosition.liquidity = toPosition.liquidity.plus(event.params.amount);
        toPosition.save();
    }
}
