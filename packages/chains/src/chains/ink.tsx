import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import {
    BaseCampaignType,
    ChainType,
    DistributablesType,
    SupportedDex,
} from "@metrom-xyz/sdk";
import {
    AmmPoolDepositUrlType,
    InkLogo,
    ProtocolType,
    VelodromeLogo,
    type ChainData,
} from "..";
import { ink } from "viem/chains";

export const inkData: ChainData = {
    active: true,
    id: ink.id,
    type: ChainType.Evm,
    name: ink.name,
    slug: "ink",
    metromContract: ADDRESS[SupportedChain.Ink],
    blockExplorers: ink.blockExplorers,
    icon: InkLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
            distributables: [DistributablesType.Tokens],
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
            distributables: [DistributablesType.Tokens],
        },
    ],
    protocols: [
        {
            active: true,
            type: ProtocolType.Dex,
            slug: SupportedDex.Velodrome,
            logo: VelodromeLogo,
            name: "Velodrome",
            depositUrl: {
                type: AmmPoolDepositUrlType.QueryTokenAddresses,
                template: `https://velo.drome.eth.limo/deposit?token0={token_0}&token1={token_1}&chain0=${SupportedChain.Ink}&chain1=${SupportedChain.Ink}&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F`,
            },
            supportsFetchAllPools: false,
        },
    ],
    baseTokens: [
        {
            address: "0x2D270e6886d130D724215A266106e6832161EAEd",
            decimals: 6,
            name: "USDC",
            symbol: "USDC",
        },
    ],
};
