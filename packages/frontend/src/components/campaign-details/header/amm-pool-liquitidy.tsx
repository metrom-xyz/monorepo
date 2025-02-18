import { useCallback } from "react";
import { Typography, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getAddressExplorerLink } from "@/src/utils/dex";
import { formatPercentage } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { PoolRemoteLogo } from "../../pool-remote-logo";
import { AprChip } from "../../apr-chip";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import type { TargetedNamedCampaign } from "@/src/types";

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

    const ChainIcon = campaign.chainData.icon;
    const depositLink = campaign.getDepositLiquidityUrl();
    const explorerLink = getAddressExplorerLink(
        campaign.target.pool.address,
        campaign.chainId,
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
                    <ChainIcon className={styles.chainLogo} />
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
                        href={depositLink}
                        disabled={!depositLink}
                        onClick={handleAddLiquidityOnClick}
                        target="_blank"
                        rel="noopener noreferrer"
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
                        icon={ArrowRightIcon}
                        href={explorerLink}
                        disabled={!explorerLink}
                        onClick={handleExploreOnClick}
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
                {campaign.apr &&
                    campaign.isDistributing(DistributablesType.Tokens) && (
                        <AprChip
                            prefix
                            size="lg"
                            apr={campaign.apr}
                            kpi={!!campaign.specification?.kpi}
                        />
                    )}
            </div>
        </div>
    );
}
