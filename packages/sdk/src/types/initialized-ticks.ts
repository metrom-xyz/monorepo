export interface Tick {
    idx: number;
    liquidity: bigint;
}

export interface TickWithPrices extends Tick {
    idx: number;
    liquidity: bigint;
    price0: number;
    price1: number;
}

export interface LiquidityDensity {
    activeIdx: number;
    ticks: TickWithPrices[];
}

export interface LiquidityInRange {
    activeTick: Tick;
    liquidity: bigint;
}
