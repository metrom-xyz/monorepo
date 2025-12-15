import { BaseCampaignType, ChainType, SupportedDex } from "@metrom-xyz/sdk";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { lumiaMainnet } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { LumiaLogo } from "../assets/logos/chains/lumia";
import { MorphexLogo } from "../assets/logos/dexes/morphex";

export const lumiaData: ChainData = {
    active: false,
    id: lumiaMainnet.id,
    type: ChainType.Evm,
    name: "Lumia",
    slug: "lumia",
    metromContract: ADDRESS[SupportedChain.Lumia],
    blockExplorers: lumiaMainnet.blockExplorers,
    icon: LumiaLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Morphex,
            logo: MorphexLogo,
            name: "Morphex",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://morphex.exchange/create-position/{pool}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0xff297ac2cb0a236155605eb37cb55cfcae6d3f01",
            symbol: "USDC",
            name: "USDC",
            decimals: 6,
        },
        {
            address: "0xdcb5227ea8e5fde0f761a55dc669ec09807e7c8b",
            symbol: "WETH",
            name: "Wrapped Ether",
            decimals: 18,
        },
        {
            address: "0xe891b5ee2f52e312038710b761ec165792ad25b1",
            symbol: "WLUMIA",
            name: "Wrapped Lumia",
            decimals: 18,
        },
    ],
};
