import {
    BaseCampaignType,
    PartnerCampaignType,
    SupportedDex,
    SupportedLiquityV2,
    TargetType,
} from "@metrom-xyz/sdk";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { swellchain } from "viem/chains";
import type { ChainData } from "../types/chains";
import { DepositUrlType, ProtocolType } from "../types/protocol";
import { SwellLogo } from "../assets/logos/chains/swell";
import { VelodromeLogo } from "../assets/logos/dexes/velodrome";
import { OrkiDarkLogo } from "../assets/logos/liquity-v2-platforms/orki-dark";
import { OrkiLightLogo } from "../assets/logos/liquity-v2-platforms/orki-light";

// FIXME: remove this once done with development testing
export const swellDevelopmentData: ChainData = {
    active: true,
    name: "Swell",
    metromContract: {
        address: "0xe82c4D8b993D613a28600B953e91A3A93Ae69Fd6",
        blockCreated: 7267194,
    },
    blockExplorers: swellchain.blockExplorers,
    icon: SwellLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.LiquityV2,
        },
        {
            active: false,
            partner: true,
            type: PartnerCampaignType.JumperWhitelistedAmmPoolLiquidity,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.HoldFungibleAsset,
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
                type: DepositUrlType.QueryTokenAddresses,
                template: `https://velodrome.finance/deposit?token0={token_0}&token1={token_1}&chain0=${SupportedChain.Swell}&chain1=${SupportedChain.Swell}&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F`,
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Orki,
            logo: OrkiDarkLogo,
            logoLight: OrkiLightLogo,
            name: "Orki",
            debtToken: {
                address: "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                decimals: 18,
                name: "USDK",
                symbol: "USDK",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]: "https://app.orki.finance",
                [TargetType.LiquityV2StabilityPool]:
                    "https://app.orki.finance/earn",
            },
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
            address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
            decimals: 18,
            name: "Ethena USDe",
            symbol: "USDe",
        },
        {
            address: "0x2826D136F5630adA89C1678b64A61620Aab77Aea",
            decimals: 18,
            name: "Swell",
            symbol: "SWELL",
        },
        {
            address: "0x09341022ea237a4db1644de7ccf8fa0e489d85b7",
            decimals: 18,
            name: "swETH",
            symbol: "swETH",
        },
        {
            address: "0x18d33689ae5d02649a859a1cf16c9f0563975258",
            decimals: 18,
            name: "rswETH",
            symbol: "rswETH",
        },
        {
            address: "0xa6cb988942610f6731e664379d15ffcfbf282b44",
            decimals: 18,
            name: "Wrapped eETH",
            symbol: "rswETH",
        },
    ],
};

export const swellProductionData: ChainData = {
    active: true,
    name: "Swell",
    metromContract: ADDRESS[SupportedChain.Swell],
    blockExplorers: swellchain.blockExplorers,
    icon: SwellLogo,
    forms: [
        {
            active: true,
            partner: false,
            type: BaseCampaignType.AmmPoolLiquidity,
        },
        {
            active: true,
            partner: false,
            type: BaseCampaignType.LiquityV2,
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
            slug: SupportedDex.Velodrome,
            logo: VelodromeLogo,
            name: "Velodrome",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template: `https://velodrome.finance/deposit?token0={token_0}&token1={token_1}&chain0=${SupportedChain.Swell}&chain1=${SupportedChain.Swell}&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F`,
            },
            supportsFetchAllPools: true,
        },
        {
            active: true,
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Orki,
            logo: OrkiDarkLogo,
            logoLight: OrkiLightLogo,
            name: "Orki",
            debtToken: {
                address: "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                decimals: 18,
                name: "USDK",
                symbol: "USDK",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]: "https://app.orki.finance",
                [TargetType.LiquityV2StabilityPool]:
                    "https://app.orki.finance/earn",
            },
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
            address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
            decimals: 18,
            name: "Ethena USDe",
            symbol: "USDe",
        },
        {
            address: "0x2826D136F5630adA89C1678b64A61620Aab77Aea",
            decimals: 18,
            name: "Swell",
            symbol: "SWELL",
        },
        {
            address: "0x09341022ea237a4db1644de7ccf8fa0e489d85b7",
            decimals: 18,
            name: "swETH",
            symbol: "swETH",
        },
        {
            address: "0x18d33689ae5d02649a859a1cf16c9f0563975258",
            decimals: 18,
            name: "rswETH",
            symbol: "rswETH",
        },
        {
            address: "0xa6cb988942610f6731e664379d15ffcfbf282b44",
            decimals: 18,
            name: "Wrapped eETH",
            symbol: "rswETH",
        },
    ],
};
