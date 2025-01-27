import type { AmmPool } from "./types/commons";

export function priceToTick(price: number) {
    return Math.round(Math.log(price) / Math.log(1.0001));
}

export function tickToPrice(tick: number) {
    return Math.pow(1.0001, tick);
}

export function getPrice(tick: number, pool: AmmPool) {
    return (
        tickToPrice(tick) *
        Math.pow(10, pool.tokens[0].decimals - pool.tokens[1].decimals)
    );
}

export function getTick(price: number, pool: AmmPool): number {
    return priceToTick(
        price / Math.pow(10, pool.tokens[0].decimals - pool.tokens[1].decimals),
    );
}
