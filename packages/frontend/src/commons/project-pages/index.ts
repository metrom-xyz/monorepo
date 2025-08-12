import type { ProjectPage } from "@/src/types/project-page-";
import { LensLogoDark, SupportedChain } from "@metrom-xyz/chains";
import { Environment } from "@metrom-xyz/sdk";

export const PROJECT_PAGES: Record<Environment, Record<string, ProjectPage>> = {
    [Environment.Development]: {},
    [Environment.Production]: {
        lens: {
            name: "Lens",
            description:
                "Lens is a high performance L2 leveraging ZKsync, Avail & Ethereum's security. Purpose-built for SocialFi, it offers modular social primitives, quick settlement & decentralized storage.",
            url: "https://lens.xyz",
            brand: {
                main: "#999696",
                light: "#cdcdcd",
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
            icon: LensLogoDark,
            campaignsFilters: {
                chainId: SupportedChain.Lens,
            },
        },
    },
};
