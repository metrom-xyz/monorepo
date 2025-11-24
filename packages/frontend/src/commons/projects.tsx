import {
    AmpedLogo,
    EbisuLogo,
    KatanaLogo,
    OrkiDarkLogo,
    QuillLogo,
} from "@metrom-xyz/chains";
import { ProjectKind, type ProjectMetadata } from "../types/project";
import { QuillIllustration } from "../assets/logos/projects/quill-illustration";
import { OrkiIllustration } from "../assets/logos/projects/orki-illustration";
import { EbisuIllustration } from "../assets/logos/projects/ebisu-illustration";
import { AmpedIllustration } from "../assets/logos/projects/amped-illustration";
import { KatanaIllustration } from "../assets/logos/projects/katana-illustration";
import { katana, mainnet, scroll, sonic, swellchain } from "viem/chains";
import { SupportedLiquidityProviderDeal } from "@metrom-xyz/sdk";

export const PROJECTS_METADATA: Record<string, ProjectMetadata> = {
    quill: {
        kind: ProjectKind.PointsTracking,
        name: "Quill",
        types: ["CDP"],
        description:
            "A secure, over-collateralized stablecoin protocol on Scroll's zk-Rollup network.",
        url: "https://app.quill.finance",
        icon: QuillLogo,
        illustration: QuillIllustration,
        chains: [scroll.id],
        branding: {
            main: "#FF5500",
            light: "#FFAC83",
            contrast: {
                light: "#FFE7DB",
                dark: "#361708",
            },
            iconBackground: "#FF5500",
        },
        intro: {
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
    },
    orki: {
        kind: ProjectKind.PointsTracking,
        name: "Orki",
        types: ["CDP"],
        description:
            "Permissionless credit protocol and the native stablecoin of the Swellchain.",
        url: "https://www.orki.finance",
        icon: OrkiDarkLogo,
        illustration: OrkiIllustration,
        chains: [swellchain.id],
        branding: {
            main: "#2973EB",
            light: "#85B3FF",
            contrast: {
                light: "#CFE1FF",
                dark: "#101D32",
            },
            iconBackground: "#2973EB",
        },
        intro: {
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
    },
    ebisu: {
        kind: ProjectKind.PointsTracking,
        name: "Ebisu",
        types: ["CDP"],
        description:
            "Ebisu Money, a stablecoin credit protocol where users can borrow ebUSD at user-set rates.",
        url: "https://ebisu.money",
        icon: EbisuLogo,
        illustration: EbisuIllustration,
        chains: [mainnet.id],
        branding: {
            main: "#FF9ECE",
            light: "#EE2D8C",
            contrast: {
                light: "#F7CEE3",
                dark: "#361325",
            },
            iconBackground: "#FFFFFF",
        },
        intro: {
            articles: [
                {
                    title: "Introducing xEBISU",
                    href: "https://mirror.xyz/0xE5147053538249EFD3791508A2c8D8BB154C910A/KyQg9sjOzLrZ_7hgkDXQmwD4EuiMgVeDRbGOwik9c4M",
                },
            ],
        },
    },
    amped: {
        kind: ProjectKind.PointsTracking,
        name: "Amped points",
        types: ["Perpetuals"],
        description:
            "Experience efficient trading and profit sharing in one dynamic platform.",
        url: "https://amped.finance",
        icon: AmpedLogo,
        illustration: AmpedIllustration,
        chains: [sonic.id],
        branding: {
            main: "#E05573",
            light: "#EDD1D7",
            contrast: {
                light: "#F7ECF0",
                dark: "#2F2124",
            },
            iconBackground: "#FFFFFF",
        },
    },
    katana: {
        kind: ProjectKind.LiquidityDeals,
        name: "The Samurai's Call",
        types: ["LP deal"],
        protocol: SupportedLiquidityProviderDeal.Turtle,
        campaignId: "2c86d3a1-cfe8-486d-915d-1b9ff5e924e9",
        description:
            "The Samurai's Call campaign is designed to seed dapps on Katana. Hold your deposits through launch to unlock all KAT token rewards.",
        url: "https://app.turtle.club/campaigns/katana",
        icon: KatanaLogo,
        illustration: KatanaIllustration,
        chains: [mainnet.id, katana.id],
        branding: {
            main: "#D4E000",
            light: "#DFE0C1",
            contrast: { light: "#EEF0DA", dark: "#222313" },
            iconBackground: "#11162F",
        },
    },
};
