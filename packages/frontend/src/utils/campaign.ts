import {
    Campaign,
    TargetType,
    DistributablesType,
    type LiquidityInRange,
    type KpiSpecification,
    type LiquityV2DebtTarget,
    type LiquidityByAddresses,
    RestrictionType,
    CampaignKind,
} from "@metrom-xyz/sdk";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    EmptyTargetCampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    AaveV3CampaignPreviewPayload,
    HoldFungibleAssetCampaignPreviewPayload,
} from "../types/campaign";
import type { TranslationsType } from "../types/utils";
import { getDistributableRewardsPercentage } from "./kpi";
import { SECONDS_IN_YEAR } from "../commons";
import { type LiquityV2Protocol } from "@metrom-xyz/chains";
import { getTranslations } from "next-intl/server";
import { getChainData, getCrossVmChainData } from "./chain";

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
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.LiquityV2StabilityPool: {
            return t("campaignActions.depositStabilityPool", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.AaveV3Borrow: {
            return t("campaignActions.aaveV3Borrow", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.AaveV3Supply: {
            return t("campaignActions.aaveV3Supply", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.AaveV3NetSupply: {
            return t("campaignActions.aaveV3NetSupply", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.AaveV3BridgeAndSupply: {
            return t("campaignActions.aaveV3BridgeAndSupply", {
                brand: campaign.target.brand.name,
                token: campaign.target.collateral.symbol,
            });
        }
        case TargetType.HoldFungibleAsset: {
            return t("campaignActions.holdFungibleAsset", {
                name: campaign.target.asset.name,
                symbol: campaign.target.asset.symbol,
            });
        }
        case TargetType.JumperWhitelistedAmmPoolLiquidity: {
            return t("campaignActions.jumperWhitelistedAmmPoolLiquidity", {
                dex: campaign.target.pool.dex.name,
                pool: campaign.target.pool.tokens
                    .map((token) => token.symbol)
                    .join("/"),
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

export function getCampaignTargetValueName(
    t: TranslationsType<never>,
    kind: CampaignKind,
) {
    switch (kind) {
        case CampaignKind.AmmPoolLiquidity:
        case CampaignKind.JumperWhitelistedAmmPoolLiquidity:
        case CampaignKind.HoldFungibleAsset: {
            return t("campaignTargetValueName.tvl");
        }
        case CampaignKind.LiquityV2Debt:
        case CampaignKind.AaveV3Borrow: {
            return t("campaignTargetValueName.debt");
        }
        case CampaignKind.LiquityV2StabilityPool:
        case CampaignKind.AaveV3Supply:
        case CampaignKind.AaveV3BridgeAndSupply: {
            return t("campaignTargetValueName.deposits");
        }
        case CampaignKind.AaveV3NetSupply: {
            return t("campaignTargetValueName.netDeposits");
        }
        default: {
            return "-";
        }
    }
}

export function getCampaignPreviewName(
    t: TranslationsType<never>,
    payload: BaseCampaignPreviewPayload,
): string {
    if (payload instanceof AmmPoolLiquidityCampaignPreviewPayload) {
        const dex = payload.pool.dex.name;
        const pool = payload.pool.tokens.map((token) => token.symbol).join("/");

        switch (payload.kind) {
            case CampaignKind.AmmPoolLiquidity: {
                return t("campaignActions.lp", { dex, pool });
            }
            case CampaignKind.JumperWhitelistedAmmPoolLiquidity: {
                return t("campaignActions.jumperWhitelistedAmmPoolLiquidity", {
                    dex,
                    pool,
                });
            }
            default: {
                return "-";
            }
        }
    } else if (payload instanceof LiquityV2CampaignPreviewPayload) {
        const targetProtocol = getChainData(
            payload.collateral.chainId,
        )?.protocols.find(({ slug }) => slug === payload.brand.slug) as
            | LiquityV2Protocol
            | undefined;

        const brand = payload.brand.name;
        const debtToken = targetProtocol?.debtToken.symbol || "";
        const token = payload.collateral.token.symbol;

        switch (payload.kind) {
            case CampaignKind.LiquityV2Debt: {
                return t("campaignActions.borrow", {
                    brand,
                    debtToken,
                    token,
                });
            }
            case CampaignKind.LiquityV2StabilityPool: {
                return t("campaignActions.depositStabilityPool", {
                    brand,
                    token,
                });
            }
            default: {
                return "-";
            }
        }
    } else if (payload instanceof AaveV3CampaignPreviewPayload) {
        const brand = payload.brand.name;
        const token = payload.collateral.token.symbol;

        switch (payload.kind) {
            case CampaignKind.AaveV3Borrow: {
                return t("campaignActions.aaveV3Borrow", { brand, token });
            }
            case CampaignKind.AaveV3Supply: {
                return t("campaignActions.aaveV3Supply", { brand, token });
            }
            case CampaignKind.AaveV3NetSupply: {
                return t("campaignActions.aaveV3NetSupply", { brand, token });
            }
            case CampaignKind.AaveV3BridgeAndSupply: {
                return t("campaignActions.aaveV3BridgeAndSupply", {
                    brand,
                    token,
                });
            }
            default: {
                return "-";
            }
        }
    } else if (payload instanceof HoldFungibleAssetCampaignPreviewPayload) {
        return t("campaignActions.holdFungibleAsset", {
            name: payload.asset.name,
            symbol: payload.asset.symbol,
        });
    } else if (payload instanceof EmptyTargetCampaignPreviewPayload) {
        return t("campaignActions.empty");
    } else {
        return "-";
    }
}

export async function getSocialPreviewCampaignName(
    campaign: Campaign,
): Promise<string> {
    const t = await getTranslations();

    const chain = getCrossVmChainData(
        campaign.chainId,
        campaign.chainType,
    )?.name.toUpperCase();

    if (!chain) return "-";

    switch (campaign.target.type) {
        case TargetType.JumperWhitelistedAmmPoolLiquidity:
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
        const { distributables, kpiSpecification } = payload;

        let rewardsUsdValue = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        const liquidity = payload.getTargetValue();

        return getCampaignApr({
            usdRewards: rewardsUsdValue,
            duration,
            usdTvl: liquidity?.usd,
            liquidity: liquidity?.raw,
            kpiSpecification,
            range,
        });

        // TODO: add liquidity by addresses once supported
    }

    if (
        payload instanceof AaveV3CampaignPreviewPayload &&
        payload.isDistributing(DistributablesType.Tokens)
    ) {
        const { distributables, kpiSpecification } = payload;

        let rewardsUsdValue = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return undefined;
            rewardsUsdValue += reward.amount.usdValue;
        }

        const liquidity = payload.getTargetValue();

        return getCampaignApr({
            usdRewards: rewardsUsdValue,
            duration,
            usdTvl: liquidity?.usd,
            liquidity: liquidity?.raw,
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
