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
