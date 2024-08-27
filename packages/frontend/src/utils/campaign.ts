import type { Campaign } from "@metrom-xyz/sdk";
import { SUPPORTED_AMM_SLUG_TO_NAME } from "../commons";

export const getCampaignName = (campaign: Campaign) => {
    return `${SUPPORTED_AMM_SLUG_TO_NAME[campaign.pool.amm] || "-"} ${campaign.pool.token0.symbol} / ${campaign.pool.token1.symbol}`;
};
