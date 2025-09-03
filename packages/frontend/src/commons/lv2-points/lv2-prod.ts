import { SupportedGmxV1, SupportedLiquityV2 } from "@metrom-xyz/sdk";
import {
    Lv2PointsCampaign2Action,
    type Lv2PointsCampaign,
} from "@/src/types/lv2-points-campaign";
import { SupportedChain } from "@metrom-xyz/contracts";
import {
    EbisuLogo,
    AmpedLogo,
    OrkiDarkLogo,
    QuillLogo,
} from "@metrom-xyz/chains";
import { mainnet } from "viem/chains";

export const lv2PointsCampaignsProd: Record<
    SupportedLiquityV2 | SupportedGmxV1,
    Lv2PointsCampaign | null
> = {
    [SupportedLiquityV2.Ebisu]: {
        name: "Ebisu",
        description:
            "Ebisu Money, a stablecoin credit protocol where users can borrow ebUSD at user-set rates.",
        url: "https://ebisu.money",
        chain: mainnet.id as SupportedChain,
        pointsName: "Ebisu Points",
        protocol: SupportedLiquityV2.Ebisu,
        brand: { main: "#f14d9d", light: "#f28fbd" },
        icon: EbisuLogo,
        protocolIntro: {
            articles: [
                {
                    title: "Introducing xEBISU",
                    href: "https://mirror.xyz/0xE5147053538249EFD3791508A2c8D8BB154C910A/KyQg9sjOzLrZ_7hgkDXQmwD4EuiMgVeDRbGOwik9c4M",
                },
            ],
        },
        from: 1753963200,
        to: 1761915600,
        leaderboard: false,
        actions: {
            [Lv2PointsCampaign2Action.Liquidity]: {
                title: "Liquidity",
                description:
                    "Users get incentivized to provide liquidity in pools in AMMs.",
                actions: [
                    {
                        targets: [
                            "0x09fD37d9AA613789c517e76DF1c53aEce2b60Df4",
                            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        ],
                        minimumDuration: 3600,
                        name: "ebUSD/USDC LP",
                        description: "Curve",
                        multiplier: 5,
                        href: "https://www.curve.finance/dex/ethereum/pools/factory-stable-ng-487/deposit/",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.NetSwapVolume]: {
                title: "Net swap volume",
                description:
                    "Users get incentivized to perform swaps on ebUSD/USDC.",
                actions: [
                    {
                        targets: [
                            "0x09fD37d9AA613789c517e76DF1c53aEce2b60Df4",
                            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                        ],
                        tooltip: "netSwapVolumeEbUSD",
                        minimumDuration: 604800,
                        name: "ebUSD/USDC LP",
                        description: "Curve",
                        multiplier: 3,
                        href: "https://www.curve.finance/dex/ethereum/pools/factory-stable-ng-487/deposit/",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.StabilityPool]: {
                title: "Deposit to stability pool",
                description:
                    "Users get incentivized to deposit liquidity in stability pools.",
                actions: [
                    {
                        targets: ["0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee"],
                        minimumDuration: 3600,
                        name: "weETH stability pool",
                        multiplier: 1,
                        href: "https://ebisu.money/earn/weeth",
                    },
                    {
                        targets: ["0x9d39a5de30e57443bff2a8307a4256c8797a3497"],
                        minimumDuration: 3600,
                        name: "sUSDe stability pool",
                        multiplier: 1,
                        href: "https://ebisu.money/earn/susde",
                    },
                    {
                        targets: ["0x8236a87084f8b84306f72007f36f2618a5634494"],
                        minimumDuration: 3600,
                        name: "LBTC stability pool",
                        multiplier: 1,
                        href: "https://ebisu.money/earn/lbtc",
                    },
                    {
                        targets: ["0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"],
                        minimumDuration: 3600,
                        name: "WBTC stability pool",
                        multiplier: 1,
                        href: "https://ebisu.money/earn/wbtc",
                    },
                ],
            },
            // title: "Liquity V2",
            // description:
            //     "Users get incentivized to deposit liquidity on Liquidy V2.",
            // actions: [
            //     {
            //         name: "2.75% of EBISU will be allocated to Liquity v2 BOLD users according to the Liquity v2 user scores",
            //         href: "https://dune.com/liquity/v2-leaderboard",
            //         targets: [],
            //         minimumDuration: 0,
            //         multiplier: 1,
            //     },
            // ],
            [Lv2PointsCampaign2Action.Debt]: {
                title: "Borrow",
                description:
                    "Users get incentivized to deposit collateral and mint ebUSD.",
                actions: [
                    {
                        targets: ["0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee"],
                        minimumDuration: 3600,
                        name: "Borrow using weETH",
                        multiplier: 1,
                        href: "https://ebisu.money/borrow/weeth",
                    },
                    {
                        targets: ["0x9d39a5de30e57443bff2a8307a4256c8797a3497"],
                        minimumDuration: 3600,
                        name: "Borrow using sUSDe",
                        multiplier: 1,
                        href: "https://ebisu.money/borrow/susde",
                    },
                    {
                        targets: ["0x8236a87084f8b84306f72007f36f2618a5634494"],
                        minimumDuration: 3600,
                        name: "Borrow using LBTC",
                        multiplier: 1,
                        href: "https://ebisu.money/borrow/lbtc",
                    },
                    {
                        targets: ["0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"],
                        minimumDuration: 3600,
                        name: "Borrow using WBTC",
                        multiplier: 1,
                        href: "https://ebisu.money/borrow/wbtc",
                    },
                ],
            },
        },
    },
    [SupportedLiquityV2.Orki]: {
        name: "Orki",
        description:
            "Permissionless credit protocol and the native stablecoin of the Swellchain.",
        url: "https://www.orki.finance",
        chain: SupportedChain.Swell,
        protocol: SupportedLiquityV2.Orki,
        pointsName: "Orki Drops",
        brand: { main: "#2973EB", light: "#94B9F5" },
        icon: OrkiDarkLogo,
        protocolIntro: {
            articles: [
                {
                    title: "A Permissionless Credit and Stablecoin Protocol",
                    href: "https://orkifinance.substack.com/p/a-permissionless-credit-and-stablecoin",
                },
                {
                    title: "Maximizing Yield: Drops, Pools, and Multiple Returns",
                    href: "https://orkifinance.substack.com/p/maximizing-yield-drops-pools-and",
                },
            ],
        },
        from: 1747317600,
        to: 1763218800,
        leaderboard: true,
        actions: {
            [Lv2PointsCampaign2Action.Liquidity]: {
                title: "Liquidity",
                description:
                    "Users get incentivized to provide liquidity for $USDK pairs in AMMs.",
                actions: [
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0x4200000000000000000000000000000000000006",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/WETH LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x4200000000000000000000000000000000000006&type=200&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0x09341022ea237a4DB1644DE7CCf8FA0e489D85B7",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/swETH LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x09341022ea237a4db1644de7ccf8fa0e489d85b7&type=200&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0x18d33689AE5d02649a859A1CF16c9f0563975258",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/rswETH LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x18d33689ae5d02649a859a1cf16c9f0563975258&type=200&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0xA6cB988942610f6731e664379D15fFcfBf282b44",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/weETH LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0xa6cb988942610f6731e664379d15ffcfbf282b44&type=200&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0x2826D136F5630adA89C1678b64A61620Aab77Aea",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/SWELL LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x2826d136f5630ada89c1678b64a61620aab77aea&type=200&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/USDe LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34&type=50&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0xc2606AADe4bdd978a4fa5a6edb3b66657acEe6F8",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/KING LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0xc2606aade4bdd978a4fa5a6edb3b66657acee6f8&type=200&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                    {
                        targets: [
                            "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                            "0x9ab96a4668456896d45c301bc3a15cee76aa7b8d",
                        ],
                        minimumDuration: 3600,
                        name: "USDK/rUSDC LP",
                        description: "Velodrome",
                        multiplier: 5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x9ab96a4668456896d45c301bc3a15cee76aa7b8d&type=50&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.NetSwapVolume]: null,
            [Lv2PointsCampaign2Action.StabilityPool]: {
                title: "Deposit to stability pool",
                description:
                    "Users get incentivized to deposit liquidity in stability pools.",
                boost: 0.5,
                actions: [
                    {
                        targets: ["0x4200000000000000000000000000000000000006"],
                        minimumDuration: 3600,
                        name: "wETH stability pool",
                        multiplier: 1.5,
                        href: "https://app.orki.finance/earn",
                    },
                    {
                        targets: ["0x09341022ea237a4DB1644DE7CCf8FA0e489D85B7"],
                        minimumDuration: 3600,
                        name: "swETH stability pool",
                        multiplier: 1.5,
                        href: "https://app.orki.finance/earn",
                    },
                    {
                        targets: ["0x18d33689AE5d02649a859A1CF16c9f0563975258"],
                        minimumDuration: 3600,
                        name: "rswETH stability pool",
                        multiplier: 1.5,
                        href: "https://app.orki.finance/earn",
                    },
                    {
                        targets: ["0xA6cB988942610f6731e664379D15fFcfBf282b44"],
                        minimumDuration: 3600,
                        name: "weETH stability pool",
                        multiplier: 1.5,
                        href: "https://app.orki.finance/earn",
                    },
                    {
                        targets: ["0x2826D136F5630adA89C1678b64A61620Aab77Aea"],
                        minimumDuration: 3600,
                        name: "SWELL stability pool",
                        multiplier: 1.5,
                        href: "https://app.orki.finance/earn",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.Debt]: {
                title: "Borrow",
                description:
                    "Users get incentivized to deposit collateral and mint USDK.",
                boost: 0.5,
                actions: [
                    {
                        targets: ["0x4200000000000000000000000000000000000006"],
                        minimumDuration: 3600,
                        name: "Borrow using wETH",
                        multiplier: 1,
                        href: "https://app.orki.finance/borrow/eth",
                    },
                    {
                        targets: ["0x09341022ea237a4DB1644DE7CCf8FA0e489D85B7"],
                        minimumDuration: 3600,
                        name: "Borrow using swETH",
                        multiplier: 1,
                        href: "https://app.orki.finance/borrow/sweth",
                    },
                    {
                        targets: ["0x18d33689AE5d02649a859A1CF16c9f0563975258"],
                        minimumDuration: 3600,
                        name: "Borrow using rswETH",
                        multiplier: 1,
                        href: "https://app.orki.finance/borrow/rsweth",
                    },
                    {
                        targets: ["0xA6cB988942610f6731e664379D15fFcfBf282b44"],
                        minimumDuration: 3600,
                        name: "Borrow using weETH",
                        multiplier: 1,
                        href: "https://app.orki.finance/borrow/weeth",
                    },
                    {
                        targets: ["0x2826D136F5630adA89C1678b64A61620Aab77Aea"],
                        minimumDuration: 3600,
                        name: "Borrow using SWELL",
                        multiplier: 1,
                        href: "https://app.orki.finance/borrow/swell",
                    },
                ],
            },
        },
    },
    [SupportedGmxV1.Amped]: {
        name: "Amped",
        description:
            "Experience efficient trading and profit sharing in one dynamic platform.",
        url: "https://amped.finance",
        chain: SupportedChain.Sonic,
        protocol: SupportedGmxV1.Amped,
        pointsName: "Amped Points",
        brand: { main: "#e05573", light: "#ffb1c6" },
        icon: AmpedLogo,
        from: 1739750400,
        to: 1756080000,
        leaderboard: true,
        actions: {
            [Lv2PointsCampaign2Action.Liquidity]: {
                title: "Liquidity",
                description:
                    "Users get incentivized to provide liquidity on Amped.",
                actions: [
                    {
                        targets: ["0x6fbaeE8bEf2e8f5c34A08BdD4A4AB777Bd3f6764"],
                        minimumDuration: 3600,
                        name: "ALP on Sonic",
                        multiplier: 1,
                        href: "https://amped.finance/#/earn",
                    },
                    {
                        targets: ["0x6fbaeE8bEf2e8f5c34A08BdD4A4AB777Bd3f6764"],
                        minimumDuration: 3600,
                        name: "yALP on Sonic",
                        multiplier: 1,
                        href: "https://amped.finance/#/earn",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.NetSwapVolume]: null,
            [Lv2PointsCampaign2Action.StabilityPool]: null,
            [Lv2PointsCampaign2Action.Debt]: null,
        },
    },
    [SupportedLiquityV2.Quill]: {
        name: "Quill finance",
        description:
            "A secure, over-collateralized stablecoin protocol on Scroll's zk-Rollup network.",
        url: "https://app.quill.finance",
        chain: SupportedChain.Scroll,
        protocol: SupportedLiquityV2.Quill,
        pointsName: "Quill Liquidity Points",
        brand: { main: "#FF5500", light: "#FFBFA3" },
        icon: QuillLogo,
        protocolIntro: {
            articles: [
                {
                    title: "How Quill and Scroll Are Redefining DeFi Together",
                    href: "https://medium.com/@QuillFi/how-quill-and-scroll-are-redefining-defi-together-47aeba67d995",
                },
                {
                    title: "Fueling DeFi: Quill's Revamped Incentives Programs",
                    href: "https://medium.com/@QuillFi/fueling-defi-quills-revamped-incentives-programs-926e4ffd9034",
                },
            ],
        },
        from: 1746720000,
        to: 1757347200,
        leaderboard: true,
        actions: {
            [Lv2PointsCampaign2Action.Liquidity]: {
                title: "Liquidity",
                description:
                    "Users get incentivized to provide liquidity in USDQ/USDC in AMMs.",
                actions: [
                    {
                        targets: [
                            "0xdb9E8F82D6d45fFf803161F2a5f75543972B229a",
                            "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
                        ],
                        minimumDuration: 3600,
                        name: "USDQ/USDC LP",
                        description: "Ambient",
                        multiplier: 2,
                        href: "https://ambient.finance/trade/pool/chain=0x82750&tokenA=0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4&tokenB=0xdb9e8f82d6d45fff803161f2a5f75543972b229a",
                    },
                    {
                        targets: [
                            "0xdb9E8F82D6d45fFf803161F2a5f75543972B229a",
                            "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
                        ],
                        minimumDuration: 3600,
                        name: "USDQ/USDC LP",
                        description: "Honeypop",
                        multiplier: 2,
                        href: "https://honeypop.app/add/0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4/0xdb9E8F82D6d45fFf803161F2a5f75543972B229a/500",
                    },
                    {
                        targets: [
                            "0xdb9E8F82D6d45fFf803161F2a5f75543972B229a",
                            "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
                        ],
                        minimumDuration: 3600,
                        name: "USDQ/USDC LP",
                        description: "Nuri",
                        multiplier: 2,
                        href: "https://www.nuri.exchange/liquidity/v2/0x082a51f4256555110350c5eec54e4c7e440a131e",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.NetSwapVolume]: null,
            [Lv2PointsCampaign2Action.StabilityPool]: {
                title: "Deposit to stability pool",
                description:
                    "Users get incentivized to deposit liquidity in stability pools.",
                boost: 0.5,
                actions: [
                    {
                        targets: ["0x5300000000000000000000000000000000000004"],
                        minimumDuration: 3600,
                        name: "ETH stability pool",
                        multiplier: 3,
                        href: "https://app.quill.finance/earn/eth",
                    },
                    {
                        targets: ["0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32"],
                        minimumDuration: 3600,
                        name: "stETH stability pool",
                        multiplier: 3,
                        href: "https://app.quill.finance/earn/wsteth",
                    },
                    {
                        targets: ["0x01f0a31698C4d065659b9bdC21B3610292a1c506"],
                        minimumDuration: 3600,
                        name: "weETH stability pool",
                        multiplier: 2,
                        href: "https://app.quill.finance/earn/weeth",
                    },
                    {
                        targets: ["0xd29687c813D741E2F938F4aC377128810E217b1b"],
                        minimumDuration: 3600,
                        name: "SCR stability pool",
                        multiplier: 5,
                        href: "https://app.quill.finance/earn/scr",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.Debt]: {
                title: "Borrow",
                description:
                    "Users get incentivized to deposit collateral and mint USDQ.",
                boost: 0.5,
                actions: [
                    {
                        targets: ["0x5300000000000000000000000000000000000004"],
                        minimumDuration: 3600,
                        name: "Borrow using ETH",
                        multiplier: 3,
                        href: "https://app.quill.finance/borrow/eth",
                    },
                    {
                        targets: ["0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32"],
                        minimumDuration: 3600,
                        name: "Borrow using stETH",
                        multiplier: 3,
                        href: "https://app.quill.finance/borrow/wsteth",
                    },
                    {
                        targets: ["0x01f0a31698C4d065659b9bdC21B3610292a1c506"],
                        minimumDuration: 3600,
                        name: "Borrow using weETH",
                        multiplier: 2,
                        href: "https://app.quill.finance/borrow/weeth",
                    },
                    {
                        targets: ["0xd29687c813D741E2F938F4aC377128810E217b1b"],
                        minimumDuration: 3600,
                        name: "Borrow using SCR",
                        multiplier: 5,
                        href: "https://app.quill.finance/borrow/scr",
                    },
                ],
            },
        },
    },
    [SupportedLiquityV2.Liquity]: null,
};
