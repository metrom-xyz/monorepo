import {
    Campaign,
    TargetType,
    DistributablesType,
    type Specification,
    type LiquidityInRange,
} from "@metrom-xyz/sdk";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2Action,
    LiquityV2CampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    type CampaignPayloadTokenDistributables,
    type CampaignPreviewPayload,
    type CampaignPreviewTokenDistributables,
    type TranslationsType,
} from "../types/common";
import { getDistributableRewardsPercentage } from "./kpi";
import { type Hex, encodeAbiParameters, stringToHex } from "viem";
import { CHAIN_DATA, SECONDS_IN_YEAR } from "../commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { getTranslations } from "next-intl/server";

export function buildCampaignDataBundle(payload: CampaignPreviewPayload) {
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload)
        return encodeAbiParameters(
            [{ name: "poolAddress", type: "address" }],
            [payload.pool.id],
        );
    else if (payload instanceof LiquityV2CampaignPreviewPayload) {
        return encodeAbiParameters(
            [
                { name: "brand", type: "bytes32" },
                { name: "collateral", type: "address" },
            ],
            [
                stringToHex(payload.brand.slug).padEnd(66, "0") as Hex,
                payload.collateral.token.address,
            ],
        );
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

// TODO: Should maybe avoid passing the t function as a parameter https://github.com/amannn/next-intl/issues/1704#issuecomment-2643211585.
export function getCampaignName(
    t: TranslationsType<never>,
    campaign: Campaign,
): string {
    switch (campaign.target.type) {
        case TargetType.AmmPoolLiquidity: {
            return t("campaignActions.lp", {
                dex: campaign.target.pool.dex.name,
                pool: campaign.target.pool.tokens
                    .map((token) => token.symbol)
                    .join("/"),
            });
        }
        case TargetType.LiquityV2Debt: {
            return t("campaignActions.takeLoan", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.LiquityV2StabilityPool: {
            return t("campaignActions.depositStabilityPool", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
    }
}

export async function getSocialPreviewCampaignName(
    campaign: Campaign,
): Promise<string> {
    const t = await getTranslations();

    const chain =
        CHAIN_DATA[campaign.chainId as SupportedChain].name.toUpperCase();

    switch (campaign.target.type) {
        case TargetType.AmmPoolLiquidity: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.pool.dex.name,
                chain,
            });
        }
        case TargetType.LiquityV2Debt: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.brand.name,
                chain,
            });
        }
        case TargetType.LiquityV2StabilityPool: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.brand.name,
                chain,
            });
        }
    }
}

export function getCampaignPreviewApr(
    payload: BaseCampaignPreviewPayload,
    range?: LiquidityInRange,
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

        let poolUsdTvl = payload.pool.usdTvl;
        if (range) {
            const { liquidity, activeTick } = range;

            const multiplier =
                Math.min(
                    Number((liquidity * 1_000_000n) / activeTick.liquidity),
                    1_000_000,
                ) / 1_000_000;

            poolUsdTvl = payload.pool.usdTvl * multiplier;
        }

        const rewardsTvlRatio = rewardsUsdValue / poolUsdTvl;
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

        let liquityUsdValue = 0;
        switch (payload.action) {
            case LiquityV2Action.Debt: {
                liquityUsdValue = payload.collateral.usdMintedDebt;
                break;
            }
            case LiquityV2Action.StabilityPool: {
                liquityUsdValue = payload.collateral.usdStabilityPoolDebt;
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
