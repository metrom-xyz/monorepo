import type { AmmPool } from "./types/commons";

export function priceToTick(price: number) {
    return Math.round(Math.log(price) / Math.log(1.0001));
}

export function tickToPrice(tick: number) {
    return Math.pow(1.0001, tick);
}

export function tickToScaledPrice(
    tick: number,
    pool: AmmPool,
    token0To1: boolean,
) {
    const scalingFactor = token0To1
        ? pool.tokens[0].decimals - pool.tokens[1].decimals
        : pool.tokens[1].decimals - pool.tokens[0].decimals;

    return tickToPrice(tick) * Math.pow(10, scalingFactor);
}

export function scaledPriceToTick(
    price: number,
    pool: AmmPool,
    token0To1: boolean,
): number {
    const scalingFactor = token0To1
        ? pool.tokens[0].decimals - pool.tokens[1].decimals
        : pool.tokens[1].decimals - pool.tokens[0].decimals;

    return priceToTick(price / Math.pow(10, scalingFactor));
}
