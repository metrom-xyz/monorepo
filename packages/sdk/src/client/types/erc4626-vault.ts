import type { Address } from "viem";

export interface BackendErc4626Vault {
    address: Address;
    asset: Address;
    assetDecimals: number;
    name: string;
    symbol: string;
    totalAssets: string;
    usdTvl: number;
}

export type BackendErc4626VaultResponse = { vaults: BackendErc4626Vault[] };
