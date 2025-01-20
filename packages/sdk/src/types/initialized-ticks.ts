export interface Tick {
    idx: number;
    liquidity: bigint;
    price0: number;
    price1: number;
}

export interface LiquidityDensity {
    activeIdx: number;
    ticks: Tick[];
}
