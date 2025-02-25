export interface BackendInitializedTicksResponse {
    activeTick: {
        idx: number;
        liquidity: string;
    };
    ticks: {
        idx: number;
        liquidityNet: string;
    }[];
}

export interface BackendLiquidityInRangeResponse {
    activeTick: {
        idx: number;
        liquidity: string;
    };
    liquidity: string;
}
