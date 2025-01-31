import {
    Campaign,
    TargetType,
    DistributablesType,
    type Specification,
    SupportedLiquityV2,
} from "@metrom-xyz/sdk";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2Action,
    LiquityV2CampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    type CampaignPreviewPayload,
} from "../types";
import { getDistributableRewardsPercentage } from "./kpi";
import type { TranslationValues } from "next-intl";
import { encodeAbiParameters, type Address } from "viem";

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export function buildCampaignDataBundle(payload: CampaignPreviewPayload) {
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload)
        return encodeAbiParameters(
            [{ name: "poolAddress", type: "address" }],
            [payload.pool.address],
        );
    else if (payload instanceof LiquityV2CampaignPreviewPayload) {
        const parameters = [{ name: "brandSlug", type: "string" }];
        const values: [SupportedLiquityV2, Address[]?] = [payload.brand.slug];

        if (payload.filters.length > 0) {
            parameters.push({ name: "collaterals", type: "address[]" });
            values.push(payload.filters.map(({ token }) => token.address));
        }

        return encodeAbiParameters(parameters, values);
    } else return null;
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
                pool: campaign.target.pool.tokens
                    .map((token) => token.symbol)
                    .join("/"),
            });
        }
        case TargetType.LiquityV2Debt: {
            return t("campaignActions.takeLoan", {
                brand: campaign.target.brand.name,
            });
        }
        case TargetType.LiquityV2Collateral: {
            return t("campaignActions.depositCollateral", {
                brand: campaign.target.brand.name,
            });
        }
        // TODO: add missing type
    }
}

export function getCampaignPreviewApr(
    payload: BaseCampaignPreviewPayload,
): number | undefined {
    const duration = payload.endDate.unix() - payload.startDate.unix();
    if (duration <= 0) return undefined;

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

        const rewardsTvlRatio = rewardsUsdValue / payload.pool.usdTvl;
        const yearMultiplier = SECONDS_IN_YEAR / duration;
        const apr = rewardsTvlRatio * yearMultiplier * 100;

        return apr;
    }

    if (
        payload instanceof LiquityV2CampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    ) {
        let rewardsUsdValue = 0;
        for (const reward of payload.distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        const filteredCollaterals =
            payload.filters.length === 0
                ? payload.supportedCollaterals
                : payload.filters;

        let liquityUsdValue = 0;
        switch (payload.action) {
            case LiquityV2Action.Debt: {
                liquityUsdValue = filteredCollaterals.reduce(
                    (usd, collateral) => usd + collateral.usdMintedDebt,
                    0,
                );
                break;
            }
            case LiquityV2Action.Collateral: {
                liquityUsdValue = filteredCollaterals.reduce(
                    (usd, collateral) => usd + collateral.usdTvlUsd,
                    0,
                );
                break;
            }
            case LiquityV2Action.StabilityPool: {
                liquityUsdValue = filteredCollaterals.reduce(
                    (usd, collateral) => usd + collateral.usdStabilityPoolDebt,
                    0,
                );
                break;
            }
        }

        // TODO: add KPI once supported for liquity v2

        const rewardsRatio = rewardsUsdValue / liquityUsdValue;
        const yearMultiplier = SECONDS_IN_YEAR / duration;
        const apr = rewardsRatio * yearMultiplier * 100;

        return apr;
    }
}
