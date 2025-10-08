import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import {
    DepositUrlType,
    LensLogo,
    ProtocolType,
    SupportedDex,
    UniswapLogo,
    type ChainData,
} from "..";
import { lens } from "viem/chains";
import { BaseCampaignType, PartnerCampaignType } from "@metrom-xyz/sdk";

export const lensData: ChainData = {
    active: true,
    name: lens.name,
    metromContract: ADDRESS[SupportedChain.Lens],
    blockExplorers: lens.blockExplorers,
    icon: LensLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: false,
            partner: true,
            type: PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity,
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.UniswapV3,
            logo: UniswapLogo,
            name: "Uniswap v3",
            depositUrl: {
                type: DepositUrlType.PathPoolAddress,
                template: "https://oku.trade/app/lens/liquidity/{pool}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [
        {
            address: "0x000000000000000000000000000000000000800A",
            decimals: 18,
            name: "GHO",
            symbol: "GHO",
        },
        {
            address: "0x6bDc36E20D267Ff0dd6097799f82e78907105e2F",
            decimals: 18,
            name: "Wrapped GHO",
            symbol: "WGHO",
        },
        {
            address: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884",
            decimals: 18,
            name: "USDC",
            symbol: "USDC",
        },
        {
            address: "0xE5ecd226b3032910CEaa43ba92EE8232f8237553",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
    ],
};
