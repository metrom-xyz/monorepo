import type { TurtleCampaign } from "@/src/types/turtle";
import { KatanaLogo } from "@metrom-xyz/chains";

// TODO: enable per single env?
export const TURTLE_CAMPAIGNS: TurtleCampaign[] = [
    {
        id: "2c86d3a1-cfe8-486d-915d-1b9ff5e924e9",
        description:
            "The Samurai's Call campaign is designed to seed dapps on Katana. Hold your deposits through launch to unlock all KAT token rewards.",
        name: "The Samurai's Call",
        url: "https://app.turtle.club/campaigns/katana",
        brand: { main: "#d4e000", light: "#f2f7b3" },
        owner: "Katana",
        ownerLogo: KatanaLogo,
    },
];
