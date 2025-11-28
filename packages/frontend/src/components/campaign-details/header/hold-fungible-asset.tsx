import { Button, InfoTooltip, Typography } from "@metrom-xyz/ui";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { useCallback } from "react";
import { RemoteLogo } from "../../remote-logo";
import { AprChip } from "../../apr-chip";
import { trackFathomEvent } from "@/src/utils/fathom";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { getFungibleAssetExplorerLink } from "@/src/utils/explorer";

import styles from "./styles.module.css";

interface HoldFungibleAssetProps {
    campaign: TargetedNamedCampaign<TargetType.HoldFungibleAsset>;
}

export function HoldFungibleAsset({ campaign }: HoldFungibleAssetProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const ChainIcon = campaign.chainData?.icon;
    const explorerLink = getFungibleAssetExplorerLink(
        campaign.target.asset.address,
        campaign.target.chainId,
        campaign.target.chainType,
    );

    const handleClaimOnClick = useCallback(() => {
        router.push("/claims");
    }, [router]);

    function handleExploreOnClick() {
        trackFathomEvent("CLICK_FUNGIBLE_ASSET_EXPLORE");
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {ChainIcon && (
                        <InfoTooltip
                            icon={<ChainIcon className={styles.chainLogo} />}
                        >
                            <Typography size="sm">
                                {campaign.chainData.name}
                            </Typography>
                        </InfoTooltip>
                    )}
                    <RemoteLogo
                        size="xl"
                        address={campaign.target.asset.address}
                        chain={campaign.target.chainId}
                    />
                    <Typography size="xl3" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
            </div>
            <div className={styles.actionsContainer}>
                <div className={styles.leftActions}>
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
                        campaign={campaign}
                    />
                )}
            </div>
        </div>
    );
}
