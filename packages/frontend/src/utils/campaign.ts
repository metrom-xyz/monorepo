import type { CampaignPayload } from "../types";
import { getDistributableRewardsPercentage } from "./kpi";

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export const getCampaignPreviewApr = (
    campaign: CampaignPayload,
): number | undefined => {
    if (
        !campaign.tokens ||
        !campaign.pool?.usdTvl ||
        !campaign.startDate ||
        !campaign.endDate
    )
        return undefined;

    let rewardsUsdValue = 0;
    for (const reward of campaign.tokens) {
        if (!reward.amount.usdValue) return undefined;
        rewardsUsdValue += reward.amount.usdValue;
    }

    if (campaign.kpiSpecification) {
        rewardsUsdValue *= getDistributableRewardsPercentage(
            campaign.pool.usdTvl,
            campaign.kpiSpecification.goal.lowerUsdTarget,
            campaign.kpiSpecification.goal.upperUsdTarget,
            campaign.kpiSpecification.minimumPayoutPercentage,
        );
    }

    const duration = campaign.endDate.unix() - campaign.startDate.unix();
    if (duration <= 0) return undefined;

    const rewardsTvlRatio = rewardsUsdValue / campaign.pool.usdTvl;
    const yearMultiplier = SECONDS_IN_YEAR / duration;
    const apr = rewardsTvlRatio * yearMultiplier * 100;

    return apr || undefined;
};
