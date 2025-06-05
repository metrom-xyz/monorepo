import {
    Initialize,
    Swap,
    Mint,
    Burn,
} from "../../../generated/templates/ClPool/ClPool";
import { ConcentratedPool, SwapChange } from "../../../generated/schema";
import {
    getEventId,
    getOrCreateTick,
    getConcentratedPoolOrThrow,
    getPrice,
} from "../../commons";

export function handleInitialize(event: Initialize): void {
    let pool = ConcentratedPool.load(event.address);
    if (pool === null)
        throw new Error(
            `Could not find pool with address ${event.address.toHexString()}`,
        );

    pool.tick = event.params.tick;
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.save();
}

export function handleSwap(event: Swap): void {
    let pool = getConcentratedPoolOrThrow(event.address);
    pool.liquidity = event.params.liquidity;
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);
    pool.price = getPrice(event.params.sqrtPriceX96, pool.token0, pool.token1);

    if (
        event.params.sqrtPriceX96.notEqual(pool.sqrtPriceX96) ||
        event.params.tick != pool.tick
    ) {
        let swapChange = new SwapChange(getEventId(event));
        swapChange.timestamp = event.block.timestamp;
        swapChange.blockNumber = event.block.number;
        swapChange.pool = pool.id;
        swapChange.tick = event.params.tick;
        swapChange.sqrtPriceX96 = event.params.sqrtPriceX96;
        swapChange.save();
    }

    pool.tick = event.params.tick;
    pool.sqrtPriceX96 = event.params.sqrtPriceX96;
    pool.save();
}

export function handleMint(event: Mint): void {
    let pool = getConcentratedPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.plus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.plus(event.params.amount1);

    if (
        event.params.tickLower <= pool.tick &&
        event.params.tickUpper > pool.tick
    )
        pool.liquidity = pool.liquidity.plus(event.params.amount);

    pool.save();

    let lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
    lowerTick.liquidityGross = lowerTick.liquidityGross.plus(
        event.params.amount,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.plus(event.params.amount);
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
    upperTick.liquidityGross = upperTick.liquidityGross.plus(
        event.params.amount,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.minus(event.params.amount);
    upperTick.save();
}

export function handleBurn(event: Burn): void {
    let pool = getConcentratedPoolOrThrow(event.address);
    pool.token0Tvl = pool.token0Tvl.minus(event.params.amount0);
    pool.token1Tvl = pool.token1Tvl.minus(event.params.amount1);

    if (
        event.params.tickLower <= pool.tick &&
        event.params.tickUpper > pool.tick
    )
        pool.liquidity = pool.liquidity.minus(event.params.amount);

    pool.save();

    let lowerTick = getOrCreateTick(pool.id, event.params.tickLower);
    lowerTick.liquidityGross = lowerTick.liquidityGross.minus(
        event.params.amount,
    );
    lowerTick.liquidityNet = lowerTick.liquidityNet.minus(event.params.amount);
    lowerTick.save();

    let upperTick = getOrCreateTick(pool.id, event.params.tickUpper);
    upperTick.liquidityGross = upperTick.liquidityGross.minus(
        event.params.amount,
    );
    upperTick.liquidityNet = upperTick.liquidityNet.plus(event.params.amount);
    upperTick.save();
}
