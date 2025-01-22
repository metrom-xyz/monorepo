import {
    Campaign,
    TargetType,
    DistributablesType,
    type Specification,
} from "@metrom-xyz/sdk";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    type CampaignPreviewPayload,
} from "../types";
import { getDistributableRewardsPercentage } from "./kpi";
import type { TranslationValues } from "next-intl";
import { encodeAbiParameters, zeroAddress } from "viem";

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export function buildCampaignDataBundle(payload: CampaignPreviewPayload) {
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload)
        return encodeAbiParameters(
            [{ name: "poolAddress", type: "address" }],
            [payload.pool.address],
        );
    else if (payload instanceof LiquityV2CampaignPreviewPayload)
        // TODO: have proper parameters
        return encodeAbiParameters(
            [{ name: "poolAddress", type: "address" }],
            [zeroAddress],
        );
    else return null;
}

export function buildSpecificationBundle(
    payload: CampaignPreviewPayload,
): Specification {
    const specification: Specification = {};

    if (payload.kpiSpecification) specification.kpi = payload.kpiSpecification;

    if (payload.restrictions)
        specification[payload.restrictions.type] = payload.restrictions.list;

    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload)
        if (payload.priceRangeSpecification) {
            let from;
            let to;
            if (payload.priceRangeSpecification.token0To1) {
                from = payload.priceRangeSpecification.from.tick;
                to = payload.priceRangeSpecification.to.tick;
            } else {
                from = -payload.priceRangeSpecification.to.tick;
                to = -payload.priceRangeSpecification.from.tick;
            }

            specification.priceRange = { from, to };
        }

    return specification;
}

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
    payload: BaseCampaignPreviewPayload,
): number | undefined {
    if (
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    ) {
        let rewardsUsdValue = 0;
        for (const reward of payload.distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        if (payload.kpiSpecification) {
            rewardsUsdValue *= getDistributableRewardsPercentage(
                payload.pool.usdTvl,
                payload.kpiSpecification.goal.lowerUsdTarget,
                payload.kpiSpecification.goal.upperUsdTarget,
                payload.kpiSpecification.minimumPayoutPercentage,
            );
        }

        const duration = payload.endDate.unix() - payload.startDate.unix();
        if (duration <= 0) return undefined;

        const rewardsTvlRatio = rewardsUsdValue / payload.pool.usdTvl;
        const yearMultiplier = SECONDS_IN_YEAR / duration;
        const apr = rewardsTvlRatio * yearMultiplier * 100;

        return apr;
    }

    if (
        payload instanceof LiquityV2CampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    )
        // TODO: implement APR for liquity v2 campaign
        return 0;
}
