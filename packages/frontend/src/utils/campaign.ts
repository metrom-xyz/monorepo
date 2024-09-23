import type { Campaign } from "@metrom-xyz/sdk";
import { CHAIN_DATA } from "../commons";
import type { CampaignPayload } from "../types";

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

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

export const getCampaignPreviewApr = (campaign: CampaignPayload) => {
    if (
        !campaign.rewards ||
        !campaign.pool?.tvl ||
        !campaign.startDate ||
        !campaign.endDate
    )
        return null;

    let rewardsUsdValue = 0;
    for (const reward of campaign.rewards) {
        if (!reward.amount.usdValue) return null;
        rewardsUsdValue += reward.amount.usdValue;
    }

    const duration = campaign.endDate.unix() - campaign.startDate.unix();
    if (duration <= 0) return null;

    const rewardsTvlRatio = rewardsUsdValue / campaign.pool.tvl;
    const yearMultiplier = SECONDS_IN_YEAR / duration;
    const apr = rewardsTvlRatio * yearMultiplier * 100;

    return apr || null;
};
