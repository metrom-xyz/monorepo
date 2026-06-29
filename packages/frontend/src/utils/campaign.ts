import {
    TargetType,
    DistributablesType,
    type LiquidityInRange,
    type LiquityV2DebtTarget,
    type LiquidityByAddresses,
    RestrictionType,
    CampaignKind,
    SupportedOdysseyStrategy,
    BaseCampaign as SdkBaseCampaign,
    CampaignDetails as SdkCampaignDetails,
    CampaignItem as SdkCampaignItem,
    type AmmPool,
    type AaveV3Collateral,
    type LiquityV2Collateral,
    type Erc4626Vault,
    type Erc20Token,
} from "@metrom-xyz/sdk";
import {
    CampaignDetails,
    type BaseCampaignPreviewPayload,
    type CampaignPreviewKpiDistribution,
} from "../types/campaign/common";
import type { TranslationsType } from "../types/utils";
import { getDistributableRewardsPercentage } from "./kpi";
import { ARCHE_ARUSD_VAULT_ADDRESSES, SECONDS_IN_YEAR } from "../commons";
import {
    type AaveV3Protocol,
    type LiquityV2Protocol,
} from "@metrom-xyz/chains";
import { getTranslations } from "next-intl/server";
import { getCrossVmChainData } from "./chain";
import { ODYSSEY_STRATEGIES_NAME } from "../commons/odyssey";
import { getErc20Protocol } from "./erc20";

// TODO: Should maybe avoid passing the t function as a parameter https://github.com/amannn/next-intl/issues/1704#issuecomment-2643211585.
export function getCampaignName(
    t: TranslationsType<never>,
    campaign: SdkBaseCampaign | SdkCampaignItem,
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
        case TargetType.GmxV1Liquidity: {
            return t("campaignActions.gmxV1", {
                brand: campaign.target.brand.name,
            });
        }
        case TargetType.LiquityV2Debt: {
            const targetProtocol = getCrossVmChainData(
                campaign.chainId,
                campaign.chainType,
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
            return getHoldFungibleAssetCampaignPreviewName(
                t,
                campaign.target.asset,
            );
        }
        case TargetType.JumperWhitelistedAmmPoolLiquidity: {
            return t("campaignActions.jumperWhitelistedAmmPoolLiquidity", {
                dex: campaign.target.pool.dex.name,
                pool: campaign.target.pool.tokens
                    .map((token) => token.symbol)
                    .join("/"),
            });
        }
        case TargetType.Turtle: {
            return campaign.target.name;
        }
        case TargetType.YieldSeeker: {
            // TODO: have the collateral returned by the API
            return "Yieldseeker USDC";
        }
        case TargetType.Odyssey: {
            return t("campaignActions.odysseyStrategy", {
                strategy:
                    ODYSSEY_STRATEGIES_NAME[
                        campaign.target.strategyId as SupportedOdysseyStrategy
                    ],
                asset: campaign.target.asset.symbol,
            });
        }
        case TargetType.Erc4626Vault: {
            if (
                ARCHE_ARUSD_VAULT_ADDRESSES.includes(
                    campaign.target.vault.address,
                )
            ) {
                return t("campaignActions.erc4626Vault", {
                    vault: campaign.target.vault.name,
                    brand: "Arche",
                });
            }

            return t("campaignActions.erc4626Vault", {
                vault: campaign.target.vault.name,
                brand: campaign.target.brand.name,
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
        case CampaignKind.HoldFungibleAsset:
        case CampaignKind.OdysseyStrategy:
        case CampaignKind.Erc4626Vault: {
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

export function getAmmPoolLiquidityCampaignPreviewName(
    t: TranslationsType<never>,
    kind: CampaignKind,
    pool: AmmPool,
) {
    const dex = pool.dex.name;
    const poolName = pool.tokens.map((token) => token.symbol).join("/");

    switch (kind) {
        case CampaignKind.AmmPoolLiquidity: {
            return t("campaignActions.lp", { dex, pool: poolName });
        }
        case CampaignKind.JumperWhitelistedAmmPoolLiquidity: {
            return t("campaignActions.jumperWhitelistedAmmPoolLiquidity", {
                dex,
                pool: poolName,
            });
        }
        default: {
            return "-";
        }
    }
}

export function getAaveV3CampaignPreviewName(
    t: TranslationsType<never>,
    kind: CampaignKind,
    brand: AaveV3Protocol,
    collateral: AaveV3Collateral,
) {
    const brandName = brand.name;
    const token = collateral.symbol;

    switch (kind) {
        case CampaignKind.AaveV3Borrow: {
            return t("campaignActions.aaveV3Borrow", {
                brand: brandName,
                token,
            });
        }
        case CampaignKind.AaveV3Supply: {
            return t("campaignActions.aaveV3Supply", {
                brand: brandName,
                token,
            });
        }
        case CampaignKind.AaveV3NetSupply: {
            return t("campaignActions.aaveV3NetSupply", {
                brand: brandName,
                token,
            });
        }
        case CampaignKind.AaveV3BridgeAndSupply: {
            return t("campaignActions.aaveV3BridgeAndSupply", {
                brand: brandName,
                token,
            });
        }
        default: {
            return "-";
        }
    }
}

export function getLiquityV2CampaignPreviewName(
    t: TranslationsType<never>,
    kind: CampaignKind,
    brand: LiquityV2Protocol,
    collateral: LiquityV2Collateral,
) {
    const brandName = brand.name;
    const token = collateral.symbol;

    switch (kind) {
        case CampaignKind.LiquityV2Debt: {
            return t("campaignActions.borrow", {
                brand: brandName,
                debtToken: brand.debtToken.symbol,
                token,
            });
        }
        case CampaignKind.LiquityV2StabilityPool: {
            return t("campaignActions.depositStabilityPool", {
                brand: brandName,
                token,
            });
        }
        default: {
            return "-";
        }
    }
}

export function getHoldFungibleAssetCampaignPreviewName(
    t: TranslationsType<never>,
    asset: Erc20Token,
) {
    const protocol = getErc20Protocol(asset);

    switch (asset.details?.type) {
        case "lp":
            return t("campaignActions.holdFungibleAsset.lp", {
                dex: protocol?.name || "",
                pool: `${asset.details.baseTokenSymbol}/${asset.details.quoteTokenSymbol}`,
            });
        default:
            return t("campaignActions.holdFungibleAsset.default", {
                name: asset.name,
                symbol: asset.symbol,
            });
    }
}

export function getErc4626VaultCampaignPreviewName(
    t: TranslationsType<never>,
    brand: string,
    vault: Erc4626Vault,
) {
    return t("campaignActions.erc4626Vault", {
        vault: vault.name,
        brand: brand,
    });
}

export async function getSocialPreviewCampaignName(
    campaign: CampaignDetails | SdkCampaignDetails,
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
        case TargetType.HoldFungibleAsset: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.asset.name,
                chain,
            });
        }
        case TargetType.Erc4626Vault: {
            return t("socialCampaignPreview.title", {
                protocol: campaign.target.vault.name,
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
    usdTvl?: number,
): number | undefined {
    const duration = payload.endDate.unix() - payload.startDate.unix();
    if (duration <= 0 || !payload.isDistributing(DistributablesType.Tokens))
        return undefined;

    const { distributables, kpiDistribution } = payload;

    let rewardsUsdValue = 0;
    for (const reward of distributables.tokens) {
        if (!reward.amount.usdValue) return undefined;
        rewardsUsdValue += reward.amount.usdValue;
    }

    const liquidity = payload.getTargetValue();

    return getCampaignApr({
        usdRewards: rewardsUsdValue,
        duration,
        usdTvl: usdTvl || liquidity?.usd,
        liquidity: liquidity?.raw,
        kpiDistribution,
        range,
        liquidityByAddresses,
    });
}

export function getCampaignApr({
    duration,
    usdRewards,
    usdTvl,
    liquidity,
    kpiDistribution,
    range,
    liquidityByAddresses,
}: {
    duration?: number;
    usdRewards?: number;
    usdTvl?: number;
    liquidity?: bigint;
    kpiDistribution?: CampaignPreviewKpiDistribution;
    range?: LiquidityInRange;
    liquidityByAddresses?: LiquidityByAddresses;
}) {
    if (!duration || usdRewards === undefined || usdTvl === undefined)
        return undefined;

    let distributableUsdRewards = usdRewards;
    if (kpiDistribution) {
        distributableUsdRewards *= getDistributableRewardsPercentage(
            usdTvl,
            kpiDistribution.goal.lowerUsdTarget,
            kpiDistribution.goal.upperUsdTarget,
            kpiDistribution.minimumPayoutPercentage,
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
        if (!liquidity) {
            console.error(
                "Missing raw liquidity while calculating APR for liquidity by addresses",
            );
            return undefined;
        }

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
