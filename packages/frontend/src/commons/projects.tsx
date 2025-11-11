import {
    AmpedLogo,
    EbisuLogo,
    KatanaLogo,
    LensLogoDark,
    OrkiDarkLogo,
    QuillLogo,
} from "@metrom-xyz/chains";
import { ProjectKind, type ProjectMetadata } from "../types/project";
import { QuillIllustration } from "../assets/logos/projects/quill-illustration";
import { OrkiIllustration } from "../assets/logos/projects/orki-illustration";
import { EbisuIllustration } from "../assets/logos/projects/ebisu-illustration";
import { LensIllustration } from "../assets/logos/projects/lens-illustration";
import { AmpedIllustration } from "../assets/logos/projects/amped-illustration";
import { lens } from "viem/chains";
import { ChainType } from "@metrom-xyz/sdk";

export const PROJECTS_METADATA: Record<string, ProjectMetadata> = {
    quill: {
        kind: ProjectKind.PointsTracking,
        name: "Quill",
        description:
            "A secure, over-collateralized stablecoin protocol on Scroll's zk-Rollup network.",
        url: "https://app.quill.finance",
        icon: QuillLogo,
        illustration: QuillIllustration,
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
        description:
            "Permissionless credit protocol and the native stablecoin of the Swellchain.",
        url: "https://www.orki.finance",
        icon: OrkiDarkLogo,
        illustration: OrkiIllustration,
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
        description:
            "Ebisu Money, a stablecoin credit protocol where users can borrow ebUSD at user-set rates.",
        url: "https://ebisu.money",
        icon: EbisuLogo,
        illustration: EbisuIllustration,
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
    lens: {
        kind: ProjectKind.Chain,
        chainType: ChainType.Evm,
        chainId: lens.id,
        name: "Lens",
        description:
            "Lens is a high performance L2 leveraging ZKsync, Avail & Ethereum's security. Purpose-built for SocialFi, it offers modular social primitives, quick settlement & decentralized storage.",
        url: "https://lens.xyz",
        icon: LensLogoDark,
        illustration: LensIllustration,
        branding: {
            main: "#646262",
            light: "#DDDDDD",
            contrast: {
                light: "#EBEBEB",
                dark: "#232323",
            },
            iconBackground: "#FFFFFF",
        },
        intro: {
            articles: [
                {
                    title: "Introducing the New Lens",
                    href: "https://lens.xyz/news/introducing-the-new-lens",
                },
                {
                    title: "GHO: Stablecoin as Gas on Lens Chain",
                    href: "https://lens.xyz/news/gho-stablecoin-as-gas-on-lens-chain",
                },
            ],
        },
    },
    amped: {
        kind: ProjectKind.PointsTracking,
        name: "Amped points",
        description:
            "Experience efficient trading and profit sharing in one dynamic platform.",
        url: "https://amped.finance",
        icon: AmpedLogo,
        illustration: AmpedIllustration,
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
    // TODO: find a way to add the missing info for Katana here, like id, owner, url...
    katana: {
        kind: ProjectKind.LiquidityDeals,
        description:
            "The Samurai's Call campaign is designed to seed dapps on Katana. Hold your deposits through launch to unlock all KAT token rewards.",
        name: "The Samurai's Call",
        url: "https://app.turtle.club/campaigns/katana",
        icon: KatanaLogo,
        illustration: EbisuIllustration,
        branding: {
            main: "#D4E000",
            light: "#DFE0C1",
            contrast: { light: "", dark: "#222313" },
            iconBackground: "#11162F",
        },
    },
};
