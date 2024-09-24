import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { ADDRESS } from "@metrom-xyz/contracts";
import { BaseLogo } from "../../assets/logos/chains/base";
import { KimLogo } from "../../assets/logos/amms/kim";
import { ENVIRONMENT } from "../env";
import { type ChainData } from "..";

export const baseData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.Base]!,
    icon: BaseLogo,
    amms: [
        {
            slug: SupportedAmm.Kim,
            logo: KimLogo,
            name: "Kim",
            addLiquidityUrl: "https://app.kim.exchange/pools/v4/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0x4200000000000000000000000000000000000006",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
            decimals: 18,
            name: "DAI Stablecoin",
            symbol: "DAI",
        },
        {
            address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
            decimals: 8,
            name: "Wrapped BTC",
            symbol: "WBTC",
        },
    ],
};
