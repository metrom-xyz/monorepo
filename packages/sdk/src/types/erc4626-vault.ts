import type { Address } from "viem";

export interface Erc4626Vault {
    address: Address;
    asset: Address;
    assetDecimals: number;
    name: string;
    symbol: string;
    totalAssets: bigint;
    usdTvl: number;
}
