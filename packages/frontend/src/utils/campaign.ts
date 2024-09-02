import type { Campaign } from "@metrom-xyz/sdk";
import { CHAIN_DATA } from "../commons";

const SUPPORTED_AMM_SLUG_TO_NAME = Object.values(CHAIN_DATA).reduce(
    (acc: Record<string, string>, chainData) => {
        for (const amm of chainData.amms) acc[amm.slug] = amm.name;
        return acc;
    },
    {},
);

export const getCampaignName = (campaign: Campaign) => {
    return `${SUPPORTED_AMM_SLUG_TO_NAME[campaign.pool.amm] || "-"} ${campaign.pool.token0.symbol} / ${campaign.pool.token1.symbol}`;
};
