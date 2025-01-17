import { Campaign, TargetType, type DistributablesType } from "@metrom-xyz/sdk";
import type { DistributablesCampaignPreviewPayload } from "../types";
import { getDistributableRewardsPercentage } from "./kpi";
import type { TranslationValues } from "next-intl";

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export function getCampaignName(
    t: (key: string, values?: TranslationValues) => string,
    campaign: Campaign,
): string {
    switch (campaign.target.type) {
        case TargetType.AmmPoolLiquidity: {
            return t("campaignActions.lp", {
                name: campaign.target.pool.tokens
                    .map((token) => token.symbol)
                    .join("/"),
            });
        }
        case TargetType.LiquityV2Debt: {
            return t("campaignActions.takeLoan", {
                name: campaign.target.liquityV2Brand.name,
            });
        }
    }
}

export function getCampaignPreviewApr(
    campaign: DistributablesCampaignPreviewPayload<DistributablesType.Tokens>,
): number | undefined {
    let rewardsUsdValue = 0;
    for (const reward of campaign.distributables.tokens) {
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
}
