import {
    Campaign,
    TargetType,
    DistributablesType,
    type Specification,
    type LiquidityInRange,
    type KpiSpecification,
    type LiquityV2DebtTarget,
    type LiquidityByAddresses,
    RestrictionType,
    SupportedBridge,
} from "@metrom-xyz/sdk";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    EmptyTargetCampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    type CampaignPreviewPayload,
    AaveV3CampaignPreviewPayload,
    CampaignKind,
    CampaignType,
} from "../types/campaign";
import type { TranslationsType } from "../types/utils";
import { LiquityV2Action } from "../types/common";
import { getDistributableRewardsPercentage } from "./kpi";
import { type Hex, encodeAbiParameters, stringToHex, isAddress } from "viem";
import { SECONDS_IN_YEAR, WEIGHT_UNIT } from "../commons";
import { type LiquityV2Protocol } from "@metrom-xyz/chains";
import { getTranslations } from "next-intl/server";
import { getChainData } from "./chain";
import {
    Serializer,
    AccountAddress,
    MoveString,
    U32,
} from "@aptos-labs/ts-sdk";

export const AMM_POOL_CAMPAIGN_KIND: Record<
    | CampaignType.AmmPoolLiquidity
    | CampaignType.JumperWhitelistedAmmPoolLiquidity,
    CampaignKind
> = {
    [CampaignType.AmmPoolLiquidity]: CampaignKind.AmmPoolLiquidity,
    [CampaignType.JumperWhitelistedAmmPoolLiquidity]:
        CampaignKind.JumperWhitelistedAmmPoolLiquidity,
};

export function buildCampaignDataBundleEvm(payload: CampaignPreviewPayload) {
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
    } else if (payload instanceof EmptyTargetCampaignPreviewPayload) {
        return "0x";
    } else return null;
}

export function buildCampaignDataBundleMvm(payload: CampaignPreviewPayload) {
    const serializableParts = [];
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload) {
        serializableParts.push(AccountAddress.fromString(payload.pool.id));
    } else if (payload instanceof LiquityV2CampaignPreviewPayload) {
        serializableParts.push(new MoveString(payload.brand.slug));
        serializableParts.push(
            AccountAddress.fromString(payload.collateral.token.address),
        );
    } else if (payload instanceof AaveV3CampaignPreviewPayload) {
        // TODO: have the bridge brand in the campaign payload
        if (payload.kind === CampaignKind.AaveV3BridgeAndSupply)
            serializableParts.push(new MoveString(SupportedBridge.LayerZero));

        serializableParts.push(new MoveString(payload.brand.slug));
        serializableParts.push(
            AccountAddress.fromString(payload.market.address),
        );
        serializableParts.push(
            AccountAddress.fromString(payload.collateral.token.address),
        );

        if (
            payload.boostingFactor &&
            payload.kind === CampaignKind.AaveV3BridgeAndSupply
        ) {
            serializableParts.push(
                new U32(payload.boostingFactor * 100 * 1_000_000),
            );
        }
    } else if (payload instanceof EmptyTargetCampaignPreviewPayload) {
        return [];
    } else return null;

    const serializer = new Serializer();
    for (const part of serializableParts) part.serialize(serializer);

    return serializer.toUint8Array();
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
            const targetProtocol = getChainData(
                campaign.chainId,
            )?.protocols.find(
                ({ slug }) =>
                    slug ===
                    (campaign.target as LiquityV2DebtTarget).brand.slug,
            ) as LiquityV2Protocol | undefined;

            return t("campaignActions.borrow", {
                brand: campaign.target.brand.name,
                debtToken: targetProtocol?.debtToken.symbol || "",
                token: campaign.target.collateral.token.symbol,
            });
        }
        case TargetType.LiquityV2StabilityPool: {
            return t("campaignActions.depositStabilityPool", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.token.symbol,
            });
        }
        case TargetType.AaveV3Borrow: {
            return t("campaignActions.aaveV3Borrow", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.token.symbol,
            });
        }
        case TargetType.AaveV3Supply: {
            return t("campaignActions.aaveV3Supply", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.token.symbol,
            });
        }
        case TargetType.AaveV3NetSupply: {
            return t("campaignActions.aaveV3NetSupply", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.token.symbol,
            });
        }
        case TargetType.AaveV3BridgeAndSupply: {
            return t("campaignActions.aaveV3BridgeAndSupply", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.token.symbol,
            });
        }
        case TargetType.Empty: {
            return t("campaignActions.empty");
        }
        default: {
            return "-";
        }
    }
}

export async function getSocialPreviewCampaignName(
    campaign: Campaign,
): Promise<string> {
    const t = await getTranslations();

    const chain = getChainData(campaign.chainId)?.name.toUpperCase();

    if (!chain) return "-";

    switch (campaign.target.type) {
        case TargetType.AmmPoolLiquidity: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.pool.dex.name,
                chain,
            });
        }
        case TargetType.LiquityV2StabilityPool:
        case TargetType.LiquityV2Debt:
        case TargetType.AaveV3Borrow:
        case TargetType.AaveV3Supply:
        case TargetType.AaveV3NetSupply:
        case TargetType.AaveV3BridgeAndSupply: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.brand.name,
                chain,
            });
        }
        case TargetType.Empty: {
            return t("socialCampaignPreview.empty");
        }
        default: {
            return "-";
        }
    }
}

export function getCampaignPreviewApr(
    payload: BaseCampaignPreviewPayload,
    range?: LiquidityInRange,
    liquidityByAddresses?: LiquidityByAddresses,
): number | undefined {
    const duration = payload.endDate.unix() - payload.startDate.unix();
    if (duration <= 0) return undefined;

    if (
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    ) {
        const { distributables, pool, kpiSpecification } = payload;

        let rewardsUsdValue = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        return getCampaignApr({
            usdRewards: rewardsUsdValue,
            duration,
            usdTvl: pool.usdTvl,
            liquidity: pool.liquidity,
            kpiSpecification,
            range,
            liquidityByAddresses,
        });
    }

    if (
        payload instanceof LiquityV2CampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    ) {
        const { action, distributables, collateral } = payload;

        let rewardsUsdValue = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        let liquityUsdValue = 0;
        switch (action) {
            case LiquityV2Action.Debt: {
                liquityUsdValue = collateral.usdMintedDebt;
                break;
            }
            case LiquityV2Action.StabilityPool: {
                liquityUsdValue = collateral.usdStabilityPoolDebt;
                break;
            }
        }

        // TODO: add KPI once supported for liquity v2
        // TODO: add liquidity by addresses once supported

        const rewardsRatio = rewardsUsdValue / liquityUsdValue;
        const yearMultiplier = SECONDS_IN_YEAR / duration;
        const apr = rewardsRatio * yearMultiplier * 100;

        return apr;
    }

    if (
        payload instanceof AaveV3CampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    ) {
        const { action, distributables, collateral, kpiSpecification } =
            payload;

        let rewardsUsdValue = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        let usdTvl = 0;
        let liquidity = 0n;
        switch (action) {
            case CampaignKind.AaveV3Borrow: {
                usdTvl = collateral.usdDebt;
                liquidity = collateral.debt;
                break;
            }
            case CampaignKind.AaveV3BridgeAndSupply:
            case CampaignKind.AaveV3Supply: {
                usdTvl = collateral.usdSupply;
                liquidity = collateral.supply;
                break;
            }
            case CampaignKind.AaveV3NetSupply: {
                usdTvl = Math.max(collateral.usdSupply - collateral.usdDebt, 0);
                liquidity =
                    collateral.supply - collateral.debt > 0n
                        ? collateral.supply - collateral.debt
                        : 0n;
                break;
            }
        }

        return getCampaignApr({
            usdRewards: rewardsUsdValue,
            duration,
            usdTvl,
            liquidity,
            kpiSpecification,
            range,
        });
    }
}

export function getCampaignApr({
    duration,
    usdRewards,
    usdTvl,
    liquidity,
    kpiSpecification,
    range,
    liquidityByAddresses,
}: {
    duration?: number;
    usdRewards?: number;
    usdTvl?: number;
    liquidity?: bigint;
    kpiSpecification?: KpiSpecification;
    range?: LiquidityInRange;
    liquidityByAddresses?: LiquidityByAddresses;
}) {
    if (
        !duration ||
        usdRewards === undefined ||
        usdTvl === undefined ||
        liquidity === undefined
    )
        return undefined;

    let distributableUsdRewards = usdRewards;
    if (kpiSpecification) {
        distributableUsdRewards *= getDistributableRewardsPercentage(
            usdTvl,
            kpiSpecification.goal.lowerUsdTarget,
            kpiSpecification.goal.upperUsdTarget,
            kpiSpecification.minimumPayoutPercentage,
        );
    }

    let totalUsdTvl = usdTvl;
    if (range) {
        const multiplier =
            Math.min(
                Number(
                    (range.liquidity * 1_000_000n) / range.activeTick.liquidity,
                ),
                1_000_000,
            ) / 1_000_000;

        totalUsdTvl = usdTvl * multiplier;
    } else if (liquidityByAddresses) {
        const adjustedLiquidity =
            liquidityByAddresses.type === RestrictionType.Blacklist
                ? liquidity - liquidityByAddresses.liquidity
                : liquidityByAddresses.liquidity;

        const multiplier =
            Math.min(
                Number((adjustedLiquidity * 1_000_000n) / liquidity),
                1_000_000,
            ) / 1_000_000;

        totalUsdTvl = usdTvl * multiplier;
    }

    const rewardsRatio = distributableUsdRewards / totalUsdTvl;
    const yearMultiplier = SECONDS_IN_YEAR / duration;
    const aprPercentage = rewardsRatio * yearMultiplier * 100;

    return aprPercentage;
}
