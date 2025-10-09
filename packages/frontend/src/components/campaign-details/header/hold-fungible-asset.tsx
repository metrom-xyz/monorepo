import { Button, InfoTooltip, Typography } from "@metrom-xyz/ui";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { useCallback } from "react";
import { RemoteLogo } from "../../remote-logo";
import { AprChip } from "../../apr-chip";

import styles from "./styles.module.css";

interface HoldFungibleAssetProps {
    campaign: TargetedNamedCampaign<TargetType.HoldFungibleAsset>;
}

export function HoldFungibleAsset({ campaign }: HoldFungibleAssetProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const ChainIcon = campaign.chainData?.icon;

    const handleClaimOnClick = useCallback(() => {
        router.push("/claims");
    }, [router]);

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
                    <RemoteLogo
                        size="xl"
                        address={campaign.target.asset.address}
                        chain={campaign.target.chainId}
                    />
                    <Typography size="xl4" weight="medium">
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
                    {/* <Button
                        size="sm"
                        href={actionLink || undefined}
                        disabled={!actionLink}
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={{
                            icon: styles.externalLinkIcon,
                        }}
                    >
                        {t(`liquityV2.${campaign.target.type}`, {
                            collateral: campaign.target.collateral.token.symbol,
                            debtToken: brand?.debtToken.symbol || "",
                        })}
                    </Button> */}
                </div>
                {campaign.isDistributing(DistributablesType.Tokens) && (
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
