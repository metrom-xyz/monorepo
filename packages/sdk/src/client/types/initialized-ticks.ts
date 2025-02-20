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

export interface BackendLiquiditiesInRangeResposne {
    activeTick: {
        idx: number;
        liquidity: string;
    };
    liquidity: string;
}
