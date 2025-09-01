import { useCallback } from "react";
import { Typography, Button, InfoTooltip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
import { AprChip } from "../../apr-chip";
import { DistributablesType, type AaveV3TargetType } from "@metrom-xyz/sdk";
import { type TargetedNamedCampaign } from "@/src/types/campaign";
import { ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { ProtocolLogo } from "../../protocol-logo";

import styles from "./styles.module.css";

interface AaveV3HeaderProps {
    campaign: TargetedNamedCampaign<AaveV3TargetType>;
}

export function AaveV3Header({ campaign }: AaveV3HeaderProps) {
    const t = useTranslations("campaignDetails.header");
    const router = useRouter();

    const brand = useProtocolsInChain({
        chainId: campaign.chainId,
        type: ProtocolType.AaveV3,
    }).find((brand) => brand.slug === campaign.target.brand.slug);

    const ChainIcon = campaign.chainData?.icon;
    const actionLink = brand?.actionUrls[campaign.target.type];

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
                    <ProtocolLogo protocol={brand} size="lg" />
                    <Typography size="xl4" weight="medium">
                        {campaign.name}
                    </Typography>
                </div>
                <Typography size="sm" weight="medium" light>
                    {t("rewardsMayVary")}
                </Typography>
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
                        href={actionLink || undefined}
                        disabled={!actionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t(`aaveV3.${campaign.target.type}`, {
                            collateral: campaign.target.collateral.token.symbol,
                            brand: campaign.target.brand.name,
                        })}
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
