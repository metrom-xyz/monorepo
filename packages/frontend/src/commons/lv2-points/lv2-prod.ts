import { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { QuillLogo } from "@/src/assets/logos/liquity-v2-platforms/quill";
import {
    Lv2PointsCampaign2Action,
    type Lv2PointsCampaign,
} from "@/src/types/lv2-points-campaign";
import { SupportedChain } from "@metrom-xyz/contracts";
import { OrkiLogo } from "@/src/assets/logos/liquity-v2-platforms/orki";
import { EbisuLogo } from "@/src/assets/logos/liquity-v2-platforms/ebisu";

export const lv2PointsCampaignsProd: Record<
    SupportedLiquityV2,
    Lv2PointsCampaign | null
> = {
    [SupportedLiquityV2.Orki]: null,
    [SupportedLiquityV2.Ebisu]: null,
    [SupportedLiquityV2.Liquity]: null,
    [SupportedLiquityV2.Quill]: {
        name: "Quill finance",
        description:
            "A secure, over-collateralized stablecoin protocol on Scroll's zk-Rollup network.",
        url: "https://app.quill.finance",
        chain: SupportedChain.Scroll,
        protocol: SupportedLiquityV2.Quill,
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
                    "Incentivize users that provide liquidity of USDQ/USDC in AMMs.",
                actions: [
                    {
                        targets: [
                            "0x6F2A1A886Dbf8E36C4fa9F25a517861A930fBF3A",
                            "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
                        ],
                        minimumDuration: 300,
                        name: "USDQ/USDC",
                        description: "Ambient",
                        multiplier: 2,
                    },
                    {
                        targets: [
                            "0x6F2A1A886Dbf8E36C4fa9F25a517861A930fBF3A",
                            "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
                        ],
                        minimumDuration: 300,
                        name: "USDQ/USDC",
                        description: "Nuri",
                        multiplier: 2,
                    },
                ],
            },
            [Lv2PointsCampaign2Action.StabilityPool]: {
                title: "Deposit to stability pool",
                description:
                    "Incentivize users that deposit liquidity to a various stability pool.",
                actions: [
                    {
                        targets: ["0x5300000000000000000000000000000000000004"],
                        minimumDuration: 300,
                        name: "ETH stability pool",
                        multiplier: 3,
                    },
                    {
                        targets: ["0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32"],
                        minimumDuration: 300,
                        name: "stETH stability pool",
                        multiplier: 3,
                    },
                    {
                        targets: ["0x01f0a31698C4d065659b9bdC21B3610292a1c506"],
                        minimumDuration: 300,
                        name: "weETH stability pool",
                        multiplier: 2,
                    },
                    {
                        targets: ["0xd29687c813D741E2F938F4aC377128810E217b1b"],
                        minimumDuration: 300,
                        name: "SCR stability pool",
                        multiplier: 5,
                    },
                ],
            },
            [Lv2PointsCampaign2Action.Debt]: {
                title: "Borrow",
                description:
                    "Incentivize users that deposits collateral and mints USDQ.",
                actions: [
                    {
                        targets: ["0x5300000000000000000000000000000000000004"],
                        minimumDuration: 300,
                        name: "Deposit ETH",
                        multiplier: 3,
                    },
                    {
                        targets: ["0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32"],
                        minimumDuration: 300,
                        name: "Deposit stETH",
                        multiplier: 3,
                    },
                    {
                        targets: ["0x01f0a31698C4d065659b9bdC21B3610292a1c506"],
                        minimumDuration: 300,
                        name: "Deposit weETH",
                        multiplier: 2,
                    },
                    {
                        targets: ["0xd29687c813D741E2F938F4aC377128810E217b1b"],
                        minimumDuration: 300,
                        name: "Deposit SCR",
                        multiplier: 5,
                    },
                ],
            },
        },
    },
    // [SupportedLiquityV2.Orki]: {
    //     name: "Orki",
    //     description: "Native stablecoin and credit protocol on Swell.",
    //     url: "https://www.orki.finance",
    //     chain: SupportedChain.Scroll,
    //     protocol: SupportedLiquityV2.Orki,
    //     totalUsdRewards: 500000,
    //     brand: { main: "#2973EB", light: "#94B9F5" },
    //     icon: OrkiLogo,
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
