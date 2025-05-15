import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    Swap,
    Mint,
    Burn,
    Transfer,
} from "../../../generated/templates/Pool/Pool";
import {
    FullRangePosition,
    FullRangeLiquidityChange,
    FullRangeLiquidityTransfer,
    Gauge,
    FullRangePool,
} from "../../../generated/schema";
import {
    BI_0,
    getEventId,
    getFullRangePoolOrThrow,
    getTokenOrThrow,
    exponentToBigDecimal,
    BD_0,
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
    pool.token0Tvl = pool.token0Tvl.plus(amount0Delta);
    pool.token1Tvl = pool.token1Tvl.plus(amount1Delta);
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

export function handleMint(event: Mint): void {
    let pool = getFullRangePoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.save();
}

export function handleBurn(event: Burn): void {
    let pool = getFullRangePoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.amount1);
    pool.save();
}

export function handleTransfer(event: Transfer): void {
    if (
        event.params.value.isZero() ||
        Gauge.load(event.params.from) !== null ||
        Gauge.load(event.params.to) !== null
    )
        return;

    if (event.params.from == Address.zero()) {
        // mint scenario
        let pool = getFullRangePoolOrThrow(event.address);
        pool.liquidity = pool.liquidity.plus(event.params.value);
        pool.save();

        let position = getOrCreatePosition(
            changetype<Address>(pool.id),
            event.params.to,
        );
        position.liquidity = position.liquidity.plus(event.params.value);
        position.save();

        let liquidityChange = new FullRangeLiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value;
        liquidityChange.pool = pool.id;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else if (event.params.to == Address.zero()) {
        // burn scenario
        let pool = getFullRangePoolOrThrow(event.address);
        pool.liquidity = pool.liquidity.minus(event.params.value);
        pool.save();

        let position = getPositionOrThrow(
            changetype<Address>(pool.id),
            event.params.from,
        );
        position.liquidity = position.liquidity.minus(event.params.value);
        position.save();

        let liquidityChange = new FullRangeLiquidityChange(getEventId(event));
        liquidityChange.timestamp = event.block.timestamp;
        liquidityChange.blockNumber = event.block.number;
        liquidityChange.delta = event.params.value.neg();
        liquidityChange.pool = pool.id;
        liquidityChange.position = position.id;
        liquidityChange.save();
    } else {
        let transfer = new FullRangeLiquidityTransfer(getEventId(event));
        transfer.timestamp = event.block.timestamp;
        transfer.blockNumber = event.block.number;
        transfer.from = event.params.from;
        transfer.to = event.params.to;
        transfer.amount = event.params.value;
        transfer.pool = event.address;
        transfer.save();

        let fromPosition = getPositionOrThrow(event.address, event.params.from);
        fromPosition.liquidity = fromPosition.liquidity.minus(
            event.params.value,
        );
        fromPosition.save();

        let toPosition = getOrCreatePosition(event.address, event.params.to);
        toPosition.liquidity = toPosition.liquidity.plus(event.params.value);
        toPosition.save();
    }
}
