import type { Campaign } from "sdk";
import { filterPairs } from "./tokens";

export const filterCampaigns = (campaigns: Campaign[], searchQuery: string) => {
    return campaigns.filter((campaign) => {
        const pairs = filterPairs([campaign.pair], searchQuery);
        return pairs.length > 0;
    });
};
