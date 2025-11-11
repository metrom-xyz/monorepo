import type { TurtleCampaign } from "@/src/types/turtle";
import { Environment, KatanaLogo, SupportedChain } from "@metrom-xyz/chains";
import { ChainType } from "@metrom-xyz/sdk";

export const TURTLE_REFERRAL_CODE = "D8B9mk2Z";
export const TURTLE_DISTRIBUTOR_URL =
    "https://app.turtle.club/widget/?distributorId=D8B9mk2Z";

export const TURTLE_CAMPAIGNS: Record<Environment, TurtleCampaign[]> = {
    [Environment.Development]: [],
    [Environment.Production]: [
        {
            id: "2c86d3a1-cfe8-486d-915d-1b9ff5e924e9",
            chain: {
                id: 1 as SupportedChain,
                type: ChainType.Evm,
            },
            distributor: `${TURTLE_DISTRIBUTOR_URL}&campaignName=katana`,
            description:
                "The Samurai's Call campaign is designed to seed dapps on Katana. Hold your deposits through launch to unlock all KAT token rewards.",
            name: "The Samurai's Call",
            url: "https://app.turtle.club/campaigns/katana",
            brand: {
                main: "#d4e000",
                light: "#f2f7b3",
                contrast: { dark: "", light: "" },
                iconBackground: "",
            },
            owner: "Katana",
            ownerLogo: KatanaLogo,
        },
    ],
};
