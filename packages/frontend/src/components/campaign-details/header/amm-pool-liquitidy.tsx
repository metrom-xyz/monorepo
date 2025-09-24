import { useCallback } from "react";
import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getExplorerLink } from "@/src/utils/explorer";
import { formatPercentage } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import { AprChip } from "../../apr-chip";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import type { TargetedNamedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface AmmPoolLiquityHeaderProps {
    campaign: TargetedNamedCampaign<TargetType.AmmPoolLiquidity>;
}

export function AmmPoolLiquityHeader({ campaign }: AmmPoolLiquityHeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const handleClaimOnClick = useCallback(() => {
        router.push("/claims");
    }, [router]);

    // FIXME: temp fix, have the tick spacing in the pool, from the API
    const velodromePoolParams =
        campaign.target.pool.amm === "velodrome"
            ? {
                  type: campaign.target.pool.fee === 0.05 ? 50 : 200,
              }
            : undefined;

    const ChainIcon = campaign.chainData?.icon;
    const depositLink = campaign.getDepositLiquidityUrl(velodromePoolParams);
    const explorerLink = getExplorerLink(
        campaign.target.pool.id,
        campaign.chainId,
        campaign.chainType,
    );

    function handleAddLiquidityOnClick() {
        trackFathomEvent("CLICK_POOL_DEPOSIT");
    }

    function handleExploreOnClick() {
        trackFathomEvent("CLICK_DEX_EXPLORE");
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {ChainIcon && (
                        <InfoTooltip
                            placement="top"
                            icon={<ChainIcon className={styles.chainLogo} />}
                        >
                            <Typography size="sm">
                                {campaign.chainData.name}
                            </Typography>
                        </InfoTooltip>
                    )}
                    <PoolRemoteLogo
                        chain={campaign.chainId}
                        size="xl"
                        tokens={campaign.target.pool.tokens.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        }))}
                    />
                    <Typography size="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                    {campaign.target.pool.fee && (
                        <Typography size="lg" weight="medium" light>
                            {formatPercentage({
                                percentage: campaign.target.pool.fee,
                                keepDust: true,
                            })}
                        </Typography>
                    )}
                </div>
                <Typography size="sm" weight="medium" light>
                    {t("rewardsMayVary")}
                </Typography>
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
                    <Button
                        size="sm"
                        href={depositLink || undefined}
                        disabled={!depositLink}
                        onClick={handleAddLiquidityOnClick}
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={{
                            icon: styles.externalLinkIcon,
                        }}
                    >
                        {t("ammPoolLiquidity.deposit")}
                    </Button>
                    {campaign.isDistributing(DistributablesType.Tokens) && (
                        <Button size="sm" onClick={handleClaimOnClick}>
                            {t("claim")}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="secondary"
                        border={false}
                        href={explorerLink}
                        disabled={!explorerLink}
                        onClick={handleExploreOnClick}
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={{
                            root: styles.exploreButton,
                            contentWrapper: styles.exploreButton,
                            icon: styles.externalLinkIcon,
                        }}
                    >
                        {t("explorer")}
                    </Button>
                </div>
                {campaign.isDistributing(DistributablesType.Tokens) && (
                    <AprChip
                        prefix
                        size="lg"
                        apr={campaign.apr}
                        kpi={!!campaign.specification?.kpi}
                        priceRange={campaign.specification?.priceRange}
                        weighting={campaign.specification?.weighting}
                        token0Symbol={campaign.target.pool.tokens[0].symbol}
                        token1Symbol={campaign.target.pool.tokens[1].symbol}
                    />
                )}
            </div>
        </div>
    );
}
