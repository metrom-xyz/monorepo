import {
    Campaign,
    TargetType,
    DistributablesType,
    type Specification,
    type LiquidityInRange,
    type KpiSpecification,
    SupportedLiquityV2,
    type LiquityV2DebtTarget,
} from "@metrom-xyz/sdk";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    type CampaignPreviewPayload,
} from "../types/campaign";
import type { TranslationsType } from "../types/utils";
import { LiquityV2Action } from "../types/common";
import { getDistributableRewardsPercentage } from "./kpi";
import { type Hex, encodeAbiParameters, stringToHex, isAddress } from "viem";
import { CHAIN_DATA, SECONDS_IN_YEAR, WEIGHT_UNIT } from "../commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { getTranslations } from "next-intl/server";
import type { LiquityV2Protocol } from "../types/protocol";

export function buildCampaignDataBundle(payload: CampaignPreviewPayload) {
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload)
        return encodeAbiParameters(
            [
                {
                    name: "poolAddress",
                    type: isAddress(payload.pool.id) ? "address" : "bytes32",
                },
            ],
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

    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload) {
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

        if (payload.weighting) {
            specification.weighting = {
                token0: (payload.weighting.token0 * WEIGHT_UNIT) / 100,
                token1: (payload.weighting.token1 * WEIGHT_UNIT) / 100,
                liquidity: (payload.weighting.liquidity * WEIGHT_UNIT) / 100,
            };
        }
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
            const targetProtocol = CHAIN_DATA[
                campaign.chainId as SupportedChain
            ].protocols.find(
                ({ slug }) =>
                    slug ===
                    (campaign.target as LiquityV2DebtTarget).brand.slug,
            ) as LiquityV2Protocol | undefined;

            return t("campaignActions.borrow", {
                brand: campaign.target.brand.name,
                debtToken: targetProtocol?.debtToken.symbol || "",
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

        return getAmmPoolLiquidityCampaignApr({
            usdRewards: rewardsUsdValue,
            duration,
            poolUsdTvl: payload.pool.usdTvl,
            kpiSpecification: payload.kpiSpecification,
            range,
        });
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

export function getAmmPoolLiquidityCampaignApr({
    duration,
    usdRewards,
    poolUsdTvl,
    kpiSpecification,
    range,
}: {
    duration?: number;
    usdRewards?: number;
    poolUsdTvl?: number;
    kpiSpecification?: KpiSpecification;
    range?: LiquidityInRange;
}) {
    if (!poolUsdTvl || !usdRewards || !duration) return undefined;

    let distributableUsdRewards = usdRewards;
    if (kpiSpecification) {
        distributableUsdRewards *= getDistributableRewardsPercentage(
            poolUsdTvl,
            kpiSpecification.goal.lowerUsdTarget,
            kpiSpecification.goal.upperUsdTarget,
            kpiSpecification.minimumPayoutPercentage,
        );
    }

    let totalUsdTvl = poolUsdTvl;
    if (range) {
        const { liquidity, activeTick } = range;

        const multiplier =
            Math.min(
                Number((liquidity * 1_000_000n) / activeTick.liquidity),
                1_000_000,
            ) / 1_000_000;

        totalUsdTvl = poolUsdTvl * multiplier;
    }

    const rewardsRatio = distributableUsdRewards / totalUsdTvl;
    const yearMultiplier = SECONDS_IN_YEAR / duration;
    const aprPercentage = rewardsRatio * yearMultiplier * 100;

    return aprPercentage;
}
