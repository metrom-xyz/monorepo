import type { Address } from "viem";

export interface PairRemoteLogoProps {
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
    token0?: {
        address: Address;
        symbol: string;
    };
    token1?: {
        address: Address;
        symbol: string;
    };
}
