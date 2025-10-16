import type { AmmPool } from "./types/commons";

export function tickToScaledPrice(
    tick: number,
    pool: AmmPool,
    token0To1: boolean,
) {
    const scalingFactor = token0To1
        ? pool.tokens[0].decimals - pool.tokens[1].decimals
        : pool.tokens[1].decimals - pool.tokens[0].decimals;

    return Math.pow(1.0001, tick) * Math.pow(10, scalingFactor);
}

export function scaledPriceToTick(
    price: number,
    pool: AmmPool,
    token0To1: boolean,
): number {
    const scalingFactor = token0To1
        ? pool.tokens[0].decimals - pool.tokens[1].decimals
        : pool.tokens[1].decimals - pool.tokens[0].decimals;

    const scaledPrice = price / Math.pow(10, scalingFactor);

    return Math.round(Math.log(scaledPrice) / Math.log(1.0001));
}

export function unix(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}
