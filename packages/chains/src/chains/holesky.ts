import { BaseCampaignType, SupportedDex } from "@metrom-xyz/sdk";
import { EthLogo } from "../assets/logos/chains/eth";
import { AlgebraIntegralLogo } from "../assets/logos/dexes/algebra-integral";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { holesky } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";

export const holeskyData: ChainData = {
    active: true,
    name: holesky.name,
    metromContract: ADDRESS[SupportedChain.Holesky],
    blockExplorers: holesky.blockExplorers,
    icon: EthLogo,
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
            slug: SupportedDex.TestIntegral,
            logo: AlgebraIntegralLogo,
            name: "Algebra integral",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template:
                    "https://integral.algebra.finance/pool/{pool}/new-position",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x94373a4919b3240d86ea41593d5eba789fef3848",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x7d98346b3b000c55904918e3d9e2fc3f94683b01",
            decimals: 18,
            name: "USDT",
            symbol: "USDT",
        },
    ],
};
