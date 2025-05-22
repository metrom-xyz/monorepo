import { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import {
    Lv2PointsCampaign2Action,
    type Lv2PointsCampaign,
} from "@/src/types/lv2-points-campaign";
import { SupportedChain } from "@metrom-xyz/contracts";
import { OrkiLogo, QuillLogo } from "@metrom-xyz/chains-data";

export const lv2PointsCampaignsProd: Record<
    SupportedLiquityV2,
    Lv2PointsCampaign | null
> = {
    [SupportedLiquityV2.Ebisu]: null,
    [SupportedLiquityV2.Liquity]: null,
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
        to: 1749398400,
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
            [Lv2PointsCampaign2Action.StabilityPool]: {
                title: "Deposit to stability pool",
                description:
                    "Users get incentivized to deposit liquidity in stability pools.",
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
    [SupportedLiquityV2.Orki]: {
        name: "Orki",
        description:
            "Permissionless credit protocol and the native stablecoin of the Swellchain.",
        url: "https://www.orki.finance",
        chain: SupportedChain.Swell,
        protocol: SupportedLiquityV2.Orki,
        pointsName: "Orki Drops",
        brand: { main: "#2973EB", light: "#94B9F5" },
        icon: OrkiLogo,
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
        to: 1755266400,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
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
                        multiplier: 2.5,
                        href: "https://velodrome.finance/deposit?token0=0x0000baa0b1678229863c0a941c1056b83a1955f5&token1=0x9ab96a4668456896d45c301bc3a15cee76aa7b8d&type=50&chain0=1923&chain1=1923&factory=0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                    },
                ],
            },
            [Lv2PointsCampaign2Action.StabilityPool]: {
                title: "Deposit to stability pool",
                description:
                    "Users get incentivized to deposit liquidity in stability pools.",
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
    // [SupportedLiquityV2.Ebisu]: {
    //     name: "Ebisu",
    //     description: "Native stablecoin and credit protocol on Swell.",
    //     url: "https://www.orki.finance",
    //     chain: SupportedChain.Scroll,
    //     protocol: SupportedLiquityV2.Orki,
    //     totalUsdRewards: 250000,
    //     brand: { main: "#F24C9E", light: "#F9A5CF" },
    //     icon: EbisuLogo,
    //     from: 1744892700,
    //     to: 1744899900,
    //     actions: {
    //         [Lv2PointsCampaign2Action.Liquidity]: {
    //             title: "",
    //             description: "",
    //             actions: [],
    //         },
    //         [Lv2PointsCampaign2Action.StabilityPool]: {
    //             title: "",
    //             description: "",
    //             actions: [],
    //         },
    //         [Lv2PointsCampaign2Action.Debt]: {
    //             title: "",
    //             description: "",
    //             actions: [],
    //         },
    //     },
    // },
};
