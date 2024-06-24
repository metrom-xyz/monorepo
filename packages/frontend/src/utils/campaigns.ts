import type { Campaign } from "sdk";
import { filterPools } from "@metrom-xyz/ui";

export const filterCampaigns = (campaigns: Campaign[], searchQuery: string) => {
    return campaigns.filter((campaign) => {
        const pools = filterPools([campaign.pool], searchQuery);
        return pools.length > 0;
    });
};
