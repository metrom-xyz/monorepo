import { useCallback } from "react";
import type { NamedCampaign } from "@/src/hooks/useCampaign";
import { Skeleton, Typography, Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getPoolAddLiquidityLink, getPoolExplorerLink } from "@/src/utils/dex";
import { formatPercentage } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { PoolRemoteLogo } from "../../pool-remote-logo";

import styles from "./styles.module.css";

interface HeaderProps {
    campaign: NamedCampaign;
}

export function Header({ campaign }: HeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const handleClaimOnClick = useCallback(() => {
        router.push("/claims");
    }, [router]);

    const depositLink = getPoolAddLiquidityLink(
        campaign.chainId,
        campaign.pool.dex,
        campaign.pool,
    );
    const explorerLink = getPoolExplorerLink(campaign.chainId, campaign.pool);

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
                    <PoolRemoteLogo
                        chain={campaign.chainId}
                        size="xl"
                        tokens={campaign.pool.tokens.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        }))}
                    />
                    <Typography variant="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                    {campaign.pool.fee && (
                        <Typography variant="lg" weight="medium" light>
                            {formatPercentage(campaign.pool.fee)}
                        </Typography>
                    )}
                </div>
                <Typography variant="sm" weight="medium" light>
                    {t("rewardsMayVary")}
                </Typography>
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
                    <Button
                        size="xsmall"
                        href={depositLink}
                        disabled={!depositLink}
                        onClick={handleAddLiquidityOnClick}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={{ root: styles.button }}
                    >
                        {t("deposit")}
                    </Button>
                    <Button
                        size="xsmall"
                        className={{ root: styles.claimButton }}
                        onClick={handleClaimOnClick}
                    >
                        {t("claim")}
                    </Button>
                    <Button
                        size="xsmall"
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
                {campaign.apr && (
                    <div className={styles.aprContainer}>
                        <Typography
                            uppercase
                            weight="medium"
                            variant="lg"
                            className={styles.aprText}
                        >
                            {t("apr", {
                                value: formatPercentage(campaign.apr),
                            })}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

export function SkeletonHeader() {
    const t = useTranslations("campaignDetails.header");

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <PoolRemoteLogo
                        tokens={[{ address: "0x1" }, { address: "0x2" }]}
                        loading
                        size="xl"
                    />
                    <Skeleton variant="xl2" width={400} />
                    <Skeleton variant="lg" width={60} />
                </div>
                <Skeleton variant="sm" width={125} />
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
                    <Button size="xsmall" loading>
                        {t("deposit")}
                    </Button>
                    <Button
                        size="xsmall"
                        className={{ root: styles.claimButton }}
                        loading
                    >
                        {t("claim")}
                    </Button>
                    <Button
                        size="xsmall"
                        variant="secondary"
                        border={false}
                        loading
                    >
                        {t("explorer")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
