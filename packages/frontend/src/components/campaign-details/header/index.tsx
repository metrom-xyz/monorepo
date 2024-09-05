import { useCallback } from "react";
import type { NamedCampaign } from "@/src/hooks/useCampaign";
import { Typography } from "@/src/ui/typography";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import numeral from "numeral";
import { Skeleton } from "@/src/ui/skeleton";
import { useTranslations } from "next-intl";
import { Button } from "@/src/ui/button";
import { useRouter } from "@/src/i18n/routing";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getPoolAddLiquidityLink, getPoolExplorerLink } from "@/src/utils/amm";

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
        campaign.pool.amm,
        campaign.pool,
    );
    const exploreLink = getPoolExplorerLink(
        campaign.chainId,
        campaign.pool.amm,
        campaign.pool,
    );

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    <PoolRemoteLogo
                        chain={campaign.chainId}
                        size="xl"
                        token0={{
                            address: campaign.pool.token0.address,
                            defaultText: campaign.pool.token0.symbol,
                        }}
                        token1={{
                            address: campaign.pool.token1.address,
                            defaultText: campaign.pool.token1.symbol,
                        }}
                    />
                    <Typography variant="xl4" weight="medium" noWrap>
                        {campaign.name}
                    </Typography>
                    <Typography variant="lg" weight="medium" light>
                        {numeral(campaign.pool.fee).format("0.0[0]")}%
                    </Typography>
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
                        href={exploreLink}
                        disabled={!exploreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={{ icon: styles.externalLinkIcon }}
                    >
                        {t("explorer")}
                    </Button>
                </div>
                <div className={styles.aprContainer}>
                    <Typography
                        uppercase
                        weight="medium"
                        variant="lg"
                        className={styles.aprText}
                    >
                        {t("apr", {
                            value: numeral(campaign.apr).format("0.0[0]"),
                        })}
                    </Typography>
                </div>
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
                    <PoolRemoteLogo loading size="xl" />
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
