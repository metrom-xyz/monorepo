import type { Hex } from "viem";
import type {
    AmmPoolLiquidityType,
    Brand,
    ChainType,
    Erc20Token,
} from "./commons";
import type { RestrictionType } from "./campaigns";
import type { SupportedAmm, SupportedDex } from "src/commons";

export interface LiquidityByAddresses {
    type: RestrictionType;
    liquidity: bigint;
}

export interface AmmPool {
    chainId: number;
    chainType: ChainType;
    id: Hex;
    dex: Brand<SupportedDex>;
    amm: SupportedAmm;
    tokens: Erc20Token[];
    liquidityType: AmmPoolLiquidityType;
    liquidity: bigint;
    usdTvl: number;
    fee?: number;
}

export interface CampaignAmmPool {
    chainId: number;
    chainType: ChainType;
    id: Hex;
    dex: Brand<SupportedDex>;
    amm: SupportedAmm;
    tokens: Erc20Token[];
    liquidityType: AmmPoolLiquidityType;
    fee?: number;
}
